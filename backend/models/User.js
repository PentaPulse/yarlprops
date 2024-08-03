const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
    firstName:String,
    lastName:String,
    displayName:String,
    email:String,
    role:String,
    password:String
});

userScheme.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    try{
        const hPass = await bcrypt.hash(this.password,10);
        this.password=hPass;
        next();
    }catch(e){
        next(e)
    }
});

userScheme.methods.comparePassword = async function(cPass){
    return await bcrypt.compare(cPass,this.password)
};


const User = mongoose.model('User',userScheme);

module.exports = User;