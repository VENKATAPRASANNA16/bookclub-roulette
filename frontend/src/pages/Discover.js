import React, { useState, useEffect } from 'react';
import './Discover.css';

function Discover() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    genre: '',
    contentType: '',
    sortBy: 'waitingReaders'
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooks();
  }, [filter]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...filter,
        search: searchQuery
      }).toString();

      const response = await fetch(`http://localhost:5000/api/books?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setBooks(data.books);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  const addToQueue = async (bookId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/queue/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Book added to your queue!');
        fetchBooks(); // Refresh to update waiting readers count
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (error) {
      console.error('Error adding to queue:', error);
      alert('❌ Error adding book to queue');
    }
  };

  return (
    <div className="discover-container">
      <div className="discover-header">
        <h1>Discover Books 📚</h1>
        <p>Find your next great read and add it to your queue</p>
      </div>

      <div className="search-filter-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            🔍 Search
          </button>
        </form>

        <div className="filters">
          <select
            value={filter.genre}
            onChange={(e) => setFilter({ ...filter, genre: e.target.value })}
            className="filter-select"
          >
            <option value="">All Genres</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Mystery">Mystery</option>
            <option value="Romance">Romance</option>
            <option value="Horror">Horror</option>
            <option value="Classic">Classic</option>
          </select>

          <select
            value={filter.contentType}
            onChange={(e) => setFilter({ ...filter, contentType: e.target.value })}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="novel">Novel</option>
            <option value="comic">Comic</option>
            <option value="manga">Manga</option>
            <option value="poetry">Poetry</option>
            <option value="fanfiction">Fanfiction</option>
          </select>

          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
            className="filter-select"
          >
            <option value="waitingReaders">Most Popular</option>
            <option value="totalReads">Most Read</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="no-books">
          <h3>No books found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="books-count">
            Found {books.length} book{books.length !== 1 ? 's' : ''}
          </div>

          <div className="books-grid">
            {books.map(book => (
              <div key={book._id} className="book-card">
                <div className="book-cover-container">
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="book-cover-image"
                  />
                  {book.waitingReaders >= 2 && (
                    <div className="almost-ready-badge">
                      🔥 Almost Ready!
                    </div>
                  )}
                </div>

                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>

                  <div className="book-meta">
                    <span className="badge badge-genre">{book.genre}</span>
                    <span className="badge badge-type">{book.contentType}</span>
                  </div>

                  {book.synopsis && (
                    <p className="book-synopsis">
                      {book.synopsis.length > 150 
                        ? book.synopsis.substring(0, 150) + '...' 
                        : book.synopsis}
                    </p>
                  )}

                  <div className="book-stats">
                    <span className="stat">
                      👥 {book.waitingReaders} waiting
                    </span>
                    <span className="stat">
                      📖 {book.pageCount} pages
                    </span>
                  </div>

                  <button 
                    onClick={() => addToQueue(book._id)} 
                    className="btn btn-primary btn-full"
                  >
                    + Add to Queue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Discover;