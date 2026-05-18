import { useState, useEffect } from 'react'
import './index.css'
import './App.css'
import Lobby from './components/Lobby'
import PhysicsCanvas from './components/PhysicsCanvas'
import Toolbar from './components/Toolbar'
import MaterialPicker from './components/MaterialPicker'
import AnalyticsPanel from './components/AnalyticsPanel'
import socket from './socket'

function App() {
  const [roomId, setRoomId] = useState(null)
  const [userCount, setUserCount] = useState(1)
  const [activeTool, setActiveTool] = useState('cursor')
  const [material, setMaterial] = useState({
    restitution: 0.6,
    friction: 0.1,
    density: 0.001,
    ropeLength: 120,
    springStiffness: 0.05,
    motorType: 'gear',
    gearTeeth: 12,
    gearRadius: 40,
    isMotorized: true,
    motorSpeed: 0.05,
    motorDirection: 'clockwise'
  })
  const [isPaused, setIsPaused] = useState(false)
  const [selectedConstraintType, setSelectedConstraintType] = useState(null)

  useEffect(() => {
    if (!roomId) return

    socket.connect()
    socket.emit('join-room', roomId)

    const onUserJoined = (data) => setUserCount(data.userCount)
    const onUserLeft = (data) => setUserCount(data.userCount)
    const onRoomUserCount = (data) => setUserCount(data.userCount)

    socket.on('user-joined', onUserJoined)
    socket.on('user-left', onUserLeft)
    socket.on('room-user-count', onRoomUserCount)

    return () => {
      socket.off('user-joined', onUserJoined)
      socket.off('user-left', onUserLeft)
      socket.off('room-user-count', onRoomUserCount)
      socket.disconnect()
    }
  }, [roomId])

  useEffect(() => {
    const handleConstraintSelectionChange = (event) => {
      const detail = event.detail || null
      setSelectedConstraintType(detail?.type || null)

      if (typeof detail?.length === 'number') {
        setMaterial((prev) => ({ ...prev, ropeLength: detail.length }))
      }
    }

    window.addEventListener('constraint-selection-change', handleConstraintSelectionChange)
    return () => window.removeEventListener('constraint-selection-change', handleConstraintSelectionChange)
  }, [])

  useEffect(() => {
    const handleBodySelectionChange = (event) => {
      const detail = event.detail || null
      if (!detail) return

      setMaterial((prev) => ({
        ...prev,
        restitution: typeof detail.restitution === 'number' ? detail.restitution : prev.restitution,
        friction: typeof detail.friction === 'number' ? detail.friction : prev.friction,
        density: typeof detail.density === 'number' ? detail.density : prev.density,
      }))
    }

    window.addEventListener('body-selection-change', handleBodySelectionChange)
    return () => window.removeEventListener('body-selection-change', handleBodySelectionChange)
  }, [])

  if (!roomId) {
    return <Lobby onJoinRoom={(id) => setRoomId(id)} />
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: 'var(--color-pg-canvas)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Bar ── */}
      <header className="pg-header">
        <div className="pg-header__brand">
          <span className="pg-header__logo">🔬</span>
          <span className="pg-header__title">VIRTUAL-LAB</span>
        </div>

        <div className="pg-header__center">
          <span className="pg-badge pg-badge--live">
            <span className="pg-badge__dot" />
            <span>{userCount} online</span>
          </span>
          <span className="pg-badge pg-badge--room">{roomId}</span>
        </div>

        <div className="pg-header__actions">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`pg-btn ${isPaused ? 'pg-btn--pause' : 'pg-btn--play'}`}
          >
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('trigger-clear'))}
            className="pg-btn pg-btn--danger"
          >
            ✕ Clear
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('trigger-delete-selected'))}
            className="pg-btn pg-btn--danger"
          >
            🗑 Delete
          </button>

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('trigger-save'))}
            className="pg-btn pg-btn--accent"
          >
            💾 Save
          </button>

          <button
            onClick={() => setRoomId(null)}
            className="pg-btn pg-btn--ghost"
          >
            Exit
          </button>
        </div>
      </header>

      {/* ── Canvas & Overlays ── */}
      <main style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <PhysicsCanvas roomId={roomId} activeTool={activeTool} material={material} isPaused={isPaused} />
        <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} material={material} setMaterial={setMaterial} />
        <MaterialPicker
          material={material}
          setMaterial={setMaterial}
          activeTool={activeTool}
          selectedConstraintType={selectedConstraintType}
        />
        <AnalyticsPanel />
      </main>
    </div>
  )
}

export default App
