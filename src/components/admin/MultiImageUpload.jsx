'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function MultiImageUpload({ value = [], onChange, label = 'Image Gallery', folder = 'uploads' }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);

    const uploaded = [];
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        const result = await res.json();
        if (result.success) {
          uploaded.push(result.url);
        } else {
          toast.error('Upload failed: ' + (result.error || 'Unknown'));
        }
      } catch (err) {
        toast.error('Upload error: ' + err.message);
      }
    }

    if (uploaded.length) {
      onChange([...value, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleRemove = (idx) => {
    const updated = value.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <div
        onClick={() => fileRef.current?.click()}
        style={{
          border: '2px dashed #c8e6c9',
          borderRadius: 8,
          padding: '30px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: '#f9fffe',
          marginBottom: 12,
          transition: '0.2s',
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const dt = e.dataTransfer;
          if (dt.files.length) handleUpload({ target: { files: dt.files } });
        }}
      >
        <i className="bi bi-images" style={{ fontSize: 28, color: '#888', display: 'block', marginBottom: 8 }} />
        <p style={{ margin: 0, color: '#888', fontSize: 13 }}>
          {uploading ? 'Uploading...' : 'Choose image files or drag it here'}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
      </div>

      {value.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {value.map((img, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <img
                src={img}
                alt={`Gallery ${idx + 1}`}
                style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }}
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#dc3545', color: '#fff', border: 'none',
                  fontSize: 10, cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
