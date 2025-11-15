import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    timezone: 'Asia/Seoul',
    commitmentLevel: 'regular'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          email: formData.email,
          password: formData.password,
          preferences: {
            timezone: formData.timezone,
            commitmentLevel: formData.commitmentLevel,
            readingLanguages: ['English']
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login', { 
          state: { message: 'Registration successful! Please login.' } 
        });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check if the server is running.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Join BookClub Roulette</h2>
          <p>Start your reading adventure today</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Display Name *</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
              placeholder="How should we call you?"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              placeholder="At least 8 characters"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select 
              name="timezone" 
              value={formData.timezone} 
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Asia/Seoul">Asia/Seoul (GMT+9)</option>
              <option value="America/New_York">America/New York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
              <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
              <option value="America/Los_Angeles">America/Los Angeles (GMT-8)</option>
              <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Commitment Level</label>
            <select 
              name="commitmentLevel" 
              value={formData.commitmentLevel} 
              onChange={handleChange}
              disabled={loading}
            >
              <option value="casual">Casual - Low-pressure discussions</option>
              <option value="regular">Regular - Monthly reading, regular attendance</option>
              <option value="dedicated">Dedicated - Never miss a discussion</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;