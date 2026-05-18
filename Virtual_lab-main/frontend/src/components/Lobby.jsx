import { useState, useEffect } from 'react'

export default function Lobby({ onJoinRoom }) {
  const [roomCode, setRoomCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')
  
  const [gallery, setGallery] = useState([])
  const [isLoadingGallery, setIsLoadingGallery] = useState(true)

  const API_URL = 'http://localhost:5001/api'

  // Fetch the experiment library on mount
  useEffect(() => {
    fetch(`${API_URL}/rooms`)
      .then(res => res.json())
      .then(data => {
        setGallery(data)
        setIsLoadingGallery(false)
      })
      .catch(err => {
        console.error('Failed to load gallery', err)
        setIsLoadingGallery(false)
      })
  }, [])

  // Create a brand-new room
  const handleCreate = async () => {
    setIsCreating(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/rooms`, { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        onJoinRoom(data.roomId) // Pass the new room code up to App
      } else {
        setError(data.error || 'Failed to create room')
      }
    } catch (err) {
      console.error(err)
      setError('Cannot reach server. Is the backend running on port 5001?')
    } finally {
      setIsCreating(false)
    }
  }

  // Join an existing room by code
  const handleJoin = async () => {
    const code = roomCode.trim().toUpperCase()
    if (code.length === 0) {
      setError('Please enter a room code')
      return
    }
    setIsJoining(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/rooms/${code}`)
      const data = await res.json()
      if (res.ok) {
        onJoinRoom(data.roomId) // Room exists — join it
      } else {
        setError(data.error || 'Room not found')
      }
    } catch (err) {
      console.error(err)
      setError('Cannot reach server. Is the backend running on port 5001?')
    } finally {
      setIsJoining(false)
    }
  }

  return (
    <div className="pg-lobby">
      <div className="pg-lobby__bg" />
      <div className="pg-lobby__content">
        {/* Hero Section */}
        <div className="pg-lobby__hero">
          <span className="pg-lobby__icon">🔬</span>
          <h1 className="pg-lobby__heading">VIRTUAL-LAB</h1>
          <p className="pg-lobby__tagline">
            Interactive 2D Mechanics Sandbox
          </p>
        </div>

        {/* Room Card */}
        <div className="pg-lobby__card">
          {/* Create Room Button */}
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="pg-lobby__create-btn"
          >
            {isCreating ? '⏳ Setting up...' : '⚡ Start New Session'}
          </button>

          {/* Divider */}
          <div className="pg-lobby__separator">
            <div className="pg-lobby__separator-line" />
            <span className="pg-lobby__separator-text">
              or enter code
            </span>
            <div className="pg-lobby__separator-line" />
          </div>

          {/* Join Room Input */}
          <div className="pg-lobby__join-row">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="Session code"
              maxLength={6}
              className="pg-lobby__code-input"
            />
            <button
              onClick={handleJoin}
              disabled={isJoining}
              className="pg-lobby__join-btn"
            >
              {isJoining ? '⏳' : 'Enter'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="pg-lobby__error">
              {error}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="pg-lobby__hint">
          Share your session code with collaborators to experiment together
        </p>

        {/* Saved Sessions Gallery */}
        {!isLoadingGallery && gallery.length > 0 && (
          <div className="pg-gallery">
            <h2 className="pg-gallery__title">
              <span>🗂</span> Saved Sessions
            </h2>
            <div className="pg-gallery__grid">
              {gallery.map(room => (
                <button
                  key={room.roomId}
                  onClick={() => onJoinRoom(room.roomId)}
                  className="pg-gallery__item"
                >
                  <div className="pg-gallery__item-code">{room.roomId}</div>
                  <div className="pg-gallery__item-meta">
                    <span className="pg-gallery__item-count">
                      {room.bodyCount} Objects
                    </span>
                    <span className="pg-gallery__item-date">
                      {new Date(room.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
