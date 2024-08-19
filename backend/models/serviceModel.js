const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    sid:{type:String,required:true,unique:true},
    sellerid:{type:String,required:true},
    title:{type:String,required:true},
    category:{type:String,required:true},
    subctegory:{type:String,required:true},
    description:{type:String},
    location:{type:String,required:true},
});


const Service = mongoose.model('Service',serviceSchema);

module.exports=Service;