import React from 'react'
import { MapPin, Star, Plus, Check, Info, ExternalLink, Building2 } from 'lucide-react'

export default function HostelCard({
  hostel,
  isCompared,
  toggleCompare,
  onViewDetails,
  highlighted
}) {
  const minRent = Math.min(...Object.values(hostel.rent))

  const genderLabels = {
    boys: 'Boys PG',
    girls: 'Girls PG',
    coliving: 'Co-Living'
  }

  const providerColors = {
    'Stanza Living': '#6366f1',
    'Zolo Stays': '#f59e0b',
    'Metrocity Living': '#10b981',
    'MIT World Peace University': '#3b82f6',
    'Local Owner (Mrs. Patil)': '#ec4899',
    'Independent Co-living': '#8b5cf6'
  }
  const providerColor = providerColors[hostel.provider] || 'var(--accent-primary)'

  return (
    <article
      className={`hostel-card ${highlighted ? 'highlighted-from-map' : ''}`}
      id={`card-${hostel.id}`}
    >
      <div className="card-image-wrapper">
        <img
          src={hostel.images[0]}
          alt={hostel.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=60'
          }}
        />
        <span className={`gender-badge ${hostel.gender}`}>
          {genderLabels[hostel.gender]}
        </span>
        <span className="distance-badge">
          <MapPin size={12} /> {hostel.distance} km
        </span>
        {/* Provider badge */}
        <span style={{
          position: 'absolute',
          bottom: '0.6rem',
          left: '0.6rem',
          background: providerColor,
          color: 'white',
          fontSize: '0.65rem',
          fontWeight: 700,
          padding: '0.15rem 0.5rem',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {hostel.provider === 'MIT World Peace University' ? 'MIT-WPU Official' : hostel.provider}
        </span>
      </div>

      <div className="card-body">
        <div className="card-header-row">
          <h3 className="card-title">{hostel.name}</h3>
          <div className="rating-badge" title="Average Rating">
            <Star size={14} fill="currentColor" />
            <span>{hostel.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="card-location">
          <MapPin size={12} />
          <span>{hostel.area}</span>
        </div>

        {/* Rent includes line */}
        {hostel.rentIncludes && (
          <div style={{
            fontSize: '0.72rem',
            color: '#10b981',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            marginTop: '-0.15rem'
          }}>
            ✓ {hostel.rentIncludes.split('(')[0].trim()}
          </div>
        )}

        <div className="amenities-preview">
          {hostel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="amenity-tag">
              {amenity.replace(/\s*\(.*\)\s*/g, '').replace(/\s*\d+.*$/, '')}
            </span>
          ))}
          {hostel.amenities.length > 3 && (
            <span className="amenity-tag">+{hostel.amenities.length - 3} more</span>
          )}
        </div>

        <div className="card-rent-row">
          <div className="rent-info">
            <span className="rent-label">Starting Rent (2024-25)</span>
            <div className="rent-value">
              ₹{minRent.toLocaleString()}
              <span>/mo</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.15rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Deposit: {hostel.deposit}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {hostel.reviewsCount} verified reviews
            </span>
          </div>
        </div>

        <div className="card-actions">
          <button
            id={`compare-btn-${hostel.id}`}
            className={`compare-check-btn ${isCompared ? 'active' : ''}`}
            onClick={() => toggleCompare(hostel)}
            title={isCompared ? 'Remove from comparison' : 'Add to comparison'}
            aria-label={isCompared ? `Remove ${hostel.name} from comparison` : `Add ${hostel.name} to comparison`}
          >
            {isCompared ? <Check size={18} /> : <Plus size={18} />}
          </button>

          <button
            id={`details-btn-${hostel.id}`}
            className="details-btn"
            onClick={() => onViewDetails(hostel)}
          >
            <Info size={15} /> Details & Reviews
          </button>
        </div>

        {/* Direct booking/inquiry link */}
        {hostel.bookingUrl && (
          <a
            href={hostel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              width: '100%',
              padding: '0.45rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: providerColor,
              border: `1px solid ${providerColor}33`,
              background: `${providerColor}10`,
              textDecoration: 'none',
              marginTop: '0.25rem',
              transition: 'all 0.2s ease'
            }}
          >
            <ExternalLink size={13} />
            Inquire / Book on Official Site
          </a>
        )}
      </div>
    </article>
  )
}
