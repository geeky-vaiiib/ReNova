const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate, authSchemas } = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(authSchemas.register), register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(authSchemas.login), login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, getMe);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', refreshToken);

module.exports = router;
