const pool = require('../config/db');

// GET /api/cities?search=paris&region=Europe&limit=20
const searchCities = async (req, res) => {
  const { search = '', region = '', limit = 20, offset = 0 } = req.query;
  try {
    const result = await pool.query(
      `SELECT id, name, country, region, cost_index, popularity, image_url, currency_code, timezone
       FROM cities
       WHERE (name ILIKE $1 OR country ILIKE $1)
         AND ($2 = '' OR region ILIKE $2)
       ORDER BY popularity DESC, name
       LIMIT $3 OFFSET $4`,
      [`%${search}%`, region, parseInt(limit), parseInt(offset)]
    );
    res.json({ cities: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('searchCities:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/cities/:id
const getCityById = async (req, res) => {
  const { id } = req.params;
  try {
    const cityRes = await pool.query('SELECT * FROM cities WHERE id = $1', [id]);
    if (cityRes.rows.length === 0) return res.status(404).json({ error: 'City not found' });

    const activitiesRes = await pool.query(
      'SELECT * FROM activities WHERE city_id = $1 ORDER BY category, cost', [id]
    );

    res.json({ ...cityRes.rows[0], activities: activitiesRes.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/cities/:id/activities?category=food&maxCost=50
const getCityActivities = async (req, res) => {
  const { id } = req.params;
  const { category = '', maxCost = 99999 } = req.query;
  try {
    const result = await pool.query(
      `SELECT * FROM activities
       WHERE city_id = $1
         AND ($2 = '' OR category = $2)
         AND cost <= $3
       ORDER BY category, cost`,
      [id, category, parseFloat(maxCost)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { searchCities, getCityById, getCityActivities };
