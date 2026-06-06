'use client';

export const GOLD = '#C49A2E';
export const GOLD_LT = '#E6C25A';
export const GOLD_DK = '#9A7414';
export const BROWN = '#3B2509';
export const BROWN_LT = '#5A3A12';
export const CREAM_BG = '#FFFDF8';
export const INK_TX = '#3A2A12';
export const DOT_LINE = '#E7D8B5';
export const EM = '#0B7A57';
export const serif = 'Georgia, "Times New Roman", serif';

/* Warm champagne-gold headers (replaces the old dark-brown fills) */
export const HEAD_TOP = '#C9A24E';
export const HEAD_BOT = '#A87E2B';
export const HEAD_GRAD = `linear-gradient(180deg, ${HEAD_TOP} 0%, ${HEAD_BOT} 100%)`;
export const HEAD_DK_GRAD = `linear-gradient(180deg, #B5912E 0%, #96752A 100%)`; // deeper gold (meta box A)
export const HEAD_LT_GRAD = `linear-gradient(180deg, #DCC07A 0%, #C6A24C 100%)`; // lighter gold (meta box B)

export const HLOGO = '/IMG_6483.PNG'; // full brand lockup (emblem + wordmark)

/* Non-transparent artwork bounds inside the 1024×1024 PNG (measured), used to
   crop away the large transparent margins so the logo prints big and tight. */
const LOGO_BBOX = { x: 119, y: 89, w: 777, h: 703, full: 1024 };

export const fmt2 = (n) => Number(n || 0).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* Format a stored date string → { main:'04 Jun 2026', wd:'(Thu)' } */
export const fmtDate = (s) => {
  if (!s) return { main: '', wd: '' };
  const d = new Date(s);
  if (isNaN(d.getTime())) return { main: String(s), wd: '' };
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleDateString('en-US', { month: 'short' });
  const wd = d.toLocaleDateString('en-US', { weekday: 'short' });
  return { main: `${day} ${mon} ${d.getFullYear()}`, wd: `(${wd})` };
};

/* Minimal 24×24 glyph paths (stroke-drawn) */
export const G = {
  user: 'M12 12.5a4 4 0 100-8 4 4 0 000 8zM4.5 20c0-3.6 3.4-5.5 7.5-5.5s7.5 1.9 7.5 5.5',
  globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 4.5 3 13.5 0 18M12 3c-3 4.5-3 13.5 0 18',
  hash: 'M9 3L7 21M17 3l-2 18M4 9h16M3 15h16',
  calendar: 'M5 5h14v15H5zM5 9h14M8 3v4M16 3v4',
  badge: 'M5 4h14v16H5zM9 8h6M9 12h6M9 16h4',
  check: 'M4 12.5l5 5 11-12',
  building: 'M5 21V4h9v17M14 9h5v12M8 8h2M8 12h2M8 16h2M16 12h1M16 16h1',
  bed: 'M3 18v-7M3 18h18M21 18v-5a3 3 0 00-3-3h-7v4M3 13h8M6 7.5h2.5a1.5 1.5 0 010 3H6z',
  moon: 'M21 12.8A8 8 0 1111.2 3 6.5 6.5 0 0021 12.8z',
  door: 'M6 21V3.5h9V21M15 3.5h3V21M11 12h.6',
  guests: 'M8.5 11a3 3 0 100-6 3 3 0 000 6zM2.5 20c0-3.3 2.7-5 6-5s6 1.7 6 5M16 5.5a3 3 0 010 6M15 15.2c2.7.2 5 1.9 5 4.8',
  meal: 'M12 3a9 9 0 100 18 9 9 0 000-18zM7.5 7v3.5a2 2 0 004 0V7M9.5 7v10M15.5 7c-1.2 0-2 1.8-2 4s.8 3 2 3v3',
  money: 'M9.5 3h5l-1 3h-3zM6.5 9c.4-1.4 2.4-3 5.5-3s5.1 1.6 5.5 3c1.6 3.6 1 11-5.5 11S4.9 12.6 6.5 9zM12 9.5v8M10 11.5h3a1.4 1.4 0 010 2.8h-3.2m2.2-2.8v-1.3m0 5.6v1.3',
  bank: 'M3 9.5l9-5 9 5M4 9.5h16M5.5 10.5v7M9.5 10.5v7M14.5 10.5v7M18.5 10.5v7M3.5 19.5h17',
  card: 'M3 6h18v12H3zM3 10h18M6 14h4',
  iban: 'M4 7h16v10H4zM4 11h16M7 14h3M14 14h3',
  pin: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  phone: 'M5 4h3.6l1.8 4.5-2.3 1.7a12 12 0 005 5l1.7-2.3 4.5 1.8V18a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z',
  mail: 'M3 6h18v12H3zM3.5 7l8.5 6 8.5-6',
  receipt: 'M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2.5-1.5L6 21zM9 8h6M9 12h6',
  car: 'M3 13l2-5h14l2 5M3 13h18v4H3zM3 13v4M6.5 17a1.5 1.5 0 100 0M17.5 17a1.5 1.5 0 100 0',
  route: 'M6 4a2 2 0 100 4 2 2 0 000-4zM6 8v6a3 3 0 003 3h6M18 16a2 2 0 100 4 2 2 0 000-4z',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.5V12l3 2',
  tag: 'M3 12l8-8h7v7l-8 8zM15.5 8.5a1 1 0 100 0',
};

