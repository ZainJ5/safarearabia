'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="egns-preloader"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 99999,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s ease',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Spinner */}
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(177,114,60,0.2)',
          borderTop: '4px solid var(--primary-color1, #B1723C)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 15px',
        }} />
        <p style={{
          color: 'var(--primary-color1, #B1723C)',
          fontFamily: 'var(--font-satisfy, Satisfy, cursive)',
          fontSize: '18px',
          margin: 0,
        }}>
          Safar e Arabian
        </p>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
