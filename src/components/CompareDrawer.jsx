import React from 'react'
import { X, ArrowRight, BarChart3 } from 'lucide-react'

export default function CompareDrawer({ comparedHostels, onRemove, onCompare, onClose }) {
  const isOpen = comparedHostels.length > 0;

  return (
    <div className={`compare-drawer ${isOpen ? 'open' : ''}`} id="compare-drawer-container">
      <div className="compare-drawer-info">
        <div className="compare-drawer-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={18} className="text-accent" />
          <span>PG Comparison Desk (<span>{comparedHostels.length}</span>/3)</span>
        </div>
        
        <div className="compare-thumbnails">
          {comparedHostels.map(hostel => (
            <div key={hostel.id} className="compare-thumb" id={`compare-thumb-${hostel.id}`}>
              <span style={{ marginRight: '0.5rem' }}>
                {hostel.gender === 'girls' ? '👩' : hostel.gender === 'boys' ? '👨' : '👥'}
              </span>
              <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {hostel.name.split(' ')[0]}
              </span>
              <button 
                className="compare-thumb-remove" 
                onClick={() => onRemove(hostel)}
                aria-label={`Remove ${hostel.name} from comparison`}
                title="Remove"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 3 - comparedHostels.length) }).map((_, idx) => (
            <div 
              key={idx} 
              className="compare-thumb" 
              style={{ borderStyle: 'dashed', color: 'var(--text-muted)', background: 'transparent' }}
            >
              <span>+ Add PG</span>
            </div>
          ))}
        </div>
      </div>

      <div className="compare-drawer-actions">
        <button 
          id="compare-now-btn"
          className="compare-btn-primary" 
          disabled={comparedHostels.length < 2}
          onClick={onCompare}
          style={{ 
            opacity: comparedHostels.length < 2 ? 0.5 : 1, 
            cursor: comparedHostels.length < 2 ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          Compare PGs <ArrowRight size={16} />
        </button>
        <button id="close-drawer-btn" className="compare-btn-close" onClick={onClose}>
          Clear All
        </button>
      </div>
    </div>
  )
}
