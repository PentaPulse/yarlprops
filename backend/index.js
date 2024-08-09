const express = require("express");
const connectDB = require("./config/mongoDB");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const contactusRoutes = require("./routes/contactusRoutes");
require("dotenv").config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/u", userRoutes);
app.use("/api/c/", contactusRoutes);
app.use("/api/p", productRoutes);
app.use("/api/s", serviceRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
