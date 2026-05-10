/**
 * Traveloop — Seed Data
 * Populates cities and activities tables
 * Run with: node seeds/run.js
 */

const pool = require('../src/config/db');

const cities = [
  { name: 'Paris',         country: 'France',        region: 'Europe',      cost_index: 2.1, popularity: 98, currency_code: 'EUR', timezone: 'Europe/Paris' },
  { name: 'Tokyo',         country: 'Japan',          region: 'Asia',        cost_index: 1.8, popularity: 97, currency_code: 'JPY', timezone: 'Asia/Tokyo' },
  { name: 'New York',      country: 'United States',  region: 'Americas',    cost_index: 2.4, popularity: 96, currency_code: 'USD', timezone: 'America/New_York' },
  { name: 'Barcelona',     country: 'Spain',          region: 'Europe',      cost_index: 1.6, popularity: 93, currency_code: 'EUR', timezone: 'Europe/Madrid' },
  { name: 'Bangkok',       country: 'Thailand',       region: 'Asia',        cost_index: 0.7, popularity: 91, currency_code: 'THB', timezone: 'Asia/Bangkok' },
  { name: 'Dubai',         country: 'UAE',            region: 'Middle East', cost_index: 2.0, popularity: 90, currency_code: 'AED', timezone: 'Asia/Dubai' },
  { name: 'Rome',          country: 'Italy',          region: 'Europe',      cost_index: 1.7, popularity: 92, currency_code: 'EUR', timezone: 'Europe/Rome' },
  { name: 'Singapore',     country: 'Singapore',      region: 'Asia',        cost_index: 2.2, popularity: 89, currency_code: 'SGD', timezone: 'Asia/Singapore' },
  { name: 'Istanbul',      country: 'Turkey',         region: 'Europe/Asia', cost_index: 0.9, popularity: 88, currency_code: 'TRY', timezone: 'Europe/Istanbul' },
  { name: 'Amsterdam',     country: 'Netherlands',    region: 'Europe',      cost_index: 2.0, popularity: 87, currency_code: 'EUR', timezone: 'Europe/Amsterdam' },
  { name: 'Bali',          country: 'Indonesia',      region: 'Asia',        cost_index: 0.6, popularity: 94, currency_code: 'IDR', timezone: 'Asia/Makassar' },
  { name: 'London',        country: 'United Kingdom', region: 'Europe',      cost_index: 2.5, popularity: 95, currency_code: 'GBP', timezone: 'Europe/London' },
  { name: 'Prague',        country: 'Czech Republic', region: 'Europe',      cost_index: 1.1, popularity: 85, currency_code: 'CZK', timezone: 'Europe/Prague' },
  { name: 'New Delhi',     country: 'India',          region: 'Asia',        cost_index: 0.5, popularity: 82, currency_code: 'INR', timezone: 'Asia/Kolkata' },
  { name: 'Cape Town',     country: 'South Africa',   region: 'Africa',      cost_index: 0.8, popularity: 84, currency_code: 'ZAR', timezone: 'Africa/Johannesburg' },
  { name: 'Sydney',        country: 'Australia',      region: 'Oceania',     cost_index: 2.3, popularity: 88, currency_code: 'AUD', timezone: 'Australia/Sydney' },
  { name: 'Lisbon',        country: 'Portugal',       region: 'Europe',      cost_index: 1.3, popularity: 86, currency_code: 'EUR', timezone: 'Europe/Lisbon' },
  { name: 'Mexico City',   country: 'Mexico',         region: 'Americas',    cost_index: 0.8, popularity: 80, currency_code: 'MXN', timezone: 'America/Mexico_City' },
  { name: 'Vienna',        country: 'Austria',        region: 'Europe',      cost_index: 1.9, popularity: 83, currency_code: 'EUR', timezone: 'Europe/Vienna' },
  { name: 'Seoul',         country: 'South Korea',    region: 'Asia',        cost_index: 1.5, popularity: 89, currency_code: 'KRW', timezone: 'Asia/Seoul' },
];

