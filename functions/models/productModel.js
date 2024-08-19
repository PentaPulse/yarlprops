const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pid:{type:String,required:true,unique:true},
    sid:{type:String,required:true},
    title:{type:String,required:true},
    category:{type:String,required:true},
    subctegory:{type:String,required:true},
    description:{type:String},
    location:{type:String,required:true},
    quantity:{type:Number,required:true},
    status:{type:String,required:true},    
});


const Product = mongoose.model('Product',productSchema);

module.exports=Product;