'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { defaultSettings } from '@/lib/defaultSettings';
import {
  G, EM, fmt2, fmtDate, BROWN,
  PageBox, BrandHeader, Divider, InfoCard, InfoCardRow, DetailsTitle, ThemeTable,
  BankList, SummaryCard, BankSummaryRow, Policies, DocFooter, downloadDoc,
} from '@/components/admin/invoiceTheme';

const phoneNum = defaultSettings.hotline_phone;
const emailAddr = defaultSettings.email_address;
const website = (emailAddr && emailAddr.includes('@')) ? emailAddr.split('@')[1] : 'safararabiantravel.com';

const HOTEL_COLS = [
  { label: 'HOTEL', icon: G.building }, { label: 'ROOM TYPE', icon: G.bed },
  { label: 'CHECK-IN', icon: G.calendar }, { label: 'CHECK-OUT', icon: G.calendar },
  { label: 'NIGHTS', icon: G.moon }, { label: 'ROOMS', icon: G.door },
  { label: 'GUESTS', icon: G.guests }, { label: 'MEAL PLAN', icon: G.meal },
];

const hotelRow = (r, lastCell) => {
  const ci = fmtDate(r.check_in), co = fmtDate(r.check_out);
  return [
    { emblem: true, top: r.hotel_name || '' },
    r.room_type || '',
    { top: ci.main, bottom: ci.wd },
    { top: co.main, bottom: co.wd },
    r.no_of_nights || 0,
    r.no_of_rooms || 0,
    { top: `${Number(r.no_of_adults || 0)} Adult`, bottom: `${Number(r.no_of_children || 0)} Child` },
    r.meals || '',
    lastCell(r),
  ];
};

/* ─── Hotel Invoice document ─── */
function InvoiceDoc({ inv, rooms, hotelTotal }) {
  const roomsByCity = rooms.reduce((acc, r) => {
    const city = (r.city || inv.city || '').trim().toUpperCase();
    if (!acc[city]) acc[city] = [];
    acc[city].push(r);
    return acc;
  }, {});
  const cityKeys = Object.keys(roomsByCity);

  return (
    <PageBox>
      <BrandHeader title="INVOICE"
        metaA={{ label: 'INVOICE NO.', value: inv.invoice_no || inv.reserve_no }}
        metaB={{ label: 'INVOICE DATE', value: fmtDate(new Date()).main }}
        phone={phoneNum} email={emailAddr} website={website} />
      <Divider />
      <InfoCardRow>
        <InfoCard icon={G.calendar} title="BOOKING INFORMATION" rows={[
          { icon: G.hash, label: 'Reservation No', value: inv.reserve_no },
          { icon: G.user, label: 'Agent Name', value: inv.agent_name },
          { icon: G.badge, label: 'Agent No', value: inv.agent_no },
          { icon: G.calendar, label: 'Option Date', value: inv.option_date },
          { icon: G.check, label: 'Invoice Status', value: 'Confirmed', valueColor: EM },
        ]} />
        <InfoCard icon={G.user} title="GUEST INFORMATION" rows={[
          { icon: G.user, label: 'Guest Name', value: inv.guest_name },
          { icon: G.globe, label: 'Nationality', value: inv.nationality },
          { icon: G.hash, label: 'Client Ref No', value: inv.client_ref_no },
          { icon: G.badge, label: 'VAT Number', value: inv.vat_number },
        ]} />
      </InfoCardRow>
      {cityKeys.map((city, idx) => (
        <div key={idx}>
          <DetailsTitle icon={G.building}>{city ? `${city} ` : ''}Hotel Details</DetailsTitle>
          <ThemeTable
            columns={[...HOTEL_COLS, { label: 'AMOUNT (SAR)', icon: G.money }]}
            rows={roomsByCity[city].map((r) => hotelRow(r, (x) => ({ strong: true, value: fmt2(x.room_amount) })))} />
        </div>
      ))}
      <BankSummaryRow
        left={<BankList
          rows={[
            { icon: G.bank, label: 'Account Name', value: inv.account_name },
            { icon: G.bank, label: 'Bank', value: inv.bank },
            { icon: G.card, label: 'Bank Account No', value: inv.bank_account_no },
            { icon: G.iban, label: 'IBAN', value: inv.ibn },
            { icon: G.pin, label: 'Bank Address', value: inv.bank_address },
          ]}
          extra={inv.important_contact ? <div style={{ fontSize: 11, marginTop: 6 }}><strong style={{ color: BROWN }}>Important Contact:</strong> {inv.important_contact}</div> : null} />}
        right={<SummaryCard
          lines={[{ label: 'Subtotal', value: `SAR ${fmt2(hotelTotal)}` }, { label: 'VAT (0%)', value: 'SAR 0.00' }]}
          total={{ label: 'TOTAL', pre: 'SAR', value: fmt2(hotelTotal) }} />} />
      <Policies inv={inv} />
      <DocFooter inv={inv} />
    </PageBox>
  );
}

