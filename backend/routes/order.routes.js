const express = require('express');
const orderRouter = express.Router();
const { addOrderItems,getOrderById,getMyOrders,getAllOrders } = require('../controllers/order.controller');
const { userAuth } = require("../middlewares/userAuth.js")
const { admin,adminAuth } = require("../middlewares/adminAuth.js")


orderRouter.route('/').post(userAuth, addOrderItems).get(userAuth, admin, getAllOrders);  //change admin  ->  adminAuth
orderRouter.route('/myorders').get(userAuth, getMyOrders);
orderRouter.route('/:id').get(userAuth, getOrderById);

module.exports = {orderRouter};