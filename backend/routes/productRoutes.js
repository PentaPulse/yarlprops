const express = require('express');
const router = express.Router();
const { getProducts, dummy } = require('../controllers/productController');

router.get('/products',getProducts);
router.post('/dummy',dummy)

module.exports = router;