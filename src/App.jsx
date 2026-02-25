import React, { useState, useEffect, useMemo } from 'react'
import DonorCard from './components/DonorCard'
import FilterBar from './components/FilterBar'
import AddDonorForm from './components/AddDonorForm'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

const MY_GIVEN_DATA = [
  { id: 1, name: "Dhairya Gupta", bloodGroup: "A+", city: "Bulandshahr", phone: "8126471106", available: true },
  { id: 2, name: "Devansh Mittal", bloodGroup: "B+", city: "Patna", phone: "7320012989", available: true },
  { id: 3, name: "Prince Kotadia", bloodGroup: "B+", city: "Rajkot", phone: "9328982707", available: false },
  { id: 4, name: "Kavya Gandhi", bloodGroup: "O+", city: "Vadodara", phone: "9879184495", available: true },
  { id: 5, name: "Deyaan Kapasi", bloodGroup: "O-", city: "Mumbai", phone: "8208323539", available: true },
  { id: 6, name: "Samad Sabharwal", bloodGroup: "AB+", city: "Ludhiana", phone: "7864900030", available: false },
  { id: 7, name: "Varun Patil", bloodGroup: "A-", city: "Bengaluru", phone: "6364450108", available: true },
  { id: 8, name: "Soham Gangopadhyay", bloodGroup: "AB-", city: "Hyderabad", phone: "8790276934", available: false },
  { id: 9, name: "Kavya Tejani", bloodGroup: "B-", city: "Surat", phone: "9429423101", available: true }
];

export default function App() {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [citySearch, setCitySearch] = useState('')
  const [sortByAvail, setSortByAvail] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    const loadLocalData = () => {
      try {
        setLoading(true);
        setTimeout(() => {
          const randomizedData = MY_GIVEN_DATA.map(donor => ({
            ...donor,
            available: Math.random() > 0.5 
          }));
          setDonors(randomizedData);
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

  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleAddDonor = (newDonorData) => {
    const newDonor = {
      ...newDonorData,
      id: Date.now(), 
    }
    setDonors(prev => [newDonor, ...prev]) 
    setShowAddForm(false) 
    triggerToast(`Successfully registered ${newDonor.name} as a donor!`) 
  }

  return (
    <div className="app">
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
              
              <div className="stat-divider hide-mobile" />
              <button className="add-donor-btn" onClick={() => setShowAddForm(true)}>
                + Become a Donor
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main">
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
              <DonorCard key={donor.id} donor={donor} index={i} onShowToast={triggerToast} />
            ))}
          </div>
        )}
      </main>

      <footer className="footer">
        <span>BloodLink — Saving lives, one connection at a time</span>
      </footer>

      <div className={`toast-notification ${toastMessage ? 'show' : ''}`}>
        <div className="toast-icon">✅</div>
        <div className="toast-text">{toastMessage}</div>
      </div>

      {showAddForm && (
        <AddDonorForm 
          onClose={() => setShowAddForm(false)} 
          onSubmit={handleAddDonor} 
        />
      )}
    </div>
  )
}