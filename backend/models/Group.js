const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book ID is required']
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'left', 'completed'],
      default: 'active'
    }
  }],
  maxMembers: {
    type: Number,
    default: 6,
    min: [3, 'Group must have at least 3 members'],
    max: [10, 'Group cannot exceed 10 members']
  },
  discussionSchedule: [{
    week: {
      type: Number,
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    topic: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  messages: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    edited: {
      type: Boolean,
      default: false
    }
  }],
  readingProgress: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    currentPage: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['forming', 'active', 'completed', 'disbanded'],
    default: 'forming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: function() {
      // Default: 30 days from now
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  groupName: {
    type: String,
    default: function() {
      return `Reading Group ${Date.now()}`;
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
groupSchema.index({ status: 1, createdAt: -1 });
groupSchema.index({ 'members.userId': 1 });

// Method to add member
groupSchema.methods.addMember = function(userId) {
  if (this.members.length >= this.maxMembers) {
    throw new Error('Group is full');
  }
  
  const alreadyMember = this.members.some(
    member => member.userId.toString() === userId.toString()
  );
  
  if (alreadyMember) {
    throw new Error('User is already a member');
  }
  
  this.members.push({ userId, status: 'active' });
};

// Method to remove member
groupSchema.methods.removeMember = function(userId) {
  this.members = this.members.map(member => {
    if (member.userId.toString() === userId.toString()) {
      member.status = 'left';
    }
    return member;
  });
};

// Get active members count
groupSchema.methods.getActiveMembersCount = function() {
  return this.members.filter(m => m.status === 'active').length;
};

module.exports = mongoose.model('Group', groupSchema);