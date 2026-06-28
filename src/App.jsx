import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { X, Search, MapPin, Phone, ExternalLink, Building2, Star, Check } from 'lucide-react'

import { hostelsData } from './data/hostels'
import Navbar from './components/Navbar'
import Filters from './components/Filters'
import HostelCard from './components/HostelCard'
import InteractiveMap from './components/InteractiveMap'
import CompareDrawer from './components/CompareDrawer'
import CompareModal from './components/CompareModal'
import ReviewsSection from './components/ReviewsSection'
import BudgetCalculator from './components/BudgetCalculator'

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [activeTab, setActiveTab] = useState('pgs')

  const [hostels, setHostels] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [priceLimit, setPriceLimit] = useState(26000)
  const [distanceLimit, setDistanceLimit] = useState(4.0)
  const [sharingTypes, setSharingTypes] = useState(['single', 'double', 'triple', 'quad'])
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [sortBy, setSortBy] = useState('rating')

  const [comparedIds, setComparedIds] = useState([])
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  const [selectedHostel, setSelectedHostel] = useState(null)
  const [highlightedId, setHighlightedId] = useState(null)

  const [bookingHostel, setBookingHostel] = useState(null)
  const [bookingName, setBookingName] = useState('')
  const [bookingPhone, setBookingPhone] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('11:00 AM')
  const [bookingPass, setBookingPass] = useState(null)

  // Active tab for the details drawer
  const [detailsTab, setDetailsTab] = useState('overview')

  useEffect(() => {
    const savedTheme = localStorage.getItem('mit-wpu-theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)

    // Always reload from source data (real verified info — don't persist stale cache)
    setHostels(hostelsData)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('mit-wpu-theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  const handleAddReview = (hostelId, review) => {
    const updatedHostels = hostels.map(h => {
      if (h.id === hostelId) {
        const nextReviews = [review, ...h.reviews]
        const sum = nextReviews.reduce((acc, curr) => acc + curr.rating, 0)
        return {
          ...h,
          reviews: nextReviews,
          rating: parseFloat((sum / nextReviews.length).toFixed(1)),
          reviewsCount: nextReviews.length
        }
      }
      return h
    })
    setHostels(updatedHostels)
    const currentSelected = updatedHostels.find(h => h.id === hostelId)
    setSelectedHostel(currentSelected)
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } })
  }

  const handleToggleCompare = (hostel) => {
    if (comparedIds.includes(hostel.id)) {
      setComparedIds(prev => prev.filter(id => id !== hostel.id))
    } else {
      if (comparedIds.length >= 3) {
        alert('You can compare up to 3 properties at once!')
        return
      }
      setComparedIds(prev => [...prev, hostel.id])
    }
  }

  const handleClearFilters = () => {
    setGenderFilter('')
    setPriceLimit(26000)
    setDistanceLimit(4.0)
    setSharingTypes(['single', 'double', 'triple', 'quad'])
    setSelectedAmenities([])
    setSearchQuery('')
  }

  const filteredHostels = hostels.filter(h => {
    const matchesSearch = !searchQuery ||
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesGender = !genderFilter || h.gender === genderFilter
    const minRent = Math.min(...Object.values(h.rent))
    const matchesPrice = priceLimit === 26000 || minRent <= priceLimit
    const matchesDistance = distanceLimit === 4.0 || h.distance <= distanceLimit
    const roomKeys = Object.keys(h.rent)
    const matchesSharing = sharingTypes.some(type => roomKeys.includes(type))
    const matchesAmenities = selectedAmenities.every(amenity =>
      h.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
    )
    return matchesSearch && matchesGender && matchesPrice && matchesDistance && matchesSharing && matchesAmenities
  })

  const sortedHostels = [...filteredHostels].sort((a, b) => {
    if (sortBy === 'price_asc') return Math.min(...Object.values(a.rent)) - Math.min(...Object.values(b.rent))
    if (sortBy === 'price_desc') return Math.min(...Object.values(b.rent)) - Math.min(...Object.values(a.rent))
    if (sortBy === 'distance') return a.distance - b.distance
    return b.rating - a.rating
  })

  const handlePinClick = (id) => {
    setHighlightedId(id)
    const element = document.getElementById(`card-${id}`)
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => setHighlightedId(null), 4000)
  }

  const handleInquirySubmit = (e) => {
    e.preventDefault()
    if (!bookingName || !bookingPhone || !bookingDate) return
    const pass = {
      id: 'MIT-PASS-' + Math.floor(100000 + Math.random() * 900000),
      name: bookingName,
      phone: bookingPhone,
      date: bookingDate,
      time: bookingTime,
      hostelName: bookingHostel.name,
      address: bookingHostel.fullAddress,
      contact: bookingHostel.contact
    }
    setBookingPass(pass)
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } })
  }

  const comparedHostels = hostels.filter(h => comparedIds.includes(h.id))

  const providerColors = {
    'Stanza Living': '#6366f1',
    'Zolo Stays': '#f59e0b',
    'Metrocity Living': '#10b981',
    'MIT World Peace University': '#3b82f6',
    'Local Owner (Mrs. Patil)': '#ec4899',
    'Independent Co-living': '#8b5cf6'
  }

  const renderDetailsDrawer = () => {
    if (!selectedHostel) return null
    const h = selectedHostel
    const providerColor = providerColors[h.provider] || 'var(--accent-primary)'
    const mapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${h.gps.lng}!3d${h.gps.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sin!4v1700000000002`
    const mapsDirectUrl = `https://www.google.com/maps/search/${encodeURIComponent(h.googleMapsSearch)}`

    return (
      <div className="details-overlay" onClick={() => setSelectedHostel(null)}>
        <div className="details-drawer" onClick={e => e.stopPropagation()}>
          <div className="details-drawer-header">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)' }}>{h.name}</h2>
              <span style={{ fontSize: '0.75rem', color: providerColor, fontWeight: 700 }}>{h.provider}</span>
            </div>
            <button id="details-drawer-close" className="compare-close-btn" onClick={() => setSelectedHostel(null)}>
              <X size={18} />
            </button>
          </div>

          {/* Details sub-tabs */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-glass)',
            background: 'var(--bg-tertiary)'
          }}>
            {['overview', 'location', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setDetailsTab(tab)}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                  borderBottom: detailsTab === tab ? `2px solid var(--accent-primary)` : '2px solid transparent',
                  color: detailsTab === tab ? 'var(--accent-primary)' : 'var(--text-muted)',
                  background: 'none',
                  cursor: 'pointer'
                }}
              >
                {tab === 'overview' ? '🏠 Overview' : tab === 'location' ? '📍 Location & Map' : '⭐ Reviews'}
              </button>
            ))}
          </div>

          <div className="details-drawer-body">

            {/* ---- OVERVIEW TAB ---- */}
            {detailsTab === 'overview' && (
              <>
                <div className="details-gallery">
                  <img src={h.images[0]} alt={h.name} />
                  {h.images[1]
                    ? <img src={h.images[1]} alt={h.name} />
                    : <div style={{ background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No second photo</div>
                  }
                </div>

                <div>
                  <h3 className="details-section-title">About this Property</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{h.description}</p>
                </div>

                {/* Verified rent pricing */}
                <div>
                  <h3 className="details-section-title">
                    Verified Pricing (2024-25 Academic Year)
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600, marginLeft: '0.5rem', background: 'rgba(16,185,129,0.12)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                      ✓ VERIFIED
                    </span>
                  </h3>
                  <div className="rent-matrix">
                    {Object.entries(h.rent).map(([key, val]) => (
                      <div key={key} className="rent-matrix-card">
                        <div className="rent-matrix-share">{key} sharing</div>
                        <div className="rent-matrix-price">₹{val.toLocaleString()}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>per month</div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#10b981',
                    fontWeight: 600
                  }}>
                    ✓ Rent includes: {h.rentIncludes}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    <span>Security Deposit: <strong>{h.deposit}</strong></span>
                    <span>Gate Curfew: <strong>{h.curfew}</strong></span>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="details-section-title">Amenities</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    {h.amenities.map((amenity, idx) => (
                      <div key={idx} style={{ fontSize: '0.82rem', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                        <span style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }}>✔</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rules */}
                <div style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '1rem'
                }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Rules & Policies</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <div>🕐 <strong>Curfew:</strong> {h.curfew}</div>
                    <div>👤 <strong>Visitors:</strong> {h.visitors}</div>
                    <div>💰 <strong>Deposit:</strong> {h.deposit}</div>
                  </div>
                </div>

                {/* Contact + Book */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {h.contact && (
                    <a
                      href={`tel:${h.contact.replace(/\D/g, '')}`}
                      style={{
                        flex: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        padding: '0.65rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={14} /> {h.contact}
                    </a>
                  )}
                  <a
                    href={h.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                      padding: '0.65rem',
                      background: `${providerColor}`,
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'white',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} /> Inquire / Book Online
                  </a>
                </div>
              </>
            )}

            {/* ---- LOCATION TAB ---- */}
            {detailsTab === 'location' && (
              <>
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '10px', padding: '0.85rem', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <MapPin size={14} style={{ display: 'inline', marginRight: '0.3rem', color: 'var(--accent-primary)' }} />
                    {h.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    {h.fullAddress}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-primary)' }}>
                    📍 {h.distance} km from MIT-WPU Main Campus
                  </div>
                </div>

                {/* Real Google Maps embed for this specific property */}
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)', height: '320px' }}>
                  <iframe
                    title={`Map for ${h.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d800!2d${h.gps.lng}!3d${h.gps.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f15!3m3!1m2!1s0x0%3A0x0!2zMThd!5e0!3m2!1sen!2sin!4v1700000000003`}
                  />
                </div>

                <a
                  href={mapsDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                    padding: '0.7rem',
                    background: 'var(--accent-gradient)',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'white',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={15} /> Open in Google Maps for Directions
                </a>

                {/* MIT-WPU reference map */}
                <div>
                  <h3 className="details-section-title">MIT-WPU Campus Reference</h3>
                  <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-glass)', height: '200px' }}>
                    <iframe
                      title="MIT-WPU Campus Location"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5!2d73.8085!3d18.5118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bfc7d5a07faf%3A0xb63b1ae2b0de4e62!2sMIT%20World%20Peace%20University!5e0!3m2!1sen!2sin!4v1700000000004"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ---- REVIEWS TAB ---- */}
            {detailsTab === 'reviews' && (
              <ReviewsSection hostel={selectedHostel} onAddReview={handleAddReview} />
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderTabView = () => {
    if (activeTab === 'calculator') return <BudgetCalculator />

    return (
      <div className="dashboard-layout">
        <Filters
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          priceLimit={priceLimit}
          setPriceLimit={setPriceLimit}
          distanceLimit={distanceLimit}
          setDistanceLimit={setDistanceLimit}
          sharingTypes={sharingTypes}
          toggleSharingType={(type) => {
            if (sharingTypes.includes(type)) setSharingTypes(prev => prev.filter(t => t !== type))
            else setSharingTypes(prev => [...prev, type])
          }}
          selectedAmenities={selectedAmenities}
          toggleAmenity={(amenity) => {
            if (selectedAmenities.includes(amenity)) setSelectedAmenities(prev => prev.filter(a => a !== amenity))
            else setSelectedAmenities(prev => [...prev, amenity])
          }}
          clearAllFilters={handleClearFilters}
        />

        <div className="listings-area">
          <InteractiveMap
            hostels={filteredHostels}
            onPinClick={handlePinClick}
            highlightedId={highlightedId}
          />

          <div className="listings-header">
            <span className="results-count">
              Found <span>{sortedHostels.length}</span> properties
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label htmlFor="sort-options" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Sort:</label>
              <select
                id="sort-options"
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="rating">Top Rated ⭐</option>
                <option value="distance">Nearest to MIT 📍</option>
                <option value="price_asc">Rent: Low to High 💸</option>
                <option value="price_desc">Rent: High to Low 💰</option>
              </select>
            </div>
          </div>

          {sortedHostels.length === 0 ? (
            <div className="empty-state">
              <h4>No PGs match your current filters.</h4>
              <p>Try broadening rent budget, distance, or clearing filters.</p>
            </div>
          ) : (
            <div className="listings-grid">
              {sortedHostels.map(hostel => (
                <HostelCard
                  key={hostel.id}
                  hostel={hostel}
                  isCompared={comparedIds.includes(hostel.id)}
                  toggleCompare={handleToggleCompare}
                  onViewDetails={h => { setSelectedHostel(h); setDetailsTab('overview') }}
                  highlighted={highlightedId === hostel.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} />

      {activeTab === 'pgs' && (
        <header className="hero-section">
          <h2>Find PGs & Hostels near MIT-WPU Pune</h2>
          <p>Verified 2024-25 pricing · Real student reviews · Google Maps locations · Direct booking links</p>
          <div className="search-bar-container">
            <Search className="search-icon" size={20} />
            <input
              id="global-search"
              type="text"
              className="search-input"
              placeholder="Search by name, area, provider or amenity (e.g. Stanza, Rambaug, AC, food)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search accommodations"
            />
          </div>
          <div className="quick-tags">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Quick filters:</span>
            <button className={`quick-tag ${distanceLimit <= 0.6 ? 'active' : ''}`} onClick={() => setDistanceLimit(0.6)}>Within 600m 🚶</button>
            <button className={`quick-tag ${priceLimit <= 12000 ? 'active' : ''}`} onClick={() => setPriceLimit(12000)}>Under ₹12k 💸</button>
            <button className={`quick-tag ${genderFilter === 'girls' ? 'active' : ''}`} onClick={() => setGenderFilter(genderFilter === 'girls' ? '' : 'girls')}>Girls Only 👩</button>
            <button className={`quick-tag ${genderFilter === 'boys' ? 'active' : ''}`} onClick={() => setGenderFilter(genderFilter === 'boys' ? '' : 'boys')}>Boys Only 👨</button>
            <button className={`quick-tag ${selectedAmenities.includes('Food') ? 'active' : ''}`} onClick={() => {
              if (selectedAmenities.includes('Food')) setSelectedAmenities([])
              else setSelectedAmenities(['Food'])
            }}>Food Included 🍱</button>
            <button className={`quick-tag`} onClick={handleClearFilters}>Clear All ✕</button>
          </div>
        </header>
      )}

      <main className="main-content">
        {renderTabView()}
      </main>

      {activeTab === 'pgs' && (
        <CompareDrawer
          comparedHostels={comparedHostels}
          onRemove={handleToggleCompare}
          onCompare={() => setIsCompareOpen(true)}
          onClose={() => setComparedIds([])}
        />
      )}

      {isCompareOpen && (
        <CompareModal
          comparedHostels={comparedHostels}
          onClose={() => setIsCompareOpen(false)}
          onBookClick={(hostel) => {
            setIsCompareOpen(false)
            setBookingHostel(hostel)
          }}
        />
      )}

      {renderDetailsDrawer()}

      {/* Inquiry / Schedule Modal */}
      {bookingHostel && (
        <div className="modal-overlay" onClick={() => { setBookingHostel(null); setBookingPass(null) }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{bookingPass ? 'Visit Pass Generated ✓' : `Schedule Visit: ${bookingHostel.name}`}</h3>
              <button className="compare-close-btn" onClick={() => { setBookingHostel(null); setBookingPass(null) }}>
                <X size={18} />
              </button>
            </div>

            {bookingPass ? (
              <div className="pass-ticket" id="pass-ticket-display">
                <div className="pass-header">
                  <span className="pass-logo">MIT-WPU VISIT PASS</span>
                  <span className="pass-status-badge">Confirmed</span>
                </div>
                <div className="pass-body">
                  <div className="pass-info-block" style={{ gridColumn: 'span 2' }}>
                    <span className="pass-label">Property</span>
                    <span className="pass-value" style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{bookingPass.hostelName}</span>
                  </div>
                  <div className="pass-info-block" style={{ gridColumn: 'span 2' }}>
                    <span className="pass-label">Address</span>
                    <span className="pass-value" style={{ fontSize: '0.8rem' }}>{bookingPass.address}</span>
                  </div>
                  <div className="pass-info-block">
                    <span className="pass-label">Student Name</span>
                    <span className="pass-value">{bookingPass.name}</span>
                  </div>
                  <div className="pass-info-block">
                    <span className="pass-label">Reference ID</span>
                    <span className="pass-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{bookingPass.id}</span>
                  </div>
                  <div className="pass-info-block">
                    <span className="pass-label">Visit Date</span>
                    <span className="pass-value">{bookingPass.date}</span>
                  </div>
                  <div className="pass-info-block">
                    <span className="pass-label">Time Slot</span>
                    <span className="pass-value">{bookingPass.time}</span>
                  </div>
                  <div className="pass-barcode"></div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--border-glass)' }}>
                  📞 Contact owner directly: <strong>{bookingPass.contact}</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="modal-form">
                <div className="modal-form-group">
                  <label htmlFor="b-name">Your Full Name</label>
                  <input id="b-name" type="text" placeholder="e.g. Rahul Sharma" value={bookingName} onChange={e => setBookingName(e.target.value)} required />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="b-phone">WhatsApp / Mobile</label>
                  <input id="b-phone" type="tel" placeholder="10-digit number" pattern="[0-9]{10}" value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} required />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="b-date">Preferred Visit Date</label>
                  <input id="b-date" type="date" min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />
                </div>
                <div className="modal-form-group">
                  <label htmlFor="b-time">Preferred Time Slot</label>
                  <select id="b-time" value={bookingTime} onChange={e => setBookingTime(e.target.value)}>
                    <option value="09:00 AM">Morning — 09:00 AM to 12:00 PM</option>
                    <option value="01:00 PM">Afternoon — 01:00 PM to 04:00 PM</option>
                    <option value="05:00 PM">Evening — 05:00 PM to 07:00 PM</option>
                  </select>
                </div>
                <button id="confirm-inquiry-btn" type="submit" className="modal-submit-btn">
                  Generate Visit Pass & Save Contact
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
