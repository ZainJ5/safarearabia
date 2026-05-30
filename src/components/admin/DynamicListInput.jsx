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
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="admin-btn admin-btn-primary admin-btn-sm"
          style={{ alignSelf: 'flex-start' }}
        >
          <i className="bi bi-plus-lg"></i> {addLabel}
        </button>
      </div>
    </div>
  );
}
