import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    queueSize: 0,
    totalGroups: 0,
    booksCompleted: 0,
    currentGroup: false
  });
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Fetch user stats
      const statsRes = await fetch(`${process.env.REACT_APP_API_URL}/api/users/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch current group
      const groupRes = await fetch(`${process.env.REACT_APP_API_URL}/api/groups/current`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const groupData = await groupRes.json();
      if (groupData.success && groupData.currentGroup) {
        setCurrentGroup(groupData.currentGroup);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.displayName}! 👋</h1>
        <p className="dashboard-subtitle">Your reading journey continues</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.queueSize}</h3>
            <p>Books in Queue</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalGroups}</h3>
            <p>Total Groups</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.booksCompleted}</h3>
            <p>Books Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{stats.currentGroup ? 'Active' : 'None'}</h3>
            <p>Current Group</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {currentGroup ? (
          <div className="dashboard-card current-group-card">
            <h2>📖 Current Reading Group</h2>
            <div className="group-info">
              <img 
                src={currentGroup.bookId.coverImage} 
                alt={currentGroup.bookId.title}
                className="book-cover"
              />
              <div className="group-details">
                <h3>{currentGroup.bookId.title}</h3>
                <p className="author">by {currentGroup.bookId.author}</p>
                <p className="members">
                  👥 {currentGroup.members.filter(m => m.status === 'active').length} members
                </p>
                <p className="messages">
                  💬 {currentGroup.messages.length} messages
                </p>
                <Link to="/groups" className="btn btn-primary">
                  Open Discussion
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-card">
            <h2>📖 No Active Group</h2>
            <p>You're not currently in a reading group. Add books to your queue to get matched!</p>
            <Link to="/discover" className="btn btn-primary">Discover Books</Link>
          </div>
        )}

        <div className="dashboard-card">
          <h2>📚 My Queue</h2>
          <p className="card-description">
            {stats.queueSize > 0 
              ? `You have ${stats.queueSize} book${stats.queueSize > 1 ? 's' : ''} waiting to be matched.`
              : 'Your queue is empty. Start adding books!'}
          </p>
          <Link to="/queue" className="btn btn-primary">View Queue</Link>
        </div>

        <div className="dashboard-card">
          <h2>🔍 Discover Books</h2>
          <p className="card-description">
            Browse our collection of books and add interesting titles to your queue.
          </p>
          <Link to="/discover" className="btn btn-primary">Browse Books</Link>
        </div>

        <div className="dashboard-card">
          <h2>👥 My Groups</h2>
          <p className="card-description">
            {stats.totalGroups > 0
              ? `You've been part of ${stats.totalGroups} reading group${stats.totalGroups > 1 ? 's' : ''}.`
              : 'Join your first reading group!'}
          </p>
          <Link to="/groups" className="btn btn-primary">View All Groups</Link>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/discover" className="action-btn">
            <span className="action-icon">🔍</span>
            <span>Find Books</span>
          </Link>
          <Link to="/queue" className="action-btn">
            <span className="action-icon">📋</span>
            <span>Manage Queue</span>
          </Link>
          {currentGroup && (
            <Link to="/groups" className="action-btn">
              <span className="action-icon">💬</span>
              <span>Chat with Group</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;