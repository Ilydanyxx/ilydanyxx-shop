const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { products, totalPrice } = req.body;
        const newOrder = new Order({
            userId: req.user.id,
            products,
            totalPrice
        });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
