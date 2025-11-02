import React, { useState, useEffect } from 'react';
import { mockBooks } from '../mockData';
import './Discover.css';

function Discover() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Simulate API call with mock data
    setBooks(mockBooks);
  }, []);

  const addToQueue = (bookId) => {
    alert('Book added to queue! (Demo mode - no backend connected yet)');
  };

  return (
    <div className="discover-container">
      <h1>Discover Books</h1>
      <p style={{textAlign: 'center', color: '#666', marginBottom: '2rem'}}>
        📌 Demo Mode: Backend coming soon!
      </p>
      <div className="books-grid">
        {books.map(book => (
          <div key={book._id} className="book-card">
            <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <span className="badge">{book.genre}</span>
            <p className="readers">{book.waitingReaders} readers waiting</p>
            <button onClick={() => addToQueue(book._id)} className="btn btn-primary">
              Add to Queue
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;