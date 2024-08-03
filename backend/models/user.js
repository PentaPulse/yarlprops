const mongoose = require('mongoose');

const userScheme = new mongoose.Schema({
    firstName:String,
    lastName:String,
    displayName:String,
    email:String,
    role:String
});

const User = mongoose.model('User',userScheme);

module.exports = User;