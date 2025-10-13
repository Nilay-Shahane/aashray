const Order = require('../models/orderModel');
const Product = require('../models/productModel');


const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const productIds = orderItems.map(item => item.product);
    const productsFromDB = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(productsFromDB.map(p => [p._id.toString(), p]));

    for (const item of orderItems) {
      const product = productMap.get(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();

    const stockUpdates = orderItems.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { countInStock: -item.qty } },
      },
    }));

    await Product.bulkWrite(stockUpdates);

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation failed:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order.' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getAllOrders,
};