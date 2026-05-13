const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  createProductValidator,
  updateProductValidator,
  listProductsValidator,
  mongoIdValidator,
} = require('../validators/product.validator');
const { upload } = require('../config/cloudinary');

/**
 * @route   GET /api/products
 * @desc    Get all products with search, filter, pagination
 * @access  Public
 */
router.get('/', listProductsValidator, validate, productController.getProducts);

/**
 * @route   GET /api/products/categories
 * @desc    Get all distinct categories
 * @access  Public
 */
router.get('/categories', productController.getCategories);

/**
 * @route   GET /api/products/:id
 * @desc    Get single product
 * @access  Public
 */
router.get('/:id', mongoIdValidator('id'), validate, productController.getProductById);

/**
 * @route   POST /api/products
 * @desc    Create a product listing
 * @access  Admin
 */
router.post(
  '/',
  protect,
  adminOnly,
  upload.array('images', 5),
  createProductValidator,
  validate,
  productController.createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product listing
 * @access  Admin
 */
router.put(
  '/:id',
  protect,
  adminOnly,
  upload.array('images', 5),
  mongoIdValidator('id'),
  updateProductValidator,
  validate,
  productController.updateProduct
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product listing
 * @access  Admin
 */
router.delete(
  '/:id',
  protect,
  adminOnly,
  mongoIdValidator('id'),
  validate,
  productController.deleteProduct
);

module.exports = router;
