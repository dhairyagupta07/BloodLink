import React, { useState, useEffect, useMemo } from 'react'
import DonorCard from './components/DonorCard'
import FilterBar from './components/FilterBar'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

// 1. YOUR GIVEN DATA
const MY_GIVEN_DATA = [
  {
    id: 1,
    name: "Dhairya Gupta",
    bloodGroup: "A+",
    city: "Bulandshahr",
    phone: "8126471106",
    available: true
  },
  {
    id: 2,
    name: "Devansh Mittal",
    bloodGroup: "B+",
    city: "Patna",
    phone: "7320012989",
    available: true
  },
  {
    id: 3,
    name: "Prince Kotadia",
    bloodGroup: "B+",
    city: "Rajkot",
    phone: "9328982707",
    available: false
  },
  {
    id: 4,
    name: "Kavya Gandhi",
    bloodGroup: "O-",
    city: "Vadodara",
    phone: "9879184495",
    available: true
  },
  {
    id: 5,
    name: "Deyaan Kapasi",
    bloodGroup: "O-",
    city: "Mumbai",
    phone: "8208323539",
    available: true
  },
  {
    id: 6,
    name: "Samad Sabharwal",
    bloodGroup: "AB+",
    city: "Ludhiana",
    phone: "7864900030",
    available: false
  },
  {
    id: 7,
    name: "Varun Patil",
    bloodGroup: "A-",
    city: "Bengaluru",
    phone: "6364450108",
    available: true
  },
  {
    id: 8,
    name: "Soham Gangopadhyay",
    bloodGroup: "AB-",
    city: "Hyderabad",
    phone: "8790276934",
    available: false
  },
  {
    id: 9,
    name: "Kavya Tejani",
    bloodGroup: "A+",
    city: "Surat",
    phone: "9429423101",
    available: true
  }
];

