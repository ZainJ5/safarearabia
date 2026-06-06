'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAdminSidebar } from './AdminSidebarContext';

/* ─── Icons ──────────────────────────────────────────────────────────── */
const I = {
  dashboard:  <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity=".55"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity=".55"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity=".3"/></svg>,
  arrivals:   <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  fileAdd:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M12 18v-6M9 15h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  list:       <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  calendar:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  hotel:      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 21V8a2 2 0 012-2h14a2 2 0 012 2v13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M9 21V15h6v6M3 21h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  car:        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M6 18v2m12-2v2M2 12h20M7 8V5a1 1 0 011-1h8a1 1 0 011 1v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  visa:       <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.7"/><circle cx="8" cy="15" r="1.5" fill="currentColor"/></svg>,
  tag:        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  plane:      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011 2a1.5 1.5 0 00-1.5 1.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  accounts:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M2 10h20M6 15h2m4 0h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  dollar:     <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  cart:       <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  invoice:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  payment:    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M1 10h22" stroke="currentColor" strokeWidth="1.7"/></svg>,
  agent:      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M2 21v-1a7 7 0 0114 0v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M19 8v6m3-3h-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  agentAdd:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M2 21v-1a7 7 0 0114 0v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M17 11h6M20 8v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  customer:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.7"/><path d="M4 20v-1a8 8 0 0116 0v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  users:      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.7"/><circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.7"/><path d="M1 20v-1a7 7 0 0113.93-1.37M17 21v-.5a5.5 5.5 0 00-3-4.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><path d="M19.5 16h3M21 14.5v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  chart:      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  gear:       <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="1.7"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.7"/></svg>,
  mail:       <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.7"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  chat:       <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  currency:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.7"/><path d="M12 6v12M15 9H10.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  template:   <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  route:      <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="6" cy="19" r="3" stroke="currentColor" strokeWidth="1.7"/><circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.7"/><path d="M18 8v5a2 2 0 01-2 2H8a2 2 0 00-2 2v1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>,
  star:       <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

/* ─── Navigation definition ──────────────────────────────────────────── */
const NAV = [
  { key: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: I.dashboard, exact: true },
  { key: 'arrivals',  label: 'Arrivals',  href: '/admin/arrivals',  icon: I.arrivals },

  { type: 'divider', label: 'HOTEL' },
  { key: 'hotel-create-inv',  label: 'Create Invoice', href: '/admin/hotels/invoice/create', icon: I.fileAdd },
  { key: 'hotel-bookings',    label: 'Hotel Booking',  href: '/admin/hotels/invoice',        icon: I.calendar, exact: true },
  { key: 'hotel-list',        label: 'Hotel List',     href: '/admin/hotels',                icon: I.hotel, exact: true },

  { type: 'divider', label: 'TRANSPORT' },
  { key: 'transport-bookings', label: 'Transport Bookings',  href: '/admin/transport/invoice',        icon: I.calendar, exact: true },
  { key: 'transport-inv',      label: 'Transport Invoice',   href: '/admin/transport/invoice/create', icon: I.fileAdd },
  { key: 'transport-category', label: 'Transport Category',  href: '/admin/transport/category',       icon: I.tag },
  { key: 'vehicle-list',       label: 'Vehicle List',        href: '/admin/transport',                icon: I.car, exact: true },

  { type: 'divider', label: 'VISA' },
  { key: 'all-visas',       label: 'All Visas',   href: '/admin/visa',          icon: I.visa,  exact: true },
  { key: 'add-visa',        label: 'Add Visa',    href: '/admin/visa/create',   icon: I.fileAdd },
  { key: 'visa-categories', label: 'Categories',  href: '/admin/visa/category', icon: I.tag },

  { type: 'divider', label: 'AIR TICKET' },
  { key: 'air-bookings',   label: 'Bookings',        href: '/admin/air-ticket', icon: I.calendar, soon: true },
  { key: 'air-invoices',   label: 'Invoices',        href: '/admin/air-ticket', icon: I.invoice,  soon: true },
  { key: 'air-create-inv', label: 'Create Invoice',  href: '/admin/air-ticket', icon: I.fileAdd,  soon: true },
  { key: 'airlines',       label: 'Airlines',        href: '/admin/air-ticket', icon: I.plane,    soon: true },
  { key: 'air-routes',     label: 'Routes',          href: '/admin/air-ticket', icon: I.route,    soon: true },
  { key: 'flight-sched',   label: 'Flight Schedule', href: '/admin/air-ticket', icon: I.calendar, soon: true },
  { key: 'ticket-status',  label: 'Ticket Status',   href: '/admin/air-ticket', icon: I.list,     soon: true },

  { key: 'accounts', label: 'Accounts', href: '/admin/accounts', icon: I.accounts, soon: true, topGap: true },

  { type: 'divider', label: 'INCOME' },
  { key: 'hotel-income',     label: 'Hotel Income',     href: '/admin/income', icon: I.dollar, soon: true },
  { key: 'transport-income', label: 'Transport Income', href: '/admin/income', icon: I.dollar, soon: true },
  { key: 'visa-income',      label: 'Visa Income',      href: '/admin/income', icon: I.dollar, soon: true },
  { key: 'air-income',       label: 'Air Ticket Income',href: '/admin/income', icon: I.dollar, soon: true },

  { type: 'divider', label: 'EXPENSES' },
  { key: 'office-exp',   label: 'Office Expenses',   href: '/admin/expenses', icon: I.cart, soon: true },
  { key: 'staff-sal',    label: 'Staff Salaries',    href: '/admin/expenses', icon: I.cart, soon: true },
  { key: 'mktg-exp',     label: 'Marketing Expenses',href: '/admin/expenses', icon: I.cart, soon: true },
  { key: 'vendor-pay',   label: 'Vendor Payments',   href: '/admin/expenses', icon: I.cart, soon: true },

  { type: 'divider', label: 'INVOICES' },
  { key: 'all-invoices',   label: 'All Invoices',  href: '/admin/invoices', icon: I.invoice, soon: true },
  { key: 'create-inv-gen', label: 'Create Invoice', href: '/admin/invoices', icon: I.fileAdd, soon: true },

  { type: 'divider', label: 'PAYMENTS' },
  { key: 'cust-payments', label: 'Customer Payments', href: '/admin/payments', icon: I.payment, soon: true },
  { key: 'supp-payments', label: 'Supplier Payments', href: '/admin/payments', icon: I.payment, soon: true },

  { type: 'divider', label: 'AGENTS' },
  { key: 'all-agents',       label: 'All Agents',        href: '/admin/agents',        icon: I.agent,    exact: true },
  { key: 'add-agent',        label: 'Add Agent',         href: '/admin/agents/create', icon: I.agentAdd },
  { key: 'agent-comm',       label: 'Agent Commissions', href: '/admin/agents',        icon: I.star,     soon: true },
  { key: 'agent-statements', label: 'Agent Statements',  href: '/admin/agents',        icon: I.chart,    soon: true },

  { type: 'divider', label: 'CUSTOMERS' },
  { key: 'all-customers', label: 'All Customers', href: '/admin/customers', icon: I.customer, soon: true },
  { key: 'add-customer',  label: 'Add Customer',  href: '/admin/customers', icon: I.customer, soon: true },

  { type: 'divider', label: 'USERS' },
  { key: 'all-users',  label: 'All Users',  href: '/admin/users', icon: I.users, exact: true },

  { type: 'divider', label: 'REPORTS' },
  { key: 'daily-rpt',    label: 'Daily Report',        href: '/admin/reports', icon: I.chart, soon: true },
  { key: 'monthly-rpt',  label: 'Monthly Report',      href: '/admin/reports', icon: I.chart, soon: true },
  { key: 'sales-rpt',    label: 'Sales Report',        href: '/admin/reports', icon: I.chart, soon: true },
  { key: 'profit-loss',  label: 'Profit & Loss',       href: '/admin/reports', icon: I.chart, soon: true },
  { key: 'outstanding',  label: 'Outstanding Payments',href: '/admin/reports', icon: I.chart, soon: true },

  { type: 'divider', label: 'SETTINGS' },
  { key: 'company-profile',  label: 'Company Profile',   href: '/admin/settings',                   icon: I.gear,     exact: true },
  { key: 'email-settings',   label: 'Email Settings',    href: '/admin/settings/email',             icon: I.mail },
  { key: 'sms-settings',     label: 'SMS / WhatsApp',    href: '/admin/settings/sms',               icon: I.chat },
  { key: 'inv-templates',    label: 'Invoice Templates', href: '/admin/settings/invoice-templates', icon: I.template },
  { key: 'currency-settings',label: 'Currency Settings', href: '/admin/settings/currency',          icon: I.currency },
];

const AGENT_NAV = [
  { key: 'dashboard', label: 'Dashboard', href: '/admin/dashboard', icon: I.dashboard, exact: true },
  { type: 'divider', label: 'MY INVOICES' },
  { key: 'hotel-my-inv',    label: 'Hotel Invoices',          href: '/admin/hotels/invoice',          icon: I.invoice, exact: true },
  { key: 'hotel-create-inv',label: 'Create Hotel Invoice',    href: '/admin/hotels/invoice/create',   icon: I.fileAdd },
  { key: 'transp-my-inv',   label: 'Transport Invoices',      href: '/admin/transport/invoice',       icon: I.invoice, exact: true },
  { key: 'transp-create-inv',label: 'Create Transport Invoice',href: '/admin/transport/invoice/create',icon: I.fileAdd },
];

/* Employees only generate & manage their own invoices — invoice tabs only. */
const EMPLOYEE_NAV = [
  { type: 'divider', label: 'HOTEL' },
  { key: 'hotel-my-inv',     label: 'Hotel Invoices',  href: '/admin/hotels/invoice',        icon: I.invoice, exact: true },
  { key: 'hotel-create-inv', label: 'Create Invoice',  href: '/admin/hotels/invoice/create', icon: I.fileAdd },
  { type: 'divider', label: 'TRANSPORT' },
  { key: 'transp-my-inv',     label: 'Transport Invoices', href: '/admin/transport/invoice',        icon: I.invoice, exact: true },
  { key: 'transp-create-inv', label: 'Create Invoice',     href: '/admin/transport/invoice/create', icon: I.fileAdd },
];

/* ─── Sidebar component ──────────────────────────────────────────────── */
export default function AdminSidebar({ userRole = 1 }) {
  const pathname  = usePathname();
  const nav       = userRole === 4 ? EMPLOYEE_NAV : (userRole === 2 ? AGENT_NAV : NAV);
  const [hovered, setHovered] = useState(null);
  const { open, setOpen } = useAdminSidebar();

  // Close sidebar on route change (mobile navigation)
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (item) => {
    if (item.soon) return false;
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar${open ? ' sidebar-open' : ''}`}
        style={{
        width: 248,
        flexShrink: 0,
        background: '#0A1628',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: '#1e3a5f #0A1628',
        borderRight: '1px solid rgba(255,255,255,0.04)',
      }}>

        {/* Logo */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/admin/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #C8844A 0%, #8B5329 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(177,114,60,0.35)',
            }}>
              <svg width="17" height="17" fill="none" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" opacity="0.95"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
              </svg>
            </div>
            <div>
              <div style={{ color: '#F9FAFB', fontWeight: 700, fontSize: 13, lineHeight: 1.25, letterSpacing: '-0.2px' }}>Safar e Arabian</div>
              <div style={{ color: '#C8844A', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 1 }}>Admin Portal</div>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            className="admin-sidebar-close"
            onClick={() => setOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: 'none', borderRadius: 7,
              width: 30, height: 30,
              display: 'none',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav onClick={() => setOpen(false)} style={{ flex: 1, padding: '8px 8px 20px' }}>
          {nav.map((item, idx) => {
            if (item.type === 'divider') {
              return (
                <div key={idx} style={{
                  padding: '14px 10px 5px',
                  fontSize: 9, fontWeight: 700,
                  color: 'rgba(255,255,255,0.2)',
                  textTransform: 'uppercase', letterSpacing: 1.5,
                  userSelect: 'none',
                  borderTop: idx > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  marginTop: idx > 0 ? 4 : 0,
                }}>
                  {item.label}
                </div>
              );
            }

            const active  = isActive(item);
            const hovrd   = hovered === item.key;

            let bg    = 'transparent';
            let color = 'rgba(255,255,255,0.5)';
            let icCol = 'rgba(255,255,255,0.3)';

            if (active) {
              bg    = 'rgba(200,132,74,0.15)';
              color = '#E8A870';
              icCol = '#E8A870';
            } else if (hovrd && !item.soon) {
              bg    = 'rgba(255,255,255,0.05)';
              color = 'rgba(255,255,255,0.8)';
              icCol = 'rgba(255,255,255,0.6)';
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                onMouseEnter={() => setHovered(item.key)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6.5px 10px', borderRadius: 7,
                  background: bg, color,
                  fontWeight: active ? 600 : 400, fontSize: 12.5,
                  textDecoration: 'none',
                  marginBottom: 1,
                  marginTop: item.topGap ? 6 : 0,
                  transition: 'background 0.12s, color 0.12s',
                  position: 'relative',
                  cursor: item.soon ? 'default' : 'pointer',
                }}
              >
                {active && (
                  <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: 2, background: '#C8844A' }} />
                )}
                <span style={{ flexShrink: 0, color: icCol, lineHeight: 1 }}>
                  {item.icon}
                </span>
                <span style={{ flex: 1, lineHeight: 1.3 }}>{item.label}</span>
                {item.soon && (
                  <span style={{ fontSize: 7.5, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.28)', padding: '2px 5px', borderRadius: 3, fontWeight: 700, letterSpacing: 0.6, flexShrink: 0 }}>
                    SOON
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '11px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.16)', textAlign: 'center', letterSpacing: 0.3 }}>
            Safar e Arabian &copy; {new Date().getFullYear()}
          </div>
        </div>
      </aside>

      <style>{`
        .admin-sidebar::-webkit-scrollbar { width: 3px; }
        .admin-sidebar::-webkit-scrollbar-track { background: transparent; }
        .admin-sidebar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

        /* Backdrop */
        .admin-sidebar-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 299;
          backdrop-filter: blur(1px);
        }

        /* Mobile behaviour */
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            z-index: 300;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: none;
          }
          .admin-sidebar.sidebar-open {
            transform: translateX(0) !important;
            box-shadow: 8px 0 32px rgba(0,0,0,0.35);
          }
          .admin-sidebar-close {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
