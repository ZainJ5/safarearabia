'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function ImageUpload({ value, onChange, label = 'Image', folder = 'uploads' }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const result = await res.json();

      if (result.success) {
        setPreview(result.url);
        onChange(result.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed: ' + (result.error || 'Unknown error'));
        setPreview(value || '');
      }
    } catch (err) {
      toast.error('Upload error: ' + err.message);
      setPreview(value || '');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="admin-form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', alignItems: 'start', gap: 16 }}>
        {preview && (
          <div style={{ position: 'relative' }}>
            <img src={preview} alt="Preview" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} />
            <button onClick={handleRemove} type="button" style={{
              position: 'absolute', top: -6, right: -6,
              width: 20, height: 20, borderRadius: '50%',
              background: '#dc3545', color: '#fff', border: 'none',
              fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>×</button>
          </div>
        )}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ fontSize: 13 }}
          />
          {uploading && <p style={{ fontSize: 12, color: 'var(--primary-color1)', margin: '6px 0 0' }}>Uploading...</p>}
        </div>
      </div>
    </div>
  );
}
