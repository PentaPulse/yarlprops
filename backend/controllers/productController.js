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

exports.addProduct = async (req, res) => {
  try {
    const { pid, mid, title, category, subCategory, description, location, quantity, status, images, timestamp } = req.body;
    if (!pid || !mid || !title || !category || !subCategory || !location || !quantity || !status || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Create a new product instance
    const product = new Product({
      pid,
      mid,
      title,
      category,
      subCategory,
      description,
      location,
      quantity,
      status,
      images,
      timestamp
    });

    // Save the product to the database
    await product.save();

    res.status(201).json({ message: 'Product added successfully', product });
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error adding product', details: err });
  }
};

exports.dummy = async (req, res) => {

}