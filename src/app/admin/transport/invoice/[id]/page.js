'use client';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { defaultSettings } from '@/lib/defaultSettings';
import {
  G, fmt2, fmtDate, fmtTime,
  PageBox, BrandHeader, Divider, InfoCard, InfoCardRow, DetailsTitle, ThemeTable,
  BankList, SummaryCard, BankSummaryRow, Policies, DocFooter, downloadDoc, BROWN, INK_TX,
} from '@/components/admin/invoiceTheme';

const phoneNum = defaultSettings.hotline_phone;
const emailAddr = defaultSettings.email_address;
const website = (emailAddr && emailAddr.includes('@')) ? emailAddr.split('@')[1] : 'safararabiantravel.com';

/* ─── Transport Invoice document ─── */
function TransportInvoiceDoc({ inv, segs, netBase, vatAmt }) {
  return (
    <PageBox>
      <BrandHeader title="INVOICE"
        metaA={{ label: 'RESERVATION NO.', value: `T-${inv.invoice_no}` }}
        metaB={{ label: 'INVOICE DATE', value: fmtDate(new Date()).main }}
        phone={phoneNum} email={emailAddr} website={website} />
      <Divider />
      <InfoCardRow>
        <InfoCard icon={G.calendar} title="BOOKING INFORMATION" rows={[
          { icon: G.user, label: 'Agent Name', value: inv.agent_name },
          { icon: G.badge, label: 'Agent No', value: inv.agent_no },
          { icon: G.calendar, label: 'Reservation Date', value: inv.reservation_date },
          { icon: G.hash, label: 'User Id', value: inv.username },
        ]} />
        <InfoCard icon={G.user} title="GUEST INFORMATION" rows={[
          { icon: G.user, label: 'Guest Name', value: inv.guest_name },
          { icon: G.globe, label: 'Nationality', value: inv.nationality },
          { icon: G.phone, label: 'Mobile No', value: inv.contact_number },
          { icon: G.tag, label: 'Payment Type', value: inv.payment_type },
        ]} />
      </InfoCardRow>
      <DetailsTitle icon={G.car}>Transport Details</DetailsTitle>
      <ThemeTable
        columns={[
          { label: 'DATE', icon: G.calendar }, { label: 'TIME', icon: G.clock },
          { label: 'FROM', icon: G.pin }, { label: 'TO', icon: G.pin },
          { label: 'VEHICLE', icon: G.car }, { label: 'MOV TYPE', icon: G.route },
          { label: 'QTY', icon: G.hash }, { label: 'RATE', icon: G.tag },
          { label: 'TOTAL', icon: G.money },
        ]}
        rows={segs.map((s) => [
          { top: fmtDate(s.date).main || s.date || '', bottom: fmtDate(s.date).wd },
          fmtTime(s.time),
          s.from_location || '',
          s.to_location || '',
          s.vehicle || '',
          s.mov_type || '',
          s.qty || '',
          fmt2(s.rate),
          { strong: true, value: fmt2(s.total) },
        ])} />

      {(inv.special_requirements || inv.notes) && (
        <div style={{ marginTop: 10, fontSize: 11, color: INK_TX, lineHeight: 1.6 }}>
          {inv.special_requirements && <div><strong style={{ color: BROWN }}>Special Requirements:</strong> {inv.special_requirements}</div>}
          {inv.notes && <div><strong style={{ color: BROWN }}>Note:</strong> {inv.notes}</div>}
        </div>
      )}

      <BankSummaryRow
        left={<BankList rows={[
          { icon: G.bank, label: 'Account Name', value: inv.account_name },
          { icon: G.bank, label: 'Bank', value: inv.bank },
          { icon: G.card, label: 'Bank Account No', value: inv.bank_account_no },
          { icon: G.iban, label: 'IBAN', value: inv.ibn },
          { icon: G.pin, label: 'Bank Address', value: inv.bank_address },
        ]}
          extra={inv.important_contact ? <div style={{ fontSize: 11, marginTop: 6 }}><strong style={{ color: BROWN }}>Important Contact:</strong> {inv.important_contact}</div> : null} />}
        right={<SummaryCard
          lines={[
            { label: 'Transport', value: fmt2(inv.transport) },
            { label: 'Discount', value: fmt2(inv.discount) },
            { label: 'Net Total', value: fmt2(netBase) },
            { label: `VAT (${Number(inv.vat || 0).toFixed(2)}%)`, value: fmt2(vatAmt) },
            { label: 'Convert Rate Total: SAR', value: fmt2(inv.convert_rate_total_sar) },
          ]}
          total={{ label: 'NET TOTAL', pre: 'SAR', value: fmt2(inv.net_total_with_tax) }} />} />
      <Policies inv={inv} />
      <DocFooter inv={inv} />
    </PageBox>
  );
}

