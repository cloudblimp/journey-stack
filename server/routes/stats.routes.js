const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getStats } = require('../controllers/stats.controller');

router.get('/stats', auth, getStats);

module.exports = router;


