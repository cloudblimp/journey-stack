const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { createTrip, getTrips, getTrip, updateTrip, deleteTrip } = require('../controllers/trip.controller');

router.post('/', auth, createTrip);
router.get('/', auth, getTrips);
router.get('/:id', auth, getTrip);
router.put('/:id', auth, updateTrip);
router.delete('/:id', auth, deleteTrip);

module.exports = router;