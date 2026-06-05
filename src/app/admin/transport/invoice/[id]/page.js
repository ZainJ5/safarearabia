'use client';
import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { defaultSettings } from '@/lib/defaultSettings';

const fmt2 = (n) => Number(n || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nowStr = () => new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
const todayDate = () => new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

const BCell = ({ children, bold, bg, w }) => (
  <td style={{ border: '1px solid #CBD5E1', padding: '7px 11px', fontSize: 11, fontWeight: bold ? 700 : 400, background: bg || '#fff', width: w, whiteSpace: 'nowrap', color: bold ? '#374151' : '#111827' }}>
    {children ?? ''}
  </td>
);

export default function TransportInvoiceDetailPage({ params }) {
  const { id } = use(params);
  const [inv, setInv]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/transport-invoices/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setInv(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (mode) => {
    if (downloading) return;
    const elId = mode === 'trn-inv' ? 'trn-inv-print' : 'trn-vch-print';
    const el   = document.getElementById(elId);
    if (!el) return;

    setDownloading(mode);
    const prevStyle = el.getAttribute('style') || '';
    el.setAttribute('style', 'display:block;position:fixed;left:-9999px;top:0;width:794px;background:#ffffff;padding:28px;box-sizing:border-box;font-family:Arial,sans-serif;color:#111;');

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF }   = await import('jspdf');

      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: '#ffffff', logging: false,
      });

      const pdf    = new jsPDF('p', 'mm', 'a4');
      const pdfW   = pdf.internal.pageSize.getWidth();
      const pdfH   = pdf.internal.pageSize.getHeight();
      const imgH   = (canvas.height * pdfW) / canvas.width;

      let y = 0;
      while (y < imgH) {
        if (y > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.93), 'JPEG', 0, -y, pdfW, imgH);
        y += pdfH;
      }

      const suffix = mode === 'trn-inv' ? 'Invoice' : 'Voucher';
      const refNo  = inv?.invoice_no || id.slice(-6);
      pdf.save(`Transport_${suffix}_T${refNo}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      el.setAttribute('style', prevStyle || 'display:none;');
      setDownloading(null);
    }
  };


  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#5B21B6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      Loading invoice...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!inv) return <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>Invoice not found.</div>;

  const logo     = defaultSettings.header_logo || '/assets/logo/newlogosafare-1750433259.png';
  const netBase  = Number(inv.total || 0) + Number(inv.transport || 0) - Number(inv.discount || 0);
  const vatAmt   = netBase * (Number(inv.vat || 0) / 100);

  return (
    <>
      {/* print areas are hidden on screen; printed via iframe in handlePrint */}
      <style>{`
        #trn-inv-print, #trn-vch-print { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Transport Invoice</h4>
          <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>
            Invoice No: <strong style={{ color: '#5B21B6' }}>T-{inv.invoice_no}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/admin/transport/invoice/${id}/edit`}
            style={{ padding: '9px 18px', background: '#EDE9FE', color: '#7C3AED', border: '1.5px solid #DDD6FE', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Edit Invoice
          </Link>
          <button onClick={() => handleDownload('trn-inv')} disabled={!!downloading}
            style={{ padding: '9px 18px', background: downloading === 'trn-inv' ? '#1D4ED8' : '#2563EB', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: downloading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: downloading && downloading !== 'trn-inv' ? 0.6 : 1 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {downloading === 'trn-inv' ? 'Generating...' : 'Invoice PDF'}
          </button>
          <button onClick={() => handleDownload('trn-vch')} disabled={!!downloading}
            style={{ padding: '9px 18px', background: downloading === 'trn-vch' ? '#047857' : '#059669', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: downloading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6, opacity: downloading && downloading !== 'trn-vch' ? 0.6 : 1 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {downloading === 'trn-vch' ? 'Generating...' : 'Voucher PDF'}
          </button>
          <Link href="/admin/transport/invoice"
            style={{ padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            Go Back
          </Link>
        </div>
      </div>

      {/* ── SCREEN DETAIL CARD ── */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', padding: '32px 36px', marginBottom: 24 }}>
        {/* Guest Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
          {[
            ['Agent Name', inv.agent_name], ['Agent No', inv.agent_no || '—'],
            ['Guest Name', inv.guest_name], ['Nationality', inv.nationality],
            ['Mobile No', inv.contact_number], ['Client Ref No', inv.client_ref_no],
            ['Group No', inv.group_no], ['Local Ref No', inv.local_refno],
            ['Reservation Date', inv.reservation_date], ['Payment Type', inv.payment_type],
            ['Username', inv.username], ['Reservation No', inv.reservation_no],
          ].map(([label, val]) => (
            <div key={label} style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{val || '—'}</div>
            </div>
          ))}
        </div>

        {/* Transport Details */}
        <div style={{ fontWeight: 800, fontSize: 13, color: '#0D1B2E', marginBottom: 10 }}>Transport Details</div>
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #E5E7EB' }}>
            <thead>
              <tr style={{ background: '#1E3A5F' }}>
                {['Date', 'Time', 'From', 'To', 'Vehicle', 'Mov.Type', 'Qty', 'Adults', 'Packs', 'Rate', 'Total'].map(h => (
                  <th key={h} style={{ padding: '10px 11px', color: '#fff', fontSize: 11, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {[inv.date, inv.time, inv.from_location, inv.to_location, inv.vehicle, inv.mov_type, inv.qty, inv.no_of_adults, inv.packs, fmt2(inv.rate), fmt2(inv.total)].map((v, i) => (
                  <td key={i} style={{ border: '1px solid #E5E7EB', padding: '9px 10px', fontSize: 12, textAlign: 'center' }}>{v ?? ''}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: 260 }}>
            <tbody>
              {[
                ['Transport Surcharge', fmt2(inv.transport)],
                ['Discount', fmt2(inv.discount)],
                ['Net Total', fmt2(netBase)],
                [`Vat (${Number(inv.vat||0).toFixed(2)}%)`, fmt2(vatAmt)],
                ['Net Total With Tax', fmt2(inv.net_total_with_tax)],
                ['Convert Rate Total: SAR', fmt2(inv.convert_rate_total_sar)],
              ].map(([label, val], i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #E5E7EB', padding: '9px 14px', fontWeight: i >= 4 ? 800 : 600, fontSize: 13, background: i >= 4 ? '#F8FAFC' : '#fff', color: '#374151' }}>{label}</td>
                  <td style={{ border: '1px solid #E5E7EB', padding: '9px 14px', textAlign: 'right', fontWeight: i >= 4 ? 800 : 600, fontSize: i >= 4 ? 15 : 13, color: i >= 4 ? '#059669' : '#111827', background: i >= 4 ? '#F8FAFC' : '#fff' }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ═══════════════════════════════════
          DEFINITIVE INVOICE PRINT (matches Transport_.pdf)
          ═══════════════════════════════════ */}
      <div id="trn-inv-print" style={{ fontFamily: 'Arial, sans-serif', color: '#111', background: '#fff' }}>
        {/* 3-column header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ fontSize: 11, lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700 }}>TO</div>
            <div>{inv.agent_name}</div>
            {inv.agent_no && <div style={{ color: '#6B7280' }}>Agent No: <strong>{inv.agent_no}</strong></div>}
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#2563EB', letterSpacing: 2 }}>Definitive</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 11, lineHeight: 1.6 }}>
            <div><strong>Reservation No:</strong> {inv.invoice_no}</div>
            <div><strong>VAT Reg No:</strong></div>
            <div><strong>Reservation Date:</strong> {inv.reservation_date}</div>
            <div><strong>Print Date:</strong> {todayDate()}</div>
            <div><strong>User Id:</strong> {inv.username}</div>
          </div>
        </div>
        <hr style={{ border: 'none', borderTop: '1.5px solid #CBD5E1', margin: '8px 0 10px' }} />

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>Greeting From : Safar e Arabian</div>
          <div style={{ fontSize: 10, color: '#555', marginTop: 4, lineHeight: 1.6 }}>
            Thank you for choosing Safar e Arabian, With reference to your request &apos;regarding transport reservation&apos;, we are pleased to confirm your request on Definitive basis with following details
          </div>
        </div>

        {/* Guest row */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
          <tbody>
            <tr>
              <td style={{ padding: '5px 12px', fontWeight: 700, fontSize: 11, width: '12%' }}>Guest Name</td>
              <td style={{ padding: '5px 12px', fontSize: 11, width: '38%', borderBottom: '1px solid #CBD5E1' }}>{inv.guest_name}</td>
              <td style={{ padding: '5px 12px', fontWeight: 700, fontSize: 11, width: '12%' }}>Nationality</td>
              <td style={{ padding: '5px 12px', fontSize: 11, width: '38%', borderBottom: '1px solid #CBD5E1' }}>{inv.nationality}</td>
            </tr>
          </tbody>
        </table>

        {/* Transport table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
          <thead>
            <tr style={{ background: '#1E3A5F' }}>
              {['Date', 'Time', 'From', 'To', 'Vehicle', 'Qty', 'Rate', 'Total'].map(h => (
                <th key={h} style={{ border: '1px solid #CBD5E1', padding: '7px 8px', color: '#fff', fontSize: 10, fontWeight: 700, textAlign: 'center' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {[inv.date, inv.time, inv.from_location, inv.to_location, inv.vehicle, inv.qty, fmt2(inv.rate), fmt2(inv.total)].map((v, i) => (
                <td key={i} style={{ border: '1px solid #CBD5E1', padding: '6px 8px', fontSize: 10, textAlign: 'center' }}>{v ?? ''}</td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Left / Right below table */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
          <div style={{ flex: 1, fontSize: 11, lineHeight: 1.8 }}>
            <div><strong>Payment Type:</strong> {inv.payment_type}</div>
            <div><strong>Special Requirements:</strong></div>
            <div style={{ paddingLeft: 8 }}>{inv.special_requirements}</div>
            <div><strong>Note:</strong></div>
            <div style={{ paddingLeft: 8 }}>{inv.notes}</div>
          </div>
          <table style={{ borderCollapse: 'collapse', minWidth: 240 }}>
            <tbody>
              {[
                ['Transport', fmt2(inv.transport)],
                ['Discount', fmt2(inv.discount)],
                ['Net Total', fmt2(netBase)],
                [`Vat ${Number(inv.vat||0).toFixed(2)}%`, fmt2(vatAmt)],
                ['Net Total With Tax', fmt2(inv.net_total_with_tax)],
                ['Convert Rate Total: SAR', fmt2(inv.convert_rate_total_sar)],
              ].map(([label, val], i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid #CBD5E1', padding: '5px 10px', fontWeight: i >= 2 ? 700 : 400, fontSize: 11, background: i >= 2 ? '#F8FAFC' : '#fff' }}>{label}</td>
                  <td style={{ border: '1px solid #CBD5E1', padding: '5px 10px', textAlign: 'right', fontWeight: 700, fontSize: 11, background: i >= 2 ? '#F8FAFC' : '#fff' }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bank details */}
        <table style={{ borderCollapse: 'collapse', width: '50%', marginBottom: 12 }}>
          <tbody>
            {[['Account Name', inv.account_name], ['Bank', inv.bank], ['Bank Account No', inv.bank_account_no], ['Bank Address', inv.bank_address], ['IBN', inv.ibn], ['Important Contact', inv.important_contact]].map(([l, v]) => (
              <tr key={l}>
                <td style={{ border: '1px solid #CBD5E1', padding: '5px 10px', fontWeight: 700, fontSize: 10, background: '#F8FAFC', width: '40%' }}>{l}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '5px 10px', fontSize: 10 }}>{v || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 6 }}>
          <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 10, margin: '0 0 2px' }}>Cancellation Policy: <span style={{ fontWeight: 400 }}>{inv.cancellation_policy}</span></p>
          <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 10, margin: 0 }}>No Show Policy: <span style={{ fontWeight: 400 }}>{inv.no_show_policy}</span></p>
        </div>
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid #CBD5E1', fontSize: 10, color: '#374151' }}>
          <div style={{ display: 'flex', gap: 28, marginBottom: 4 }}>
            <div><strong>ZAIN:</strong> +966 53 653 3827</div>
            <div><strong>ALI HAIDER:</strong> +966 51 158 8203</div>
          </div>
          <div><strong>Generated by:</strong> {inv.agent_name || '—'}{inv.agent_no ? ` (${inv.agent_no})` : ''}</div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          VOUCHER PRINT (matches Transport_(1).pdf)
          ═══════════════════════════════════ */}
      <div id="trn-vch-print" style={{ fontFamily: 'Arial, sans-serif', color: '#111', background: '#fff' }}>
        {/* Header: logo left, company info right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <img src={logo} alt="logo" style={{ height: 110, objectFit: 'contain' }} />
          <div style={{ textAlign: 'right', fontSize: 11, lineHeight: 1.7 }}>
            <strong style={{ fontSize: 12 }}>Safar e Arabian</strong><br />
            Print Date: {nowStr()}<br />
            Reserv No: <strong style={{ color: '#B1723C', fontSize: 13 }}>{inv.invoice_no}</strong>
          </div>
        </div>

        <h2 style={{ textAlign: 'center', color: '#B1723C', fontWeight: 900, fontSize: 22, margin: '0 0 14px', letterSpacing: 1 }}>Voucher</h2>

        {/* Guest table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', marginBottom: 14 }}>
          <tbody>
            {[
              ['Agent Name',   inv.agent_name,    'Agent No',    inv.agent_no || '—'],
              ['Guest Name',   inv.guest_name,    'Nationality', inv.nationality],
              ['Contact Name', inv.contact_name,  'Client Refno',inv.client_ref_no],
              ['Mobile No',    inv.contact_number,'Group No',    inv.group_no],
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontWeight: 700, fontSize: 11, background: '#F8FAFC', width: '18%' }}>{r[0]}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontSize: 11, width: '32%' }}>{r[1] ?? ''}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontWeight: 700, fontSize: 11, background: '#F8FAFC', width: '18%' }}>{r[2]}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontSize: 11, width: '32%' }}>{r[3] ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Transport Details */}
        <p style={{ fontWeight: 800, fontSize: 12, margin: '0 0 5px' }}>Transport Details</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', marginBottom: 16 }}>
          <thead>
            <tr style={{ background: '#F1F5F9' }}>
              {['Date', 'From', 'To', 'Mov.Type', 'Vehicle', 'Qty', 'Adult', 'Packs'].map(h => (
                <th key={h} style={{ border: '1px solid #CBD5E1', padding: '6px 8px', fontSize: 10, fontWeight: 700, textAlign: 'center', color: '#374151' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {[
                inv.date && inv.time ? `${inv.date} ${inv.time}` : (inv.date || ''),
                inv.from_location, inv.to_location, inv.mov_type, inv.vehicle, inv.qty, inv.no_of_adults, inv.packs
              ].map((v, i) => (
                <td key={i} style={{ border: '1px solid #CBD5E1', padding: '6px 8px', fontSize: 10, textAlign: 'center' }}>{v ?? ''}</td>
              ))}
            </tr>
          </tbody>
        </table>

        <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 11, margin: '0 0 3px' }}>Cancellation Policy :</p>
        <p style={{ color: '#333', fontSize: 11, margin: '0 0 12px' }}>{inv.cancellation_policy}</p>
        <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 11, margin: '0 0 3px' }}>No Show Policy :</p>
        <p style={{ color: '#333', fontSize: 11, margin: '0 0 0' }}>{inv.no_show_policy}</p>
        <div style={{ marginTop: 14, paddingTop: 8, borderTop: '1px solid #E5E7EB', fontSize: 11, color: '#374151' }}>
          <div style={{ display: 'flex', gap: 28, marginBottom: 4 }}>
            <div><strong>ZAIN:</strong> +966 53 653 3827</div>
            <div><strong>ALI HAIDER:</strong> +966 51 158 8203</div>
          </div>
          <div><strong>Generated by:</strong> {inv.agent_name || '—'}{inv.agent_no ? ` (${inv.agent_no})` : ''}</div>
        </div>
      </div>
    </>
  );
}
