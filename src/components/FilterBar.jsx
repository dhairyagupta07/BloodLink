import React from 'react'

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function FilterBar({
  selectedGroup, onGroupChange,
  citySearch, onCitySearch,
  sortByAvail, onSortChange,
}) {
  return (
    <div className="filter-bar">
      {/* City Search */}
      <div className="search-wrapper">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search by city..."
          value={citySearch}
          onChange={e => onCitySearch(e.target.value)}
        />
        {citySearch && (
          <button className="clear-btn" onClick={() => onCitySearch('')}>×</button>
        )}
      </div>

      {/* Blood Group Selector */}
      <div className="group-pills">
        {BLOOD_GROUPS.map(g => (
          <button
            key={g}
            className={`group-pill ${selectedGroup === g ? 'active' : ''}`}
            onClick={() => onGroupChange(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Sort */}
      <label className="sort-toggle">
        <input
          type="checkbox"
          checked={sortByAvail}
          onChange={e => onSortChange(e.target.checked)}
        />
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-label">Available first</span>
      </label>
    </div>
  )
}
