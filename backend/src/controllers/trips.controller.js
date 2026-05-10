const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/** Generate a short random token for public sharing */
const generateShareToken = () =>
  Math.random().toString(36).substring(2, 10) +
  Math.random().toString(36).substring(2, 6);

// GET /api/trips  — list all trips for current user
const getMyTrips = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*,
              COUNT(DISTINCT ts.id)::int AS stop_count,
              COALESCE(SUM(ts.accommodation_cost + ts.transport_cost), 0) +
              COALESCE((
                SELECT SUM(COALESCE(sa.custom_cost, a.cost, 0))
                FROM trip_stops ts2
                JOIN stop_activities sa ON sa.stop_id = ts2.id
                LEFT JOIN activities a ON a.id = sa.activity_id
                WHERE ts2.trip_id = t.id
              ), 0) AS total_estimated_cost
       FROM trips t
       LEFT JOIN trip_stops ts ON ts.trip_id = t.id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getMyTrips:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/trips/:id  — get one trip with stops + activities
const getTripById = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch trip (must belong to user OR be public)
    const tripRes = await pool.query(
      `SELECT * FROM trips WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)`,
      [id, req.user.id]
    );
    if (tripRes.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });

    const trip = tripRes.rows[0];

    // Fetch stops with city info
    const stopsRes = await pool.query(
      `SELECT ts.*, c.name AS city_name, c.country, c.currency_code, c.cost_index, c.image_url AS city_image
       FROM trip_stops ts
       JOIN cities c ON c.id = ts.city_id
       WHERE ts.trip_id = $1
       ORDER BY ts.order_index, ts.arrival_date`,
      [id]
    );

    // Fetch activities for each stop
    for (const stop of stopsRes.rows) {
      const actsRes = await pool.query(
        `SELECT sa.*,
                COALESCE(a.name, sa.custom_name)       AS name,
                COALESCE(sa.custom_cost, a.cost)        AS cost,
                COALESCE(sa.custom_duration_hrs, a.duration_hrs) AS duration_hrs,
                a.category, a.description, a.image_url
         FROM stop_activities sa
         LEFT JOIN activities a ON a.id = sa.activity_id
         WHERE sa.stop_id = $1
         ORDER BY sa.scheduled_date, sa.scheduled_time`,
        [stop.id]
      );
      stop.activities = actsRes.rows;
    }

    trip.stops = stopsRes.rows;
    res.json(trip);
  } catch (err) {
    console.error('getTripById:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/trips  — create a new trip
const createTrip = async (req, res) => {
  const { title, description, start_date, end_date, budget_limit, cover_image } = req.body;

  if (!title || !start_date || !end_date) {
    return res.status(400).json({ error: 'title, start_date, end_date are required' });
  }
  if (new Date(end_date) < new Date(start_date)) {
    return res.status(400).json({ error: 'end_date must be on or after start_date' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, budget_limit, cover_image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, title.trim(), description, start_date, end_date, budget_limit || 0, cover_image]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('createTrip:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// PUT /api/trips/:id  — update trip metadata
const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { title, description, start_date, end_date, budget_limit, cover_image, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE trips SET
         title        = COALESCE($1, title),
         description  = COALESCE($2, description),
         start_date   = COALESCE($3, start_date),
         end_date     = COALESCE($4, end_date),
         budget_limit = COALESCE($5, budget_limit),
         cover_image  = COALESCE($6, cover_image),
         status       = COALESCE($7, status)
       WHERE id = $8 AND user_id = $9
       RETURNING *`,
      [title, description, start_date, end_date, budget_limit, cover_image, status, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/trips/:id/share  — toggle public sharing, generate token
const toggleShare = async (req, res) => {
  const { id } = req.params;
  try {
    const trip = await pool.query(
      'SELECT is_public, share_token FROM trips WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    if (trip.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });

    const current = trip.rows[0];
    const newPublic = !current.is_public;
    const token = newPublic ? (current.share_token || generateShareToken()) : current.share_token;

    const result = await pool.query(
      'UPDATE trips SET is_public = $1, share_token = $2 WHERE id = $3 RETURNING is_public, share_token',
      [newPublic, token, id]
    );
    res.json({
      is_public: result.rows[0].is_public,
      share_url: newPublic ? `/public/trip/${token}` : null,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/trips/:id/clone  — clone a public or own trip into your account
const cloneTrip = async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch original
    const orig = await client.query(
      'SELECT * FROM trips WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)', [id, req.user.id]
    );
    if (orig.rows.length === 0) return res.status(404).json({ error: 'Trip not found' });
    const t = orig.rows[0];

    // Create new trip
    const newTrip = await client.query(
      `INSERT INTO trips (user_id, title, description, start_date, end_date, budget_limit)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, `${t.title} (Copy)`, t.description, t.start_date, t.end_date, t.budget_limit]
    );
    const newTripId = newTrip.rows[0].id;

    // Clone stops
    const stops = await client.query('SELECT * FROM trip_stops WHERE trip_id = $1', [id]);
    for (const stop of stops.rows) {
      const newStop = await client.query(
        `INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, order_index, accommodation_cost, transport_cost)
         VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
        [newTripId, stop.city_id, stop.arrival_date, stop.departure_date, stop.order_index, stop.accommodation_cost, stop.transport_cost]
      );
      const newStopId = newStop.rows[0].id;
      // Clone activities
      const acts = await client.query('SELECT * FROM stop_activities WHERE stop_id = $1', [stop.id]);
      for (const act of acts.rows) {
        await client.query(
          `INSERT INTO stop_activities (stop_id, activity_id, custom_name, custom_cost, custom_duration_hrs, scheduled_date, scheduled_time)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [newStopId, act.activity_id, act.custom_name, act.custom_cost, act.custom_duration_hrs, act.scheduled_date, act.scheduled_time]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(newTrip.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('cloneTrip:', err.message);
    res.status(500).json({ error: 'Server error' });
  } finally {
    client.release();
  }
};

module.exports = { getMyTrips, getTripById, createTrip, updateTrip, deleteTrip, toggleShare, cloneTrip };
