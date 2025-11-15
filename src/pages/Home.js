import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Your Next Great Book Discussion Awaits</h1>
          <p className="hero-subtitle">
            Queue books you're curious about. We match you with readers worldwide. 
            Read together. Discuss. Repeat monthly.
          </p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Start Your Queue</Link>
            <a href="#how-it-works" className="btn btn-secondary">See How It Works</a>
          </div>
          <div className="community-badge">
            🌍 Join 10,000+ readers worldwide
          </div>
        </div>
      </section>

      <section className="stats">
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
      </section>

      <section className="how-it-works" id="how-it-works">
        <h2>Three Simple Steps to Your Next Reading Adventure</h2>
        <div className="steps">
          <div className="step-card">
            <div className="step-icon">📚</div>
            <div className="step-number">1</div>
            <h3>Build Your Queue</h3>
            <p>Add 5-20 books you're curious about—novels, comics, fanfics, anything. Your queue, your choices.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">🤝</div>
            <div className="step-number">2</div>
            <h3>Get Matched</h3>
            <p>When 3+ people queue the same book, boom—you've got a group. We match you with readers across timezones and perspectives.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">💬</div>
            <div className="step-number">3</div>
            <h3>Read & Connect</h3>
            <p>One month. Four discussions. Text, voice, or video—you choose. Then the group dissolves and you start fresh.</p>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Read Literally Anything</h2>
        <p className="features-subtitle">
          Traditional novels. Webcomics. Fanfiction. Manga. Poetry collections. 
          If people want to read it together, it's fair game.
        </p>
        <div className="feature-grid">
          <div className="feature-item">📖 Fiction & Non-Fiction</div>
          <div className="feature-item">🎨 Comics & Graphic Novels</div>
          <div className="feature-item">✍️ Fanfiction & Web Novels</div>
          <div className="feature-item">📝 Poetry & Short Stories</div>
          <div className="feature-item">🌏 International & Translated Works</div>
          <div className="feature-item">🎭 Drama & Plays</div>
        </div>
      </section>

      <section className="testimonials">
        <h2>From Strangers to Reading Companions</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "I'm in Texas. My group had people from Japan, Kenya, and Germany. 
              We read a Korean webnovel. It was the most fun I've had online in years."
            </p>
            <p className="testimonial-author">— Marcus, Dallas</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "Finally, a book club that works with my schedule! No pressure, 
              just genuine discussions with people who actually read the book."
            </p>
            <p className="testimonial-author">— Sarah, London</p>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-text">
              "I discovered authors I never would have found on my own. 
              The diversity of perspectives in my groups has been incredible."
            </p>
            <p className="testimonial-author">— Raj, Mumbai</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Start Reading Together?</h2>
        <p>Join thousands of readers discovering books and making connections worldwide.</p>
        <Link to="/register" className="btn btn-primary btn-large">
          Create Your Free Account
        </Link>
      </section>
    </div>
  );
}

export default Home;