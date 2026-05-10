const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const trips = require('../controllers/trips.controller');
const stops = require('../controllers/stops.controller');
const budget = require('../controllers/budget.controller');
const extras = require('../controllers/extras.controller');

// All routes require auth
router.use(authenticate);

// ── Trip CRUD ────────────────────────────────
router.get('/',           trips.getMyTrips);
router.post('/',          trips.createTrip);
router.get('/:id',        trips.getTripById);
router.put('/:id',        trips.updateTrip);
router.delete('/:id',     trips.deleteTrip);
router.post('/:id/share', trips.toggleShare);
router.post('/:id/clone', trips.cloneTrip);

// ── Budget ───────────────────────────────────
router.get('/:id/budget', budget.getTripBudget);

// ── Stops ────────────────────────────────────
router.post('/:tripId/stops',                    stops.addStop);
router.put('/:tripId/stops/reorder',             stops.reorderStops);
router.put('/:tripId/stops/:stopId',             stops.updateStop);
router.delete('/:tripId/stops/:stopId',          stops.deleteStop);

// ── Stop Activities ──────────────────────────
router.post('/:tripId/stops/:stopId/activities',       stops.addActivity);
router.delete('/:tripId/stops/:stopId/activities/:actId', stops.removeActivity);

// ── Packing List ─────────────────────────────
router.get('/:tripId/packing',            extras.getPackingList);
router.post('/:tripId/packing',           extras.addPackingItem);
router.patch('/:tripId/packing/:itemId',  extras.togglePacked);
router.delete('/:tripId/packing/:itemId', extras.deletePackingItem);
router.delete('/:tripId/packing',         extras.resetPackingList);

// ── Trip Notes ────────────────────────────────
router.get('/:tripId/notes',            extras.getNotes);
router.post('/:tripId/notes',           extras.addNote);
router.put('/:tripId/notes/:noteId',    extras.updateNote);
router.delete('/:tripId/notes/:noteId', extras.deleteNote);

module.exports = router;
