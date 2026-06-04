'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ── Bar Chart ── */
function BarChart({ data = [], height = 150 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = 36;
  const gap = 18;
  const totalW = data.length * (barW + gap) - gap;

  return (
    <svg width="100%" height={height + 28} viewBox={`0 0 ${totalW} ${height + 28}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="barGradPrimary" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B1723C" />
          <stop offset="100%" stopColor="#D4904E" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C8844A" />
          <stop offset="100%" stopColor="#E8A870" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1="0" y1={height * (1 - f)} x2={totalW} y2={height * (1 - f)}
          stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4 3" />
      ))}
      {data.map((d, i) => {
        const barH = Math.max((d.value / max) * height, 3);
        const x = i * (barW + gap);
        const y = height - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              fill="url(#barGradPrimary)" rx={5} />
            <text x={x + barW / 2} y={height + 18} textAnchor="middle"
              fontSize="10" fill="#9CA3AF" fontFamily="Jost,Inter,sans-serif" fontWeight="500">
              {d.label}
            </text>
            {d.value > 0 && (
              <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                fontSize="9" fill="#B1723C" fontWeight="700" fontFamily="Jost,Inter,sans-serif">
                {d.value > 999 ? `${(d.value / 1000).toFixed(1)}k` : d.value}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Donut Chart ── */
function DonutChart({ segments, size = 120 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 44; const cx = size / 2; const cy = size / 2;
  let cumAngle = -90;

  const polarToXY = (angle, radius) => ({
    x: cx + radius * Math.cos((angle * Math.PI) / 180),
    y: cy + radius * Math.sin((angle * Math.PI) / 180),
  });

  const arcs = segments.map(seg => {
    const angle = (seg.value / total) * 360;
    const start = cumAngle;
    cumAngle += angle;
    return { ...seg, start, angle };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {arcs.map((arc, i) => {
        if (arc.angle < 0.5) return null;
        const s = polarToXY(arc.start, r);
        const e = polarToXY(arc.start + arc.angle, r);
        const large = arc.angle > 180 ? 1 : 0;
        return (
          <path key={i}
            d={`M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${large} 1 ${e.x},${e.y} Z`}
            fill={arc.color}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#fff" />
      <text x={cx} y={cy - 5} textAnchor="middle" fontSize="15" fontWeight="800" fill="#0F172A" fontFamily="Jost,Inter,sans-serif">
        {total}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="Jost,Inter,sans-serif" fontWeight="600" letterSpacing="0.8">
        TOTAL
      </text>
    </svg>
  );
}

/* ── Sparkline ── */
function Sparkline({ values = [], color = '#B1723C', height = 34 }) {
  if (values.length < 2) return <div style={{ width: 72, height }} />;
  const max = Math.max(...values, 1);
  const w = 72;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = height - (v / max) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const fillPts = `0,${height} ${pts} ${w},${height}`;
  return (
    <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ display: 'block', flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sparkFill_${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill={`url(#sparkFill_${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Mini icon for stat cards ── */
const StatIcons = {
  totalOrders: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/><path d="M9 12h6m-6 4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  totalRevenue: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="800" fontFamily="Arial,sans-serif" fill="currentColor">SAR</text></svg>
  ),
  totalVisaApps: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="8" cy="15" r="1.5" fill="currentColor"/><path d="M12 14h6M12 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
  ),
  totalInquiries: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M6 18v2m12-2v2M7 8V5a1 1 0 011-1h8a1 1 0 011 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  totalUsers: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="8" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M2 21v-1a6 6 0 0112 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 8v6m3-3h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  totalVisas: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  totalTransports: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 8V5a1 1 0 011-1h8a1 1 0 011 1v3M6 18v2m12-2v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  pendingOrders: () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
};

const STAT_CARDS = [
  { key: 'totalOrders',    label: 'Total Orders',        color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'totalRevenue',   label: 'Total Revenue',       color: '#10B981', bg: '#ECFDF5' },
  { key: 'totalVisaApps',  label: 'Visa Applications',   color: '#8B5CF6', bg: '#F5F3FF' },
  { key: 'totalInquiries', label: 'Transport Inquiries', color: '#B1723C', bg: '#FDF4EC' },
  { key: 'totalUsers',     label: 'Registered Users',    color: '#EC4899', bg: '#FDF2F8' },
  { key: 'totalVisas',     label: 'Active Visas',        color: '#0EA5E9', bg: '#F0F9FF' },
  { key: 'totalTransports',label: 'Transports',          color: '#F59E0B', bg: '#FFFBEB' },
  { key: 'pendingOrders',  label: 'Pending Orders',      color: '#EF4444', bg: '#FEF2F2' },
];

const ORDER_STATUS = {
  1: { label: 'Pending',    color: '#F59E0B', bg: '#FFFBEB' },
2: { label: 'Processing', color: '#3B82F6', bg: '#EFF6FF' },
  3: { label: 'Approved',   color: '#10B981', bg: '#ECFDF5' },
  4: { label: 'Cancelled',  color: '#EF4444', bg: '#FEF2F2' },
};

const QuickIcons = {
  hotels: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 21V8a2 2 0 012-2h14a2 2 0 012 2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M9 21V15h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 21h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  agents: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M2 21v-1a7 7 0 0114 0v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 8v6m3-3h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
  ),
  arrivals: () => (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
};

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setData(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const todayLabel = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 44, height: 44, border: '3px solid #F3F4F6', borderTopColor: '#B1723C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#9CA3AF', fontSize: 13.5, margin: 0, fontWeight: 500 }}>Loading analytics...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const stats = data?.stats || {};
  const revenue = data?.totalRevenue || 0;
  const revenueByMonth = data?.revenueByMonth || [];
  const orderStatus = data?.orderStatus || {};
  const recentOrders = data?.recentOrders || [];

  const donutSegments = [
    { label: 'Pending',    value: orderStatus.pending    || 0, color: '#F59E0B' },
    { label: 'Processing', value: orderStatus.processing || 0, color: '#3B82F6' },
    { label: 'Approved',   value: orderStatus.approved   || 0, color: '#10B981' },
    { label: 'Cancelled',  value: orderStatus.cancelled  || 0, color: '#EF4444' },
  ];

  const sparkData = revenueByMonth.map(m => m.count);

  return (
    <div style={{ maxWidth: 1400 }}>

      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #112244 60%, #1a3356 100%)',
        borderRadius: 16,
        padding: '26px 32px',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)',
      }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', right: -60, top: -60, width: 240, height: 240, background: 'rgba(177,114,60,0.06)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -80, width: 180, height: 180, background: 'rgba(177,114,60,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '40%', top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500 }}>{todayLabel}</span>
          </div>
          <h2 style={{ color: '#F9FAFB', fontWeight: 800, fontSize: 22, margin: '0 0 6px', letterSpacing: '-0.4px' }}>
            Welcome back, Administrator
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, position: 'relative', zIndex: 1 }}>
          <Link href="/admin/arrivals" style={{
            padding: '10px 20px', background: '#B1723C', color: '#fff',
            borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 7,
            boxShadow: '0 4px 14px rgba(177,114,60,0.35)',
            transition: 'all 0.15s',
          }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Today&apos;s Arrivals
          </Link>
          <Link href="/admin/agents" style={{
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
            borderRadius: 9, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.12)',
            transition: 'all 0.15s',
          }}>
            View Agents
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {STAT_CARDS.map(card => {
          const IcoComp = StatIcons[card.key];
          return (
            <div key={card.key} className="admin-stat-card">
              <div style={{ width: 46, height: 46, borderRadius: 11, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, flexShrink: 0 }}>
                <IcoComp />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', lineHeight: 1.1, marginBottom: 2, letterSpacing: '-0.5px' }}>
                  {card.key === 'totalRevenue'
                    ? `SAR ${revenue.toLocaleString()}`
                    : (stats[card.key] || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: 11.5, color: '#6B7280', fontWeight: 500 }}>{card.label}</div>
              </div>
              <Sparkline values={sparkData.length > 1 ? sparkData : [0, 1]} color={card.color} />
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18, marginBottom: 20 }}>

        {/* Revenue bar chart */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '22px 24px 14px', border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>Revenue Overview</h3>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Last 6 months performance</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>SAR {revenue.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                <svg width="11" height="11" fill="none" viewBox="0 0 24 24"><path d="M7 17l10-10M7 7h10v10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                All Time Total
              </div>
            </div>
          </div>
          <BarChart
            data={revenueByMonth.length > 0 ? revenueByMonth : Array.from({length: 6}, (_, i) => ({ label: ['Jan','Feb','Mar','Apr','May','Jun'][i], value: 0 }))}
            height={150}
          />
        </div>

        {/* Order status donut */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '22px 22px', border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <h3 style={{ margin: '0 0 2px', fontSize: 14.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>Order Status</h3>
          <p style={{ margin: '0 0 18px', fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Distribution breakdown</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <DonutChart segments={donutSegments} size={126} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {donutSegments.map(seg => {
              const total = donutSegments.reduce((s, x) => s + x.value, 0) || 1;
              const pct = Math.round((seg.value / total) * 100);
              return (
                <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#6B7280', flex: 1, fontWeight: 500 }}>{seg.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', minWidth: 20, textAlign: 'right' }}>{seg.value}</span>
                  <div style={{ width: 52, height: 4, background: '#F3F4F6', borderRadius: 2, flexShrink: 0 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: seg.color, borderRadius: 2, transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: 10.5, color: '#9CA3AF', width: 26, textAlign: 'right', fontWeight: 600 }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick metrics + Recent orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', gap: 18, marginBottom: 20 }}>

        {/* Quick metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Active Hotels', value: stats.totalHotels || 0, color: '#3B82F6', bg: '#EFF6FF', ico: 'hotels' },
            { label: 'Agents', value: stats.agentCount || 0, color: '#8B5CF6', bg: '#F5F3FF', ico: 'agents' },
            { label: "Today's Activity", value: (data?.todayArrivals?.length || 0) + (data?.todayInquiries?.length || 0), color: '#10B981', bg: '#ECFDF5', ico: 'arrivals' },
          ].map(m => {
            const IcoComp = QuickIcons[m.ico];
            return (
              <div key={m.label} style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.15s' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color, flexShrink: 0 }}>
                  <IcoComp />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: m.color, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 1 }}>{m.label}</div>
                </div>
              </div>
            );
          })}
          <Link href="/admin/visa/create" style={{
            background: 'linear-gradient(135deg, #B1723C 0%, #8B5329 100%)',
            borderRadius: 12, padding: '14px 16px',
            color: '#fff', textDecoration: 'none',
            fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(177,114,60,0.25)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
            New Visa Entry
          </Link>
        </div>

        {/* Recent orders */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>Recent Orders</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Latest booking activity</p>
            </div>
            <Link href="/admin/orders" style={{ fontSize: 12.5, color: '#B1723C', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View all
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ marginBottom: 0 }}>
              <thead>
                <tr>
                  <th>Order #</th><th>Customer</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#9CA3AF', padding: '36px 0', fontSize: 13 }}>No orders yet</td></tr>
                ) : recentOrders.slice(0, 6).map(order => {
                  const st = ORDER_STATUS[order.status] || { label: '—', color: '#9CA3AF', bg: '#F3F4F6' };
                  return (
                    <tr key={order._id}>
                      <td>
                        <Link href={`/admin/orders/${order._id}`} style={{ color: '#B1723C', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>{order.order_number}</Link>
                      </td>
                      <td style={{ fontSize: 13, fontWeight: 500 }}>{order.first_name} {order.last_name}</td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontSize: 11, background: '#F3F4F6', color: '#374151', padding: '3px 9px', borderRadius: 6, fontWeight: 600, border: '1px solid #ECEEF2' }}>
                          {order.product_type}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>SAR {(order.total_with_tax || order.total_amount || 0).toLocaleString()}</td>
                      <td>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.color}20` }}>{st.label}</span>
                      </td>
                      <td style={{ color: '#9CA3AF', fontSize: 12 }}>{order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Today's activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

        {/* Today's transport inquiries */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>Today&apos;s Inquiries</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>Transport requests</p>
            </div>
            <Link href="/admin/transport/inquiries" style={{ fontSize: 12, color: '#B1723C', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          {(!data?.todayInquiries || data.todayInquiries.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#9CA3AF', fontSize: 13 }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 8px', color: '#E5E7EB' }}><rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7 8V5a1 1 0 011-1h8a1 1 0 011 1v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              No transport inquiries today
            </div>
          ) : data.todayInquiries.slice(0, 5).map(inq => (
            <div key={inq._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: '#FDF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#B1723C' }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 8V5a1 1 0 011-1h8a1 1 0 011 1v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{inq.transport_title}</div>
              </div>
              <span style={{ fontSize: 10.5, padding: '3px 9px', borderRadius: 10, background: '#FDF4EC', color: '#B1723C', fontWeight: 600, border: '1px solid rgba(177,114,60,0.15)', flexShrink: 0 }}>
                {inq.vehicle_type || 'Inquiry'}
              </span>
            </div>
          ))}
        </div>

        {/* Today's visa applications */}
        <div style={{ background: '#fff', borderRadius: 14, padding: '20px', border: '1px solid #ECEEF2', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: '#0F172A', letterSpacing: '-0.2px' }}>Today&apos;s Visa Applications</h3>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>New submissions</p>
            </div>
            <Link href="/admin/visa/applications" style={{ fontSize: 12, color: '#8B5CF6', fontWeight: 600, textDecoration: 'none' }}>View all</Link>
          </div>
          {(!data?.todayVisaApps || data.todayVisaApps.length === 0) ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: '#9CA3AF', fontSize: 13 }}>
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" style={{ display: 'block', margin: '0 auto 8px', color: '#E5E7EB' }}><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.4"/></svg>
              No visa applications today
            </div>
          ) : data.todayVisaApps.slice(0, 5).map(app => (
            <div key={app._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F8FAFC' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#8B5CF6' }}>
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.8"/><circle cx="8" cy="15" r="1.5" fill="currentColor"/></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.name}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{app.visa_title}</div>
              </div>
              <span style={{ fontSize: 10.5, padding: '3px 9px', borderRadius: 10, background: '#F5F3FF', color: '#8B5CF6', fontWeight: 600, border: '1px solid rgba(139,92,246,0.15)', flexShrink: 0 }}>
                {app.nationality || 'Applied'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
