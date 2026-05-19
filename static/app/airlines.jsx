// Airline logos (inline SVGs) + helpers

const AIRLINES = {
  LATAM: {
    name: 'LATAM',
    color: '#E8106B',
    // Real LATAM mark: magenta + indigo rounded-diamond star
    logo: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect width="40" height="40" rx="9" fill="#fff"/>
        <g transform="translate(20 20)">
          <path d="M0 -11 C 3 -5 5 -3 11 0 C 5 3 3 5 0 11 C -3 5 -5 3 -11 0 C -5 -3 -3 -5 0 -11 Z" fill="#E8106B"/>
          <path d="M0 -7 C 2 -3 3 -2 7 0 C 3 2 2 3 0 7 C -2 3 -3 2 -7 0 C -3 -2 -2 -3 0 -7 Z" fill="#1B1464"/>
        </g>
      </svg>
    ),
  },
  GOL: {
    name: 'GOL',
    color: '#F37021',
    logo: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect width="40" height="40" rx="9" fill="#F37021"/>
        <text x="20" y="26" textAnchor="middle" fontFamily="-apple-system, system-ui" fontWeight="800" fontSize="15" fill="#fff" letterSpacing="0.5">GOL</text>
      </svg>
    ),
  },
  Azul: {
    name: 'Azul',
    color: '#003DA5',
    logo: (size = 24) => (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect width="40" height="40" rx="9" fill="#003DA5"/>
        <path d="M10 25 Q20 10 30 25" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <circle cx="20" cy="28" r="2.2" fill="#fff"/>
      </svg>
    ),
  },
};

Object.assign(window, { AIRLINES });
