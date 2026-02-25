import React, { useState } from 'react'

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']

export default function AddDonorForm({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: 'A+',
    city: '',
    phone: '',
    available: true
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Basic validation
    if (!formData.name || !formData.city || !formData.phone) return
    
    onSubmit(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Become a Donor</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="donor-form">
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. John Doe"
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                {BLOOD_GROUPS.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>City</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                placeholder="e.g. Mumbai"
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              required 
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="toggle-label-form">
              <input 
                type="checkbox" 
                name="available" 
                checked={formData.available} 
                onChange={handleChange} 
              />
              <span className="custom-checkbox"></span>
              I am currently available to donate blood
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Register as Donor</button>
          </div>
        </form>
      </div>
    </div>
  )
}