const { Product, User } = require('../models');
const { Op } = require('sequelize');

// Get all products with search and filter
const getProducts = async (req, res) => {
  try {
    const { 
      search = '', 
      category = '', 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where clause
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category && category !== 'All') {
      whereClause.category = category;
    }

    // Valid sort fields
    const validSortFields = ['createdAt', 'title', 'price', 'category'];
    const validSortOrders = ['ASC', 'DESC'];
    
    const orderBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = validSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const { count, rows: products } = await Product.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'username']
      }],
      order: [[orderBy, orderDirection]],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      },
      filters: {
        search,
        category,
        sortBy: orderBy,
        sortOrder: orderDirection
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch products'
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'username', 'email']
      }]
    });

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch product'
    });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { title, description, category, price, imageUrl } = req.body;
    const ownerId = req.user.id;

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      category,
      price: parseFloat(price),
      imageUrl: imageUrl?.trim() || null,
      ownerId
    });

    // Fetch the created product with owner info
    const createdProduct = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'username']
      }]
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: createdProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create product'
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, price, imageUrl } = req.body;
    const userId = req.user.id;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    // Check if user owns the product
    if (product.ownerId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only update your own products'
      });
    }

    // Update fields that are provided
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;

    await product.update(updateData);

    // Fetch updated product with owner info
    const updatedProduct = await Product.findByPk(id, {
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'username']
      }]
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update product'
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found',
        message: 'The requested product does not exist'
      });
    }

    // Check if user owns the product
    if (product.ownerId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only delete your own products'
      });
    }

    await product.destroy();

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        error: 'Cannot delete product',
        message: 'This product is referenced in existing orders and cannot be deleted'
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete product'
    });
  }
};

// Get user's own products
const getMyProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: products } = await Product.findAndCountAll({
      where: { ownerId: userId },
      include: [{
        model: User,
        as: 'owner',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit)),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch your products'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
};
