const path = require('path');
const { body } = require('express-validator');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', [
    body('title', "Title must be made up of numbers or letters and must be no less than 3 characters").isAlphanumeric("en-US", {ignore: ' '}).isLength({min: 3}).trim(),
    body('price', "Price must be numeric and have decimal places").isFloat(),
    body('description', "Description must be between 5 and 250 characters").isLength({min: 5, max: 250}).trim()
], adminController.postAddProduct);

router.get('/products', adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', [
    body('title', "Title must be made up of numbers or letters and must be more than 3 characters").isAlphanumeric("en-US", {ignore: ' '}).isLength({min: 3}).trim(),
    body('price', "Price must be numeric and have decimal places").isFloat(),
    body('description', "Description must be between 5 and 250 characters").isLength({min: 5, max: 250}).trim()
], adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;