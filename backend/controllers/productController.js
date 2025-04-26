const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    try {
        const { title, description, price, imageUrl } = req.body;
        const newProduct = new Product({ title, description, price, imageUrl });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
