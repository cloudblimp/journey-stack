const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth.routes');
const tripRoutes = require('./routes/trip.routes');
const journalRoutes = require('./routes/journal.routes');
const packingRoutes = require('./routes/packing.routes');
const statsRoutes = require('./routes/stats.routes');
const mediaRoutes = require('./routes/media.routes');

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1', journalRoutes);
app.use('/api/v1', packingRoutes);
app.use('/api/v1', statsRoutes);
app.use('/api/v1', mediaRoutes);

const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
        app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
    })
    .catch((error) => {
        console.error('Connection to MongoDB failed:', error.message);
    });