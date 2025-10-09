const JournalEntry = require('../models/journalEntry.model');

exports.getEntries = async (req, res) => {
    try {
        const { tripId } = req.params;
        const entries = await JournalEntry.find({ tripId, userId: req.user.id }).sort({ date: -1, createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { title, content, media, location, date } = req.body;
        const entry = await JournalEntry.create({
            tripId,
            userId: req.user.id,
            title,
            content,
            media,
            location,
            date,
        });
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const update = req.body;
        const entry = await JournalEntry.findOneAndUpdate(
            { _id: entryId, userId: req.user.id },
            update,
            { new: true }
        );
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const { entryId } = req.params;
        const result = await JournalEntry.findOneAndDelete({ _id: entryId, userId: req.user.id });
        if (!result) return res.status(404).json({ message: 'Entry not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


