require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// ── Middleware ───────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────────
const authRoutes   = require('./routes/auth.routes');
const tripsRoutes  = require('./routes/trips.routes');
const { citiesRouter, publicRouter, adminRouter } = require('./routes/other.routes');

app.use('/api/auth',   authRoutes);
app.use('/api/trips',  tripsRoutes);
app.use('/api/cities', citiesRouter);
app.use('/api/public', publicRouter);
app.use('/api/admin',  adminRouter);

// ── Health Check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 Handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ── Global Error Handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Traveloop API running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/trips`);
  console.log(`   GET  /api/cities?search=paris`);
  console.log(`   GET  /api/trips/:id/budget`);
  console.log(`   GET  /api/public/trip/:token`);
  console.log(`   GET  /api/admin/analytics`);
});

module.exports = app;
