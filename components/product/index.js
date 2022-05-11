const express = require('express');
const router = express.Router();
const productController = require('./productController');

// get product list
router.get('/', productController.list);
router.post('/', productController.removeProduct);

// get products search
router.get('/search', productController.search);

//get add product page
router.get('/addproduct', productController.addProductPage);
router.post('/addproduct', productController.addProductForm);

//get update product page
router.get('/updateproduct/:productId', productController.updateProductPage);
router.post('/updateproduct', productController.updateProductForm);

module.exports = router;