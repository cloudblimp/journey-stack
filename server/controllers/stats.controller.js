const Trip = require('../models/trip.model');
const JournalEntry = require('../models/journalEntry.model');

exports.getStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const trips = await Trip.find({ user: userId });
        const numTrips = trips.length;
        const journalCount = await JournalEntry.countDocuments({ userId });

        // Basic derived stats; countries visited would need destinations with country
        const totalDestinations = trips.reduce((acc, t) => acc + (t.destinations?.length || 0), 0);

        res.json({ numTrips, journalCount, totalDestinations });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


