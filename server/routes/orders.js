const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  checkout,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');
const Joi = require('joi');
const { validate } = require('../middleware/validation');

// Validation schema for order status update
const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, confirmed, shipped, delivered, cancelled'
    })
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', authenticateToken, getOrders);

// @route   GET /api/orders/stats
// @desc    Get order statistics
// @access  Private
router.get('/stats', authenticateToken, getOrderStats);

// @route   GET /api/orders/:id
// @desc    Get single order by ID
// @access  Private
router.get('/:id', authenticateToken, getOrderById);

// @route   POST /api/orders/checkout
// @desc    Checkout - Convert cart to order
// @access  Private
router.post('/checkout', authenticateToken, checkout);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', authenticateToken, validate(updateStatusSchema), updateOrderStatus);

module.exports = router;