/* ─── Hotel Voucher document (same theme, voucher fields) ─── */
function VoucherDoc({ inv, rooms }) {
  const roomsByCity = rooms.reduce((acc, r) => {
    const city = (r.city || inv.city || '').trim().toUpperCase();
    if (!acc[city]) acc[city] = [];
    acc[city].push(r);
    return acc;
  }, {});
  const cityKeys = Object.keys(roomsByCity);

  return (
    <PageBox>
      <BrandHeader title="VOUCHER"
        metaA={{ label: 'RESERVE NO.', value: inv.reserve_no }}
        metaB={{ label: 'PRINT DATE', value: fmtDate(new Date()).main }}
        phone={phoneNum} email={emailAddr} website={website} />
      <Divider />
      <InfoCardRow>
        <InfoCard icon={G.calendar} title="BOOKING INFORMATION" rows={[
          { icon: G.user, label: 'Agent Name', value: inv.agent_name },
          { icon: G.badge, label: 'Agent No', value: inv.agent_no },
          { icon: G.hash, label: 'Client Ref No', value: inv.client_ref_no },
          { icon: G.hash, label: 'Group No', value: inv.group_no },
        ]} />
        <InfoCard icon={G.user} title="GUEST INFORMATION" rows={[
          { icon: G.user, label: 'Guest Name', value: inv.guest_name },
          { icon: G.globe, label: 'Nationality', value: inv.nationality },
          { icon: G.user, label: 'Contact Name', value: inv.contact_name },
          { icon: G.phone, label: 'Mobile No', value: inv.mobile_no },
        ]} />
      </InfoCardRow>
      {cityKeys.map((city, idx) => (
        <div key={idx}>
          <DetailsTitle icon={G.building}>{city ? `${city} ` : ''}Hotel Details</DetailsTitle>
          <ThemeTable
            columns={[...HOTEL_COLS, { label: 'CONF NO', icon: G.badge }]}
            rows={roomsByCity[city].map((r) => hotelRow(r, (x) => x.conformation_no || ''))} />
        </div>
      ))}
      <Policies inv={inv} />
      <DocFooter inv={inv} contacts={[{ label: 'ZAIN', value: '+966 53 653 3827' }, { label: 'ALI HAIDER', value: '+966 51 158 8203' }]} />
    </PageBox>
  );
}

/* On-screen preview frame whose inner #id is the exact capture target */
const PreviewFrame = ({ id, label, children }) => (
  <div style={{ marginBottom: 30 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E' }}>{label} Preview</span>
      <span style={{ fontSize: 11, color: '#9CA3AF' }}>— identical to the downloaded PDF</span>
    </div>
    <div style={{ overflowX: 'auto', background: '#E9EAEC', padding: 24, borderRadius: 14, display: 'flex', justifyContent: 'center' }}>
      <div style={{ flexShrink: 0, boxShadow: '0 6px 26px rgba(0,0,0,0.16)' }}>
        <div id={id}>{children}</div>
      </div>
    </div>
  </div>
);

export default function HotelInvoiceDetailPage({ params }) {
  const { id } = use(params);
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/hotel-invoices/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setInv(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (mode) => {
    if (downloading) return;
    const el = document.getElementById(mode === 'invoice' ? 'inv-doc' : 'vch-doc');
    if (!el) return;
    setDownloading(mode);
    try {
      const suffix = mode === 'invoice' ? 'Invoice' : 'Voucher';
      const refNo = inv?.reserve_no || id.slice(-6);
      await downloadDoc(el, `Hotel_${suffix}_${refNo}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      Loading invoice...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!inv) return <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>Invoice not found.</div>;

  const rooms = (inv.items && inv.items.length) ? inv.items : [inv];
  const roomsTotal = rooms.reduce((s, r) => s + Number(r.room_amount || 0), 0);
  const hotelTotal = Number(inv.total_amount || roomsTotal || inv.room_amount || 0);

  const dlBtn = (mode, label, base, active) => (
    <button onClick={() => handleDownload(mode)} disabled={!!downloading}
      style={{ padding: '12px 34px', background: downloading === mode ? active : base, color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: downloading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 8, opacity: downloading && downloading !== mode ? 0.6 : 1 }}>
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {downloading === mode ? 'Generating...' : label}
    </button>
  );

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Invoice Details</h4>
          <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>Reserve No: <strong style={{ color: '#B1723C' }}>#{inv.reserve_no}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/admin/hotels/invoice/${id}/edit`}
            style={{ padding: '9px 18px', background: '#EDE9FE', color: '#7C3AED', border: '1.5px solid #DDD6FE', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Edit Invoice
          </Link>
          <Link href="/admin/hotels/invoice/create"
            style={{ padding: '9px 18px', background: '#F9FAFB', color: '#374151', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            New Invoice
          </Link>
          <Link href="/admin/hotels/invoice"
            style={{ padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            Go Back
          </Link>
        </div>
      </div>

      {/* ── DOWNLOAD BUTTONS ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
        {dlBtn('invoice', 'Download Hotel Invoice', '#2563EB', '#1D4ED8')}
        {dlBtn('voucher', 'Download Hotel Voucher', '#059669', '#047857')}
      </div>

      {/* ── PREVIEWS (exact PDF output) ── */}
      <PreviewFrame id="inv-doc" label="Invoice"><InvoiceDoc inv={inv} rooms={rooms} hotelTotal={hotelTotal} /></PreviewFrame>
      <PreviewFrame id="vch-doc" label="Voucher"><VoucherDoc inv={inv} rooms={rooms} /></PreviewFrame>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
