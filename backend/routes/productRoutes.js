const express = require('express');
const router = express.Router();
const { addProduct, getProducts } = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.post('/add', addProduct); // без verifyAdmin

router.get('/', getProducts);

module.exports = router;
