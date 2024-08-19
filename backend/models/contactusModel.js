const mongoose = require('mongoose');

const contactusModel = new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    message:{type:String,required:true},
    status:{type:String,required:true},
    reply:{type:String},
    replyDate:{type:Date}
});

const Contactus = mongoose.model('Contactus',contactusModel);

module.exports = Contactus;