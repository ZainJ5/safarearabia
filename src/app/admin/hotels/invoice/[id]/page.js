'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { defaultSettings } from '@/lib/defaultSettings';

const fmt2 = (n) => Number(n || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nowStr = () => new Date().toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

/* ─── Reusable bordered cell ─── */
const TC = ({ children, label, w, center, bg }) => (
  <td style={{
    border: '1px solid #CBD5E1', padding: '7px 11px', fontSize: 12,
    fontWeight: label ? 700 : 400,
    background: label ? (bg || '#F8FAFC') : '#fff',
    textAlign: center ? 'center' : 'left',
    width: w, whiteSpace: 'nowrap',
    color: label ? '#374151' : '#111827',
  }}>{children ?? ''}</td>
);

export default function HotelInvoiceDetailPage({ params }) {
  const { id } = use(params);
  const [inv, setInv]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/hotel-invoices/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setInv(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = (mode) => {
    const elId = mode === 'invoice' ? 'inv-print' : 'vch-print';
    const el   = document.getElementById(elId);
    if (!el) return;

    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:absolute;width:0;height:0;top:-9999px;left:-9999px;border:none;';
    document.body.appendChild(frame);

    const doc = frame.contentDocument;
    doc.open();
    doc.write(
      '<!DOCTYPE html><html><head>' +
      '<base href="' + window.location.origin + '">' +
      '<style>' +
      '*,*::before,*::after{box-sizing:border-box;}' +
      'body{font-family:Arial,sans-serif;padding:12mm;margin:0;background:#fff;color:#111;-webkit-print-color-adjust:exact;print-color-adjust:exact;}' +
      '@page{size:A4;margin:0;}' +
      'table{border-collapse:collapse;}img{max-width:100%;height:auto;}' +
      'p{margin:0 0 4px;}hr{border:none;border-top:1.5px solid #CBD5E1;margin:8px 0 10px;}' +
      '</style></head><body>' + el.innerHTML + '</body></html>'
    );
    doc.close();

    setTimeout(() => {
      frame.contentWindow.print();
      setTimeout(() => frame.parentNode && frame.parentNode.removeChild(frame), 1000);
    }, 250);
  };

  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      Loading invoice...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!inv) return <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>Invoice not found.</div>;

  const hotelTotal = Number(inv.room_amount || 0);
  const logo = defaultSettings.header_logo || '/assets/logo/newlogosafare-1750433259.png';
  const phone = defaultSettings.hotline_phone;
  const email = defaultSettings.email_address;

  /* ─── Table header: screen keeps Category, print PDF does not ─── */
  const HotelTableHead = ({ forVoucher, forPrint }) => (
    <tr>
      {(forVoucher
        ? ['Hotel', 'Room Type', 'Check-In', 'Check-Out', '#Night', '#Room', 'Adult', 'Child', 'Meals', 'Conf No']
        : forPrint
          ? ['Hotel', 'Room Type', 'Check-In', 'Check-Out', '#Night', '#Room', 'Adult', 'Child', 'Meals', 'DayRate', 'Ml.SRate']
          : ['Hotel', 'Category', 'Room Type', 'Check-In', 'Check-Out', '#Night', '#Room', 'Adult', 'Child', 'Meals', 'DayRate', 'Ml.SRate']
      ).map(h => (
        <th key={h} style={{ border: '1px solid #CBD5E1', padding: '7px 9px', fontSize: 11, fontWeight: 700, textAlign: 'center', background: '#E5E7EB', color: '#374151' }}>{h}</th>
      ))}
    </tr>
  );

  const HotelTableRow = ({ forVoucher, forPrint, inv: v }) => (
    <tr>
      {(forVoucher
        ? [v.hotel_name, v.room_type, v.check_in, v.check_out, v.no_of_nights, v.no_of_rooms, v.no_of_adults, v.no_of_children, v.meals, v.conformation_no]
        : forPrint
          ? [v.hotel_name, v.room_type, v.check_in, v.check_out, v.no_of_nights, v.no_of_rooms, v.no_of_adults, v.no_of_children, v.meals, fmt2(v.day_rate), fmt2(v.ml_srate)]
          : [v.hotel_name, v.city, v.room_type, v.check_in, v.check_out, v.no_of_nights, v.no_of_rooms, v.no_of_adults, v.no_of_children, v.meals, fmt2(v.day_rate), fmt2(v.ml_srate)]
      ).map((val, i) => (
        <td key={i} style={{ border: '1px solid #CBD5E1', padding: '7px 9px', fontSize: 11, textAlign: 'center' }}>{val ?? ''}</td>
      ))}
    </tr>
  );

  return (
    <>
      {/* print areas are hidden on screen; printed via iframe in handlePrint */}
      <style>{`#inv-print, #vch-print { display: none; }`}</style>

      {/* ─── SCREEN: Page header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Invoice Details</h4>
          <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>Reserve No: <strong style={{ color: '#B1723C' }}>#{inv.reserve_no}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/admin/hotels/invoice/${id}/edit`}
            style={{ padding: '9px 18px', background: '#EDE9FE', color: '#7C3AED', border: '1.5px solid #DDD6FE', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Edit Invoice
          </Link>
          <Link href={`/admin/hotels/invoice/create`}
            style={{ padding: '9px 18px', background: '#F9FAFB', color: '#374151', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            New Invoice
          </Link>
          <Link href="/admin/hotels/invoice"
            style={{ padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
            Go Back
          </Link>
        </div>
      </div>

      {/* ─── SCREEN: Invoice card (mirrors invoice print layout) ─── */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 30px rgba(0,0,0,0.08)', padding: '36px 40px', marginBottom: 24 }}>

        {/* Company header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #F3F4F6' }}>
          <img src={logo} alt="Safar e Arabian" style={{ height: 64, objectFit: 'contain', maxWidth: 220 }} onError={e => { e.target.style.display = 'none'; }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#B1723C', lineHeight: 1.1 }}>Safar e Arabian</div>
            <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6, lineHeight: 1.8 }}>
              Telephone : {phone}<br />
              Email : {email}<br />
              VAT Reg No:<br />
              Print Date : {nowStr()}
            </div>
          </div>
        </div>

        {/* Confirmed Performa Invoice banner */}
        <div style={{ background: '#065F46', color: '#fff', textAlign: 'center', padding: '9px 0', fontWeight: 700, fontSize: 14, letterSpacing: 0.5, borderRadius: 4, marginBottom: 0 }}>
          Confirmed Performa Invoice
        </div>

        {/* Reservation info table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', marginBottom: 24 }}>
          <tbody>
            {[
              ['Reservation No', inv.reserve_no, 'Option Date', inv.option_date],
              ['Agent Name',     inv.agent_name,  'Agent No',    inv.agent_no || '—'],
              ['Guest Name',     inv.guest_name,  'VAT Number',  inv.vat_number],
              ['Client Ref No',  inv.client_ref_no,'Nationality', inv.nationality],
            ].map((r, i) => (
              <tr key={i}>
                <TC label w="18%">{r[0]}</TC><TC w="32%">{r[1]}</TC>
                <TC label w="18%">{r[2]}</TC><TC w="32%">{r[3]}</TC>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Hotel details section */}
        <div style={{ background: '#374151', color: '#fff', padding: '9px 0', textAlign: 'center', fontWeight: 700, fontSize: 13, borderRadius: '4px 4px 0 0' }}>
          {inv.city || 'Hotel'} Hotel Details
        </div>
        <div style={{ overflowX: 'auto', marginBottom: 28 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1' }}>
            <thead><HotelTableHead /></thead>
            <tbody><HotelTableRow inv={inv} /></tbody>
          </table>
        </div>

        {/* Bank details + Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 36 }}>
          {/* Left: bank + policies */}
          <div>
            <table style={{ fontSize: 13, lineHeight: 2, marginBottom: 16 }}>
              <tbody>
                {[
                  ['Account Name', inv.account_name],
                  ['Bank',         inv.bank],
                  ['Bank Account No', inv.bank_account_no],
                  ['Bank Address', inv.bank_address],
                  ['IBN',          inv.ibn],
                ].map(([lbl, val]) => (
                  <tr key={lbl}>
                    <td style={{ fontWeight: 700, paddingRight: 18, color: '#374151', whiteSpace: 'nowrap', fontSize: 13 }}>{lbl}</td>
                    <td style={{ color: '#111827', fontSize: 13 }}>{val || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {inv.important_contact && (
              <div style={{ marginBottom: 12 }}>
                <a href="#" style={{ color: '#2563EB', fontWeight: 700, fontSize: 13 }}>Important Contact</a>
                <div style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>{inv.important_contact}</div>
              </div>
            )}
            <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 500, marginBottom: 4 }}>
              <strong>Cancellation Policy :</strong>{' '}{inv.cancellation_policy}
            </div>
            <div style={{ fontSize: 13, color: '#DC2626', fontWeight: 500 }}>
              <strong>No Show Policy :</strong>{' '}{inv.no_show_policy}
            </div>
          </div>

          {/* Right: amount summary */}
          <div style={{ alignSelf: 'flex-start' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #CBD5E1', padding: '10px 14px', fontWeight: 600, fontSize: 13, color: '#374151' }}>Hotel</td>
                  <td style={{ border: '1px solid #CBD5E1', padding: '10px 14px', textAlign: 'right', fontWeight: 600, fontSize: 13 }}>{fmt2(hotelTotal)}</td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #CBD5E1', padding: '10px 14px', fontWeight: 700, fontSize: 13, background: '#F8FAFC' }}>Sub Total</td>
                  <td style={{ border: '1px solid #CBD5E1', padding: '10px 14px', textAlign: 'right', fontWeight: 800, fontSize: 15, color: '#059669', background: '#F8FAFC' }}>{fmt2(hotelTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Print buttons ─── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}>
        <button onClick={() => handlePrint('invoice')}
          style={{ padding: '13px 44px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Hotel Invoice
        </button>
        <button onClick={() => handlePrint('voucher')}
          style={{ padding: '13px 44px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(37,99,235,0.3)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Hotel Voucher
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          INVOICE PRINT AREA  (hidden on screen, A4 on print)
          ═══════════════════════════════════════════════════════ */}
      <div id="inv-print" style={{ fontFamily: 'Arial, sans-serif', color: '#111', background: '#fff' }}>
        {/* Header — logo left, company + invoice no right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <img src={logo} alt="logo" style={{ height: 60, objectFit: 'contain' }} />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#B1723C', marginBottom: 4 }}>Safar e Arabian</div>
            <div style={{ fontSize: 11, color: '#333', lineHeight: 1.7 }}>
              <strong>Telephone :</strong> {phone}<br />
              <strong>Email :</strong> {email}<br />
              <strong>VAT Reg No :</strong><br />
              <strong>Invoice No :</strong> {inv.reserve_no}
            </div>
          </div>
        </div>

        {/* Confirmed Performa Invoice table (row 1 = header banner) */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', marginBottom: 0 }}>
          <thead>
            <tr>
              <td colSpan={4} style={{ border: '1px solid #CBD5E1', padding: '6px 0', textAlign: 'center', fontWeight: 700, fontSize: 12, color: '#2563EB', background: '#fff' }}>
                Confirmed Performa Invoice
              </td>
            </tr>
          </thead>
          <tbody>
            {[
              ['Reservation No', inv.reserve_no,  'Option Date',  inv.option_date],
              ['Agent Name',     inv.agent_name,  'Agent No',     inv.agent_no || '—'],
              ['Guest Name',     inv.guest_name,  'VAT Number',   inv.vat_number],
              ['Client Ref No',  inv.client_ref_no,'Nationality', inv.nationality],
              ['Print Date',     nowStr(),         '',             ''],
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontSize: 11, fontWeight: 700, background: '#F8FAFC', width: '18%' }}>{r[0]}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontSize: 11, width: '32%' }}>{r[1] ?? ''}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontSize: 11, fontWeight: 700, background: '#F8FAFC', width: '18%' }}>{r[2]}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '6px 10px', fontSize: 11, width: '32%' }}>{r[3] ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Hotel Details */}
        <div style={{ background: '#4B5563', color: '#fff', padding: '6px 0', textAlign: 'center', fontWeight: 700, fontSize: 12, marginTop: 14 }}>
          {inv.city || 'Hotel'} Hotel Details
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', marginBottom: 14 }}>
          <thead><HotelTableHead forPrint /></thead>
          <tbody><HotelTableRow inv={inv} forPrint /></tbody>
        </table>

        {/* Bank + summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <table style={{ fontSize: 11, lineHeight: 1.9 }}>
              <tbody>
                {[['Account Name', inv.account_name], ['Bank', inv.bank], ['Bank Account No', inv.bank_account_no], ['Bank Address', inv.bank_address || ''], ['IBN', inv.ibn]].map(([l, v]) => (
                  <tr key={l}><td style={{ fontWeight: 700, paddingRight: 14, color: '#374151', whiteSpace: 'nowrap' }}>{l}</td><td>{v || ''}</td></tr>
                ))}
              </tbody>
            </table>
            {inv.important_contact && (
              <p style={{ margin: '8px 0 3px', fontSize: 11 }}>
                <strong>Important Contact:</strong> {inv.important_contact}
              </p>
            )}
            <div style={{ marginTop: 10 }}>
              <p style={{ color: '#DC2626', fontSize: 11, margin: '0 0 2px' }}><strong>Cancellation Policy :</strong> {inv.cancellation_policy}</p>
              <p style={{ color: '#DC2626', fontSize: 11, margin: 0 }}><strong>No Show Policy :</strong> {inv.no_show_policy}</p>
            </div>
          </div>
          <table style={{ borderCollapse: 'collapse', minWidth: 200, flexShrink: 0 }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #CBD5E1', padding: '8px 14px', fontWeight: 600, fontSize: 12 }}>Hotel</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '8px 14px', textAlign: 'right', fontSize: 12 }}>{fmt2(hotelTotal)}</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #CBD5E1', padding: '8px 14px', fontWeight: 700, fontSize: 12 }}>Sub Total</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '8px 14px', textAlign: 'right', fontWeight: 800, fontSize: 13 }}>{fmt2(hotelTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, paddingTop: 8, borderTop: '1px solid #E5E7EB', fontSize: 11, color: '#374151' }}>
          <strong>Generated by:</strong> {inv.agent_name || '—'}{inv.agent_no ? ` (${inv.agent_no})` : ''}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          VOUCHER PRINT AREA  (hidden on screen, A4 on print)
          ═══════════════════════════════════════════════════════ */}
      <div id="vch-print" style={{ fontFamily: 'Arial, sans-serif', color: '#111', background: '#fff' }}>
        {/* Header: logo left, company info right */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <img src={logo} alt="logo" style={{ height: 52, objectFit: 'contain' }} />
          <div style={{ textAlign: 'right', fontSize: 11, lineHeight: 1.8 }}>
            <strong style={{ fontSize: 13 }}>Safar e Arabian</strong><br />
            Print Date: {nowStr()}<br />
            Reserv No: <strong style={{ color: '#B1723C', fontSize: 13 }}>{inv.reserve_no}</strong>
          </div>
        </div>

        <h2 style={{ textAlign: 'center', color: '#B1723C', fontWeight: 800, fontSize: 22, margin: '0 0 16px', letterSpacing: 1 }}>Voucher</h2>

        {/* Guest info table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', marginBottom: 16 }}>
          <tbody>
            {[
              ['Agent Name',   inv.agent_name,   'Agent No',    inv.agent_no || '—'],
              ['Guest Name',   inv.guest_name,   'Nationality', inv.nationality],
              ['Contact Name', inv.contact_name, 'Client Refno',inv.client_ref_no],
              ['Mobile No',    inv.mobile_no,    'Group No',    inv.group_no],
            ].map((r, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #CBD5E1', padding: '7px 11px', fontSize: 11, fontWeight: 700, background: '#F8FAFC', width: '18%' }}>{r[0]}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '7px 11px', fontSize: 11, width: '32%' }}>{r[1] ?? ''}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '7px 11px', fontSize: 11, fontWeight: 700, background: '#F8FAFC', width: '18%' }}>{r[2]}</td>
                <td style={{ border: '1px solid #CBD5E1', padding: '7px 11px', fontSize: 11, width: '32%' }}>{r[3] ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Hotel Details */}
        <p style={{ fontWeight: 800, fontSize: 12, margin: '0 0 4px' }}>Hotel Details</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #CBD5E1', marginBottom: 18 }}>
          <thead><HotelTableHead forVoucher /></thead>
          <tbody><HotelTableRow inv={inv} forVoucher /></tbody>
        </table>

        <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 11, margin: '0 0 3px' }}>Cancellation Policy :</p>
        <p style={{ color: '#333', fontSize: 11, margin: '0 0 12px' }}>{inv.cancellation_policy}</p>
        <p style={{ color: '#DC2626', fontWeight: 700, fontSize: 11, margin: '0 0 3px' }}>No Show Policy :</p>
        <p style={{ color: '#333', fontSize: 11, margin: '0 0 0' }}>{inv.no_show_policy}</p>
        <p style={{ fontSize: 11, color: '#374151', margin: '14px 0 0', paddingTop: 8, borderTop: '1px solid #E5E7EB' }}>
          <strong>Generated by:</strong> {inv.agent_name || '—'}{inv.agent_no ? ` (${inv.agent_no})` : ''}
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
