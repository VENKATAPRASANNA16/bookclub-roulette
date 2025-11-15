import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, ThemeContext } from '../App';
import './Navbar.css';

function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          📚 BookClub Roulette
        </Link>
        
        <ul className="nav-links">
          {user ? (
            <>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/queue">My Queue</Link></li>
              <li><Link to="/discover">Discover</Link></li>
              <li><Link to="/groups">My Groups</Link></li>
              <li className="user-info">
                <span className="user-name">👤 {user.displayName}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login" className="btn-nav-login">Login</Link></li>
              <li><Link to="/register" className="btn-nav-register">Sign Up</Link></li>
            </>
          )}
          
          {/* Theme Toggle Button */}
          <li>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;