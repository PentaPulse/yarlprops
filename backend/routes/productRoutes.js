const express = require('express');
const router = express.Router();
const { getProducts, dummy, addProduct } = require('../controllers/productController');

router.get('/products',getProducts);
router.post('/add',addProduct)
router.post('/dummy',dummy)

module.exports = router;