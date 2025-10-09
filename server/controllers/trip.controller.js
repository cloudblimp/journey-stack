const Trip = require('../models/trip.model');

exports.createTrip = async (req, res) => {
    try {
        const { title, startDate, endDate } = req.body;
        const newTrip = new Trip({
            title,
            startDate,
            endDate,
            user: req.user.id, // Comes from the auth middleware
        });
        const trip = await newTrip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const trip = await Trip.findOne({ _id: id, user: req.user.id });
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const trip = await Trip.findOneAndUpdate({ _id: id, user: req.user.id }, update, { new: true });
        if (!trip) return res.status(404).json({ message: 'Trip not found' });
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Trip.findOneAndDelete({ _id: id, user: req.user.id });
        if (!result) return res.status(404).json({ message: 'Trip not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};