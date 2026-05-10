// ─── routes/auth.routes.js ───────────────────────────────────────
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const ctrl = require('../controllers/auth.controller');

router.post('/register',    ctrl.register);
router.post('/login',       ctrl.login);
router.get('/me',           authenticate, ctrl.getMe);
router.put('/profile',      authenticate, ctrl.updateProfile);
router.delete('/account',   authenticate, ctrl.deleteAccount);

module.exports = router;
