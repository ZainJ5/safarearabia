import Link from 'next/link';

/**
 * Reusable booking sidebar for all product detail pages.
 * Server component — renders price summary + Book Now button linking to /checkout/[type]/[id]
 */
export default function BookingSidebar({
  productId,
  productType,
  title,
  price,
  priceLabel = '',
  extraInfo = [],
  showCheckout = true,
}) {
  const checkoutUrl = `/checkout/${productType}/${productId}`;

  return (
    <div
      className="sidebar-widget"
      style={{
        border: '1px solid #e8e8e8',
        borderRadius: 12,
        padding: '28px 24px',
        position: 'sticky',
        top: 100,
        background: '#fff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}
    >
      {/* Price */}
      <div
        style={{
          background: 'var(--primary-color1, #B1723C)',
          borderRadius: 8,
          padding: '16px 20px',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        {price ? (
          <>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Starting from</span>
            <div style={{ color: '#fff', fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
              ${parseFloat(price).toLocaleString()}
            </div>
            {priceLabel && (
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>{priceLabel}</span>
            )}
          </>
        ) : (
          <span style={{ color: '#fff', fontSize: 16 }}>Contact for pricing</span>
        )}
      </div>

      {/* Extra info rows (e.g. visa processing time, validity) */}
      {extraInfo.length > 0 && (
        <ul className="list-unstyled mb-4" style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
          {extraInfo.map((item, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                fontSize: 14,
                borderBottom: i < extraInfo.length - 1 ? '1px dashed #f0f0f0' : 'none',
              }}
            >
              <span style={{ color: '#888' }}>{item.label}</span>
              <span style={{ fontWeight: 600, color: '#333' }}>{item.value}</span>
            </li>
          ))}
        </ul>
      )}

      {/* What's included note */}
      <ul className="list-unstyled mb-4" style={{ fontSize: 13, color: '#555' }}>
        <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--primary-color1)' }}></i>Instant confirmation</li>
        <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--primary-color1)' }}></i>Free cancellation (48h notice)</li>
        <li className="mb-2"><i className="bi bi-check-circle-fill me-2" style={{ color: 'var(--primary-color1)' }}></i>Secure payment</li>
      </ul>

      {/* CTA */}
      {showCheckout && (
        <Link
          href={checkoutUrl}
          className="primary-btn1"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            padding: '14px 20px',
            borderRadius: 8,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Book Now
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="14" viewBox="0 0 17 14" fill="none">
            <path d="M1 7H16M16 7L10.5 1.5M16 7L10.5 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      )}

      {/* Help line */}
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#888', marginBottom: 0 }}>
        Need help?{' '}
        <Link href="/contact" style={{ color: 'var(--primary-color1)', fontWeight: 500 }}>
          Contact us
        </Link>
      </p>
    </div>
  );
}
