// Shared UI primitives

// ─── Icons (minimal SVGs) ──────────────────────────────────
const Icon = {
  plane: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M10.5 16.5l-3 2-1-1 2-3-5-1.5L4 11l6 .5 3.5-4-7-5L8 1l10 3 3-3 1.5 1.5-3 3 3 10-1.5 1.5-5-7-4 3.5L12.5 19l-1 1z" fill={c}/>
    </svg>
  ),
  home: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-6h-6v6H5a2 2 0 01-2-2v-9z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  building: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M3 21h18" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <rect x="8" y="7" width="2.5" height="2.5" rx="0.4" fill={c}/>
      <rect x="13.5" y="7" width="2.5" height="2.5" rx="0.4" fill={c}/>
      <rect x="8" y="11.5" width="2.5" height="2.5" rx="0.4" fill={c}/>
      <rect x="13.5" y="11.5" width="2.5" height="2.5" rx="0.4" fill={c}/>
      <path d="M10 21v-4h4v4" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  airbnbLogo: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 2.2c-1.4 0-2.5.9-3.3 2.2-.8 1.3-1.4 2.9-2.9 6.2-1.5 3.3-2.3 5-2.6 6.5-.3 1.5 0 2.9 1 3.9 1 1 2.3 1.3 3.6 1 1.3-.3 2.5-1.2 4-2.6l.3-.3.2.3c1.5 1.4 2.7 2.3 4 2.6 1.3.3 2.6 0 3.6-1 1-1 1.3-2.4 1-3.9-.3-1.5-1.1-3.2-2.6-6.5-1.5-3.3-2.1-4.9-2.9-6.2C14.5 3.1 13.4 2.2 12 2.2z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
    </svg>
  ),
  car: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 11l1.5-4A2 2 0 018.4 5.5h7.2a2 2 0 011.9 1.5L19 11M3 11h18v6a1 1 0 01-1 1h-1a2 2 0 01-2-2H7a2 2 0 01-2 2H4a1 1 0 01-1-1v-6z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="7" cy="14.5" r="1.2" fill={c}/>
      <circle cx="17" cy="14.5" r="1.2" fill={c}/>
    </svg>
  ),
  fork: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M7 3v7a2 2 0 002 2v9M11 3v7M9 3v7M15 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4v10" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  parking: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke={c} strokeWidth="2"/>
      <path d="M9 17V7h4a3 3 0 010 6H9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  key: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="15" r="4" stroke={c} strokeWidth="2"/>
      <path d="M10.8 12.2L20 3m-4 2l2 2m-5 5l2 2" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  sparkle: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" fill={c}/>
    </svg>
  ),
  dots: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.5" fill={c}/>
      <circle cx="12" cy="12" r="1.5" fill={c}/>
      <circle cx="19" cy="12" r="1.5" fill={c}/>
    </svg>
  ),
  check: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5 9-11" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  plus: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  chevronRight: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M9 5l7 7-7 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  chevronLeft: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  close: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke={c} strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  search: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke={c} strokeWidth="2"/>
      <path d="M16.5 16.5L21 21" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  calendar: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="16" rx="2" stroke={c} strokeWidth="2"/>
      <path d="M3 10h18M8 3v4M16 3v4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  chart: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  cog: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="2"/>
      <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  list: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M8 6h13M8 12h13M8 18h13" stroke={c} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="4" cy="6" r="1" fill={c}/>
      <circle cx="4" cy="12" r="1" fill={c}/>
      <circle cx="4" cy="18" r="1" fill={c}/>
    </svg>
  ),
  alert: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L2 20h20L12 3z" stroke={c} strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 10v4M12 17v.5" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  download: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3v12m0 0l-5-5m5 5l5-5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  pin: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z" stroke={c} strokeWidth="2"/>
      <circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="2"/>
    </svg>
  ),
  sun: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" stroke={c} strokeWidth="2"/>
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke={c} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  moon: (c, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" fill={c}/>
    </svg>
  ),
};

// Category icon mapping
function CatIcon({ cat, size = 14, color = '#fff' }) {
  const map = {
    flight: Icon.plane, hotel: Icon.home, transport: Icon.car,
    food: Icon.fork, parking: Icon.parking, carRental: Icon.key,
    leisure: Icon.sparkle, other: Icon.dots,
  };
  const fn = map[cat] || Icon.dots;
  return fn(color, size);
}

// Pill badge
function Pill({ children, bg, color, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 9px', borderRadius: 999,
      background: bg, color, fontSize: 11, fontWeight: 600,
      letterSpacing: 0.1, lineHeight: 1.2,
      ...style,
    }}>{children}</span>
  );
}

// Section heading
function SectionHead({ children, action, theme }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '0 20px', marginBottom: 10,
    }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: theme.textMuted,
        textTransform: 'uppercase', letterSpacing: 0.6,
      }}>{children}</div>
      {action}
    </div>
  );
}

// Inset card
function Card({ children, theme, pad = 16, radius, style }) {
  return (
    <div style={{
      background: theme.card, borderRadius: radius ?? theme.cardRadius,
      padding: pad, border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow,
      ...style,
    }}>{children}</div>
  );
}

// Tiny donut chart for % spent
function Donut({ pct, size = 64, stroke = 8, color, track }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const o = c * (1 - Math.min(pct, 1));
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={o}
        style={{ transition: 'stroke-dashoffset 500ms cubic-bezier(.2,.8,.2,1)' }}/>
    </svg>
  );
}

// Horizontal stacked bar of category percentages
function CategoryBar({ expenses, total, height = 8, radius = 4 }) {
  const byCat = {};
  expenses.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });
  const entries = Object.entries(byCat).sort((a,b) => b[1]-a[1]);
  return (
    <div style={{
      width: '100%', height, borderRadius: radius,
      overflow: 'hidden', display: 'flex',
      background: 'rgba(120,120,128,0.16)',
    }}>
      {entries.map(([k, v]) => (
        <div key={k} style={{
          width: `${(v / total) * 100}%`,
          background: CATEGORIES[k].color,
        }} />
      ))}
    </div>
  );
}

// Theme hook
function useTheme(dark, accent, cardStyle) {
  return React.useMemo(() => {
    const styles = {
      soft: { cardRadius: 22, cardShadow: dark ? 'none' : '0 1px 2px rgba(0,0,0,0.03)' },
      flat: { cardRadius: 14, cardShadow: 'none' },
      elevated: { cardRadius: 18, cardShadow: dark ? '0 4px 14px rgba(0,0,0,0.4)' : '0 4px 14px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)' },
    };
    const cs = styles[cardStyle] || styles.soft;
    return {
      dark,
      accent,
      bg: dark ? '#000' : '#F2F2F7',
      bgSecondary: dark ? '#0B0B0D' : '#EEF0F4',
      card: dark ? '#1C1C1E' : '#FFFFFF',
      cardAlt: dark ? '#2C2C2E' : '#F8F9FB',
      text: dark ? '#FFFFFF' : '#000000',
      textMuted: dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.65)',
      textTertiary: dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)',
      border: dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
      separator: dark ? 'rgba(84,84,88,0.55)' : 'rgba(60,60,67,0.12)',
      success: '#30D158',
      warning: '#FF9F0A',
      danger: '#FF453A',
      ...cs,
    };
  }, [dark, accent, cardStyle]);
}

Object.assign(window, { Icon, CatIcon, Pill, SectionHead, Card, Donut, CategoryBar, useTheme });
