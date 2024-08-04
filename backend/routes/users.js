const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Use environment variables in production

// Signup Route
router.post('/signup', async (req, res) => {
    const { firstName, lastName, displayName, email, role, password } = req.body;

    const newUser = new User({
        firstName,
        lastName,
        displayName,
        email,
        role,
        password
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error handling user: ' + error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && await user.comparePassword(password)) {
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ ...user.toObject(), token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error during authentication' });
    }
});

// Logout Route
router.post('/logout', (req, res) => {
    // Handle logout logic (e.g., clear session or token)
    res.status(200).json({ message: 'Logged out successfully' });
});

// Get Current User Route
router.get('/me', async (req, res) => {
    // Assume you have middleware to authenticate and add user to req.user
    const user = req.user; // From authenticated middleware
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;
