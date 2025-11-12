const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('./models/Book');
const User = require('./models/User');
const Group = require('./models/Group');

dotenv.config();

const sampleBooks = [
  {
    title: "1984",
    author: "George Orwell",
    genre: "Science Fiction",
    contentType: "novel",
    pageCount: 328,
    synopsis: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    publishedYear: 1949,
    language: "English",
    waitingReaders: 2,
    tags: ["dystopia", "classic", "political"]
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    contentType: "novel",
    pageCount: 281,
    synopsis: "A story of racial injustice and childhood innocence in the American South.",
    publishedYear: 1960,
    language: "English",
    waitingReaders: 1,
    tags: ["classic", "drama", "justice"]
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    contentType: "novel",
    pageCount: 180,
    synopsis: "A tale of wealth, love, and the American Dream in the Roaring Twenties.",
    publishedYear: 1925,
    language: "English",
    waitingReaders: 3,
    tags: ["classic", "romance", "tragedy"]
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    contentType: "novel",
    pageCount: 309,
    synopsis: "A young wizard's journey begins at Hogwarts School of Witchcraft and Wizardry.",
    publishedYear: 1997,
    language: "English",
    waitingReaders: 5,
    tags: ["magic", "adventure", "young-adult"]
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    contentType: "novel",
    pageCount: 432,
    synopsis: "A classic tale of love, marriage, and society in Regency England.",
    publishedYear: 1813,
    language: "English",
    waitingReaders: 2,
    tags: ["classic", "romance", "historical"]
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    contentType: "novel",
    pageCount: 310,
    synopsis: "Bilbo Baggins' unexpected journey to reclaim dwarf treasure from the dragon Smaug.",
    publishedYear: 1937,
    language: "English",
    waitingReaders: 4,
    tags: ["fantasy", "adventure", "classic"]
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    contentType: "novel",
    pageCount: 234,
    synopsis: "Holden Caulfield's journey through New York City after being expelled from prep school.",
    publishedYear: 1951,
    language: "English",
    waitingReaders: 1,
    tags: ["coming-of-age", "classic", "rebellion"]
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    contentType: "novel",
    pageCount: 688,
    synopsis: "Epic tale of politics, religion, and ecology on the desert planet Arrakis.",
    publishedYear: 1965,
    language: "English",
    waitingReaders: 3,
    tags: ["sci-fi", "epic", "space"]
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    contentType: "novel",
    pageCount: 208,
    synopsis: "A shepherd boy's journey to find treasure and discover his personal legend.",
    publishedYear: 1988,
    language: "Portuguese",
    waitingReaders: 2,
    tags: ["philosophy", "adventure", "inspiration"]
  },
  {
    title: "Fahrenheit 451",
    author: "Ray Bradbury",
    genre: "Science Fiction",
    contentType: "novel",
    pageCount: 249,
    synopsis: "A dystopian future where books are banned and 'firemen' burn any that are found.",
    publishedYear: 1953,
    language: "English",
    waitingReaders: 1,
    tags: ["dystopia", "censorship", "classic"]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Book.deleteMany({});
    await User.deleteMany({});
    await Group.deleteMany({});

    // Insert books
    console.log('📚 Inserting sample books...');
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`✅ Inserted ${insertedBooks.length} books`);

    // Create sample users
    console.log('👤 Creating sample users...');
    const sampleUsers = [
      {
        displayName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        preferences: {
          timezone: 'America/New_York',
          commitmentLevel: 'regular',
          readingLanguages: ['English']
        }
      },
      {
        displayName: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        preferences: {
          timezone: 'Europe/London',
          commitmentLevel: 'dedicated',
          readingLanguages: ['English']
        }
      },
      {
        displayName: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        preferences: {
          timezone: 'Asia/Tokyo',
          commitmentLevel: 'casual',
          readingLanguages: ['English', 'Japanese']
        }
      },
      {
        displayName: 'Sarah Williams',
        email: 'sarah@example.com',
        password: 'password123',
        preferences: {
          timezone: 'Asia/Seoul',
          commitmentLevel: 'regular',
          readingLanguages: ['English', 'Korean']
        }
      }
    ];

    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Inserted ${insertedUsers.length} users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Sample Login Credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: mike@example.com | Password: password123');
    console.log('Email: sarah@example.com | Password: password123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();