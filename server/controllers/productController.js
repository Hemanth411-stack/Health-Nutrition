import Product from '../models/Product.js';

// 🔹 Create Product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const created = await product.save();

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// 🔹 Get All Products
export const getAllProducts = async (req, res) => {
  try {

    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
};

// 🔹 Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
};
