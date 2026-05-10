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
