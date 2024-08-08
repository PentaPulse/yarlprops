const mongoose=require('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect("mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority");
        console.log("Mongodb connected")
    }catch(e){
        console.error(e.message);
        process.exit(1);
    }
};

module.exports = connectDB;