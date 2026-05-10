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