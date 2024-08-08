const express = require('express');
const { getUsers,signup,signin } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getUsers);
router.post('/signup',signup);
router.post('/signin',signin)

module.exports = router;