// Activities keyed by city name (will be looked up after city insert)
const activitiesByCityName = {
  'Paris': [
    { name: 'Eiffel Tower Visit',     category: 'sightseeing', cost: 26,  duration_hrs: 2.5, description: 'Iconic iron tower with panoramic views of Paris.' },
    { name: 'Louvre Museum',          category: 'culture',     cost: 20,  duration_hrs: 4.0, description: 'World\'s largest art museum, home to the Mona Lisa.' },
    { name: 'Seine River Cruise',     category: 'sightseeing', cost: 15,  duration_hrs: 1.5, description: 'Scenic boat ride past Notre Dame and bridges.' },
    { name: 'Montmartre Walk',        category: 'sightseeing', cost: 0,   duration_hrs: 2.0, description: 'Bohemian hilltop neighborhood with Sacré-Cœur.' },
    { name: 'French Cooking Class',   category: 'food',        cost: 120, duration_hrs: 3.0, description: 'Learn to cook classic French dishes with a chef.' },
  ],
  'Tokyo': [
    { name: 'Shibuya Crossing',       category: 'sightseeing', cost: 0,   duration_hrs: 1.0, description: 'World\'s busiest pedestrian crossing experience.' },
    { name: 'Tsukiji Fish Market',    category: 'food',        cost: 30,  duration_hrs: 2.0, description: 'Fresh sushi breakfast at the famous outer market.' },
    { name: 'Senso-ji Temple',        category: 'culture',     cost: 0,   duration_hrs: 1.5, description: 'Tokyo\'s oldest Buddhist temple in Asakusa.' },
    { name: 'teamLab Planets',        category: 'culture',     cost: 32,  duration_hrs: 2.0, description: 'Immersive digital art museum experience.' },
    { name: 'Mt. Fuji Day Trip',      category: 'adventure',   cost: 80,  duration_hrs: 10.0, description: 'Guided day trip to Japan\'s iconic volcano.' },
  ],
  'Bali': [
    { name: 'Ubud Monkey Forest',     category: 'sightseeing', cost: 5,   duration_hrs: 2.0, description: 'Sacred sanctuary with hundreds of Balinese monkeys.' },
    { name: 'Tegallalang Rice Terraces', category: 'sightseeing', cost: 2, duration_hrs: 1.5, description: 'Stunning UNESCO-listed terraced rice fields.' },
    { name: 'Surf Lesson Kuta',       category: 'adventure',   cost: 25,  duration_hrs: 2.0, description: 'Beginner surf lesson on famous Kuta beach.' },
    { name: 'Balinese Cooking Class', category: 'food',        cost: 45,  duration_hrs: 4.0, description: 'Market visit + traditional Balinese cooking.' },
    { name: 'Tanah Lot Temple',       category: 'culture',     cost: 4,   duration_hrs: 2.0, description: 'Ancient temple perched on a sea rock at sunset.' },
  ],
  'New York': [
    { name: 'Statue of Liberty',      category: 'sightseeing', cost: 24,  duration_hrs: 3.0, description: 'Iconic symbol of freedom, accessible by ferry.' },
    { name: 'Central Park Stroll',    category: 'sightseeing', cost: 0,   duration_hrs: 2.0, description: 'Walk through the heart of Manhattan.' },
    { name: 'MoMA Visit',             category: 'culture',     cost: 25,  duration_hrs: 3.0, description: 'Museum of Modern Art with Van Gogh and Warhol.' },
    { name: 'Brooklyn Bridge Walk',   category: 'sightseeing', cost: 0,   duration_hrs: 1.5, description: 'Stroll across the iconic East River bridge.' },
    { name: 'NYC Food Tour',          category: 'food',        cost: 75,  duration_hrs: 3.0, description: 'Guided tasting tour through diverse neighborhoods.' },
  ],
  'Bangkok': [
    { name: 'Grand Palace',           category: 'culture',     cost: 15,  duration_hrs: 3.0, description: 'Opulent royal complex with Wat Phra Kaew temple.' },
    { name: 'Street Food Tour',       category: 'food',        cost: 40,  duration_hrs: 3.0, description: 'Evening guided tour of Bangkok\'s best street food.' },
    { name: 'Chao Phraya River Tour', category: 'sightseeing', cost: 20,  duration_hrs: 2.0, description: 'Boat tour past temples and markets on the river.' },
    { name: 'Muay Thai Show',         category: 'culture',     cost: 30,  duration_hrs: 2.0, description: 'Live traditional Thai boxing match experience.' },
    { name: 'Chatuchak Market',       category: 'shopping',    cost: 0,   duration_hrs: 3.0, description: 'World\'s largest weekend market with 15,000 stalls.' },
  ],
};

async function runSeeds() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── Seed Cities ──────────────────────────────────────────────
    const cityIdMap = {};
    for (const city of cities) {
      const res = await client.query(
        `INSERT INTO cities (name, country, region, cost_index, popularity, currency_code, timezone)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING
         RETURNING id, name`,
        [city.name, city.country, city.region, city.cost_index, city.popularity, city.currency_code, city.timezone]
      );
      if (res.rows.length > 0) {
        cityIdMap[res.rows[0].name] = res.rows[0].id;
      }
    }
    console.log(`✅ Seeded ${Object.keys(cityIdMap).length} cities`);

    // ── Seed Activities ──────────────────────────────────────────
    let activityCount = 0;
    for (const [cityName, acts] of Object.entries(activitiesByCityName)) {
      const cityId = cityIdMap[cityName];
      if (!cityId) continue;
      for (const act of acts) {
        await client.query(
          `INSERT INTO activities (city_id, name, description, category, cost, duration_hrs)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [cityId, act.name, act.description, act.category, act.cost, act.duration_hrs]
        );
        activityCount++;
      }
    }
    console.log(`✅ Seeded ${activityCount} activities`);

    await client.query('COMMIT');
    console.log('🎉 Seed complete!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runSeeds();
