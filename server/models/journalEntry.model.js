const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
}, { _id: false });

const locationSchema = new mongoose.Schema({
    name: { type: String },
    lat: { type: Number },
    lng: { type: Number },
}, { _id: false });

const journalEntrySchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    media: { type: [mediaSchema], default: [] },
    location: { type: locationSchema, default: undefined },
    date: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);


