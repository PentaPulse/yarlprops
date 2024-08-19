const mongoose=require('mongoose');

const connectDB = async()=>{
    try{
        //cloud "mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority"
        await mongoose.connect("mongodb://127.0.0.1:27017/yarlprops");
        console.log("Mongodb connected")
    }catch(e){
        console.error(e.message);
        process.exit(1);
    }
};

module.exports = connectDB;