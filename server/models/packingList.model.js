const mongoose = require('mongoose');

const packingItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String },
    packed: { type: Boolean, default: false },
}, { _id: false });

const packingListSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [packingItemSchema], default: [] },
}, { timestamps: { createdAt: false, updatedAt: true } });

module.exports = mongoose.model('PackingList', packingListSchema);


