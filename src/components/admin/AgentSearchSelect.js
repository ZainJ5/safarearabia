'use client';
import { useState, useRef, useEffect } from 'react';

/**
 * Searchable agent dropdown.
 * Props:
 *   agents        – array of { _id, fname, lname, custom_id }
 *   value         – currently selected agent_name string
 *   onChange      – fn(name, agentObj | undefined)
 *   disabled      – bool
 *   placeholder   – string
 *   style         – base input style object
 */
export default function AgentSearchSelect({ agents = [], value, onChange, disabled, placeholder = 'Select Agent', style = {} }) {
  const [query, setQuery]   = useState('');
  const [open, setOpen]     = useState(false);
  const containerRef        = useRef(null);

  // Sync display text with external value changes (e.g. after load)
  const [display, setDisplay] = useState(value || '');
  useEffect(() => { setDisplay(value || ''); }, [value]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = query.trim()
    ? agents.filter(a => {
        const name = `${a.fname || ''} ${a.lname || ''}`.trim().toLowerCase();
        const id   = (a.custom_id || '').toLowerCase();
        const q    = query.toLowerCase();
        return name.includes(q) || id.includes(q);
      })
    : agents;

  const select = (agent) => {
    const name = `${agent.fname || ''} ${agent.lname || ''}`.trim();
    setDisplay(name);
    setQuery('');
    setOpen(false);
    onChange(name, agent);
  };

  const clear = () => {
    setDisplay('');
    setQuery('');
    onChange('', undefined);
  };

  const inp = {
    width: '100%', padding: '10px 13px',
    border: '1px solid #D1D5DB', borderRadius: 6,
    fontSize: 14, fontFamily: 'inherit', background: '#fff',
    color: '#111827', outline: 'none', boxSizing: 'border-box',
    ...style,
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {/* Trigger input — shows selected name, cleared when typing to search */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={open ? query : (display || '')}
          readOnly={!open}
          placeholder={open ? 'Type to search...' : placeholder}
          disabled={disabled}
          onChange={e => { setQuery(e.target.value); }}
          onFocus={() => { setQuery(''); setOpen(true); }}
          onClick={() => { setQuery(''); setOpen(true); }}
          style={{ ...inp, paddingRight: 36, cursor: disabled ? 'not-allowed' : 'pointer', background: disabled ? '#F9FAFB' : '#fff' }}
        />
        {/* Chevron / clear icon */}
        {display && !open ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); clear(); }}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0, lineHeight: 1 }}
            title="Clear"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          </button>
        ) : (
          <span style={{ position: 'absolute', right: 10, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, pointerEvents: 'none', color: '#6B7280', transition: 'transform 0.15s' }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999,
          background: '#fff', border: '1px solid #D1D5DB', borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 2,
          maxHeight: 260, overflowY: 'auto',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '12px 14px', fontSize: 13, color: '#9CA3AF' }}>No agents found</div>
          ) : (
            filtered.map(a => {
              const name = `${a.fname || ''} ${a.lname || ''}`.trim();
              const isSelected = name === value;
              return (
                <div
                  key={a._id}
                  onMouseDown={() => select(a)}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', fontSize: 14,
                    background: isSelected ? '#FEF3EA' : '#fff',
                    color: isSelected ? '#B1723C' : '#111827',
                    fontWeight: isSelected ? 600 : 400,
                    borderBottom: '1px solid #F3F4F6',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#F9FAFB'; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff'; }}
                >
                  <span>{name}</span>
                  {a.custom_id && <span style={{ fontSize: 12, color: '#6B7280' }}>{a.custom_id}</span>}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
