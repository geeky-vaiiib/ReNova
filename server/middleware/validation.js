const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid input data',
        details
      });
    }
    
    next();
  };
};

// Validation schemas
const authSchemas = {
  register: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username must contain only letters and numbers',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username must be less than 30 characters long'
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  })
};

const productSchemas = {
  create: Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.min': 'Title must be at least 3 characters long',
        'string.max': 'Title must be less than 100 characters long'
      }),
    description: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description must be less than 1000 characters long'
      }),
    price: Joi.number()
      .positive()
      .precision(2)
      .required()
      .messages({
        'number.positive': 'Price must be a positive number',
        'number.precision': 'Price can have at most 2 decimal places'
      }),
    category: Joi.string()
      .valid('Clothing', 'Electronics', 'Furniture', 'Sports', 'Books', 'Music', 'Other')
      .required()
      .messages({
        'any.only': 'Category must be one of: Clothing, Electronics, Furniture, Sports, Books, Music, Other'
      }),
    imageUrl: Joi.string()
      .uri()
      .optional()
      .allow('')
      .messages({
        'string.uri': 'Image URL must be a valid URL'
      })
  }),

  update: Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .optional(),
    description: Joi.string()
      .min(10)
      .max(1000)
      .optional(),
    price: Joi.number()
      .positive()
      .precision(2)
      .optional(),
    category: Joi.string()
      .valid('Clothing', 'Electronics', 'Furniture', 'Sports', 'Books', 'Music', 'Other')
      .optional(),
    imageUrl: Joi.string()
      .uri()
      .optional()
      .allow('')
  })
};

const cartSchemas = {
  addItem: Joi.object({
    productId: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.integer': 'Product ID must be an integer',
        'number.positive': 'Product ID must be positive'
      }),
    quantity: Joi.number()
      .integer()
      .min(1)
      .max(99)
      .required()
      .messages({
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Quantity cannot exceed 99'
      })
  }),

  updateItem: Joi.object({
    quantity: Joi.number()
      .integer()
      .min(1)
      .max(99)
      .required()
      .messages({
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'number.max': 'Quantity cannot exceed 99'
      })
  })
};

module.exports = {
  validate,
  authSchemas,
  productSchemas,
  cartSchemas
};
