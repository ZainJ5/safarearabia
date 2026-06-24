'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * Nationality dropdown for hotel invoices.
 * Shows the fixed built-in list plus any staff-added nationalities (shared via
 * the database), and lets staff add a new one inline that is then saved and
 * shown in the dropdown for everyone going forward.
 *
 * Props:
 *   value     – currently selected nationality string
 *   onChange  – fn(value)
 *   style     – base input/select style object
 *   disabled  – bool
 */
const FIXED_NATIONALITIES = [
  'Pakistani', 'Saudi Arabian', 'Indian', 'Bangladeshi', 'Egyptian',
  'Indonesian', 'Malaysian', 'Turkish', 'Jordanian', 'Emirati',
  'British', 'American', 'Australian', 'Filipino', 'Moroccan', 'Nigerian', 'Other',
];

const ADD_NEW = '__add_new__';

export default function NationalitySelect({ value, onChange, style = {}, disabled = false }) {
  const [custom, setCustom] = useState([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft]   = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/hotel-nationalities')
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (active && d?.success && Array.isArray(d.data)) setCustom(d.data); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Merge fixed + custom (deduped, case-insensitive), keep 'Other' last, and
  // always include the current value so the select can display it.
  const options = (() => {
    const seen = new Set();
    const out = [];
    const push = (n) => {
      const name = (n || '').trim();
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return;
      seen.add(key);
      out.push(name);
    };
    FIXED_NATIONALITIES.filter(n => n !== 'Other').forEach(push);
    custom.forEach(push);
    if (value) push(value);
    push('Other');
    return out;
  })();

  const inp = {
    width: '100%', padding: '10px 13px',
    border: '1px solid #D1D5DB', borderRadius: 6,
    fontSize: 14, fontFamily: 'inherit', background: '#fff',
    color: '#111827', outline: 'none', boxSizing: 'border-box',
    ...style,
  };

  const handleAdd = async () => {
    const name = draft.trim();
    if (!name) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hotel-nationalities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationality: name }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Failed to add nationality');
      if (Array.isArray(data.data)) setCustom(data.data);
      // Echo the canonical casing the server stored, if present.
      const stored = Array.isArray(data.data)
        ? (data.data.find(n => n.toLowerCase() === name.toLowerCase()) || name)
        : name;
      onChange(stored);
      setAdding(false);
      setDraft('');
      toast.success('Nationality added');
    } catch (err) {
      toast.error(err.message || 'Failed to add nationality');
    } finally {
      setSaving(false);
    }
  };

  if (adding) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') { e.preventDefault(); handleAdd(); }
            if (e.key === 'Escape') { setAdding(false); setDraft(''); }
          }}
          placeholder="Type new nationality"
          disabled={saving}
          style={{ ...inp, flex: 1 }}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={saving || !draft.trim()}
          style={{ padding: '0 14px', borderRadius: 6, border: 'none', background: '#B1723C', color: '#fff', fontWeight: 600, cursor: saving || !draft.trim() ? 'default' : 'pointer', whiteSpace: 'nowrap', opacity: saving || !draft.trim() ? 0.6 : 1 }}
        >
          {saving ? 'Adding…' : 'Add'}
        </button>
        <button
          type="button"
          onClick={() => { setAdding(false); setDraft(''); }}
          disabled={saving}
          style={{ padding: '0 12px', borderRadius: 6, border: '1px solid #D1D5DB', background: '#fff', color: '#374151', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <select
      value={value || ''}
      disabled={disabled}
      onChange={e => {
        if (e.target.value === ADD_NEW) { setAdding(true); return; }
        onChange(e.target.value);
      }}
      style={inp}
    >
      <option value="">Select Option</option>
      {options.map(n => <option key={n} value={n}>{n}</option>)}
      <option value={ADD_NEW}>➕ Add new nationality…</option>
    </select>
  );
}
