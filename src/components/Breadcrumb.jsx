import Link from 'next/link';

export default function Breadcrumb({ title, currentPage }) {
  return (
    <div className="breadcrumb-area">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <div className="breadcrumb-content">
              <h2>{title}</h2>
              <ul style={{ justifyContent: 'center' }}>
                <li><Link href="/">Home</Link></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>→</span>
                  {currentPage || title}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
