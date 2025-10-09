const express = require('express');
const router = express.Router();
const { register, login, me, googleLogin } = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, me);
router.post('/google', googleLogin);

module.exports = router;