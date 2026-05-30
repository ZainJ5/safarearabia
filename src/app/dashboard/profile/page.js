'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState({ name: '', phone: '', location: '', bio: '' });

  // Load profile from DB on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch('/api/user/profile');
        const result = await res.json();
        if (result.success) {
          const u = result.data;
          setProfile({
            name: u.name || '',
            phone: u.phone || '',
            location: u.location || '',
            bio: u.bio || '',
          });
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
      setFetching(false);
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      
      const result = await res.json();
      if (result.success) {
        setMessage('Profile updated successfully!');
        // Refresh session name
        await update({ name: profile.name });
      } else {
        setMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred');
    }
    
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: 'var(--primary-color1)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4">Profile Settings</h3>
      
      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} alert-dismissible`}>
          {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      <form onSubmit={handleUpdateProfile}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={profile.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control bg-light"
                value={session?.user?.email || ''}
                readOnly
              />
              <small className="text-muted">Email cannot be changed.</small>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+966..."
              />
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={profile.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                className="form-control"
                rows={3}
                value={profile.bio}
                onChange={handleChange}
                placeholder="Tell us a little about yourself..."
              />
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="primary-btn1 px-4" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
