const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');
const { validate, cartSchemas } = require('../middleware/validation');

// @route   GET /api/cart
// @desc    Get user's cart items
// @access  Private
router.get('/', authenticateToken, getCart);

// @route   GET /api/cart/count
// @desc    Get cart item count
// @access  Private
router.get('/count', authenticateToken, getCartCount);

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', authenticateToken, validate(cartSchemas.addItem), addToCart);

// @route   PUT /api/cart/:id
// @desc    Update cart item quantity
// @access  Private
router.put('/:id', authenticateToken, validate(cartSchemas.updateItem), updateCartItem);

// @route   DELETE /api/cart/:id
// @desc    Remove item from cart
// @access  Private
router.delete('/:id', authenticateToken, removeFromCart);

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', authenticateToken, clearCart);

module.exports = router;
