const pool = require('../config/db');

// POST /api/trips/:tripId/stops
const addStop = async (req, res) => {
  const { tripId } = req.params;
  const { city_id, arrival_date, departure_date, order_index, accommodation_cost, transport_cost, notes } = req.body;

  if (!city_id || !arrival_date || !departure_date) {
    return res.status(400).json({ error: 'city_id, arrival_date, departure_date are required' });
  }

  try {
    // Verify trip ownership
    const tripCheck = await pool.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [tripId, req.user.id]);
    if (tripCheck.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });

    // Auto-assign order_index if not given
    const orderRes = await pool.query(
      'SELECT COALESCE(MAX(order_index), -1) + 1 AS next_order FROM trip_stops WHERE trip_id = $1', [tripId]
    );
    const nextOrder = order_index ?? orderRes.rows[0].next_order;

    const result = await pool.query(
      `INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, order_index, accommodation_cost, transport_cost, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *, (SELECT name FROM cities WHERE id = $2) AS city_name`,
      [tripId, city_id, arrival_date, departure_date, nextOrder, accommodation_cost || 0, transport_cost || 0, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addStop:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/trips/:tripId/stops/:stopId
const updateStop = async (req, res) => {
  const { tripId, stopId } = req.params;
  const { arrival_date, departure_date, accommodation_cost, transport_cost, notes } = req.body;

  try {
    // Verify ownership via trip
    const result = await pool.query(
      `UPDATE trip_stops SET
         arrival_date       = COALESCE($1, arrival_date),
         departure_date     = COALESCE($2, departure_date),
         accommodation_cost = COALESCE($3, accommodation_cost),
         transport_cost     = COALESCE($4, transport_cost),
         notes              = COALESCE($5, notes)
       WHERE id = $6 AND trip_id = $7
             AND $7 IN (SELECT id FROM trips WHERE user_id = $8)
       RETURNING *`,
      [arrival_date, departure_date, accommodation_cost, transport_cost, notes, stopId, tripId, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Stop not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/trips/:tripId/stops/:stopId
const deleteStop = async (req, res) => {
  const { tripId, stopId } = req.params;
  try {
    const result = await pool.query(
      `DELETE FROM trip_stops WHERE id = $1 AND trip_id = $2
             AND $2 IN (SELECT id FROM trips WHERE user_id = $3)
       RETURNING id`,
      [stopId, tripId, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Stop not found' });
    res.json({ message: 'Stop deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/trips/:tripId/stops/reorder
// Body: { order: [{ id: stopId, order_index: n }, ...] }
const reorderStops = async (req, res) => {
  const { tripId } = req.params;
  const { order } = req.body;  // array of { id, order_index }

  if (!Array.isArray(order)) {
    return res.status(400).json({ error: 'order must be an array' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const item of order) {
      await client.query(
        'UPDATE trip_stops SET order_index = $1 WHERE id = $2 AND trip_id = $3',
        [item.order_index, item.id, tripId]
      );
    }
    await client.query('COMMIT');
    res.json({ message: 'Stops reordered' });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
};

// POST /api/trips/:tripId/stops/:stopId/activities
const addActivity = async (req, res) => {
  const { tripId, stopId } = req.params;
  const { activity_id, custom_name, custom_cost, custom_duration_hrs, scheduled_date, scheduled_time, notes } = req.body;

  if (!activity_id && !custom_name) {
    return res.status(400).json({ error: 'Either activity_id or custom_name is required' });
  }

  try {
    const stopRes = await pool.query(
      `SELECT ts.id
       FROM trip_stops ts
       JOIN trips t ON t.id = ts.trip_id
       WHERE ts.id = $1 AND ts.trip_id = $2 AND t.user_id = $3`,
      [stopId, tripId, req.user.id]
    );

    if (stopRes.rows.length === 0) {
      return res.status(404).json({ error: 'Stop not found or access denied' });
    }

    const result = await pool.query(
      `INSERT INTO stop_activities (stop_id, activity_id, custom_name, custom_cost, custom_duration_hrs, scheduled_date, scheduled_time, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [stopId, activity_id || null, custom_name, custom_cost || 0, custom_duration_hrs || 0, scheduled_date, scheduled_time, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('addActivity:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/trips/:tripId/stops/:stopId/activities/:actId
const removeActivity = async (req, res) => {
  const { actId } = req.params;
  try {
    await pool.query('DELETE FROM stop_activities WHERE id = $1', [actId]);
    res.json({ message: 'Activity removed' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addStop, updateStop, deleteStop, reorderStops, addActivity, removeActivity };
