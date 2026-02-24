import React, { useState } from 'react'

const BLOOD_COLORS = {
  'A+': '#ef4444', 'A-': '#f87171',
  'B+': '#f97316', 'B-': '#fb923c',
  'O+': '#dc2626', 'O-': '#b91c1c',
  'AB+': '#7c3aed', 'AB-': '#8b5cf6',
}

export default function DonorCard({ donor, index }) {
  const [requested, setRequested] = useState(false)
  const [animating, setAnimating] = useState(false)

  const handleRequest = () => {
    if (requested) return
    setAnimating(true)
    setTimeout(() => {
      setRequested(true)
      setAnimating(false)
    }, 600)
  }

  const color = BLOOD_COLORS[donor.bloodGroup] || '#dc2626'

  return (
    <div
      className="donor-card"
      style={{
        animation: `fadeUp 0.4s ease both`,
        animationDelay: `${index * 0.06}s`,
      }}
    >
      {/* Blood group badge */}
      <div className="blood-badge" style={{ '--badge-color': color }}>
        <span className="blood-badge-text">{donor.bloodGroup}</span>
        <div className="badge-ring" />
      </div>

      {/* Card body */}
      <div className="card-content">
        <div className="donor-name">{donor.name}</div>
        <div className="donor-meta">
          <span className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {donor.city}
          </span>
          <span className="meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.28-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15z"/>
            </svg>
            {donor.phone}
          </span>
        </div>

        {/* Availability badge */}
        <div className={`availability-tag ${donor.available ? 'available' : 'unavailable'}`}>
          <span className="tag-dot" />
          {donor.available ? 'Available' : 'Unavailable'}
        </div>
      </div>

      {/* Action */}
      <button
        className={`request-btn ${requested ? 'sent' : ''} ${animating ? 'loading' : ''}`}
        onClick={handleRequest}
        disabled={!donor.available || requested}
        style={{ '--btn-color': color }}
      >
        {animating ? (
          <span className="btn-spinner" />
        ) : requested ? (
          <>Request Sent <span className="check-icon">✅</span></>
        ) : (
          donor.available ? 'Request Help' : 'Unavailable'
        )}
      </button>

      {/* Decorative line */}
      <div className="card-accent" style={{ background: color }} />
    </div>
  )
}
