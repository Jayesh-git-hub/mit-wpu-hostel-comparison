import React, { useState } from 'react'
import { Star, MessageSquarePlus, ExternalLink } from 'lucide-react'

const SOURCE_COLORS = {
  'Google Maps': '#4285f4',
  'JustDial': '#E83C24',
  'NoBroker': '#1abc9c',
  'Reddit (r/pune)': '#FF4500',
  'Reddit (r/MITWPUPune)': '#FF4500',
}

export default function ReviewsSection({ hostel, onAddReview }) {
  const [author, setAuthor] = useState('')
  const [branch, setBranch] = useState('')
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!author || !text) return

    const newReview = {
      id: 'rev-' + Date.now(),
      author,
      branch: branch || 'MIT-WPU Student',
      rating,
      date: new Date().toISOString().split('T')[0],
      text
    }

    onAddReview(hostel.id, newReview)
    
    // Reset form
    setAuthor('')
    setBranch('')
    setRating(5)
    setText('')
  }

  // Helper to draw stars for ratings
  const renderStars = (score, size = 14, clickable = false, currentRating = 5, onSelect = null) => {
    return Array.from({ length: 5 }).map((_, idx) => {
      const starVal = idx + 1;
      const isActive = clickable ? starVal <= currentRating : starVal <= score;
      return (
        <button
          key={idx}
          type="button"
          className={`star-btn ${isActive ? 'active' : ''}`}
          disabled={!clickable}
          onClick={() => onSelect && onSelect(starVal)}
          style={{ cursor: clickable ? 'pointer' : 'default', padding: 0 }}
        >
          <Star size={size} fill={isActive ? 'currentColor' : 'none'} />
        </button>
      )
    })
  }

  return (
    <div className="reviews-section-container">
      <h3 className="details-section-title">Student Reviews & Breakdowns</h3>
      
      {/* Ratings Breakdown Grid */}
      <div className="ratings-grid" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: '🍱 Food Quality', value: hostel.ratingsDetail.food },
          { label: '📡 Wi-Fi Speed', value: hostel.ratingsDetail.wifi },
          { label: '🧼 Cleanliness & Hygiene', value: hostel.ratingsDetail.hygiene },
          { label: '🔒 Safety & Security', value: hostel.ratingsDetail.security }
        ].map((item, idx) => (
          <div key={idx} className="rating-bar-group">
            <div className="rating-bar-labels">
              <span>{item.label}</span>
              <span>{item.value.toFixed(1)}/5</span>
            </div>
            <div className="rating-bar-bg">
              <div 
                className="rating-bar-fill" 
                style={{ width: `${(item.value / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Section */}
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem', padding: '0.4rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px', border: '1px solid var(--border-glass)' }}>
        ℹ️ Reviews sourced from <strong>Google Maps</strong>, <strong>JustDial</strong>, <strong>NoBroker</strong> & <strong>Reddit (r/pune, r/MITWPUPune)</strong>. Add your own review below.
      </div>
      <form onSubmit={handleSubmit} className="review-form" style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MessageSquarePlus size={16} /> Write Your Own MIT Student Review
        </h4>
        
        <div className="star-input-group">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '0.5rem' }}>Your Rating:</span>
          <div style={{ display: 'flex', gap: '0.2rem' }}>
            {renderStars(0, 18, true, rating, setRating)}
          </div>
        </div>

        <div className="review-form-row">
          <input
            id="rev-author"
            type="text"
            placeholder="Your Name (e.g. Rahul)"
            className="review-form-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <input
            id="rev-branch"
            type="text"
            placeholder="Branch/Year (e.g. B.Tech CSE, 2nd Yr)"
            className="review-form-input"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
        </div>

        <textarea
          id="rev-text"
          placeholder="Share your experience (food quality, curfew flexibility, laundry, walk to MIT WPU backgate, etc.)"
          className="review-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        ></textarea>

        <button id="rev-submit" type="submit" className="submit-review-btn">
          Submit Student Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="reviews-feed">
        {hostel.reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No reviews yet. Be the first to share your experience!</p>
        ) : (
          hostel.reviews.map((rev) => {
            const srcColor = SOURCE_COLORS[rev.source] || 'var(--text-muted)'
            return (
            <div key={rev.id} className="review-item">
              <div className="review-meta">
                <div>
                  <span className="review-author">{rev.author}</span>
                  <span className="review-branch"> • {rev.branch}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.1rem', color: 'var(--accent-secondary)' }}>
                  {renderStars(rev.rating, 12)}
                </div>
              </div>
              <p className="review-text">{rev.text}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rev.date}</div>
                {rev.source && (
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: srcColor,
                    border: `1px solid ${srcColor}44`,
                    background: `${srcColor}11`,
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px'
                  }}>
                    {rev.source === 'Google Maps' ? '🔵 ' : rev.source === 'JustDial' ? '🔴 ' : rev.source?.startsWith('Reddit') ? '🟠 ' : '🟢 '}
                    {rev.source}
                  </span>
                )}
              </div>
            </div>
          )})
        )}
      </div>
    </div>
  )
}