/* ─── Transport Voucher document (same theme, voucher fields) ─── */
function TransportVoucherDoc({ inv, segs }) {
  return (
    <PageBox>
      <BrandHeader title="VOUCHER"
        metaA={{ label: 'RESERVE NO.', value: inv.invoice_no }}
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
          { icon: G.phone, label: 'Mobile No', value: inv.contact_number },
        ]} />
      </InfoCardRow>
      <DetailsTitle icon={G.car}>Transport Details</DetailsTitle>
      <ThemeTable
        columns={[
          { label: 'DATE', icon: G.calendar }, { label: 'FROM', icon: G.pin },
          { label: 'TO', icon: G.pin }, { label: 'MOV TYPE', icon: G.route },
          { label: 'VEHICLE', icon: G.car }, { label: 'QTY', icon: G.hash },
          { label: 'ADULT', icon: G.guests },
        ]}
        rows={segs.map((s) => [
          { top: fmtDate(s.date).main || s.date || '', bottom: fmtTime(s.time) || fmtDate(s.date).wd },
          s.from_location || '',
          s.to_location || '',
          s.mov_type || '',
          s.vehicle || '',
          s.qty || '',
          s.no_of_adults || '',
        ])} />
      <Policies inv={inv} />
      <DocFooter inv={inv} contacts={[{ label: 'ZAIN', value: '+966 53 653 3827' }, { label: 'ALI HAIDER', value: '+966 51 158 8203' }]} />
    </PageBox>
  );
}

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

export default function TransportInvoiceDetailPage({ params }) {
  const { id } = use(params);
  const [inv, setInv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/transport-invoices/${id}`)
      .then(r => r.json())
      .then(d => { if (d.success) setInv(d.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async (mode) => {
    if (downloading) return;
    const el = document.getElementById(mode === 'invoice' ? 'trn-inv-doc' : 'trn-vch-doc');
    if (!el) return;
    setDownloading(mode);
    try {
      const suffix = mode === 'invoice' ? 'Invoice' : 'Voucher';
      const refNo = inv?.invoice_no || id.slice(-6);
      await downloadDoc(el, `Transport_${suffix}_T${refNo}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
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

  // One invoice may have several transport segments; fall back to flat fields.
  const segs = (inv.items && inv.items.length)
    ? inv.items
    : [{
      date: inv.date, time: inv.time, from_location: inv.from_location, to_location: inv.to_location,
      vehicle: inv.vehicle, mov_type: inv.mov_type, qty: inv.qty, no_of_adults: inv.no_of_adults,
      packs: inv.packs, rate: inv.rate, total: inv.total
    }];
  const segTotal = segs.reduce((s, r) => s + Number(r.total || 0), 0);
  const netBase = segTotal + Number(inv.transport || 0) - Number(inv.discount || 0);
  const vatAmt = netBase * (Number(inv.vat || 0) / 100);

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
          <h4 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Transport Invoice</h4>
          <p style={{ color: '#6B7280', fontSize: 13, margin: '4px 0 0' }}>Invoice No: <strong style={{ color: '#5B21B6' }}>T-{inv.invoice_no}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/admin/transport/invoice/${id}/edit`}
            style={{ padding: '9px 18px', background: '#EDE9FE', color: '#7C3AED', border: '1.5px solid #DDD6FE', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Edit Invoice
          </Link>
          <Link href="/admin/transport/invoice"
            style={{ padding: '9px 18px', background: '#374151', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M5 12l7-7m-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
            Go Back
          </Link>
        </div>
      </div>

      {/* ── DOWNLOAD BUTTONS ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 28 }}>
        {dlBtn('invoice', 'Download Transport Invoice', '#2563EB', '#1D4ED8')}
        {dlBtn('voucher', 'Download Transport Voucher', '#059669', '#047857')}
      </div>

      {/* ── PREVIEWS (exact PDF output) ── */}
      <PreviewFrame id="trn-inv-doc" label="Invoice"><TransportInvoiceDoc inv={inv} segs={segs} netBase={netBase} vatAmt={vatAmt} /></PreviewFrame>
      <PreviewFrame id="trn-vch-doc" label="Voucher"><TransportVoucherDoc inv={inv} segs={segs} /></PreviewFrame>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
