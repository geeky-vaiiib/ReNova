const { Order, OrderItem, CartItem, Product, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get user's orders
const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'username']
          }]
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch orders'
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findOne({
      where: { id, userId },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'username']
          }]
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order does not exist'
      });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order'
    });
  }
};

// Checkout - Convert cart to order
const checkout = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = req.user.id;

    // Get cart items
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'username']
        }]
      }],
      transaction
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Empty cart',
        message: 'Your cart is empty. Add some items before checkout.'
      });
    }

    // Validate all products still exist and calculate total
    let total = 0;
    const orderItemsData = [];

    for (const cartItem of cartItems) {
      if (!cartItem.product) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Product not found',
          message: 'One or more products in your cart no longer exist'
        });
      }

      // Check if user is trying to buy their own product
      if (cartItem.product.ownerId === userId) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'Invalid purchase',
          message: 'You cannot purchase your own products'
        });
      }

      const itemTotal = parseFloat(cartItem.product.price) * cartItem.quantity;
      total += itemTotal;

      orderItemsData.push({
        productId: cartItem.productId,
        priceAtPurchase: cartItem.product.price,
        quantity: cartItem.quantity
      });
    }

    // Create order
    const order = await Order.create({
      userId,
      total: total.toFixed(2),
      status: 'pending'
    }, { transaction });

    // Create order items
    const orderItems = await Promise.all(
      orderItemsData.map(item => 
        OrderItem.create({
          orderId: order.id,
          ...item
        }, { transaction })
      )
    );

    // Clear cart
    await CartItem.destroy({
      where: { userId },
      transaction
    });

    await transaction.commit();

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'username']
          }]
        }]
      }]
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order: completeOrder
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Checkout error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to process checkout'
    });
  }
};

// Update order status (for future use - admin functionality)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findOne({
      where: { id, userId }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found',
        message: 'The requested order does not exist'
      });
    }

    // For now, only allow cancellation by user
    if (status !== 'cancelled') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only cancel orders'
      });
    }

    // Don't allow cancellation of already shipped/delivered orders
    if (['shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        error: 'Cannot cancel order',
        message: 'Order has already been shipped and cannot be cancelled'
      });
    }

    await order.update({ status });

    // Fetch updated order
    const updatedOrder = await Order.findByPk(id, {
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'username']
          }]
        }]
      }]
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update order status'
    });
  }
};

// Get order statistics (for dashboard)
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Order.findAll({
      where: { userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount']
      ],
      group: ['status'],
      raw: true
    });

    const totalOrders = await Order.count({ where: { userId } });
    const totalSpent = await Order.sum('total', { where: { userId } });

    res.json({
      stats,
      summary: {
        totalOrders,
        totalSpent: parseFloat(totalSpent || 0).toFixed(2)
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch order statistics'
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  checkout,
  updateOrderStatus,
  getOrderStats
};
