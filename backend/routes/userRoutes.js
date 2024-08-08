const express = require('express');
const router = express.Router();
const { getUsers,signup,signin, updateUser, deleteUser } = require('../controllers/userController');

router.get('/users', getUsers);
router.post('/signup',signup);
router.post('/signin',signin);
router.post('/update',updateUser);
router.post('/delete',deleteUser);

module.exports = router;
