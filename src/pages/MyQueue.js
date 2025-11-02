import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import './MyQueue.css';

function MyQueue() {
  const { user } = useContext(AuthContext);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/books/queue/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (response.ok) {
        setQueue(data.queue || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading your queue...</div>;

  return (
    <div className="queue-container">
      <h1>Your Reading Queue</h1>
      <div className="queue-stats">
        <div className="stat-box">
          <span className="stat-number">{queue.length}</span>
          <span>Total Books</span>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="empty-state">
          <h3>Your queue is empty</h3>
          <p>Start by discovering some books!</p>
        </div>
      ) : (
        <div className="books-grid">
          {queue.map(book => (
            <div key={book._id} className="book-card">
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <span className="badge">{book.genre}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyQueue;