const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getPackingList, updatePackingList } = require('../controllers/packing.controller');

router.get('/trips/:tripId/packinglist', auth, getPackingList);
router.put('/trips/:tripId/packinglist', auth, updatePackingList);

module.exports = router;


