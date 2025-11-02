import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Your Next Great Book Discussion Awaits</h1>
        <p>Queue books you're curious about. We match you with readers worldwide. Read together. Discuss. Repeat monthly.</p>
        <div className="cta-buttons">
          <Link to="/register" className="btn btn-primary">Start Your Queue</Link>
          <a href="#how-it-works" className="btn btn-secondary">See How It Works</a>
        </div>
        <div className="community-badge">Join 10,000+ readers worldwide</div>
      </section>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-number">50K+</span>
          <span className="stat-label">Books in Rotation</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">85K+</span>
          <span className="stat-label">Matches Made</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">120+</span>
          <span className="stat-label">Countries Represented</span>
        </div>
      </div>

      <section className="how-it-works" id="how-it-works">
        <h2>Three Simple Steps to Your Next Reading Adventure</h2>
        <div className="steps">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Build Your Queue</h3>
            <p>Add 5-20 books you're curious about—novels, comics, fanfics, anything.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Get Matched</h3>
            <p>When 3+ people queue the same book, boom—you've got a group.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Read & Connect</h3>
            <p>One month. Four discussions. Text, voice, or video—you choose.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;