const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify', userController.verifyToken);

// Protected routes
router.get('/profile/:userId', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.get('/stats', authMiddleware, userController.getUserStats);

module.exports = router;