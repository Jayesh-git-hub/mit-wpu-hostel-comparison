import React from 'react'
import { FilterX, Shield, Wifi, Coffee, Shirt, Award } from 'lucide-react'

export default function Filters({
  genderFilter,
  setGenderFilter,
  priceLimit,
  setPriceLimit,
  distanceLimit,
  setDistanceLimit,
  sharingTypes,
  toggleSharingType,
  selectedAmenities,
  toggleAmenity,
  clearAllFilters
}) {
  const amenitiesList = [
    { id: 'Food', label: 'Food Included', icon: Coffee },
    { id: 'Wi-Fi', label: 'Wi-Fi', icon: Wifi },
    { id: 'Security', label: 'CCTV & Security', icon: Shield },
    { id: 'Laundry', label: 'Laundry Service', icon: Shirt },
    { id: 'AC', label: 'AC Rooms', icon: Award }
  ]

  return (
    <aside className="filters-sidebar">
      <div>
        <h3 className="filter-section-title">Gender Category</h3>
        <div className="gender-filters" role="group" aria-label="Gender filter">
          <button
            id="filter-boys"
            className={`gender-btn boys ${genderFilter === 'boys' ? 'active' : ''}`}
            onClick={() => setGenderFilter(genderFilter === 'boys' ? '' : 'boys')}
          >
            Boys Only
          </button>
          <button
            id="filter-girls"
            className={`gender-btn girls ${genderFilter === 'girls' ? 'active' : ''}`}
            onClick={() => setGenderFilter(genderFilter === 'girls' ? '' : 'girls')}
          >
            Girls Only
          </button>
          <button
            id="filter-coliving"
            className={`gender-btn coliving ${genderFilter === 'coliving' ? 'active' : ''}`}
            onClick={() => setGenderFilter(genderFilter === 'coliving' ? '' : 'coliving')}
          >
            Co-Living
          </button>
        </div>
      </div>

      <div className="filter-group">
        <div className="slider-labels">
          <span>Max Rent</span>
          <span id="price-limit-display">₹{priceLimit.toLocaleString()}/mo</span>
        </div>
        <input
          id="price-range"
          type="range"
          min="5000"
          max="26000"
          step="500"
          value={priceLimit}
          onChange={(e) => setPriceLimit(parseInt(e.target.value))}
          className="slider-input"
          aria-valuemin="5000"
          aria-valuemax="26000"
          aria-valuenow={priceLimit}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>₹5,000</span>
          <span>₹26,000+</span>
        </div>
      </div>

      <div className="filter-group">
        <div className="slider-labels">
          <span>Max Distance</span>
          <span id="distance-limit-display">{distanceLimit} km from MIT</span>
        </div>
        <input
          id="distance-range"
          type="range"
          min="0.2"
          max="4.0"
          step="0.1"
          value={distanceLimit}
          onChange={(e) => setDistanceLimit(parseFloat(e.target.value))}
          className="slider-input"
          aria-valuemin="0.2"
          aria-valuemax="4.0"
          aria-valuenow={distanceLimit}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>0.2 km</span>
          <span>4.0+ km</span>
        </div>
      </div>

      <div className="filter-group">
        <h3 className="filter-section-title">Sharing Mode</h3>
        <div className="checkbox-group">
          {['single', 'double', 'triple', 'quad'].map(type => (
            <label key={type} className="checkbox-label">
              <input
                id={`share-${type}`}
                type="checkbox"
                checked={sharingTypes.includes(type)}
                onChange={() => toggleSharingType(type)}
              />
              <span style={{ textTransform: 'capitalize' }}>{type} sharing</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3 className="filter-section-title">Essential Amenities</h3>
        <div className="checkbox-group">
          {amenitiesList.map(({ id, label, icon: Icon }) => (
            <label key={id} className="checkbox-label">
              <input
                id={`amenity-${id.toLowerCase().replace(' ', '-')}`}
                type="checkbox"
                checked={selectedAmenities.includes(id)}
                onChange={() => toggleAmenity(id)}
              />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                <Icon size={14} /> {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        id="clear-filters"
        onClick={clearAllFilters}
        className="clear-filters-btn"
      >
        <FilterX size={16} /> Reset Filters
      </button>
    </aside>
  )
}
