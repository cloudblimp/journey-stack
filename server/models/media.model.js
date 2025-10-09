const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    type: { type: String, enum: ['image', 'video', 'audio', 'document'], required: true },
    url: { type: String },
    thumbUrl: { type: String },
    s3Key: { type: String },
    metadata: {
        width: Number,
        height: Number,
        size: Number,
        duration: Number,
    },
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', mediaSchema);


