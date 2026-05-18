export default function MaterialPicker({
  material,
  setMaterial,
  activeTool,
  selectedConstraintType,
}) {
  const showLengthControl =
    ['rope', 'spring', 'rod'].includes(activeTool) ||
    ['rope', 'spring', 'rod'].includes(selectedConstraintType)

  const maxLinkLength =
    typeof window !== 'undefined' ? Math.round(window.innerWidth || 1200) : 1200

  return (
    <div className="pg-drawer pg-drawer--right">
      <div className="pg-drawer__header">
        <span className="pg-drawer__title">
          <span>🧪</span> Material Properties
        </span>
        <span className="pg-drawer__toggle">▾</span>
      </div>

      <div className="pg-drawer__body">
        {/* Bounciness */}
        <div className="pg-slider-group">
          <div className="pg-slider-label">
            <span className="pg-slider-label__name">Bounciness</span>
            <span className="pg-slider-label__value">
              {material.restitution.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.1"
            value={material.restitution}
            onChange={(e) =>
              setMaterial({ ...material, restitution: parseFloat(e.target.value) })
            }
            className="pg-slider"
          />
          <p className="pg-slider-hint">
            Controls how much a shape rebounds after collision. Higher values bounce more.
          </p>
        </div>

        {/* Friction */}
        <div className="pg-slider-group">
          <div className="pg-slider-label">
            <span className="pg-slider-label__name">Friction</span>
            <span className="pg-slider-label__value">
              {material.friction.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={material.friction}
            onChange={(e) =>
              setMaterial({ ...material, friction: parseFloat(e.target.value) })
            }
            className="pg-slider"
          />
          <p className="pg-slider-hint">
            Controls how strongly a shape resists sliding. Higher values grip surfaces more.
          </p>
        </div>

        {/* Density */}
        <div className="pg-slider-group">
          <div className="pg-slider-label">
            <span className="pg-slider-label__name">Density</span>
            <span className="pg-slider-label__value">
              {material.density.toFixed(3)}
            </span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.1"
            step="0.001"
            value={material.density}
            onChange={(e) =>
              setMaterial({ ...material, density: parseFloat(e.target.value) })
            }
            className="pg-slider"
          />
          <p className="pg-slider-hint">
            Controls mass per size. Higher density makes new shapes heavier.
          </p>
        </div>

        {/* Link Length (conditional) */}
        {showLengthControl && (
          <div className="pg-slider-group">
            <div className="pg-slider-label">
              <span className="pg-slider-label__name">Link Length</span>
              <span className="pg-slider-label__value">
                {Math.round(material.ropeLength ?? 120)}
              </span>
            </div>
            <input
              type="range"
              min="20"
              max={maxLinkLength}
              step="5"
              value={material.ropeLength ?? 120}
              onChange={(e) =>
                setMaterial({ ...material, ropeLength: parseFloat(e.target.value) })
              }
              className="pg-slider"
            />
            <p className="pg-slider-hint">
              Sets the target length for new links, or updates the selected rope, spring, or rod.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
