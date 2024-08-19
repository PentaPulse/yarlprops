const Products = require("../models/productModel");

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.json(products);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.dummy = async(req,res)=>{
  
}