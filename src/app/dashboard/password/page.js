'use client';

import { useState } from 'react';

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (data.newPassword !== data.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      if (result.success) {
        setMessage('Password updated successfully!');
        e.target.reset();
      } else {
        setError(result.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An error occurred');
    }
    
    setLoading(false);
  };

  return (
    <div>
      <h3 className="mb-4">Change Password</h3>
      
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleChangePassword}>
            <div className="form-group mb-3">
              <label className="form-label">Current Password</label>
              <input type="password" name="currentPassword" className="form-control" required />
            </div>
            
            <div className="form-group mb-3">
              <label className="form-label">New Password</label>
              <input type="password" name="newPassword" className="form-control" required minLength="6" />
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label">Confirm New Password</label>
              <input type="password" name="confirmPassword" className="form-control" required minLength="6" />
            </div>
            
            <button type="submit" className="btn btn-primary px-4" disabled={loading}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
