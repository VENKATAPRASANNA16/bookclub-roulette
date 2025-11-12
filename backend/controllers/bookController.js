const Book = require('../models/Book');
const User = require('../models/User');
const Group = require('../models/Group');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      genre, 
      contentType, 
      search,
      sortBy = 'waitingReaders' 
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (genre) query.genre = genre;
    if (contentType) query.contentType = contentType;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting options
    let sort = {};
    switch (sortBy) {
      case 'waitingReaders':
        sort = { waitingReaders: -1 };
        break;
      case 'totalReads':
        sort = { totalReads: -1 };
        break;
      case 'rating':
        sort = { averageRating: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { waitingReaders: -1 };
    }

    const books = await Book.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('addedBy', 'displayName');

    const count = await Book.countDocuments(query);

    res.json({ 
      success: true,
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalBooks: count
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching books' 
    });
  }
};

// @desc    Get book by ID
// @route   GET /api/books/:bookId
// @access  Public
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId)
      .populate('addedBy', 'displayName email');

    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Book not found' 
      });
    }

    res.json({ 
      success: true, 
      book 
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching book' 
    });
  }
};

// @desc    Add new book
// @route   POST /api/books
// @access  Private
exports.addBook = async (req, res) => {
  try {
    const { 
      title, 
      author, 
      genre, 
      contentType, 
      pageCount, 
      synopsis,
      isbn,
      publishedYear,
      language,
      coverImage,
      tags
    } = req.body;

    // Validation
    if (!title || !author || !genre) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide title, author, and genre' 
      });
    }

    // Check if book already exists
    const existingBook = await Book.findOne({ 
      title: { $regex: new RegExp(`^${title}$`, 'i') },
      author: { $regex: new RegExp(`^${author}$`, 'i') }
    });

    if (existingBook) {
      return res.status(400).json({ 
        success: false,
        message: 'This book already exists in the database',
        bookId: existingBook._id
      });
    }

    const book = new Book({
      title,
      author,
      genre,
      contentType: contentType || 'novel',
      pageCount: pageCount || 0,
      synopsis: synopsis || '',
      isbn,
      publishedYear,
      language: language || 'English',
      coverImage,
      tags: tags || [],
      addedBy: req.user._id
    });

    await book.save();

    res.status(201).json({ 
      success: true, 
      message: 'Book added successfully',
      book 
    });
  } catch (error) {
    console.error('Add book error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Server error adding book' 
    });
  }
};

// @desc    Add book to user queue
// @route   POST /api/books/queue/add
// @access  Private
exports.addToQueue = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // Validate bookId
    if (!bookId) {
      return res.status(400).json({ 
        success: false,
        message: 'Book ID is required' 
      });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ 
        success: false,
        message: 'Book not found' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Check if already in queue
    if (user.queue.includes(bookId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Book is already in your queue' 
      });
    }

    // Add to queue
    user.queue.push(bookId);
    await user.save();

    // Increment waiting readers
    book.waitingReaders += 1;
    await book.save();

    // Check if we can create a group (3+ readers)
    if (book.waitingReaders >= 3) {
      await checkAndCreateGroup(bookId);
    }

    res.json({ 
      success: true, 
      message: 'Book added to queue successfully',
      waitingReaders: book.waitingReaders
    });
  } catch (error) {
    console.error('Add to queue error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error adding book to queue' 
    });
  }
};

// @desc    Remove book from queue
// @route   DELETE /api/books/queue/remove
// @access  Private
exports.removeFromQueue = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Remove from queue
    user.queue = user.queue.filter(id => id.toString() !== bookId);
    await user.save();

    // Decrement waiting readers
    const book = await Book.findById(bookId);
    if (book && book.waitingReaders > 0) {
      book.waitingReaders -= 1;
      await book.save();
    }

    res.json({ 
      success: true, 
      message: 'Book removed from queue successfully' 
    });
  } catch (error) {
    console.error('Remove from queue error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error removing book from queue' 
    });
  }
};

// @desc    Get user's queue
// @route   GET /api/books/queue/:userId
// @access  Private
exports.getUserQueue = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'queue',
        options: { sort: { createdAt: -1 } }
      });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      queue: user.queue 
    });
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching queue' 
    });
  }
};

// @desc    Get books close to matching (2/3 readers)
// @route   GET /api/books/almost-ready
// @access  Public
exports.getAlmostReadyBooks = async (req, res) => {
  try {
    const books = await Book.find({ 
      waitingReaders: { $gte: 2 },
      isActive: true 
    })
    .sort({ waitingReaders: -1 })
    .limit(20);

    res.json({ 
      success: true, 
      books 
    });
  } catch (error) {
    console.error('Get almost ready books error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching books' 
    });
  }
};

// @desc    Search books
// @route   GET /api/books/search
// @access  Public
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        success: false,
        message: 'Search query must be at least 2 characters' 
      });
    }

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    })
    .limit(20)
    .sort({ waitingReaders: -1 });

    res.json({ 
      success: true, 
      books,
      count: books.length
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error searching books' 
    });
  }
};

// Helper function to check and create groups
async function checkAndCreateGroup(bookId) {
  try {
    // Find users with this book in queue and no current group
    const users = await User.find({ 
      queue: bookId, 
      currentGroup: null 
    }).limit(6);

    if (users.length >= 3) {
      // Create new group
      const group = new Group({
        bookId: bookId,
        members: users.map(u => ({ 
          userId: u._id, 
          status: 'active' 
        })),
        status: 'active',
        discussionSchedule: [
          { 
            week: 1, 
            scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            topic: 'First Impressions & Setting'
          },
          { 
            week: 2, 
            scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            topic: 'Character Development'
          },
          { 
            week: 3, 
            scheduledDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
            topic: 'Plot & Themes'
          },
          { 
            week: 4, 
            scheduledDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
            topic: 'Conclusion & Final Thoughts'
          }
        ]
      });

      await group.save();

      // Update users
      for (let user of users) {
        user.currentGroup = group._id;
        user.groups.push(group._id);
        user.queue = user.queue.filter(id => id.toString() !== bookId.toString());
        await user.save();
      }

      // Reset waiting readers and increment total reads
      const book = await Book.findById(bookId);
      if (book) {
        book.waitingReaders = Math.max(0, book.waitingReaders - users.length);
        book.totalReads += 1;
        await book.save();
      }

      console.log(`✅ Group created for book ${bookId} with ${users.length} members`);
      return group;
    }
  } catch (error) {
    console.error('Error creating group:', error);
  }
}