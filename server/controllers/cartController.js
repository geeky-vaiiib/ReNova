const { CartItem, Product, User } = require('../models');
const { Op } = require('sequelize');

// Get user's cart items
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

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
      order: [['createdAt', 'DESC']]
    });

    // Calculate cart totals
    const cartTotal = cartItems.reduce((total, item) => {
      return total + (parseFloat(item.product.price) * item.quantity);
    }, 0);

    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    res.json({
      cartItems,
      summary: {
        itemCount,
        total: parseFloat(cartTotal.toFixed(2))
      }
    });

  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch cart items'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findByPk(productId, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'username']
      }]
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    // Check if user is trying to add their own product
    if (product.ownerId === userId) {
      return res.status(400).json({
        error: 'Invalid operation',
        message: 'You cannot add your own products to cart'
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await CartItem.findOne({
      where: { userId, productId }
    });

    if (existingCartItem) {
      // Update quantity
      const newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > 99) {
        return res.status(400).json({
          error: 'Quantity limit exceeded',
          message: 'Maximum quantity per item is 99'
        });
      }

      await existingCartItem.update({ quantity: newQuantity });
      
      // Fetch updated cart item with product info
      const updatedCartItem = await CartItem.findByPk(existingCartItem.id, {
        include: [{
          model: Product,
          as: 'product',
          include: [{
            model: User,
            as: 'owner',
            attributes: ['id', 'username']
          }]
        }]
      });

      return res.json({
        message: 'Cart item updated successfully',
        cartItem: updatedCartItem
      });
    }

    // Create new cart item
    const cartItem = await CartItem.create({
      userId,
      productId,
      quantity
    });

    // Fetch created cart item with product info
    const createdCartItem = await CartItem.findByPk(cartItem.id, {
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'username']
        }]
      }]
    });

    res.status(201).json({
      message: 'Item added to cart successfully',
      cartItem: createdCartItem
    });

  } catch (error) {
    console.error('Add to cart error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to add item to cart'
    });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    const cartItem = await CartItem.findOne({
      where: { id, userId },
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'username']
        }]
      }]
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart item not found',
        message: 'The requested cart item does not exist'
      });
    }

    await cartItem.update({ quantity });

    // Fetch updated cart item
    const updatedCartItem = await CartItem.findByPk(id, {
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: User,
          as: 'owner',
          attributes: ['id', 'username']
        }]
      }]
    });

    res.json({
      message: 'Cart item updated successfully',
      cartItem: updatedCartItem
    });

  } catch (error) {
    console.error('Update cart item error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update cart item'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await CartItem.findOne({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({
        error: 'Cart item not found',
        message: 'The requested cart item does not exist'
      });
    }

    await cartItem.destroy();

    res.json({
      message: 'Item removed from cart successfully'
    });

  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to remove item from cart'
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const deletedCount = await CartItem.destroy({
      where: { userId }
    });

    res.json({
      message: 'Cart cleared successfully',
      deletedItems: deletedCount
    });

  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to clear cart'
    });
  }
};

// Get cart item count
const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartItem.findAll({
      where: { userId },
      attributes: ['quantity']
    });

    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    res.json({
      itemCount
    });

  } catch (error) {
    console.error('Get cart count error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get cart count'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartCount
};
