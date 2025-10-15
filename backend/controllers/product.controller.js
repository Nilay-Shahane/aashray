const {Product} = require('../models/product.model.js');

const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, countInStock } = req.body;

    const image = req.file ? `/${req.file.path}` : '/images/sample.jpg';

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock,
      user: req.user._id, 
    });

const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    

    if (product) {
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.image = req.body.image || product.image;
      product.description = req.body.description || product.description;
      product.category = req.body.category || product.category;
      product.countInStock = req.body.countInStock || product.countInStock;
      
      
      const updatedProduct = await product.save();
      
      res.json(updatedProduct);
    } else {
     
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error("--- 🚨 CRASH DURING PRODUCT UPDATE 🚨 ---", error);
    res.status(500).json({ message: 'Server Error' });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne(); 
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct, 
  deleteProduct,
};