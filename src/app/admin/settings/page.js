'use client';

import { useState, useEffect } from 'react';
import ImageUpload from '@/components/admin/ImageUpload';
import toast from 'react-hot-toast';

const IcoGear   = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.8"/></svg>;
const IcoShare  = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoLayout = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoSliders= () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><line x1="4" y1="21" x2="4" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="4" y1="10" x2="4" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="21" x2="12" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="12" y1="8" x2="12" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="20" y1="21" x2="20" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="20" y1="12" x2="20" y2="3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="1" y1="14" x2="7" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="9" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><line x1="17" y1="16" x2="23" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
const IcoSave   = () => <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IcoLink   = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const SOCIAL_ICONS = {
  facebook:  { icon: <svg width="14" height="14" fill="#1877F2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>, color: '#1877F2' },
  instagram: { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" stroke="#E4405F" strokeWidth="1.8"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" stroke="#E4405F" strokeWidth="1.8"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="#E4405F" strokeWidth="2.4" strokeLinecap="round"/></svg>, color: '#E4405F' },
  linkedin:  { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" stroke="#0A66C2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="9" width="4" height="12" stroke="#0A66C2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="4" cy="4" r="2" stroke="#0A66C2" strokeWidth="1.8"/></svg>, color: '#0A66C2' },
  twitter:   { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M4 4l16 16M4 20L20 4" stroke="#000" strokeWidth="2" strokeLinecap="round"/></svg>, color: '#111' },
  youtube:   { icon: <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" stroke="#FF0000" strokeWidth="1.6"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000"/></svg>, color: '#FF0000' },
};

const TABS = [
  { id: 'general',  label: 'Company Profile', icon: <IcoGear /> },
  // { id: 'social',   label: 'Social Media',   icon: <IcoShare /> },   // frontend-only
  // { id: 'footer',   label: 'Footer & Banner',icon: <IcoLayout /> },  // frontend-only
  { id: 'advanced', label: 'Advanced', icon: <IcoSliders /> },
];

function FormGroup({ label, children }) {
  return (
    <div className="admin-form-group">
      <label>{label}</label>
      {children}
    </div>
  );
}

function SocialField({ label, settingKey, value, onChange, platform }) {
  const meta = SOCIAL_ICONS[platform] || {};
  return (
    <div className="admin-form-group">
      <label style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {meta.icon}
        <span style={{ color: meta.color || '#374151' }}>{label}</span>
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}><IcoLink /></div>
        <input value={value || ''} onChange={e => onChange(settingKey, e.target.value)}
          placeholder={`https://${platform}.com/your-page`}
          style={{ paddingLeft: 36 }} />
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
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
      const res = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
      const data = await res.json();
      if (data.success) toast.success('Settings saved successfully!');
      else toast.error(data.error || 'Failed to save settings');
    } catch (e) { toast.error('Error: ' + e.message); }
    setSaving(false);
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, flexDirection: 'column', gap: 14, color: '#9CA3AF' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span style={{ fontSize: 13 }}>Loading settings...</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#0F172A', letterSpacing: '-0.3px' }}>Company Profile</h2>
          <p style={{ color: '#9CA3AF', fontSize: 13, margin: '3px 0 0', fontWeight: 500 }}>Company information, branding, and advanced site settings</p>
        </div>
        <button onClick={handleSubmit} disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', border: 'none', borderRadius: 9, background: saving ? '#D4904E' : '#B1723C', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(177,114,60,0.25)' }}>
          <IcoSave /> {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {/* Tab nav */}
        <div style={{ display: 'flex', borderBottom: '1px solid #ECEEF2', background: '#F8FAFC' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ flex: 1, padding: '14px 16px', background: activeTab === tab.id ? '#fff' : 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #B1723C' : '2px solid transparent', color: activeTab === tab.id ? '#B1723C' : '#6B7280', fontWeight: activeTab === tab.id ? 700 : 500, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s' }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: '28px 28px' }}>
          {activeTab === 'general' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Company Info</div>
                <FormGroup label="Company Name"><input value={settings.company_name || ''} onChange={e => set('company_name', e.target.value)} /></FormGroup>
                <FormGroup label="Email Address"><input type="email" value={settings.contact_email || ''} onChange={e => set('contact_email', e.target.value)} /></FormGroup>
                <FormGroup label="Phone Number"><input value={settings.contact_phone || ''} onChange={e => set('contact_phone', e.target.value)} /></FormGroup>
                <FormGroup label="Address"><textarea value={settings.address || ''} onChange={e => set('address', e.target.value)} rows={3} /></FormGroup>
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Branding</div>
                <ImageUpload label="Main Logo" value={settings.logo_url} onChange={v => set('logo_url', v)} folder="uploads/settings" />
                <div style={{ marginTop: 24 }}>
                  <ImageUpload label="Footer Logo (White)" value={settings.logo_white_url} onChange={v => set('logo_white_url', v)} folder="uploads/settings" />
                </div>
              </div>
            </div>
          )}

          {/* Social Media tab — frontend-only, commented out
          {activeTab === 'social' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <SocialField label="Facebook URL" settingKey="social_facebook" value={settings.social_facebook} onChange={set} platform="facebook" />
                <SocialField label="Instagram URL" settingKey="social_instagram" value={settings.social_instagram} onChange={set} platform="instagram" />
                <SocialField label="LinkedIn URL" settingKey="social_linkedin" value={settings.social_linkedin} onChange={set} platform="linkedin" />
              </div>
              <div>
                <SocialField label="Twitter / X URL" settingKey="social_twitter" value={settings.social_twitter} onChange={set} platform="twitter" />
                <SocialField label="YouTube URL" settingKey="social_youtube" value={settings.social_youtube} onChange={set} platform="youtube" />
              </div>
            </div>
          )}
          */}

          {/* Footer & Banner tab — frontend-only, commented out
          {activeTab === 'footer' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              ...footer fields...
            </div>
          )}
          */}

          {activeTab === 'advanced' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Commerce</div>
                <FormGroup label="Hotline Text"><input value={settings.hotline_text || ''} onChange={e => set('hotline_text', e.target.value)} placeholder="To More Inquiry" /></FormGroup>
                <FormGroup label="Hotline Phone"><input value={settings.hotline_phone || ''} onChange={e => set('hotline_phone', e.target.value)} placeholder="+92 305 1309051" /></FormGroup>
                <FormGroup label="Tax Rate (%)"><input type="number" step="0.01" value={settings.tax_rate || ''} onChange={e => set('tax_rate', e.target.value)} placeholder="5" /></FormGroup>
                <FormGroup label="Default Currency">
                  <select value={settings.default_currency || '2'} onChange={e => set('default_currency', e.target.value)}>
                    <option value="1">PKR (Pakistani Rupee)</option>
                    <option value="2">SAR (Saudi Riyal)</option>
                  </select>
                </FormGroup>
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 16 }}>Integrations</div>
                <FormGroup label="Topbar Marketing Text"><input value={settings.topbar_marketing_text || ''} onChange={e => set('topbar_marketing_text', e.target.value)} placeholder="Your trusted partner for Hajj & Umrah journeys" /></FormGroup>
                <div className="admin-form-group">
                  <label>Tawk.to Chat Code</label>
                  <input value={settings.tawk_code || ''} onChange={e => set('tawk_code', e.target.value)} placeholder="https://embed.tawk.to/..." />
                  <div style={{ fontSize: 11.5, color: '#9CA3AF', marginTop: 5 }}>Paste the full Tawk.to embed URL</div>
                </div>
                <FormGroup label="Google reCAPTCHA Site Key"><input value={settings.recaptcha_key || ''} onChange={e => set('recaptcha_key', e.target.value)} /></FormGroup>
                <FormGroup label="Show Preloader">
                  <select value={settings.show_preloader || '0'} onChange={e => set('show_preloader', e.target.value)}>
                    <option value="0">Disabled</option>
                    <option value="1">Enabled</option>
                  </select>
                </FormGroup>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
