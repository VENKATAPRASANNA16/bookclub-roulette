const Group = require('../models/Group');
const User = require('../models/User');
const Book = require('../models/Book');

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
exports.getAllGroups = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) query.status = status;

    const groups = await Group.find(query)
      .populate('bookId', 'title author coverImage')
      .populate('members.userId', 'displayName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Group.countDocuments(query);

    res.json({ 
      success: true,
      groups,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalGroups: count
    });
  } catch (error) {
    console.error('Get all groups error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching groups' 
    });
  }
};

// @desc    Get group by ID
// @route   GET /api/groups/:groupId
// @access  Private
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate('bookId')
      .populate('members.userId', 'displayName email preferences')
      .populate('messages.userId', 'displayName')
      .populate('readingProgress.userId', 'displayName');

    if (!group) {
      return res.status(404).json({ 
        success: false,
        message: 'Group not found' 
      });
    }

    // Check if user is a member
    const isMember = group.members.some(
      m => m.userId._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not a member of this group' 
      });
    }

    res.json({ 
      success: true, 
      group 
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching group' 
    });
  }
};

// @desc    Get user's groups
// @route   GET /api/groups/user/:userId
// @access  Private
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ 
      'members.userId': req.params.userId 
    })
    .populate('bookId', 'title author coverImage')
    .populate('members.userId', 'displayName')
    .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      groups 
    });
  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching user groups' 
    });
  }
};

// @desc    Get user's current active group
// @route   GET /api/groups/current
// @access  Private
exports.getCurrentGroup = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('currentGroup');

    if (!user.currentGroup) {
      return res.json({ 
        success: true, 
        currentGroup: null,
        message: 'No active group' 
      });
    }

    const group = await Group.findById(user.currentGroup)
      .populate('bookId')
      .populate('members.userId', 'displayName email preferences')
      .populate('messages.userId', 'displayName')
      .populate('readingProgress.userId', 'displayName');

    res.json({ 
      success: true, 
      currentGroup: group 
    });
  } catch (error) {
    console.error('Get current group error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching current group' 
    });
  }
};

// @desc    Create group manually (Admin/Testing)
// @route   POST /api/groups/create
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const { bookId, memberIds } = req.body;

    if (!bookId || !memberIds || memberIds.length < 3) {
      return res.status(400).json({ 
        success: false,
        message: 'Book ID and at least 3 members are required' 
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Book not found' 
      });
    }

    const group = new Group({
      bookId,
      members: memberIds.map(id => ({ userId: id, status: 'active' })),
      status: 'active',
      discussionSchedule: [
        { week: 1, scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
        { week: 2, scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
        { week: 3, scheduledDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) },
        { week: 4, scheduledDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) }
      ]
    });

    await group.save();

    // Update users
    for (let memberId of memberIds) {
      await User.findByIdAndUpdate(memberId, {
        currentGroup: group._id,
        $push: { groups: group._id },
        $pull: { queue: bookId }
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Group created successfully',
      group 
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error creating group' 
    });
  }
};

// @desc    Send message to group
// @route   POST /api/groups/:groupId/message
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const groupId = req.params.groupId;
    const userId = req.user._id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Message cannot be empty' 
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ 
        success: false,
        message: 'Group not found' 
      });
    }

    // Check if user is a member
    const isMember = group.members.some(
      m => m.userId.toString() === userId.toString() && m.status === 'active'
    );

    if (!isMember) {
      return res.status(403).json({ 
        success: false,
        message: 'You are not a member of this group' 
      });
    }

    // Add message
    group.messages.push({
      userId,
      message: message.trim(),
      timestamp: new Date()
    });

    await group.save();

    // Populate the last message for response
    await group.populate('messages.userId', 'displayName');

    const lastMessage = group.messages[group.messages.length - 1];

    res.json({ 
      success: true, 
      message: 'Message sent successfully',
      newMessage: lastMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error sending message' 
    });
  }
};

// @desc    Get group messages
// @route   GET /api/groups/:groupId/messages
// @access  Private
exports.getGroupMessages = async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId)
      .select('messages')
      .populate('messages.userId', 'displayName')
      .slice('messages', [parseInt(skip), parseInt(limit)]);

    if (!group) {
      return res.status(404).json({ 
        success: false,
        message: 'Group not found' 
      });
    }

    res.json({ 
      success: true, 
      messages: group.messages 
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching messages' 
    });
  }
};

// @desc    Update reading progress
// @route   PUT /api/groups/:groupId/progress
// @access  Private
exports.updateReadingProgress = async (req, res) => {
  try {
    const { currentPage, percentage } = req.body;
    const groupId = req.params.groupId;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ 
        success: false,
        message: 'Group not found' 
      });
    }

    // Check if progress entry exists
    const existingProgress = group.readingProgress.find(
      p => p.userId.toString() === userId.toString()
    );

    if (existingProgress) {
      existingProgress.currentPage = currentPage || existingProgress.currentPage;
      existingProgress.percentage = percentage || existingProgress.percentage;
      existingProgress.lastUpdated = new Date();
    } else {
      group.readingProgress.push({
        userId,
        currentPage: currentPage || 0,
        percentage: percentage || 0,
        lastUpdated: new Date()
      });
    }

    await group.save();

    res.json({ 
      success: true, 
      message: 'Reading progress updated successfully' 
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating progress' 
    });
  }
};

// @desc    Leave group
// @route   POST /api/groups/:groupId/leave
// @access  Private
exports.leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user._id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ 
        success: false,
        message: 'Group not found' 
      });
    }

    // Update member status
    const member = group.members.find(
      m => m.userId.toString() === userId.toString()
    );

    if (!member) {
      return res.status(404).json({ 
        success: false,
        message: 'You are not a member of this group' 
      });
    }

    member.status = 'left';
    await group.save();

    // Update user
    await User.findByIdAndUpdate(userId, {
      currentGroup: null
    });

    res.json({ 
      success: true, 
      message: 'Left group successfully' 
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error leaving group' 
    });
  }
};

// @desc    Mark discussion as completed
// @route   PUT /api/groups/:groupId/discussion/:week/complete
// @access  Private
exports.completeDiscussion = async (req, res) => {
  try {
    const { groupId, week } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ 
        success: false,
        message: 'Group not found' 
      });
    }

    const discussion = group.discussionSchedule.find(d => d.week === parseInt(week));
    if (!discussion) {
      return res.status(404).json({ 
        success: false,
        message: 'Discussion not found' 
      });
    }

    discussion.completed = true;
    if (!discussion.attendees.includes(req.user._id)) {
      discussion.attendees.push(req.user._id);
    }

    await group.save();

    res.json({ 
      success: true, 
      message: 'Discussion marked as completed' 
    });
  } catch (error) {
    console.error('Complete discussion error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error completing discussion' 
    });
  }
};