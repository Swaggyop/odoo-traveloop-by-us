const pool = require('../config/db');

// GET /api/admin/analytics  — summary stats for admin dashboard
const getAnalytics = async (req, res) => {
  try {
    const [
      usersStats,
      tripsStats,
      topCities,
      topActivities,
      tripsPerDay,
      userGrowth,
    ] = await Promise.all([

      // Total users + new users this week
      pool.query(`
        SELECT
          COUNT(*)::int                                                     AS total_users,
          COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS new_this_week
        FROM users WHERE is_admin = FALSE
      `),

      // Total trips, public trips, avg duration
      pool.query(`
        SELECT
          COUNT(*)::int                                          AS total_trips,
          COUNT(*) FILTER (WHERE is_public = TRUE)::int          AS public_trips,
          ROUND(AVG(end_date - start_date + 1), 1)               AS avg_duration_days
        FROM trips
      `),

      // Top 10 most visited cities
      pool.query(`
        SELECT c.name, c.country, COUNT(ts.id)::int AS times_added
        FROM trip_stops ts
        JOIN cities c ON c.id = ts.city_id
        GROUP BY c.id, c.name, c.country
        ORDER BY times_added DESC
        LIMIT 10
      `),

      // Top 10 most used activities
      pool.query(`
        SELECT COALESCE(a.name, sa.custom_name) AS name,
               COUNT(sa.id)::int                 AS times_added
        FROM stop_activities sa
        LEFT JOIN activities a ON a.id = sa.activity_id
        GROUP BY name
        ORDER BY times_added DESC
        LIMIT 10
      `),

      // Trips created per day (last 30 days) — for line chart
      pool.query(`
        SELECT created_at::date AS day, COUNT(*)::int AS count
        FROM trips
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY day
        ORDER BY day
      `),

      // User signups per day (last 30 days) — for growth chart
      pool.query(`
        SELECT created_at::date AS day, COUNT(*)::int AS count
        FROM users
        WHERE created_at > NOW() - INTERVAL '30 days'
        GROUP BY day
        ORDER BY day
      `),
    ]);

    res.json({
      users:           usersStats.rows[0],
      trips:           tripsStats.rows[0],
      top_cities:      topCities.rows,
      top_activities:  topActivities.rows,
      trips_per_day:   tripsPerDay.rows,
      user_growth:     userGrowth.rows,
    });
  } catch (err) {
    console.error('getAnalytics:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/admin/users  — list all users with trip count
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.name, u.email, u.is_admin, u.created_at,
             COUNT(t.id)::int AS trip_count
      FROM users u
      LEFT JOIN trips t ON t.user_id = u.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE /api/admin/users/:id  — remove a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own admin account' });
  }
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAnalytics, getAllUsers, deleteUser };
