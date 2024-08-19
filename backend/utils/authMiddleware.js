const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer token" format

  if (token == null) return res.sendStatus(401); // If no token

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // If invalid token
    req.user = user;
    next(); // Pass the user to the next middleware or route handler
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // If the user is an admin, continue to the next middleware or route handler
  } else {
    res.sendStatus(403); // If not an admin, return forbidden status
  }
};

module.exports = authenticateToken,isAdmin;
