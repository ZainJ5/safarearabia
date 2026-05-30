import Link from 'next/link';

export default function Breadcrumb({ title, currentPage }) {
  return (
    <div className="breadcrumb-area">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6 text-center text-md-start">
            <div className="breadcrumb-content">
              <h2>{title}</h2>
              <ul>
                <li><Link href="/">Home</Link></li>
                <li>{currentPage || title}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
