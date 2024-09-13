const Product = require("../models/productModel");
const Products = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addProduct=async(req,res)=>{
  try{
    const product = new Product(req.body)
    await product.save()
    res.json({message:"Product added successfully : ",product})
  } catch(err){
    res.status(500).json({error:"Error adding product",details:err})
  }
}

exports.dummy = async(req,res)=>{
  
}