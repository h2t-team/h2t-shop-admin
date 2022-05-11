const express = require('express');
const router = express.Router();
const categoryController = require('./categoryController');

// get category list
router.get('/', categoryController.list);

//get categories filter
router.get('/filter', categoryController.filter);

//get add category page
router.get('/addcategory', categoryController.addCategoryPage);
router.post('/addcategory', categoryController.addCategoryForm);

//get update category page
router.get('/updatecategory/:categoryId', categoryController.updateCategoryPage);
router.post('/updatecategory', categoryController.updateCategoryForm);

module.exports = router;