const express = require('express');
const connectDB = require('./config/mongoDB');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./utils/authMiddleware');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/u', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
