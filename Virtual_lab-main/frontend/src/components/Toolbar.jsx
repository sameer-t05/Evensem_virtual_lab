import { useState } from 'react'

export default function Toolbar({ activeTool, setActiveTool, material, setMaterial }) {
  const [showSpringMenu, setShowSpringMenu] = useState(false)
  const [showMotorMenu, setShowMotorMenu] = useState(false)

  const tools = [
    { id: 'cursor', icon: '👆', label: 'Select' },
    { id: 'box', icon: '⬜', label: 'Box' },
    { id: 'circle', icon: '⭕', label: 'Ball' },
    { id: 'pivot', icon: '📍', label: 'Pin' },
    { id: 'spring', icon: '🌀', label: 'Spring' },
    { id: 'rod', icon: '🔗', label: 'Rod' },
    { id: 'rope', icon: '🧵', label: 'Rope' },
    { id: 'motor', icon: '⚙️', label: 'Motor' },
  ]

  const handleContextMenu = (e, toolId) => {
    if (toolId === 'spring') {
      e.preventDefault()
      setShowSpringMenu(!showSpringMenu)
      setShowMotorMenu(false)
      setActiveTool('spring')
    } else if (toolId === 'motor') {
      e.preventDefault()
      setShowMotorMenu(!showMotorMenu)
      setShowSpringMenu(false)
      setActiveTool('motor')
    }
  }

  return (
    <>
      {/* ── Bottom Dock ── */}
      <div className="pg-dock">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id)
              if (tool.id !== 'spring') setShowSpringMenu(false)
              if (tool.id !== 'motor') setShowMotorMenu(false)
            }}
            onContextMenu={(e) => handleContextMenu(e, tool.id)}
            title={tool.label}
            className={`pg-dock__tool ${activeTool === tool.id ? 'pg-dock__tool--active' : ''}`}
          >
            <span className="pg-dock__tool-icon">{tool.icon}</span>
            <span className="pg-dock__tool-label">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* ── Spring Settings Popover ── */}
      {showSpringMenu && (
        <div className="pg-popover">
          <div className="pg-popover__header">
            <span className="pg-popover__title">Spring Settings</span>
            <button
              onClick={() => setShowSpringMenu(false)}
              className="pg-popover__close"
            >
              ×
            </button>
          </div>
          <div className="pg-slider-group">
            <div className="pg-slider-label">
              <span className="pg-slider-label__name">Stiffness (k)</span>
              <span className="pg-slider-label__value">
                {material?.springStiffness || 0.05}
              </span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.5"
              step="0.001"
              value={material?.springStiffness || 0.05}
              onChange={(e) =>
                setMaterial({ ...material, springStiffness: parseFloat(e.target.value) })
              }
              className="pg-slider"
            />
            <p className="pg-slider-hint">
              Higher stiffness makes the spring harder to stretch.
            </p>
          </div>
        </div>
      )}

      {/* ── Motor / Gear Settings Popover ── */}
      {showMotorMenu && (
        <div className="pg-popover">
          <div className="pg-popover__header">
            <span className="pg-popover__title">Motor / Gear Settings</span>
            <button
              onClick={() => setShowMotorMenu(false)}
              className="pg-popover__close"
            >
              ×
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Type Toggle */}
            <div className="pg-segment">
              <button
                onClick={() => setMaterial({ ...material, motorType: 'gear' })}
                className={`pg-segment__btn ${material?.motorType !== 'rod' ? 'pg-segment__btn--active' : ''}`}
              >
                ⚙️ Gear
              </button>
              <button
                onClick={() => setMaterial({ ...material, motorType: 'rod' })}
                className={`pg-segment__btn ${material?.motorType === 'rod' ? 'pg-segment__btn--active' : ''}`}
              >
                🏏 Rod
              </button>
            </div>

            {/* Motorized Checkbox */}
            <label className="pg-check">
              <input
                type="checkbox"
                checked={material?.isMotorized ?? true}
                onChange={(e) => setMaterial({ ...material, isMotorized: e.target.checked })}
              />
              <span className="pg-check__label">
                Is Motorized? (Spins by itself)
              </span>
            </label>

            {/* Speed & Direction (only when motorized) */}
            {(material?.isMotorized ?? true) && (
              <>
                <div className="pg-slider-group">
                  <div className="pg-slider-label">
                    <span className="pg-slider-label__name">Speed</span>
                    <span className="pg-slider-label__value">
                      {material?.motorSpeed || 0.05}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.2"
                    step="0.01"
                    value={material?.motorSpeed || 0.05}
                    onChange={(e) =>
                      setMaterial({ ...material, motorSpeed: parseFloat(e.target.value) })
                    }
                    className="pg-slider"
                  />
                </div>

                <div className="pg-segment">
                  <button
                    onClick={() => setMaterial({ ...material, motorDirection: 'clockwise' })}
                    className={`pg-segment__btn ${(material?.motorDirection || 'clockwise') === 'clockwise' ? 'pg-segment__btn--active' : ''}`}
                  >
                    ↻ CW
                  </button>
                  <button
                    onClick={() => setMaterial({ ...material, motorDirection: 'anticlockwise' })}
                    className={`pg-segment__btn ${material?.motorDirection === 'anticlockwise' ? 'pg-segment__btn--active' : ''}`}
                  >
                    ↺ CCW
                  </button>
                </div>
              </>
            )}

            {/* Gear-specific sliders */}
            {material?.motorType !== 'rod' && (
              <>
                <div className="pg-slider-group">
                  <div className="pg-slider-label">
                    <span className="pg-slider-label__name">Radius</span>
                    <span className="pg-slider-label__value">
                      {material?.gearRadius || 40}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={material?.gearRadius || 40}
                    onChange={(e) =>
                      setMaterial({ ...material, gearRadius: parseInt(e.target.value, 10) })
                    }
                    className="pg-slider"
                  />
                </div>
                <div className="pg-slider-group">
                  <div className="pg-slider-label">
                    <span className="pg-slider-label__name">Teeth Count</span>
                    <span className="pg-slider-label__value">
                      {material?.gearTeeth || 12}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="32"
                    step="2"
                    value={material?.gearTeeth || 12}
                    onChange={(e) =>
                      setMaterial({ ...material, gearTeeth: parseInt(e.target.value, 10) })
                    }
                    className="pg-slider"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
