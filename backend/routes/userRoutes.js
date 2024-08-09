const express = require('express');
const router = express.Router();
const { getUsers, signup, signin, updateUser, deleteUser, changePassword, changeEmail, changeRole, dummy } = require('../controllers/userController');
//const authenticateToken = require('../utils/authMiddleware');
//const isAdmin = require('../utils/authMiddleware')

router.get('/users', getUsers);
router.post('/signup', signup);
router.post('/signin', signin);
router.put('/update',  updateUser);//router.put('/update', authenticateToken, updateUser);
router.delete('/delete', deleteUser);//router.delete('/delete', authenticateToken,isAdmin, deleteUser);
router.patch('/password', changePassword);
router.patch('/email', changeEmail);
router.patch('/role', changeRole);
router.post('/dummy', dummy)

module.exports = router;
