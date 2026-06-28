import React from 'react'
import { Sun, Moon, Home, Calculator } from 'lucide-react'

export default function Navbar({ activeTab, setActiveTab, theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <div className="nav-logo-icon">W</div>
        <div className="nav-brand-text">
          <h1 id="nav-brand-title">MIT-WPU Pune</h1>
          <span>Student Accommodation Hub</span>
        </div>
      </div>

      <div className="nav-tabs" role="tablist">
        <button
          id="tab-pgs"
          role="tab"
          aria-selected={activeTab === 'pgs'}
          className={`nav-tab ${activeTab === 'pgs' ? 'active' : ''}`}
          onClick={() => setActiveTab('pgs')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Home size={16} /> Find PGs & Hostels
          </span>
        </button>
        <button
          id="tab-calculator"
          role="tab"
          aria-selected={activeTab === 'calculator'}
          className={`nav-tab ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calculator size={16} /> True Cost Calculator
          </span>
        </button>
      </div>

      <div className="nav-actions">
        <button
          id="theme-toggle"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  )
}
