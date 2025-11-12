const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/almost-ready', bookController.getAlmostReadyBooks);
router.get('/:bookId', bookController.getBookById);

// Protected routes
router.post('/', authMiddleware, bookController.addBook);
router.post('/queue/add', authMiddleware, bookController.addToQueue);
router.delete('/queue/remove', authMiddleware, bookController.removeFromQueue);
router.get('/queue/:userId', authMiddleware, bookController.getUserQueue);

module.exports = router;