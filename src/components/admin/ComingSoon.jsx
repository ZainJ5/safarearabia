import Link from 'next/link';

export default function ComingSoon({ title, description, backUrl = '/admin/dashboard', eta = 'Q1 2026' }) {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ maxWidth: 480, width: '100%' }}>

        {/* Status badge */}
        <div style={{ marginBottom: 28 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 6,
            background: '#F3F4F6', border: '1px solid #E5E7EB',
            fontSize: 11.5, fontWeight: 600, color: '#6B7280',
            textTransform: 'uppercase', letterSpacing: 0.8,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B1723C', display: 'inline-block' }} />
            Under Development
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 28, fontWeight: 700, color: '#111827',
          margin: '0 0 12px', letterSpacing: '-0.5px', lineHeight: 1.2,
        }}>
          {title}
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 15, color: '#6B7280', lineHeight: 1.65,
          margin: '0 0 32px', fontWeight: 400,
        }}>
          {description || 'This module is currently under development and will be available in a future release.'}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: '#F3F4F6', marginBottom: 28 }} />

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
              Status
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#B1723C' }}>Planned</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 4 }}>
              Priority
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>High</div>
          </div>
        </div>

        {/* CTA */}
        <Link href={backUrl} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '10px 20px',
          border: '1.5px solid #E5E7EB',
          borderRadius: 8,
          background: '#fff',
          color: '#374151',
          fontSize: 13.5, fontWeight: 600,
          textDecoration: 'none',
        }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
