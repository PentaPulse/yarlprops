const mongoose=required('mongoose');

const connectDB = async()=>{
    try{
        await mongoose.connect("mongodb+srv://Cluster33761:X2dxeXpaUktf@cluster33761.q1ofbfy.mongodb.net/yarlprops?retryWrites=true&w=majority",{
            useNewUrlParser:true,
            useUnifieldTopology:true,
        });
        console.log("Mongodb connected")
    }catch(e){
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;