const PackingList = require('../models/packingList.model');

exports.getPackingList = async (req, res) => {
    try {
        const { tripId } = req.params;
        const list = await PackingList.findOne({ tripId, userId: req.user.id });
        res.json(list || { tripId, items: [] });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updatePackingList = async (req, res) => {
    try {
        const { tripId } = req.params;
        const { items } = req.body;
        const list = await PackingList.findOneAndUpdate(
            { tripId, userId: req.user.id },
            { tripId, userId: req.user.id, items },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


