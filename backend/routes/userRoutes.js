const express = require('express');
const router = express.Router();
const { getUsers,signup,signin, updateUser, deleteUser, changePassword, changeEmail, changeRole } = require('../controllers/userController');

router.get('/users', getUsers);
router.post('/signup',signup);
router.post('/signin',signin);
router.put('/update',updateUser);
router.delete('/delete',deleteUser);
router.patch('/password',changePassword);
router.patch('/email',changeEmail);
router.patch('/role',changeRole)

module.exports = router;
