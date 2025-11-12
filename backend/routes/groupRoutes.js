const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/auth');

// All group routes require authentication
router.use(authMiddleware);

// General group routes
router.get('/', groupController.getAllGroups);
router.get('/current', groupController.getCurrentGroup);
router.get('/user/:userId', groupController.getUserGroups);
router.get('/:groupId', groupController.getGroupById);
router.post('/create', groupController.createGroup);

// Group interaction routes
router.post('/:groupId/message', groupController.sendMessage);
router.get('/:groupId/messages', groupController.getGroupMessages);
router.put('/:groupId/progress', groupController.updateReadingProgress);
router.post('/:groupId/leave', groupController.leaveGroup);
router.put('/:groupId/discussion/:week/complete', groupController.completeDiscussion);

module.exports = router;