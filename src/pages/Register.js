import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: formData.displayName,
          email: formData.email,
          password: formData.password,
          preferences: {
            timezone: formData.timezone,
            commitmentLevel: formData.commitmentLevel
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login', { state: { message: 'Registration successful!' } });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join BookClub Roulette</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <select name="timezone" value={formData.timezone} onChange={handleChange}>
              <option value="Asia/Seoul">Asia/Seoul (GMT+9)</option>
              <option value="America/New_York">America/New York (GMT-5)</option>
              <option value="Europe/London">Europe/London (GMT+0)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Commitment Level</label>
            <select name="commitmentLevel" value={formData.commitmentLevel} onChange={handleChange}>
              <option value="casual">Casual</option>
              <option value="regular">Regular</option>
              <option value="dedicated">Dedicated</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;