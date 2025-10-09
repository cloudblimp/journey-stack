const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    destinations: {
        type: [{ name: String, lat: Number, lng: Number }],
        default: [],
    },
    coverImageURL: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    // We'll add more fields like destinations later
}, {
    timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;