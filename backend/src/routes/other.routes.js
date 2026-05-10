// ─── routes/cities.routes.js ─────────────────────────────────────
const express = require('express');
const citiesRouter = express.Router();
const cities = require('../controllers/cities.controller');

citiesRouter.get('/',                     cities.searchCities);
citiesRouter.get('/:id',                  cities.getCityById);
citiesRouter.get('/:id/activities',       cities.getCityActivities);

// ─── routes/public.routes.js ─────────────────────────────────────
const publicRouter = express.Router();
const pub = require('../controllers/public.controller');

publicRouter.get('/trip/:token', pub.getPublicTrip);

// ─── routes/admin.routes.js ──────────────────────────────────────
const adminRouter = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const admin = require('../controllers/admin.controller');

adminRouter.use(authenticate, requireAdmin);

adminRouter.get('/analytics',     admin.getAnalytics);
adminRouter.get('/users',         admin.getAllUsers);
adminRouter.delete('/users/:id',  admin.deleteUser);

module.exports = { citiesRouter, publicRouter, adminRouter };
