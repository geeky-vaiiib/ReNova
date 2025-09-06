const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/productController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { validate, productSchemas } = require('../middleware/validation');

// @route   GET /api/products
// @desc    Get all products with search and filter
// @access  Public (but can be enhanced with user info if logged in)
router.get('/', optionalAuth, getProducts);

// @route   GET /api/products/my
// @desc    Get current user's products
// @access  Private
router.get('/my', authenticateToken, getMyProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create new product
// @access  Private
router.post('/', authenticateToken, validate(productSchemas.create), createProduct);

// @route   PUT /api/products/:id
// @desc    Update product (owner only)
// @access  Private
router.put('/:id', authenticateToken, validate(productSchemas.update), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product (owner only)
// @access  Private
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
