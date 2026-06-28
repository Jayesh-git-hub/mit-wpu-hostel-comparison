import React, { useState } from 'react'
import { Info, HelpCircle } from 'lucide-react'

export default function BudgetCalculator() {
  // Scenario A (Near Campus - Premium)
  const [rentA, setRentA] = useState(16000)
  const [foodIncludedA, setFoodIncludedA] = useState(true)
  const [foodCostA, setFoodCostA] = useState(4000)
  const [utilA, setUtilA] = useState(1000)
  const [transportA, setTransportA] = useState(0) // Walkable
  const [miscA, setMiscA] = useState(2500)

  // Scenario B (Far Campus - Budget + Commute)
  const [rentB, setRentB] = useState(10000)
  const [foodIncludedB, setFoodIncludedB] = useState(false)
  const [foodCostB, setFoodCostB] = useState(4500)
  const [utilB, setUtilB] = useState(1200)
  const [transportB, setTransportB] = useState(2500) // Needs Auto/Metro
  const [miscB, setMiscB] = useState(2500)

  // Calculate totals
  const totalA = rentA + (foodIncludedA ? 0 : foodCostA) + utilA + transportA + miscA;
  const totalB = rentB + (foodIncludedB ? 0 : foodCostB) + utilB + transportB + miscB;

  // Max cap for chart rendering
  const maxTotal = Math.max(totalA, totalB, 30000);

  return (
    <div className="calculator-container" id="budget-calculator-root">
      {/* Left inputs panel */}
      <div className="calc-inputs-pane">
        <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>True Living Cost Comparison</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Evaluate the total cost of living close to MIT-WPU (e.g. Rambaug Colony) versus living further out (e.g. Karve Road) where rent is lower but commuting costs are higher.
        </p>

        {/* --- SCENARIO A: CLOSE TO CAMPUS --- */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Scenario A: Close to Campus (e.g., Rambaug Colony)</h3>
          
          <div className="calc-input-row">
            <div className="calc-label-row">
              <label htmlFor="rentA" className="calc-label">Monthly Rent</label>
              <span className="calc-price-badge">₹{rentA.toLocaleString()}</span>
            </div>
            <input id="rentA" type="range" min="5000" max="25000" step="500" value={rentA} onChange={(e) => setRentA(parseInt(e.target.value))} className="calc-input" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <input id="foodIncA" type="checkbox" checked={foodIncludedA} onChange={(e) => setFoodIncludedA(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
            <label htmlFor="foodIncA" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Food (Mess/Meals) is included in rent</label>
          </div>

          {!foodIncludedA && (
            <div className="calc-input-row" style={{ animation: 'fadeIn 0.2s ease' }}>
              <div className="calc-label-row">
                <label htmlFor="foodCostA" className="calc-label">External Mess/Food Expenses</label>
                <span className="calc-price-badge">₹{foodCostA.toLocaleString()}</span>
              </div>
              <input id="foodCostA" type="range" min="2000" max="8000" step="250" value={foodCostA} onChange={(e) => setFoodCostA(parseInt(e.target.value))} className="calc-input" />
            </div>
          )}

          <div className="calc-input-row" style={{ marginTop: '0.5rem' }}>
            <div className="calc-label-row">
              <label htmlFor="utilA" className="calc-label">Utilities (Electricity, AC bill, Wi-Fi)</label>
              <span className="calc-price-badge">₹{utilA.toLocaleString()}</span>
            </div>
            <input id="utilA" type="range" min="0" max="4000" step="200" value={utilA} onChange={(e) => setUtilA(parseInt(e.target.value))} className="calc-input" />
          </div>

          <div className="calc-input-row" style={{ marginTop: '0.5rem' }}>
            <div className="calc-label-row">
              <label htmlFor="transportA" className="calc-label">Commute (Auto, Metro, Petrol)</label>
              <span className="calc-price-badge">₹{transportA.toLocaleString()}</span>
            </div>
            <input id="transportA" type="range" min="0" max="4000" step="200" value={transportA} onChange={(e) => setTransportA(parseInt(e.target.value))} className="calc-input" />
          </div>
        </div>

        {/* --- SCENARIO B: COMMUTER PG --- */}
        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)', marginTop: '0.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', color: 'var(--accent-secondary)', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Scenario B: Far from Campus (e.g., Erandwane/Shivtirth Nagar)</h3>
          
          <div className="calc-input-row">
            <div className="calc-label-row">
              <label htmlFor="rentB" className="calc-label">Monthly Rent</label>
              <span className="calc-price-badge">₹{rentB.toLocaleString()}</span>
            </div>
            <input id="rentB" type="range" min="5000" max="25000" step="500" value={rentB} onChange={(e) => setRentB(parseInt(e.target.value))} className="calc-input" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
            <input id="foodIncB" type="checkbox" checked={foodIncludedB} onChange={(e) => setFoodIncludedB(e.target.checked)} style={{ accentColor: 'var(--accent-primary)' }} />
            <label htmlFor="foodIncB" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>Food (Mess/Meals) is included in rent</label>
          </div>

          {!foodIncludedB && (
            <div className="calc-input-row" style={{ animation: 'fadeIn 0.2s ease' }}>
              <div className="calc-label-row">
                <label htmlFor="foodCostB" className="calc-label">External Mess/Food Expenses</label>
                <span className="calc-price-badge">₹{foodCostB.toLocaleString()}</span>
              </div>
              <input id="foodCostB" type="range" min="2000" max="8000" step="250" value={foodCostB} onChange={(e) => setFoodCostB(parseInt(e.target.value))} className="calc-input" />
            </div>
          )}

          <div className="calc-input-row" style={{ marginTop: '0.5rem' }}>
            <div className="calc-label-row">
              <label htmlFor="utilB" className="calc-label">Utilities (Electricity, AC, Wi-Fi)</label>
              <span className="calc-price-badge">₹{utilB.toLocaleString()}</span>
            </div>
            <input id="utilB" type="range" min="0" max="4000" step="200" value={utilB} onChange={(e) => setUtilB(parseInt(e.target.value))} className="calc-input" />
          </div>

          <div className="calc-input-row" style={{ marginTop: '0.5rem' }}>
            <div className="calc-label-row">
              <label htmlFor="transportB" className="calc-label">Commute (Auto/Metro/Bus Daily)</label>
              <span className="calc-price-badge">₹{transportB.toLocaleString()}</span>
            </div>
            <input id="transportB" type="range" min="0" max="4000" step="200" value={transportB} onChange={(e) => setTransportB(parseInt(e.target.value))} className="calc-input" />
          </div>
        </div>
      </div>

      {/* Right calculations & visualization panel */}
      <div className="calc-results-pane">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Total Cost Visualizer</h3>
          
          <div className="calc-chart-box">
            {/* Scenario A Bar */}
            <div className="calc-chart-item">
              <div className="calc-chart-label">Scenario A</div>
              <div className="calc-chart-bar-bg">
                <div 
                  className="calc-chart-bar-fill accent" 
                  style={{ width: `${(totalA / maxTotal) * 100}%` }}
                ></div>
              </div>
              <div style={{ width: '80px', fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
                ₹{totalA.toLocaleString()}
              </div>
            </div>

            {/* Scenario B Bar */}
            <div className="calc-chart-item">
              <div className="calc-chart-label">Scenario B</div>
              <div className="calc-chart-bar-bg">
                <div 
                  className="calc-chart-bar-fill secondary" 
                  style={{ width: `${(totalB / maxTotal) * 100}%` }}
                ></div>
              </div>
              <div style={{ width: '80px', fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>
                ₹{totalB.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Cost Summary analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div className="calc-metric-box">
            <span className="calc-metric-label">Difference Amount</span>
            <div className="calc-metric-value">
              ₹{Math.abs(totalA - totalB).toLocaleString()}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                {totalA > totalB ? ' cheaper to live Far (Scenario B)' : ' cheaper to live Close (Scenario A)'}
              </span>
            </div>
          </div>

          <div className="calc-tip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
              <Info size={14} style={{ color: 'var(--accent-primary)' }} />
              <span>MIT student Insider Insight</span>
            </div>
            {totalA <= totalB ? (
              <p>
                <strong>Living closer (Scenario A) is actually cheaper or nearly identical!</strong> Even if the rent in Rambaug is higher, you save on auto fares, metro tickets, and commute fatigue. Plus, walking to lectures saves 45+ minutes daily.
              </p>
            ) : Math.abs(totalA - totalB) < 1500 ? (
              <p>
                The difference is less than ₹1,500/mo. Factor in 20 hours of travel time saved per month, plus security benefits. Staying close to campus (Rambaug) is highly recommended for academic success!
              </p>
            ) : (
              <p>
                Scenario B is cheaper by ₹{Math.abs(totalA - totalB).toLocaleString()}/mo. If your budget is tight, look for PGs near the <strong>Ideal Colony Metro Station</strong> so you can commute to college cheaply by Metro instead of expensive Auto rickshaws.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
