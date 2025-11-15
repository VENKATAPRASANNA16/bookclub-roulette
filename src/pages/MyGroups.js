import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import './MyGroups.css';

function MyGroups() {
  const { user } = useContext(AuthContext);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [pastGroups, setPastGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Fetch current group
      const currentRes = await fetch(`${process.env.REACT_APP_API_URL}/api/groups/current`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const currentData = await currentRes.json();
      if (currentData.success && currentData.currentGroup) {
        setCurrentGroup(currentData.currentGroup);
        setMessages(currentData.currentGroup.messages || []);
      }

      // Fetch all user groups
      const groupsRes = await fetch(`http://localhost:5000/api/groups/user/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const groupsData = await groupsRes.json();
      if (groupsData.success) {
        const past = groupsData.groups.filter(g => 
          g.status === 'completed' || g.status === 'disbanded'
        );
        setPastGroups(past);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !currentGroup) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/groups/${currentGroup._id}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: message.trim() })
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.newMessage]);
        setMessage('');
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Error sending message');
    }
  };

  const leaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/api/groups/${currentGroup._id}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ You have left the group');
        fetchGroups(); // Refresh
      } else {
        alert('⚠️ ' + data.message);
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('❌ Error leaving group');
    }
  };

  if (loading) {
    return <div className="loading">Loading your groups...</div>;
  }

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1>My Reading Groups 👥</h1>
        <p>Connect with fellow readers and discuss your favorite books</p>
      </div>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          📖 Current Group {currentGroup && '(1)'}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          📚 Past Groups ({pastGroups.length})
        </button>
      </div>

      {activeTab === 'current' && (
        <div className="tab-content">
          {currentGroup ? (
            <div className="current-group">
              <div className="group-book-header">
                <img 
                  src={currentGroup.bookId.coverImage} 
                  alt={currentGroup.bookId.title}
                  className="group-book-cover"
                />
                <div className="group-book-details">
                  <h2>{currentGroup.bookId.title}</h2>
                  <p className="author">by {currentGroup.bookId.author}</p>
                  <div className="group-meta">
                    <span className="meta-item">
                      👥 {currentGroup.members.filter(m => m.status === 'active').length} active members
                    </span>
                    <span className="meta-item">
                      📅 Started {new Date(currentGroup.startDate).toLocaleDateString()}
                    </span>
                    <span className="meta-item">
                      ⏰ Ends {new Date(currentGroup.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="group-content">
                <div className="discussion-schedule">
                  <h3>📅 Discussion Schedule</h3>
                  <div className="schedule-list">
                    {currentGroup.discussionSchedule.map((discussion, index) => (
                      <div 
                        key={index} 
                        className={`schedule-item ${discussion.completed ? 'completed' : ''}`}
                      >
                        <div className="schedule-week">Week {discussion.week}</div>
                        <div className="schedule-details">
                          <div className="schedule-topic">{discussion.topic || 'General Discussion'}</div>
                          <div className="schedule-date">
                            {new Date(discussion.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="schedule-status">
                          {discussion.completed ? '✅' : '⏳'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="group-chat">
                  <h3>💬 Group Chat</h3>
                  <div className="messages-container">
                    {messages.length === 0 ? (
                      <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`message ${msg.userId._id === user._id ? 'own-message' : ''}`}
                        >
                          <div className="message-header">
                            <span className="message-author">
                              {msg.userId.displayName}
                            </span>
                            <span className="message-time">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="message-text">{msg.message}</div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={sendMessage} className="message-form">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="message-input"
                      maxLength={1000}
                    />
                    <button type="submit" className="btn btn-primary">
                      Send 📤
                    </button>
                  </form>
                </div>
              </div>

              <div className="group-actions">
                <button onClick={leaveGroup} className="btn btn-danger">
                  Leave Group
                </button>
              </div>
            </div>
          ) : (
            <div className="no-current-group">
              <div className="empty-icon">📖</div>
              <h2>No Active Group</h2>
              <p>You're not currently in a reading group.</p>
              <p>Add books to your queue to get matched with other readers!</p>
              <a href="/queue" className="btn btn-primary btn-large">
                View My Queue
              </a>
            </div>
          )}
        </div>
      )}

      {activeTab === 'past' && (
        <div className="tab-content">
          {pastGroups.length === 0 ? (
            <div className="no-past-groups">
              <div className="empty-icon">📚</div>
              <h2>No Past Groups</h2>
              <p>Your completed reading groups will appear here.</p>
            </div>
          ) : (
            <div className="past-groups-grid">
              {pastGroups.map(group => (
                <div key={group._id} className="past-group-card">
                  <img 
                    src={group.bookId.coverImage} 
                    alt={group.bookId.title}
                    className="past-group-cover"
                  />
                  <div className="past-group-info">
                    <h3>{group.bookId.title}</h3>
                    <p className="past-group-author">by {group.bookId.author}</p>
                    <div className="past-group-stats">
                      <span>👥 {group.members.length} members</span>
                      <span>💬 {group.messages.length} messages</span>
                    </div>
                    <div className="past-group-status">
                      Status: {group.status === 'completed' ? '✅ Completed' : '⚠️ Disbanded'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyGroups;