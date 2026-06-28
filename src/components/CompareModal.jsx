import React from 'react'
import { X, Check, Star, Shield, Info, ArrowUpRight } from 'lucide-react'

export default function CompareModal({ comparedHostels, onClose, onBookClick }) {
  if (comparedHostels.length === 0) return null;

  // Helper to find the "best" in category
  const minDistance = Math.min(...comparedHostels.map(h => h.distance));
  const maxRating = Math.max(...comparedHostels.map(h => h.rating));

  // Helper to get minimum rent for a hostel
  const getMinRent = (hostel) => Math.min(...Object.values(hostel.rent));
  const minRentOverall = Math.min(...comparedHostels.map(h => getMinRent(h)));

  const genderLabels = {
    boys: 'Boys PG',
    girls: 'Girls PG',
    coliving: 'Co-Living'
  };

  const allAmenities = [
    "High-Speed Wi-Fi",
    "CCTV & Security Guard",
    "Gym",
    "Laundry Service",
    "AC Rooms"
  ];

  return (
    <div className="compare-modal-overlay" onClick={onClose}>
      <div className="compare-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="compare-modal-header">
          <h3>PG & Hostel Comparison Grid</h3>
          <button id="compare-modal-close" className="compare-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Parameters</th>
                {comparedHostels.map(hostel => (
                  <td key={hostel.id}>
                    <div className="compare-th-title">{hostel.name}</div>
                    <div className="card-location" style={{ marginTop: '0.25rem' }}>{hostel.area}</div>
                    <span className={`gender-badge ${hostel.gender}`} style={{ display: 'inline-block', position: 'static', marginTop: '0.5rem', fontSize: '0.7rem' }}>
                      {genderLabels[hostel.gender]}
                    </span>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Overall Rating */}
              <tr>
                <th>Overall Rating</th>
                {comparedHostels.map(hostel => {
                  const isWinner = hostel.rating === maxRating;
                  return (
                    <td key={hostel.id} className={isWinner ? 'compare-metric-win' : ''}>
                      <div className="compare-rating-circle">
                        <Star size={16} fill="currentColor" />
                        <span>{hostel.rating.toFixed(1)}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({hostel.reviewsCount} student ratings)</div>
                      {isWinner && <span className="win-badge">Highly Rated</span>}
                    </td>
                  )
                })}
              </tr>

              {/* Distance from MIT */}
              <tr>
                <th>Distance from MIT</th>
                {comparedHostels.map(hostel => {
                  const isWinner = hostel.distance === minDistance;
                  return (
                    <td key={hostel.id} className={isWinner ? 'compare-metric-win' : ''}>
                      <span style={{ fontWeight: 700 }}>{hostel.distance} km</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>from main gates</div>
                      {isWinner && <span className="win-badge">Closest</span>}
                    </td>
                  )
                })}
              </tr>

              {/* Rent Structure */}
              <tr>
                <th>Monthly Rent</th>
                {comparedHostels.map(hostel => {
                  const minRent = getMinRent(hostel);
                  const isWinner = minRent === minRentOverall;
                  return (
                    <td key={hostel.id} className={isWinner ? 'compare-metric-win' : ''}>
                      <div className="rent-value" style={{ fontSize: '1.1rem' }}>
                        ₹{minRent.toLocaleString()}+ <span>/mo</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {hostel.rent.single && <div>Single: ₹{hostel.rent.single.toLocaleString()}</div>}
                        {hostel.rent.double && <div>Double: ₹{hostel.rent.double.toLocaleString()}</div>}
                        {hostel.rent.triple && <div>Triple: ₹{hostel.rent.triple.toLocaleString()}</div>}
                        {hostel.rent.quad && <div>Quad: ₹{hostel.rent.quad.toLocaleString()}</div>}
                      </div>
                      {isWinner && <span className="win-badge" style={{ background: 'var(--accent-gradient)' }}>Best Deal</span>}
                    </td>
                  )
                })}
              </tr>

              {/* Deposit */}
              <tr>
                <th>Security Deposit</th>
                {comparedHostels.map(hostel => (
                  <td key={hostel.id}>
                    <span style={{ fontWeight: 600 }}>{hostel.deposit}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Refundable lock-in</div>
                  </td>
                ))}
              </tr>

              {/* Curfew Rules */}
              <tr>
                <th>Curfew Policy</th>
                {comparedHostels.map(hostel => (
                  <td key={hostel.id}>
                    <span style={{ fontWeight: 600 }}>{hostel.curfew}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gate timing</div>
                  </td>
                ))}
              </tr>

              {/* Visitor Rules */}
              <tr>
                <th>Visitor Policy</th>
                {comparedHostels.map(hostel => (
                  <td key={hostel.id}>
                    <span style={{ fontSize: '0.85rem' }}>{hostel.visitors}</span>
                  </td>
                ))}
              </tr>

              {/* Ratings Details */}
              <tr>
                <th>Rating Breakdowns</th>
                {comparedHostels.map(hostel => (
                  <td key={hostel.id} style={{ fontSize: '0.8rem' }}>
                    <div>🍱 Food: <strong style={{ color: 'var(--accent-secondary)' }}>{hostel.ratingsDetail.food}</strong>/5</div>
                    <div>📡 Wi-Fi: <strong style={{ color: 'var(--accent-secondary)' }}>{hostel.ratingsDetail.wifi}</strong>/5</div>
                    <div>🧼 Cleanliness: <strong style={{ color: 'var(--accent-secondary)' }}>{hostel.ratingsDetail.hygiene}</strong>/5</div>
                    <div>🔒 Security: <strong style={{ color: 'var(--accent-secondary)' }}>{hostel.ratingsDetail.security}</strong>/5</div>
                  </td>
                ))}
              </tr>

              {/* Key Amenities Checklist */}
              {allAmenities.map(amenity => (
                <tr key={amenity}>
                  <th>{amenity}</th>
                  {comparedHostels.map(hostel => {
                    const hasAmenity = hostel.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase().split(' ')[0]));
                    return (
                      <td key={hostel.id}>
                        {hasAmenity ? (
                          <Check size={18} style={{ color: '#10b981' }} />
                        ) : (
                          <X size={18} style={{ color: '#ef4444' }} />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}

              {/* Direct Booking triggers */}
              <tr>
                <th></th>
                {comparedHostels.map(hostel => (
                  <td key={hostel.id}>
                    <button
                      id={`compare-book-${hostel.id}`}
                      className="details-btn"
                      onClick={() => onBookClick(hostel)}
                      style={{ 
                        background: 'var(--accent-gradient)', 
                        color: 'white', 
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      Inquire Visit <ArrowUpRight size={14} />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
