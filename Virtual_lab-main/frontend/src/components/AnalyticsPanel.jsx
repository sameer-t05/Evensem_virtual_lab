import { useState, useEffect } from 'react'
import { LineChart, Line, YAxis, ResponsiveContainer } from 'recharts'

export default function AnalyticsPanel() {
  const [metrics, setMetrics] = useState({ bodies: 0, fps: 0, telemetry: null })
  const [history, setHistory] = useState([])

  useEffect(() => {
    // Listen to custom event fired by the physics engine every few frames
    const handleMetrics = (e) => {
      setMetrics(e.detail)
      
      // Update chart history if we have telemetry
      if (e.detail.telemetry) {
        setHistory(prev => {
          // Parse the string back to a float for the chart
          const newEnergy = parseFloat(e.detail.telemetry.energy)
          // Add the new data point
          const nextHistory = [...prev, { time: Date.now(), energy: newEnergy }]
          // Keep only the last 60 frames (approx 1 second) so the chart scrolls
          if (nextHistory.length > 60) return nextHistory.slice(nextHistory.length - 60)
          return nextHistory
        })
      } else {
        // Reset chart if they deselect the body
        setHistory(prev => prev.length > 0 ? [] : prev)
      }
    }

    window.addEventListener('physics-metrics', handleMetrics)
    
    return () => window.removeEventListener('physics-metrics', handleMetrics)
  }, [])

  return (
    <div className="pg-drawer pg-drawer--bottom-right">
      <div className="pg-drawer__header">
        <span className="pg-drawer__title">
          <span>📈</span> Live Metrics
          <span className="pg-live-dot" style={{ marginLeft: 6 }}>
            <span className="pg-live-dot__ping" />
            <span className="pg-live-dot__core" />
          </span>
        </span>
      </div>

      <div className="pg-drawer__body">
        <div className="pg-stat">
          <span className="pg-stat__label">Framerate</span>
          <span className="pg-stat__value pg-stat__value--ok">{metrics.fps}</span>
        </div>

        <div className="pg-stat">
          <span className="pg-stat__label">Active Bodies</span>
          <span className="pg-stat__value pg-stat__value--accent">{metrics.bodies}</span>
        </div>

        {/* Physics Telemetry for Selected Body */}
        {metrics.telemetry && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-pg-edge)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-pg-text-dim)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Telemetry
            </div>
            <div className="pg-stat">
              <span className="pg-stat__label">Speed</span>
              <span className="pg-stat__value pg-stat__value--accent">{metrics.telemetry.speed}</span>
            </div>
            <div className="pg-stat" style={{ marginBottom: 10 }}>
              <span className="pg-stat__label">Energy (KE)</span>
              <span className="pg-stat__value pg-stat__value--warn">{metrics.telemetry.energy}</span>
            </div>
            
            {/* Live Chart using Recharts */}
            <div style={{ height: 72, width: '100%', marginTop: 6 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <YAxis hide domain={['dataMin', 'dataMax']} />
                  <Line 
                    type="monotone" 
                    dataKey="energy" 
                    stroke="#14b8a6" 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
