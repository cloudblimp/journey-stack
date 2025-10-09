const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/journal.controller');

// Scoped under /trips/:tripId
router.get('/trips/:tripId/journal', auth, getEntries);
router.post('/trips/:tripId/journal', auth, createEntry);

// Entry by id
router.put('/journal/:entryId', auth, updateEntry);
router.delete('/journal/:entryId', auth, deleteEntry);

module.exports = router;


