const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderController');
const { verifyUser } = require('../middleware/authMiddleware');

router.post('/', verifyUser, createOrder);

module.exports = router;
