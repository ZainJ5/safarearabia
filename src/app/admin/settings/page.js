'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { if (d.success) setSettings(d.data || {}); })
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) alert('Settings saved successfully');
      else alert(data.error || 'Failed to save');
    } catch (e) {
      alert(e.message);
    }
    setSaving(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Loading settings...</div>;

  const tabs = [
    { id: 'general', label: 'General', icon: 'bi-gear' },
    { id: 'social', label: 'Social Media', icon: 'bi-share' },
    { id: 'footer', label: 'Footer & Banner', icon: 'bi-layout-text-window-reverse' },
    { id: 'payment', label: 'Payment APIs', icon: 'bi-credit-card' },
    { id: 'advanced', label: 'Advanced', icon: 'bi-sliders' },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Site Settings</h4>
        <button onClick={handleSubmit} className="admin-btn admin-btn-primary" disabled={saving}>
          <i className="bi bi-save"></i> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid #e8e8e8' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '14px 20px', background: activeTab === tab.id ? '#fff' : '#f8f9fa',
                border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--primary-color1)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--primary-color1)' : '#666',
                fontWeight: activeTab === tab.id ? 600 : 500, fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <i className={`bi ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: 24 }}>
          {activeTab === 'general' && (
            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group"><label>Company Name</label><input value={settings.company_name || ''} onChange={e => set('company_name', e.target.value)} /></div>
                <div className="admin-form-group"><label>Email Address</label><input type="email" value={settings.contact_email || ''} onChange={e => set('contact_email', e.target.value)} /></div>
                <div className="admin-form-group"><label>Phone Number</label><input value={settings.contact_phone || ''} onChange={e => set('contact_phone', e.target.value)} /></div>
                <div className="admin-form-group"><label>Address</label><textarea value={settings.address || ''} onChange={e => set('address', e.target.value)} rows={3} /></div>
              </div>
              <div className="col-md-6">
                <ImageUpload label="Main Logo" value={settings.logo_url} onChange={v => set('logo_url', v)} folder="uploads/settings" />
                <div style={{ marginTop: 24 }}>
                  <ImageUpload label="Footer Logo (White)" value={settings.logo_white_url} onChange={v => set('logo_white_url', v)} folder="uploads/settings" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group"><label><i className="bi bi-facebook" style={{ color: '#1877f2', marginRight: 6 }}></i> Facebook URL</label><input value={settings.social_facebook || ''} onChange={e => set('social_facebook', e.target.value)} /></div>
                <div className="admin-form-group"><label><i className="bi bi-instagram" style={{ color: '#e4405f', marginRight: 6 }}></i> Instagram URL</label><input value={settings.social_instagram || ''} onChange={e => set('social_instagram', e.target.value)} /></div>
                <div className="admin-form-group"><label><i className="bi bi-linkedin" style={{ color: '#0a66c2', marginRight: 6 }}></i> LinkedIn URL</label><input value={settings.social_linkedin || ''} onChange={e => set('social_linkedin', e.target.value)} /></div>
              </div>
              <div className="col-md-6">
                <div className="admin-form-group"><label><i className="bi bi-twitter-x" style={{ color: '#000', marginRight: 6 }}></i> Twitter / X URL</label><input value={settings.social_twitter || ''} onChange={e => set('social_twitter', e.target.value)} /></div>
                <div className="admin-form-group"><label><i className="bi bi-youtube" style={{ color: '#ff0000', marginRight: 6 }}></i> YouTube URL</label><input value={settings.social_youtube || ''} onChange={e => set('social_youtube', e.target.value)} /></div>
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group"><label>Footer Description</label><textarea value={settings.footer_text || ''} onChange={e => set('footer_text', e.target.value)} rows={4} /></div>
                <div className="admin-form-group"><label>Copyright Text</label><input value={settings.copyright_text || ''} onChange={e => set('copyright_text', e.target.value)} placeholder="© 2026 Safar e Arabian. All rights reserved." /></div>
              </div>
              <div className="col-md-6">
                <div className="admin-form-group"><label>Marketing Banner Title</label><input value={settings.marketing_title || ''} onChange={e => set('marketing_title', e.target.value)} placeholder="Get 5% Off Your First Booking" /></div>
                <div className="admin-form-group"><label>Marketing Banner Subtitle</label><input value={settings.marketing_subtitle || ''} onChange={e => set('marketing_subtitle', e.target.value)} placeholder="Join our newsletter" /></div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="row">
              <div className="col-md-6">
                <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8, marginBottom: 16 }}>
                  <h6 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}><i className="bi bi-stripe" style={{ color: '#635bff' }}></i> Stripe</h6>
                  <div className="admin-form-group mb-2"><label>Publishable Key</label><input value={settings.stripe_key || ''} onChange={e => set('stripe_key', e.target.value)} /></div>
                  <div className="admin-form-group mb-0"><label>Secret Key</label><input type="password" value={settings.stripe_secret || ''} onChange={e => set('stripe_secret', e.target.value)} /></div>
                </div>
              </div>
              <div className="col-md-6">
                <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
                  <h6 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}><i className="bi bi-paypal" style={{ color: '#003087' }}></i> PayPal</h6>
                  <div className="admin-form-group mb-2"><label>Client ID</label><input value={settings.paypal_client_id || ''} onChange={e => set('paypal_client_id', e.target.value)} /></div>
                  <div className="admin-form-group mb-0"><label>Secret</label><input type="password" value={settings.paypal_secret || ''} onChange={e => set('paypal_secret', e.target.value)} /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Hotline Text</label>
                  <input value={settings.hotline_text || ''} onChange={e => set('hotline_text', e.target.value)} placeholder="To More Inquiry" />
                </div>
                <div className="admin-form-group">
                  <label>Hotline Phone</label>
                  <input value={settings.hotline_phone || ''} onChange={e => set('hotline_phone', e.target.value)} placeholder="+92 305 1309051" />
                </div>
                <div className="admin-form-group">
                  <label>Tax Rate (%)</label>
                  <input type="number" step="0.01" value={settings.tax_rate || ''} onChange={e => set('tax_rate', e.target.value)} placeholder="5" />
                </div>
                <div className="admin-form-group">
                  <label>Default Currency</label>
                  <select value={settings.default_currency || '2'} onChange={e => set('default_currency', e.target.value)}>
                    <option value="1">PKR (Pakistani Rupee)</option>
                    <option value="2">SAR (Saudi Riyal)</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Topbar Marketing Text</label>
                  <input value={settings.topbar_marketing_text || ''} onChange={e => set('topbar_marketing_text', e.target.value)} placeholder="Your trusted partner for Hajj & Umrah journeys" />
                </div>
                <div className="admin-form-group">
                  <label>Tawk.to Chat Code</label>
                  <input value={settings.tawk_code || ''} onChange={e => set('tawk_code', e.target.value)} placeholder="https://embed.tawk.to/..." />
                  <small style={{ color: '#888', fontSize: 12 }}>Paste the full Tawk.to embed URL</small>
                </div>
                <div className="admin-form-group">
                  <label>Google reCAPTCHA Site Key</label>
                  <input value={settings.recaptcha_key || ''} onChange={e => set('recaptcha_key', e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label>Show Preloader</label>
                  <select value={settings.show_preloader || '0'} onChange={e => set('show_preloader', e.target.value)}>
                    <option value="0">Disabled</option>
                    <option value="1">Enabled</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
