const express = require('express');
const multer = require('multer');
const path = require('path');
const { createProduct,getAllProducts,getProductById,updateProduct,deleteProduct } = require('../controllers/product.controller.js');
const { userAuth } = require("../middlewares/userAuth.js")
const { admin,adminAuth } = require("../middlewares/adminAuth.js")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


const productRouter = express.Router();

// for customers
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);



//for admin
// productRouter.post('/', userAuth, admin, createProduct);
productRouter.post('/', userAuth, admin, upload.single('image'), createProduct);   //change admin -> adminAuth
productRouter.put('/:id',userAuth, admin, updateProduct)    
productRouter.delete('/:id',userAuth, admin, deleteProduct);


module.exports = productRouter;