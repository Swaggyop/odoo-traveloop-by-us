/**
 * Traveloop — Full Database Migration
 * Run with: node migrations/run.js
 *
 * Schema Overview:
 *   users  →  trips  →  trip_stops  →  stop_activities
 *                  ↘          ↘ cities ↗  ↘ activities ↗
 *   (packing_items, trip_notes, admin_logs hang off trips)
 */

const pool = require('../src/config/db');

const migrations = [

  // ─── 1. USERS ────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS users (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(255)  UNIQUE NOT NULL,
    password_hash TEXT          NOT NULL,
    avatar_url    TEXT,
    language      VARCHAR(10)   DEFAULT 'en',
    is_admin      BOOLEAN       DEFAULT FALSE,
    created_at    TIMESTAMPTZ   DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   DEFAULT NOW()
  )`,

  // ─── 2. CITIES (seed data) ───────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS cities (
    id            SERIAL        PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    country       VARCHAR(100)  NOT NULL,
    region        VARCHAR(100),
    cost_index    NUMERIC(5,2)  DEFAULT 1.0,  -- relative daily cost multiplier
    popularity    INTEGER       DEFAULT 0,
    image_url     TEXT,
    currency_code CHAR(3)       DEFAULT 'USD',
    timezone      VARCHAR(60),
    created_at    TIMESTAMPTZ   DEFAULT NOW()
  )`,

  // ─── 3. ACTIVITIES (seed data) ───────────────────────────────────
  `CREATE TABLE IF NOT EXISTS activities (
    id            SERIAL        PRIMARY KEY,
    city_id       INTEGER       NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
    name          VARCHAR(200)  NOT NULL,
    description   TEXT,
    category      VARCHAR(50),     -- sightseeing | food | adventure | culture | shopping
    cost          NUMERIC(10,2) DEFAULT 0,
    duration_hrs  NUMERIC(4,1),
    image_url     TEXT,
    created_at    TIMESTAMPTZ   DEFAULT NOW()
  )`,

  // ─── 4. TRIPS ────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS trips (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title          VARCHAR(200)  NOT NULL,
    description    TEXT,
    cover_image    TEXT,
    start_date     DATE          NOT NULL,
    end_date       DATE          NOT NULL,
    budget_limit   NUMERIC(12,2) DEFAULT 0,
    is_public      BOOLEAN       DEFAULT FALSE,
    share_token    VARCHAR(20)   UNIQUE,      -- for /public/trip/:token
    status         VARCHAR(20)   DEFAULT 'draft',  -- draft | planned | ongoing | completed
    created_at     TIMESTAMPTZ   DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   DEFAULT NOW(),
    CONSTRAINT     dates_valid CHECK (end_date >= start_date)
  )`,

  // ─── 5. TRIP STOPS (cities within a trip) ────────────────────────
  `CREATE TABLE IF NOT EXISTS trip_stops (
    id             SERIAL        PRIMARY KEY,
    trip_id        UUID          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    city_id        INTEGER       NOT NULL REFERENCES cities(id),
    arrival_date   DATE          NOT NULL,
    departure_date DATE          NOT NULL,
    order_index    INTEGER       NOT NULL DEFAULT 0,  -- for reordering stops
    accommodation_cost NUMERIC(10,2) DEFAULT 0,
    transport_cost     NUMERIC(10,2) DEFAULT 0,
    notes          TEXT,
    created_at     TIMESTAMPTZ   DEFAULT NOW(),
    CONSTRAINT     stop_dates_valid CHECK (departure_date >= arrival_date)
  )`,

  // ─── 6. STOP ACTIVITIES (activities assigned to a stop) ──────────
  `CREATE TABLE IF NOT EXISTS stop_activities (
    id             SERIAL        PRIMARY KEY,
    stop_id        INTEGER       NOT NULL REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id    INTEGER       REFERENCES activities(id),  -- NULL if custom
    custom_name    VARCHAR(200),    -- if user creates a custom activity
    custom_cost    NUMERIC(10,2),
    custom_duration_hrs NUMERIC(4,1),
    scheduled_date DATE,
    scheduled_time TIME,
    notes          TEXT,
    created_at     TIMESTAMPTZ   DEFAULT NOW()
  )`,

  // ─── 7. PACKING ITEMS ────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS packing_items (
    id             SERIAL        PRIMARY KEY,
    trip_id        UUID          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    name           VARCHAR(200)  NOT NULL,
    category       VARCHAR(50)   DEFAULT 'other',  -- clothing | docs | electronics | other
    is_packed      BOOLEAN       DEFAULT FALSE,
    created_at     TIMESTAMPTZ   DEFAULT NOW()
  )`,

  // ─── 8. TRIP NOTES ───────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS trip_notes (
    id             SERIAL        PRIMARY KEY,
    trip_id        UUID          NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    stop_id        INTEGER       REFERENCES trip_stops(id),  -- optional: per-stop note
    content        TEXT          NOT NULL,
    created_at     TIMESTAMPTZ   DEFAULT NOW(),
    updated_at     TIMESTAMPTZ   DEFAULT NOW()
  )`,

  // ─── 9. INDEXES for performance ──────────────────────────────────
  `CREATE INDEX IF NOT EXISTS idx_trips_user_id       ON trips(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_trips_share_token   ON trips(share_token)`,
  `CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id  ON trip_stops(trip_id)`,
  `CREATE INDEX IF NOT EXISTS idx_stop_acts_stop_id   ON stop_activities(stop_id)`,
  `CREATE INDEX IF NOT EXISTS idx_activities_city_id  ON activities(city_id)`,
  `CREATE INDEX IF NOT EXISTS idx_packing_trip_id     ON packing_items(trip_id)`,
  `CREATE INDEX IF NOT EXISTS idx_notes_trip_id       ON trip_notes(trip_id)`,
  `CREATE INDEX IF NOT EXISTS idx_cities_name         ON cities(name)`,

  // ─── 10. updated_at trigger function ─────────────────────────────
  `CREATE OR REPLACE FUNCTION update_updated_at()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql`,

  `DROP TRIGGER IF EXISTS trg_users_updated_at ON users`,
  `CREATE TRIGGER trg_users_updated_at
   BEFORE UPDATE ON users
   FOR EACH ROW EXECUTE FUNCTION update_updated_at()`,

  `DROP TRIGGER IF EXISTS trg_trips_updated_at ON trips`,
  `CREATE TRIGGER trg_trips_updated_at
   BEFORE UPDATE ON trips
   FOR EACH ROW EXECUTE FUNCTION update_updated_at()`,

  `DROP TRIGGER IF EXISTS trg_notes_updated_at ON trip_notes`,
  `CREATE TRIGGER trg_notes_updated_at
   BEFORE UPDATE ON trip_notes
   FOR EACH ROW EXECUTE FUNCTION update_updated_at()`,
];

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const sql of migrations) {
      await client.query(sql);
    }
    await client.query('COMMIT');
    console.log('✅ All migrations ran successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
