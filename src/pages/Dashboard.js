import React, { useContext } from 'react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.displayName}!</h1>
        <p>Your reading journey continues</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Queue</h3>
          <p className="card-stat">5 books waiting</p>
          <Link to="/queue" className="btn btn-primary">View Queue</Link>
        </div>

        <div className="dashboard-card">
          <h3>Current Group</h3>
          <p className="card-stat">Reading "1984"</p>
          <button className="btn btn-primary">Open Discussion</button>
        </div>

        <div className="dashboard-card">
          <h3>Discover Books</h3>
          <p className="card-stat">300+ books available</p>
          <Link to="/discover" className="btn btn-primary">Browse</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;