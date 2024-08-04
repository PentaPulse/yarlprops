const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Use environment variables in production

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Assume token is sent as "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = decoded; // Attach user info to request
        next();
    });
};

module.exports = authMiddleware;
