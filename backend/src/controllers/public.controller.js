const pool = require('../config/db');

// GET /api/public/trip/:token  — no auth required
const getPublicTrip = async (req, res) => {
  const { token } = req.params;
  try {
    const tripRes = await pool.query(
      `SELECT t.id, t.title, t.description, t.cover_image, t.start_date, t.end_date,
              t.budget_limit, t.status,
              u.name AS creator_name
       FROM trips t
       JOIN users u ON u.id = t.user_id
       WHERE t.share_token = $1 AND t.is_public = TRUE`,
      [token]
    );

    if (tripRes.rows.length === 0) {
      return res.status(404).json({ error: 'Shared trip not found or no longer public' });
    }

    const trip = tripRes.rows[0];

    // Fetch stops + activities
    const stopsRes = await pool.query(
      `SELECT ts.id, ts.arrival_date, ts.departure_date, ts.order_index,
              c.name AS city_name, c.country, c.image_url AS city_image
       FROM trip_stops ts
       JOIN cities c ON c.id = ts.city_id
       WHERE ts.trip_id = $1
       ORDER BY ts.order_index`,
      [trip.id]
    );

    for (const stop of stopsRes.rows) {
      const actsRes = await pool.query(
        `SELECT COALESCE(a.name, sa.custom_name) AS name,
                a.category,
                COALESCE(sa.custom_cost, a.cost) AS cost,
                sa.scheduled_date, sa.scheduled_time
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
    console.error('getPublicTrip:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getPublicTrip };
