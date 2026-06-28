import React, { useState } from 'react'
import { MapPin, ExternalLink } from 'lucide-react'

// MIT-WPU Main Campus coordinates (Kothrud)
const MIT_WPU_LAT = 18.5118
const MIT_WPU_LNG = 73.8105

export default function InteractiveMap({ hostels, onPinClick, highlightedId }) {
  const [activePin, setActivePin] = useState(null)

  // Build a Google Maps iframe URL showing all PG markers near MIT-WPU
  // Uses the free embed endpoint — no API key required
  const buildMapUrl = (hostel = null) => {
    if (hostel) {
      // Show the specific hostel location
      const query = encodeURIComponent(hostel.googleMapsSearch || hostel.fullAddress)
      return `https://www.google.com/maps/embed/v1/place?q=${query}&zoom=17&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dmaRT-HxjN3g2s`
    }
    // Default: show Kothrud area around MIT-WPU
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5!2d${MIT_WPU_LNG}!3d${MIT_WPU_LAT}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfc7d5a07faf%3A0xb63b1ae2b0de4e62!2sMIT%20World%20Peace%20University!5e0!3m2!1sen!2sin!4v1700000000000`
  }

  const handlePinClick = (hostel) => {
    setActivePin(hostel.id === activePin ? null : hostel.id)
    onPinClick(hostel.id)
  }

  return (
    <section className="map-container">
      <div className="map-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} style={{ color: 'var(--accent-primary)' }} />
          <span>Location Map — Kothrud, Pune</span>
        </h3>
        <a
          href="https://www.google.com/maps/search/PG+near+MIT+WPU+Kothrud+Pune/@18.5118,73.8105,15z"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--accent-primary)',
            textDecoration: 'none'
          }}
        >
          Open in Google Maps <ExternalLink size={14} />
        </a>
      </div>

      {/* Google Maps embed — real MIT-WPU campus area */}
      <div style={{ width: '100%', aspectRatio: '16/7', position: 'relative', background: 'var(--bg-tertiary)' }}>
        <iframe
          id="gmap-main"
          title="PG & Hostels near MIT-WPU Kothrud, Pune"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3783.5!2d73.8045!3d18.5118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sPG%20near%20MIT%20WPU%20Kothrud%20Pune!5e0!3m2!1sen!2sin!4v1700000000001"
        />
      </div>

      {/* Clickable Property Pins below map */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-glass)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Click a property to view on Google Maps
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {hostels.map(hostel => {
            const isActive = highlightedId === hostel.id
            const genderColors = {
              boys: 'var(--color-boys)',
              girls: 'var(--color-girls)',
              coliving: 'var(--color-coliving)'
            }
            return (
              <button
                key={hostel.id}
                id={`map-pin-btn-${hostel.id}`}
                onClick={() => handlePinClick(hostel)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: `1px solid ${isActive ? genderColors[hostel.gender] : 'var(--border-glass)'}`,
                  background: isActive ? `${genderColors[hostel.gender]}22` : 'var(--bg-tertiary)',
                  color: isActive ? genderColors[hostel.gender] : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={`View ${hostel.name} on Google Maps`}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: genderColors[hostel.gender],
                  flexShrink: 0
                }}></span>
                {hostel.name.split('–')[0].split('-')[0].trim()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Location details panel for highlighted hostel */}
      {highlightedId && (() => {
        const h = hostels.find(x => x.id === highlightedId)
        if (!h) return null
        return (
          <div style={{
            margin: '0 1rem 1rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-glass)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{h.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={12} /> {h.fullAddress}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '0.15rem', fontWeight: 600 }}>
                📍 {h.distance} km from MIT-WPU · Starting ₹{Math.min(...Object.values(h.rent)).toLocaleString()}/mo
              </div>
            </div>
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(h.googleMapsSearch)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: 'var(--accent-gradient)',
                color: 'white',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              View on Maps <ExternalLink size={13} />
            </a>
          </div>
        )
      })()}

      {/* Legend */}
      <div className="map-legend">
        <div className="legend-item"><div className="legend-dot wpu"></div><span>MIT-WPU Campus</span></div>
        <div className="legend-item"><div className="legend-dot boys"></div><span>Boys Hostels/PG</span></div>
        <div className="legend-item"><div className="legend-dot girls"></div><span>Girls Hostels/PG</span></div>
        <div className="legend-item"><div className="legend-dot coliving"></div><span>Co-living Hubs</span></div>
      </div>
    </section>
  )
}
