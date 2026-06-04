'use client';

export default function DynamicListInput({
  items,
  onChange,
  fields = [{ key: 'title', label: 'Title' }],
  label = 'Items',
  addLabel = 'Add Item',
}) {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const handleAdd = () => {
    const newItem = {};
    fields.forEach(f => { newItem[f.key] = ''; });
    onChange([...safeItems, newItem]);
  };

  const handleRemove = (index) => {
    onChange(safeItems.filter((_, i) => i !== index));
  };

  const handleChange = (index, key, value) => {
    const updated = [...safeItems];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {safeItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, alignItems: 'start',
            padding: 12, background: '#f8f9fa', borderRadius: 6, border: '1px solid #eee',
          }}>
            <span style={{ fontSize: 12, color: '#888', fontWeight: 600, minWidth: 24, paddingTop: 10 }}>
              #{i + 1}
            </span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fields.map((field) => (
                <div key={field.key}>
                  <label style={{ fontSize: 12, color: '#666', marginBottom: 2, display: 'block' }}>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={item[field.key] || ''}
                      onChange={(e) => handleChange(i, field.key, e.target.value)}
                      rows={2}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13, fontFamily: 'inherit', resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={item[field.key] || ''}
                      onChange={(e) => handleChange(i, field.key, e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              style={{
                background: '#ffebee', color: '#c62828', border: 'none',
                borderRadius: 4, padding: '6px 8px', cursor: 'pointer', fontSize: 14, marginTop: 20,
              }}
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6m4-6v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="admin-btn admin-btn-primary admin-btn-sm"
          style={{ alignSelf: 'flex-start' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg> {addLabel}
        </button>
      </div>
    </div>
  );
}