export const Ico = ({ d, size = 15, color = GOLD, sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d={d} fill={fill} stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Circular icon badge. Uses display:flex to centre the glyph — this renders the
   SVG reliably in html2canvas AND, as a block-level flex item, is vertically
   centred correctly by a parent flex row's alignItems:center in both the live
   page and the PDF. */
export const Badge = ({ d, size = 28, ring = GOLD, glyph = GOLD, bg = '#fff', sw }) => (
  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: '50%', border: `${sw || 1.5}px solid ${ring}`, background: bg, flexShrink: 0 }}>
    <Ico d={d} color={glyph} size={Math.round(size * 0.52)} />
  </span>
);

/* Brand logo cropped tight to its artwork and rendered at an explicit size.
   Explicit width/height + maxWidth:none make it render identically in the live
   page and in html2canvas (which otherwise mis-sizes width-less images and is
   affected by the global `img{max-width:100%;height:auto}` reset). */
export const BrandLogo = ({ h = 150 }) => {
  const s = h / LOGO_BBOX.h;
  const draw = Math.round(LOGO_BBOX.full * s);
  const w = Math.round(LOGO_BBOX.w * s);
  return (
    <div style={{ position: 'relative', width: w, height: h, overflow: 'hidden', flexShrink: 0 }}>
      <img src={HLOGO} alt="Safar e Arabian" width={draw} height={draw}
        style={{ position: 'absolute', left: Math.round(-LOGO_BBOX.x * s), top: Math.round(-LOGO_BBOX.y * s), width: draw, height: draw, maxWidth: 'none', display: 'block' }} />
    </div>
  );
};

/* A single "badge · label : value" line as a table row (reliable alignment in PDF). */
/* badge · label : value rows. Flexbox with alignItems:center vertically centres
   the badge against its text in BOTH the live page and html2canvas (a table cell's
   vertical-align leaves the empty-inline-block badge sitting too high in-browser). */
const FieldRows = ({ rows, labelW = 110 }) => (
  <div>
    {rows.map((r, i) => {
      const last = i === rows.length - 1;
      return (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 2px', borderBottom: last ? 'none' : `1px dotted ${DOT_LINE}` }}>
          <Badge d={r.icon} size={28} />
          <div style={{ width: labelW, flexShrink: 0, fontSize: 12, fontWeight: 700, color: INK_TX }}>{r.label}</div>
          <div style={{ flexShrink: 0, color: '#B9A77E', fontWeight: 700 }}>:</div>
          <div style={{ flex: 1, fontSize: 12, color: r.valueColor || '#2C2113', fontWeight: 600, wordBreak: 'break-word' }}>{r.value || '—'}</div>
        </div>
      );
    })}
  </div>
);

export const Ribbon = ({ d, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: HEAD_BOT, backgroundImage: HEAD_GRAD, borderRadius: '8px 8px 0 0', padding: '8px 14px' }}>
    <Badge d={d} size={28} ring="rgba(255,255,255,0.9)" glyph="#fff" bg="rgba(255,255,255,0.16)" sw={1.5} />
    <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', letterSpacing: 1.1 }}>{title}</span>
  </div>
);

