import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">BookClub Roulette</Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/discover">Discover Books</Link></li>
          <li><span className="demo-badge">Demo Mode</span></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;