// Mock data for frontend-only testing

export const mockBooks = [
  {
    _id: '1',
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    contentType: "novel",
    pageCount: 328,
    synopsis: "A dystopian social science fiction novel about totalitarianism.",
    waitingReaders: 2
  },
  {
    _id: '2',
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    contentType: "novel",
    pageCount: 281,
    synopsis: "A story of racial injustice and childhood innocence.",
    waitingReaders: 1
  },
  {
    _id: '3',
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic",
    contentType: "novel",
    pageCount: 180,
    synopsis: "A tale of wealth, love, and the American Dream.",
    waitingReaders: 3
  },
  {
    _id: '4',
    title: "Harry Potter",
    author: "J.K. Rowling",
    genre: "Fantasy",
    contentType: "novel",
    pageCount: 309,
    synopsis: "A young wizard's journey begins.",
    waitingReaders: 5
  },
  {
    _id: '5',
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    contentType: "novel",
    pageCount: 432,
    synopsis: "A classic tale of love and society.",
    waitingReaders: 2
  }
];

export const mockUser = {
  _id: 'user1',
  displayName: 'Demo User',
  email: 'demo@bookclub.com',
  preferences: {
    timezone: 'Asia/Seoul',
    commitmentLevel: 'regular'
  }
};