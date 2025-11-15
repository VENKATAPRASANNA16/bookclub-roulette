import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import './MyQueue.css';

function MyQueue() {
  const { user } = useContext(AuthContext);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    readyToMatch: 0,
    waiting: 0
  });

  useEffect(() => {
    if (user) {
      fetchQueue();
    }
  }, [user]);

  const fetchQueue = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/books/queue/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setQueue(data.queue || []);
        calculateStats(data.queue || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching queue:', error);
      setLoading(false);
    }
  };

  const calculateStats = (queueData) => {
    const total = queueData.length;
    const readyToMatch = queueData.filter(book => book.waitingReaders >= 2).length;
    const waiting = total - readyToMatch;
    setStats({ total, readyToMatch, waiting });
  };

  const removeFromQueue = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book from your queue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/queue/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Book removed from queue');
        fetchQueue(); // Refresh queue
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (error) {
      console.error('Error removing book:', error);
      alert('❌ Error removing book from queue');
    }
  };

  if (loading) {
    return <div className="loading">Loading your queue...</div>;
  }

  return (
    <div className="queue-container">
      <div className="queue-header">
        <h1>Your Reading Queue 📚</h1>
        <p className="queue-subtitle">
          Books you're interested in reading. When 3+ readers queue the same book, we'll form your group!
        </p>
      </div>

      <div className="queue-stats">
        <div className="stat-box">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Books</span>
          </div>
        </div>

        <div className="stat-box highlight">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <span className="stat-number">{stats.readyToMatch}</span>
            <span className="stat-label">Almost Ready (2/3)</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-number">{stats.waiting}</span>
            <span className="stat-label">Waiting</span>
          </div>
        </div>
      </div>

      {queue.length === 0 ? (
        <div className="empty-queue">
          <div className="empty-icon">📖</div>
          <h2>Your queue is empty</h2>
          <p>Start by discovering books you'd like to read!</p>
          <Link to="/discover" className="btn btn-primary btn-large">
            🔍 Discover Books
          </Link>
        </div>
      ) : (
        <>
          {stats.readyToMatch > 0 && (
            <section className="queue-section">
              <div className="section-header">
                <h2>🔥 Almost Ready to Match!</h2>
                <p>These books have 2 out of 3 readers. One more and you're in!</p>
              </div>
              <div className="books-grid">
                {queue
                  .filter(book => book.waitingReaders >= 2)
                  .map(book => (
                    <BookQueueCard 
                      key={book._id} 
                      book={book} 
                      onRemove={removeFromQueue}
                      priority="high"
                    />
                  ))}
              </div>
            </section>
          )}

          <section className="queue-section">
            <div className="section-header">
              <h2>📋 Your Full Queue</h2>
              <p>All books you're interested in reading</p>
            </div>
            <div className="books-grid">
              {queue.map(book => (
                <BookQueueCard 
                  key={book._id} 
                  book={book} 
                  onRemove={removeFromQueue}
                />
              ))}
            </div>
          </section>
        </>
      )}

      <div className="queue-actions">
        <Link to="/discover" className="btn btn-secondary">
          ➕ Add More Books
        </Link>
      </div>
    </div>
  );
}

// Book Card Component for Queue
function BookQueueCard({ book, onRemove, priority }) {
  return (
    <div className={`queue-book-card ${priority === 'high' ? 'priority-high' : ''}`}>
      <div className="book-cover-wrapper">
        <img 
          src={book.coverImage} 
          alt={book.title}
          className="queue-book-cover"
        />
        {book.waitingReaders >= 2 && (
          <div className="priority-badge">
            🔥 2/{3} Readers!
          </div>
        )}
      </div>

      <div className="queue-book-info">
        <h3 className="queue-book-title">{book.title}</h3>
        <p className="queue-book-author">by {book.author}</p>

        <div className="queue-book-meta">
          <span className="meta-badge">{book.genre}</span>
          <span className="meta-badge">{book.contentType}</span>
        </div>

        <div className="queue-book-stats">
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <span className="stat-text">{book.waitingReaders} waiting</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📄</span>
            <span className="stat-text">{book.pageCount} pages</span>
          </div>
        </div>

        <div className="queue-progress">
          <div 
            className="progress-bar"
            style={{ 
              width: `${(book.waitingReaders / 3) * 100}%`,
              backgroundColor: book.waitingReaders >= 2 ? '#ff6b6b' : '#9AA28C'
            }}
          />
          <span className="progress-text">
            {book.waitingReaders}/3 readers needed
          </span>
        </div>

        <button 
          onClick={() => onRemove(book._id)}
          className="btn-remove"
        >
          🗑️ Remove
        </button>
      </div>
    </div>
  );
}

export default MyQueue;