export default function App() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [citySearch, setCitySearch] = useState('')
  const [sortByAvail, setSortByAvail] = useState(false)

  // 2. UPDATED USEEFFECT
  useEffect(() => {
    const loadLocalData = () => {
      try {
        setLoading(true);
        // We simulate a small delay to mimic an API behavior 
        // and show the loading state as required by your project structure
        setTimeout(() => {
          setDonors(MY_GIVEN_DATA);
          setLoading(false);
        }, 800); 
      } catch (err) {
        setError("Failed to load donor data");
        setLoading(false);
      }
    };

    loadLocalData();
  }, []);

  const filtered = useMemo(() => {
    let result = donors

    if (selectedGroup !== 'All') {
      result = result.filter(d => d.bloodGroup === selectedGroup)
    }
    if (citySearch.trim()) {
      const q = citySearch.toLowerCase()
      result = result.filter(d => d.city.toLowerCase().includes(q))
    }
    if (sortByAvail) {
      result = [...result].sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0))
    }
    return result
  }, [donors, selectedGroup, citySearch, sortByAvail])

  const availableCount = useMemo(
    () => filtered.filter(d => d.available).length,
    [filtered]
  )

  return (
    <div className="app">
      {/* Hero Header */}
      <header className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-inner">
          <div className="logo-mark">
            <span className="logo-drop">🩸</span>
          </div>
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-blood">BLOOD</span>
              <span className="title-link">LINK</span>
            </h1>
            <p className="hero-sub">Community Donor Network — Find help when it matters most</p>
          </div>

          {/* Stats bar */}
          {!loading && !error && (
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-num">{donors.length}</span>
                <span className="stat-label">Total Donors</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num available-num">{availableCount}</span>
                <span className="stat-label">Available Now</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">{filtered.length}</span>
                <span className="stat-label">Showing</span>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="main">
        {/* Filters */}
        {!loading && !error && (
          <FilterBar
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
            citySearch={citySearch}
            onCitySearch={setCitySearch}
            sortByAvail={sortByAvail}
            onSortChange={setSortByAvail}
          />
        )}

        {/* Content States */}
        {loading && (
          <div className="state-center">
            <div className="spinner-wrap">
              <div className="spinner" />
              <div className="spinner-ring" />
            </div>
            <p className="state-text">Finding donors near you...</p>
          </div>
        )}

        {error && (
          <div className="state-center">
            <div className="error-icon">⚠️</div>
            <p className="state-text error-text">{error}</p>
            <button className="retry-btn" onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="state-center">
            <div className="empty-icon">🔍</div>
            <p className="state-heading">No donors found</p>
            <p className="state-text">Try adjusting your filters or search query</p>
            <button className="retry-btn" onClick={() => { setSelectedGroup('All'); setCitySearch('') }}>
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="donor-grid">
            {filtered.map((donor, i) => (
              <DonorCard key={donor.id} donor={donor} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <span>BloodLink — Saving lives, one connection at a time</span>
      </footer>

      <style>{`
        /* ===== LAYOUT ===== */
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* ===== HERO ===== */
        .hero {
          position: relative;
          padding: 3rem 2rem 2.5rem;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
        }
        .hero-bg-glow {
          position: absolute;
          top: -80px; left: 50%; transform: translateX(-50%);
          width: 600px; height: 300px;
          background: radial-gradient(ellipse, rgba(220,38,38,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }
        .logo-mark {
          position: relative;
        }
        .logo-drop {
          font-size: 3rem;
          display: block;
          animation: heartbeat 2.5s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(220,38,38,0.6));
        }
        .hero-text {
          text-align: center;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(3rem, 10vw, 7rem);
          line-height: 1;
          letter-spacing: 0.04em;
          display: flex;
          gap: 0.3em;
        }
        .title-blood {
          color: var(--red-bright);
          text-shadow: 0 0 40px rgba(239,68,68,0.4);
        }
        .title-link {
          color: var(--text-primary);
        }
        .hero-sub {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 300;
          letter-spacing: 0.02em;
          margin-top: 0.3rem;
        }

        /* ===== STATS BAR ===== */
        .stats-bar {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 0.75rem 2rem;
          margin-top: 0.5rem;
          animation: fadeUp 0.5s ease both 0.3s;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.1rem;
        }
        .stat-num {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--text-primary);
          letter-spacing: 0.05em;
        }
        .available-num {
          color: #4ade80;
        }
        .stat-label {
          font-size: 0.68rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }
        .stat-divider {
          width: 1px;
          height: 32px;
          background: var(--border);
        }

        /* ===== MAIN ===== */
        .main {
          flex: 1;
          max-width: 1100px;
          width: 100%;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        /* ===== FILTER BAR ===== */
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.25rem 1.5rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          animation: fadeUp 0.4s ease both;
        }
        .search-wrapper {
          position: relative;
          flex: 1;
          min-width: 180px;
        }
        .search-icon {
          position: absolute;
          left: 12px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.875rem;
          padding: 0.6rem 0.75rem 0.6rem 2.25rem;
          outline: none;
          transition: border-color var(--transition);
        }
        .search-input::placeholder { color: var(--text-muted); }
        .search-input:focus { border-color: var(--red); }
        .clear-btn {
          position: absolute;
          right: 10px; top: 50%; transform: translateY(-50%);
          background: none; border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          line-height: 1;
          padding: 0 2px;
        }
        .clear-btn:hover { color: var(--text-primary); }

        .group-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }
        .group-pill {
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.35rem 0.75rem;
          border-radius: 100px;
          cursor: pointer;
          transition: all var(--transition);
        }
        .group-pill:hover {
          border-color: var(--red);
          color: var(--text-primary);
        }
        .group-pill.active {
          background: var(--red);
          border-color: var(--red);
          color: #fff;
          box-shadow: 0 0 12px rgba(220,38,38,0.35);
        }

        .sort-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
        }
        .sort-toggle input { display: none; }
        .toggle-track {
          width: 36px; height: 20px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 100px;
          position: relative;
          transition: background var(--transition);
        }
        .sort-toggle input:checked + .toggle-track {
          background: var(--red);
          border-color: var(--red);
        }
        .toggle-thumb {
          position: absolute;
          top: 2px; left: 2px;
          width: 14px; height: 14px;
          background: #fff;
          border-radius: 50%;
          transition: transform var(--transition);
        }
        .sort-toggle input:checked + .toggle-track .toggle-thumb {
          transform: translateX(16px);
        }
        .toggle-label {
          font-size: 0.82rem;
          color: var(--text-secondary);
        }

        /* ===== DONOR GRID ===== */
        .donor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        /* ===== DONOR CARD ===== */
        .donor-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
          transition: border-color var(--transition), transform var(--transition), box-shadow var(--transition);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .donor-card:hover {
          border-color: var(--border-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(220,38,38,0.08);
        }
        .card-accent {
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          border-radius: 12px 0 0 12px;
        }

        .blood-badge {
          position: relative;
          width: 52px; height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .blood-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: var(--badge-color);
          opacity: 0.15;
        }
        .blood-badge::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          border: 1.5px solid var(--badge-color);
          opacity: 0.4;
        }
        .blood-badge-text {
          font-family: var(--font-display);
          font-size: 1.25rem;
          color: var(--badge-color);
          position: relative;
          z-index: 1;
          letter-spacing: 0.05em;
        }
        .badge-ring {
          position: absolute;
          inset: -4px;
          border-radius: 18px;
          border: 1px solid var(--badge-color);
          opacity: 0;
          transition: opacity var(--transition);
        }
        .donor-card:hover .badge-ring {
          opacity: 0.2;
        }

        .card-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .donor-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
        }
        .donor-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
        .meta-item svg {
          flex-shrink: 0;
          opacity: 0.6;
        }

        .availability-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.6rem;
          border-radius: 100px;
          width: fit-content;
          letter-spacing: 0.03em;
        }
        .availability-tag.available {
          background: var(--available-bg);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.2);
        }
        .availability-tag.unavailable {
          background: var(--unavailable-bg);
          color: var(--unavailable);
          border: 1px solid rgba(107,114,128,0.15);
        }
        .tag-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
          flex-shrink: 0;
        }
        .availability-tag.available .tag-dot {
          box-shadow: 0 0 6px currentColor;
          animation: pulse-ring 1.5s ease-out infinite;
        }

        /* ===== REQUEST BUTTON ===== */
        .request-btn {
          width: 100%;
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          border: 1.5px solid var(--btn-color, var(--red));
          background: transparent;
          color: var(--btn-color, var(--red));
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          letter-spacing: 0.02em;
        }
        .request-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--btn-color, var(--red));
          opacity: 0;
          transition: opacity var(--transition);
        }
        .request-btn:hover:not(:disabled)::before {
          opacity: 0.12;
        }
        .request-btn:hover:not(:disabled) {
          box-shadow: 0 0 16px rgba(220,38,38,0.25);
          transform: translateY(-1px);
        }
        .request-btn:disabled:not(.sent) {
          opacity: 0.3;
          cursor: not-allowed;
          border-color: var(--text-muted);
          color: var(--text-muted);
        }
        .request-btn.sent {
          border-color: var(--available);
          color: #4ade80;
          cursor: default;
        }
        .check-icon { font-size: 0.9rem; }
        .btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          position: relative;
          z-index: 1;
        }

        /* ===== EMPTY / LOADING STATES ===== */
        .state-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-height: 360px;
          text-align: center;
        }
        .spinner-wrap {
          position: relative;
          width: 56px; height: 56px;
        }
        .spinner {
          width: 56px; height: 56px;
          border: 2.5px solid rgba(220,38,38,0.15);
          border-top-color: var(--red);
          border-radius: 50%;
          animation: spin 0.9s linear infinite;
        }
        .spinner-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(220,38,38,0.1);
          animation: spin 2.5s linear infinite reverse;
        }
        .state-text {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        .state-heading {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .error-icon, .empty-icon {
          font-size: 3rem;
        }
        .error-text { color: var(--red-bright); }
        .retry-btn {
          background: var(--surface-2);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.875rem;
          padding: 0.6rem 1.5rem;
          border-radius: 100px;
          cursor: pointer;
          transition: all var(--transition);
          margin-top: 0.5rem;
        }
        .retry-btn:hover {
          border-color: var(--red);
          color: var(--red-bright);
        }

        /* ===== FOOTER ===== */
        .footer {
          border-top: 1px solid var(--border);
          text-align: center;
          padding: 1.25rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          letter-spacing: 0.03em;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 600px) {
          .hero { padding: 2rem 1rem 1.75rem; }
          .stats-bar { gap: 1rem; padding: 0.75rem 1.25rem; }
          .filter-bar { padding: 1rem; }
          .main { padding: 1.25rem 1rem; }
        }
      `}</style>
    </div>
  )
}