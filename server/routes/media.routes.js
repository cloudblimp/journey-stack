const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getSignedUpload, confirmUpload } = require('../controllers/media.controller');

router.post('/media/upload', auth, getSignedUpload);
router.post('/media/confirm', auth, confirmUpload);

module.exports = router;


