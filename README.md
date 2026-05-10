# 🗺️ Traveloop — Backend & Database

> Node.js + Express + PostgreSQL  
> Odoo Hackathon 2026 — Backend Role

---

## 📁 Project Structure

```
traveloop-backend/
├── src/
│   ├── server.js                  ← Express app entry point
│   ├── config/
│   │   └── db.js                  ← PostgreSQL pool connection
│   ├── middleware/
│   │   └── auth.js                ← JWT authenticate + requireAdmin
│   ├── controllers/
│   │   ├── auth.controller.js     ← Register, Login, Profile
│   │   ├── trips.controller.js    ← Trip CRUD, share, clone
│   │   ├── stops.controller.js    ← Trip stops + activities
│   │   ├── cities.controller.js   ← City search + activity search
│   │   ├── budget.controller.js   ← Cost aggregation queries
│   │   ├── extras.controller.js   ← Packing list + Trip notes
│   │   ├── public.controller.js   ← Public shared trip view
│   │   └── admin.controller.js    ← Analytics dashboard
│   └── routes/
│       ├── auth.routes.js
│       ├── trips.routes.js
│       └── other.routes.js        ← cities, public, admin
├── migrations/
│   └── run.js                     ← Creates all tables + triggers
├── seeds/
│   └── run.js                     ← Populates cities + activities
├── .env.example
└── package.json
```

---

## ⚙️ Setup (do this first!)

### 1. Install dependencies
```bash
npm install
```

### 2. Create your .env
```bash
cp .env.example .env
# Fill in DB_PASSWORD and JWT_SECRET
```

### 3. Create PostgreSQL database
```bash
psql -U postgres -c "CREATE DATABASE traveloop;"
```

### 4. Run migrations (creates all tables)
```bash
node migrations/run.js
```

### 5. Seed data (cities + activities)
```bash
node seeds/run.js
```

### 6. Start the server
```bash
npm run dev        # development (nodemon)
npm start          # production
```

Server runs on: **http://localhost:5000**

---

## 🗄️ Database Schema

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│  users   │────<│    trips     │────<│  trip_stops  │────<│ stop_activities │
└──────────┘     └──────────────┘     └──────────────┘     └─────────────────┘
                                             │                      │
                                             ▼                      ▼
                                        ┌────────┐           ┌────────────┐
                                        │ cities │           │ activities │
                                        └────────┘           └────────────┘

trips ──< packing_items
trips ──< trip_notes ──> trip_stops (optional)
```

### Tables

| Table | Purpose | Key Columns |
|---|---|---|
| `users` | Auth & profile | id (UUID), email (UNIQUE), password_hash, is_admin |
| `trips` | Trip plans | id (UUID), user_id→users, start_date, end_date, budget_limit, share_token |
| `cities` | Seed city catalog | id, name, country, cost_index, currency_code |
| `activities` | Seed activity catalog | id, city_id→cities, name, category, cost |
| `trip_stops` | Cities in a trip | id, trip_id→trips, city_id→cities, order_index, accommodation_cost |
| `stop_activities` | Activities in a stop | id, stop_id→trip_stops, activity_id→activities, custom_cost |
| `packing_items` | Checklist per trip | id, trip_id→trips, name, category, is_packed |
| `trip_notes` | Notes per trip/stop | id, trip_id→trips, stop_id (nullable), content |

### Key Relationships
- `trips` → `trip_stops` → `cities` (many-to-many via junction)
- `trip_stops` → `stop_activities` → `activities` (many-to-many via junction)
- Users can add **custom activities** (no activity_id, just custom_name + custom_cost)
- Public sharing via `share_token` (short random string), no auth needed to read

---
## 📡 Full API Reference

All protected routes need: `Authorization: Bearer <token>`

### Auth — `/api/auth`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | ❌ | Create account |
| POST | `/login` | ❌ | Login, returns JWT |
| GET | `/me` | ✅ | Get current user |
| PUT | `/profile` | ✅ | Update name/avatar/language |
| DELETE | `/account` | ✅ | Delete account |

**Register body:** `{ name, email, password }`  
**Login body:** `{ email, password }`  
**Response:** `{ token, user }`

---

### Trips — `/api/trips`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List my trips (with stop count + total cost) |
| POST | `/` | Create trip |
| GET | `/:id` | Get full trip with stops + activities |
| PUT | `/:id` | Update trip metadata |
| DELETE | `/:id` | Delete trip |
| POST | `/:id/share` | Toggle public sharing, returns share_url |
| POST | `/:id/clone` | Clone trip into my account |
| GET | `/:id/budget` | Full cost breakdown |
