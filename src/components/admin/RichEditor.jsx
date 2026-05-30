'use client';

import { useEffect, useRef } from 'react';

export default function RichEditor({ value, onChange, minHeight = 200 }) {
  const editorRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (editorRef.current && !initializedRef.current) {
      editorRef.current.innerHTML = value || '';
      initializedRef.current = true;
    }
  }, [value]);

  const exec = (cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
    onChange(editorRef.current?.innerHTML || '');
  };

  const toolbarBtn = (label, cmd, val = null, title = '') => (
    <button
      type="button"
      title={title || label}
      onMouseDown={(e) => { e.preventDefault(); exec(cmd, val); }}
      style={{
        padding: '3px 7px', border: '1px solid #ddd', borderRadius: 3,
        background: '#fff', cursor: 'pointer', fontSize: 13, lineHeight: 1.4,
        color: '#333', fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 6, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{
        background: '#f8f9fa', borderBottom: '1px solid #ddd',
        padding: '6px 10px', display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center',
      }}>
        <select
          onChange={(e) => exec('fontSize', e.target.value)}
          defaultValue="3"
          style={{ padding: '3px 6px', border: '1px solid #ddd', borderRadius: 3, fontSize: 13 }}
          title="Font Size"
        >
          {[1,2,3,4,5,6,7].map(s => <option key={s} value={s}>{[10,12,16,18,24,32,48][s-1]}</option>)}
        </select>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontWeight:'bold', fontSize:14 }} title="Bold">B</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontStyle:'italic', fontSize:14 }} title="Italic">I</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('underline'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', textDecoration:'underline', fontSize:14 }} title="Underline">U</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('strikeThrough'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', textDecoration:'line-through', fontSize:14 }} title="Strikethrough">S</button>
        <select
          onChange={(e) => exec('fontName', e.target.value)}
          defaultValue="sans-serif"
          style={{ padding: '3px 6px', border: '1px solid #ddd', borderRadius: 3, fontSize: 13 }}
          title="Font Family"
        >
          <option value="sans-serif">sans-serif</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
        </select>
        <input
          type="color"
          title="Text Color"
          onChange={(e) => exec('foreColor', e.target.value)}
          style={{ width: 28, height: 26, border: '1px solid #ddd', borderRadius: 3, padding: 1, cursor: 'pointer' }}
        />
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontSize:14 }} title="Bullet List">&#9679;</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontSize:14 }} title="Numbered List">1.</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('justifyLeft'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontSize:14 }} title="Align Left">&#8676;</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('justifyCenter'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontSize:14 }} title="Align Center">&#9643;</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('justifyRight'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontSize:14 }} title="Align Right">&#8677;</button>
        <div style={{ width: 1, height: 22, background: '#ddd', margin: '0 2px' }} />
        <button
          type="button"
          title="Insert Link"
          onMouseDown={(e) => {
            e.preventDefault();
            const url = prompt('Enter URL:');
            if (url) exec('createLink', url);
          }}
          style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontSize:14 }}
        >&#128279;</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('unlink'); }} style={{ padding:'3px 7px', border:'1px solid #ddd', borderRadius:3, background:'#fff', cursor:'pointer', fontSize:14 }} title="Remove Link">&#10007;</button>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        style={{
          minHeight,
          padding: '12px 14px',
          fontSize: 14,
          lineHeight: 1.7,
          color: '#333',
          outline: 'none',
          fontFamily: 'inherit',
        }}
        data-placeholder="Write here..."
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #aaa;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