export const Flourish = ({ flip }) => (
  <svg width="84" height="13" viewBox="0 0 92 14" style={{ display: 'block', transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M2 7h44c8 0 8-5 16-5" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M62 2c6 0 6 10 12 10s6-8 14-5" fill="none" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="90" cy="7" r="2" fill={GOLD} />
  </svg>
);

/* Decorative gold/brown corner arc, anchored to the page's top-left */
export const CornerDecor = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, width: 124, height: 108, zIndex: 0, pointerEvents: 'none' }}>
    <svg width="124" height="108" viewBox="0 0 124 108">
      <path d="M124 0 A124 108 0 0 1 0 108 L0 94 A110 94 0 0 0 110 0 Z" fill={GOLD} />
      <path d="M104 0 A104 90 0 0 1 0 90 L0 62 A76 62 0 0 0 76 0 Z" fill={BROWN} />
      <path d="M60 0 A60 52 0 0 1 0 52 L0 45 A53 45 0 0 0 53 0 Z" fill={GOLD_LT} />
    </svg>
  </div>
);

/* The 794px "page" with corner decoration and padded content */
export const PageBox = ({ children, width = 794 }) => (
  <div style={{ width, background: '#fff', position: 'relative', overflow: 'hidden', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif', color: INK_TX }}>
    <CornerDecor />
    <div style={{ position: 'relative', zIndex: 1, padding: '22px 30px 16px' }}>{children}</div>
  </div>
);

/* Header: cropped brand logo (left) beside title + meta boxes + contacts (right).
   The two halves sit in a 2-cell table so they can never stack in the PDF; the
   inner pieces use flexbox (which html2canvas renders reliably — unlike
   inline-block, whose text it drops). */
export const BrandHeader = ({ title, metaA, metaB, phone, email, website, logoH = 150 }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 4 }}>
    <tbody>
      <tr>
        <td style={{ verticalAlign: 'middle', padding: '0 0 0 28px', width: 1, whiteSpace: 'nowrap' }}>
          <BrandLogo h={logoH} />
        </td>
        <td style={{ verticalAlign: 'middle', textAlign: 'right', padding: 0 }}>
          <div style={{ fontFamily: serif, fontSize: 40, fontWeight: 700, color: INK_TX, letterSpacing: 3, lineHeight: 1, marginBottom: 10 }}>{title}</div>
          {(metaA || metaB) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
              <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', border: `1px solid ${HEAD_BOT}` }}>
                {metaA && (
                  <div style={{ backgroundColor: '#9F7E2A', backgroundImage: HEAD_DK_GRAD, padding: '7px 18px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9.5, letterSpacing: 1.2, color: 'rgba(255,255,255,0.9)' }}>{metaA.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 2 }}>{metaA.value}</div>
                  </div>
                )}
                {metaB && (
                  <div style={{ backgroundColor: '#C6A24C', backgroundImage: HEAD_LT_GRAD, padding: '7px 18px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9.5, letterSpacing: 1.2, color: BROWN }}>{metaB.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: BROWN, marginTop: 2 }}>{metaB.value}</div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, fontSize: 11.5, color: INK_TX }}>
            {phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>{phone}</span><Badge d={G.phone} size={23} /></div>}
            {email && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>{email}</span><Badge d={G.mail} size={23} /></div>}
            {website && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span>{website}</span><Badge d={G.globe} size={23} /></div>}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
);

export const Divider = () => <div style={{ height: 1.5, background: GOLD, opacity: 0.5, margin: '6px 0 10px' }} />;

/* Equal-height info card: nested table lets the cream body stretch to the row
   height so paired cards align at the bottom (reliable in browser + html2canvas). */
export const InfoCard = ({ icon, title, rows }) => (
  <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse' }}>
    <tbody>
      <tr><td style={{ padding: 0 }}><Ribbon d={icon} title={title} /></td></tr>
      <tr style={{ height: '100%' }}>
        <td style={{ padding: 0, verticalAlign: 'top', height: '100%' }}>
          <div style={{ height: '100%', boxSizing: 'border-box', border: `1px solid ${DOT_LINE}`, borderTop: 'none', borderRadius: '0 0 10px 10px', background: CREAM_BG, padding: '3px 15px' }}>
            <FieldRows rows={rows} />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
);

/* Two info cards side-by-side, as a fixed-layout table (never stacks in PDF).
   Pass the two <InfoCard> elements as children. */
export const InfoCardRow = ({ children, gap = 20 }) => {
  const kids = Array.isArray(children) ? children.filter(Boolean) : [children];
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
      <tbody>
        <tr>
          <td style={{ width: '50%', verticalAlign: 'top', padding: 0 }}>{kids[0]}</td>
          <td style={{ width: gap, padding: 0 }} />
          <td style={{ width: '50%', verticalAlign: 'top', padding: 0 }}>{kids[1]}</td>
        </tr>
      </tbody>
    </table>
  );
};

/* Bank/details list (left) + payment summary (right), side-by-side without flex. */
export const BankSummaryRow = ({ left, right, rightWidth = 330, gap = 24 }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14 }}>
    <tbody>
      <tr>
        <td style={{ verticalAlign: 'top', padding: 0 }}>{left}</td>
        <td style={{ width: gap, padding: 0 }} />
        <td style={{ width: rightWidth, verticalAlign: 'top', padding: 0 }}>{right}</td>
      </tr>
    </tbody>
  </table>
);

export const DetailsTitle = ({ icon, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '10px 0 8px' }}>
    <Flourish flip />
    <Badge d={icon} size={28} />
    <span style={{ fontFamily: serif, fontSize: 17, fontWeight: 700, color: BROWN, letterSpacing: 1.2, textTransform: 'uppercase' }}>{children}</span>
    <Flourish />
  </div>
);

const tdC = { borderTop: `1px solid ${DOT_LINE}`, padding: '9px 6px', fontSize: 11.5, textAlign: 'center', color: '#3A2F1C', verticalAlign: 'middle' };

/* Generic premium table. columns:[{label,icon}]  rows:[[cell,...]]
   cell may be a string/number, {top,bottom}, {strong,value}, or {emblem,top}. */
export const ThemeTable = ({ columns, rows }) => (
  <div style={{ borderRadius: 10, overflow: 'hidden', border: `1px solid ${GOLD}` }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ background: HEAD_BOT, backgroundImage: HEAD_GRAD }}>
          {columns.map((c, ci) => (
            <th key={ci} style={{ padding: '7px 5px', borderRight: ci < columns.length - 1 ? '1px solid rgba(255,255,255,0.22)' : 'none', color: '#fff', verticalAlign: 'middle' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Ico d={c.icon} color="#fff" size={15} />
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 0.3 }}>{c.label}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, ri) => (
          <tr key={ri} style={{ background: ri % 2 ? '#FBF5E8' : '#fff' }}>
            {r.map((cell, ci) => {
              const obj = cell && typeof cell === 'object';
              const strong = obj && cell.strong;
              return (
                <td key={ci} style={{ ...tdC, ...(strong ? { fontWeight: 700, color: BROWN, fontSize: 12 } : {}) }}>
                  {obj
                    ? (cell.emblem
                      ? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}><Ico d={G.building} color={GOLD} size={14} /><span style={{ fontWeight: 700, color: INK_TX }}>{cell.top}</span></div>)
                      : ('top' in cell
                        ? (<><div>{cell.top}</div>{cell.bottom != null && cell.bottom !== '' && <div style={{ fontSize: 9.5, color: '#8A7A55' }}>{cell.bottom}</div>}</>)
                        : cell.value))
                    : cell}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* Left-hand bank/details list with gold badges (flex rows, badge centred on text) */
export const BankList = ({ rows, extra }) => (
  <div>
    {rows.map((b, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
        <Badge d={b.icon} size={28} />
        <div style={{ width: 120, flexShrink: 0, fontSize: 12, fontWeight: 700, color: INK_TX }}>{b.label}</div>
        <div style={{ flexShrink: 0, color: '#B9A77E', fontWeight: 700 }}>:</div>
        <div style={{ flex: 1, fontSize: 12, color: '#2C2113', wordBreak: 'break-word' }}>{b.value || '—'}</div>
      </div>
    ))}
    {extra}
  </div>
);

/* Payment summary card. lines:[{label,value}]  total:{label,pre,value} */
export const SummaryCard = ({ icon = G.receipt, title = 'PAYMENT SUMMARY', lines, total }) => (
  <div>
    <Ribbon d={icon} title={title} />
    <div style={{ border: `1px solid ${DOT_LINE}`, borderTop: 'none', background: CREAM_BG, padding: '4px 16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {lines.map((l, i) => (
            <tr key={i}>
              <td style={{ padding: '8px 0', fontSize: 12.5, color: INK_TX, textAlign: 'left', borderTop: i ? `1px dotted ${DOT_LINE}` : 'none' }}>{l.label}</td>
              <td style={{ padding: '8px 0', fontSize: 12.5, fontWeight: 600, color: INK_TX, textAlign: 'right', borderTop: i ? `1px dotted ${DOT_LINE}` : 'none' }}>{l.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: GOLD, backgroundImage: `linear-gradient(to bottom, ${GOLD_LT}, ${GOLD})`, borderRadius: '0 0 10px 10px' }}>
      <tbody>
        <tr>
          <td style={{ padding: '11px 16px', textAlign: 'left', fontFamily: serif, fontSize: 18, fontWeight: 700, color: BROWN }}>{total.label}</td>
          <td style={{ padding: '11px 16px', textAlign: 'right', fontSize: 12, color: BROWN }}>{total.pre} <strong style={{ fontSize: 21 }}>{total.value}</strong></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const PolicyLine = ({ label, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
    <Badge d="M6 6l12 12M18 6L6 18" size={22} ring="#C99A4E" glyph="#B23B2E" sw={1.4} />
    <div style={{ fontSize: 11, color: '#5A4A33' }}><strong style={{ color: BROWN }}>{label} :</strong> {text}</div>
  </div>
);

export const Policies = ({ inv }) => (
  (inv.cancellation_policy || inv.no_show_policy) ? (
    <div style={{ marginTop: 12 }}>
      {inv.cancellation_policy && <PolicyLine label="Cancellation Policy" text={inv.cancellation_policy} />}
      {inv.no_show_policy && <PolicyLine label="No Show Policy" text={inv.no_show_policy} />}
    </div>
  ) : null
);

export const DocFooter = ({ inv, contacts, signoff }) => {
  const name = signoff || inv.employee_name || inv.agent_name || 'Safar e Arabian Travel';
  return (
    <div style={{ marginTop: 14 }}>
      {contacts && contacts.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <Flourish flip />
          {contacts.map((c) => <div key={c.label} style={{ fontSize: 11, color: INK_TX }}><strong style={{ color: BROWN }}>{c.label}:</strong> {c.value}</div>)}
          <Flourish />
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
          <Flourish flip />
          <Ico d="M12 2l4 5-4 5-4-5z" color={GOLD} fill={GOLD} size={13} />
          <Flourish />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
        <div style={{ fontSize: 10.5, fontStyle: 'italic', color: '#9B8A6A' }}>Thank you for choosing Safar e Arabian</div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#6B5C3E' }}>Thanks, and Best Regards</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: BROWN }}>{name}</div>
        </div>
      </div>
    </div>
  );
};

/* Open a print window as a fallback when the server PDF route is unavailable
   (e.g. Chrome not installed on the host). Same fidelity, but shows the dialog. */
function printFallback(el, filename) {
  const title = String(filename || 'document').replace(/\.pdf$/i, '');
  const win = window.open('', '_blank', 'width=900,height=1200');
  if (!win) { alert('Please allow pop-ups for this site to download the PDF.'); return; }
  const html = `<!doctype html>
<html><head><meta charset="utf-8"/><title>${title}</title><base href="${window.location.origin}/"/>
<style>
  @page { size: A4 portrait; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
  #print-doc { width: 794px; margin: 0 auto; }
  #print-doc > * { width: 794px !important; }
  tr, table, img, svg { break-inside: avoid; page-break-inside: avoid; }
  @media screen { body { background: #9aa; padding: 16px; } }
</style></head>
<body><div id="print-doc">${el.outerHTML}</div>
<script>(function(){function go(){try{window.focus();window.print();}catch(e){}}var imgs=[].slice.call(document.images||[]);var p=imgs.filter(function(i){return !i.complete;}).length;if(!p){setTimeout(go,350);return;}imgs.forEach(function(i){if(i.complete)return;i.addEventListener('load',function(){if(--p<=0)setTimeout(go,250);});i.addEventListener('error',function(){if(--p<=0)setTimeout(go,250);});});setTimeout(go,2500);})();<\/script>
</body></html>`;
  win.document.open(); win.document.write(html); win.document.close();
}

/* PDF export. Renders the document to a real, vector PDF on the SERVER using the
   installed Chrome (`/api/admin/pdf`) and downloads it directly — no print dialog.

   We deliberately do NOT use html2canvas: it re-implements CSS layout and
   mis-places flex children (badges) in the raster even when the live page is
   correct ("text below the logo"). Server-side Chrome uses the same engine that
   draws the on-screen preview, so the PDF is pixel-identical and crisp/selectable.
   If the server has no Chrome, we fall back to the browser print dialog. */
export async function downloadDoc(el, filename) {
  if (!el) return;
  const name = String(filename || 'document').replace(/\.pdf$/i, '') + '.pdf';
  try {
    const res = await fetch('/api/admin/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: el.outerHTML, filename: name }),
    });
    if (!res.ok) throw new Error(`PDF route ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  } catch (err) {
    console.warn('Server PDF unavailable, using print fallback:', err);
    printFallback(el, name);
  }
}
