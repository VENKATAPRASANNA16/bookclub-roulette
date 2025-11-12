const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: [
      'Fiction',
      'Non-Fiction',
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Thriller',
      'Romance',
      'Historical Fiction',
      'Biography',
      'Self-Help',
      'Poetry',
      'Drama',
      'Horror',
      'Young Adult',
      'Classic',
      'Comic/Graphic Novel',
      'Fanfiction',
      'Manga',
      'Other'
    ]
  },
  contentType: {
    type: String,
    enum: ['novel', 'comic', 'fanfiction', 'poetry', 'manga', 'short-story', 'other'],
    default: 'novel'
  },
  pageCount: {
    type: Number,
    min: [0, 'Page count cannot be negative'],
    default: 0
  },
  synopsis: {
    type: String,
    maxlength: [1000, 'Synopsis cannot exceed 1000 characters'],
    trim: true
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=Book+Cover'
  },
  isbn: {
    type: String,
    trim: true
  },
  publishedYear: {
    type: Number,
    min: [1000, 'Invalid year'],
    max: [new Date().getFullYear() + 5, 'Year cannot be in the distant future']
  },
  language: {
    type: String,
    default: 'English'
  },
  waitingReaders: {
    type: Number,
    default: 0,
    min: [0, 'Waiting readers cannot be negative']
  },
  totalReads: {
    type: Number,
    default: 0,
    min: [0, 'Total reads cannot be negative']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search optimization
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });
bookSchema.index({ waitingReaders: -1 });
bookSchema.index({ totalReads: -1 });

module.exports = mongoose.model('Book', bookSchema);