// Calendar (home) screen — Airbnb/Booking-style modern home

// ── City visual catalog (gradients + simple silhouette / motif) ──
const CITY_VISUALS = {
  'São Paulo':       { from: '#1E3A8A', to: '#7C3AED', motif: 'city',   emoji: '🏙️' },
  'Rio de Janeiro':  { from: '#0EA5E9', to: '#F59E0B', motif: 'mountain', emoji: '⛰️' },
  'Porto Alegre':    { from: '#0F766E', to: '#22C55E', motif: 'water',  emoji: '🌳' },
  'Belo Horizonte':  { from: '#7C2D12', to: '#F97316', motif: 'hills',  emoji: '⛰️' },
  'Curitiba':        { from: '#065F46', to: '#10B981', motif: 'forest', emoji: '🌲' },
  'Nova York':       { from: '#0F172A', to: '#475569', motif: 'skyline',emoji: '🌃' },
  'New York':        { from: '#0F172A', to: '#475569', motif: 'skyline',emoji: '🌃' },
  'Brasília':        { from: '#1E40AF', to: '#0EA5E9', motif: 'modern', emoji: '🏛️' },
  'Salvador':        { from: '#9A3412', to: '#FBBF24', motif: 'coast',  emoji: '🏖️' },
  'Recife':          { from: '#0E7490', to: '#06B6D4', motif: 'coast',  emoji: '🏖️' },
  'Florianópolis':   { from: '#0369A1', to: '#22D3EE', motif: 'coast',  emoji: '🏖️' },
};

function getCityVisual(city) {
  return CITY_VISUALS[city] || { from: '#0F172A', to: '#3B82F6', motif: 'city', emoji: '✈️' };
}

// SVG silhouette painters
const Skyline = ({ motif, color = '#fff', opacity = 0.18 }) => {
  const paths = {
    city: 'M0 100 L0 70 L8 70 L8 55 L18 55 L18 65 L26 65 L26 40 L36 40 L36 55 L44 55 L44 30 L54 30 L54 50 L62 50 L62 60 L72 60 L72 45 L82 45 L82 65 L92 65 L92 55 L100 55 L100 100 Z',
    skyline: 'M0 100 L0 60 L6 60 L6 45 L12 45 L12 55 L18 55 L18 25 L24 25 L24 50 L30 50 L30 35 L38 35 L38 55 L44 55 L44 20 L50 20 L50 50 L56 50 L56 40 L64 40 L64 55 L70 55 L70 30 L78 30 L78 50 L84 50 L84 45 L92 45 L92 60 L100 60 L100 100 Z',
    modern: 'M0 100 L0 70 L20 70 L20 55 L40 55 L40 65 L50 50 L60 65 L60 55 L80 55 L80 70 L100 70 L100 100 Z',
    mountain: 'M0 100 L0 80 L15 50 L30 70 L50 30 L70 65 L85 45 L100 75 L100 100 Z',
    hills:   'M0 100 L0 80 L20 60 L40 75 L60 55 L80 70 L100 60 L100 100 Z',
    forest:  'M0 100 L0 75 L8 60 L12 70 L20 55 L26 70 L34 60 L42 70 L50 55 L58 70 L66 60 L74 70 L82 55 L90 70 L100 65 L100 100 Z',
    water:   'M0 100 L0 78 Q10 72 20 78 T40 78 T60 78 T80 78 T100 78 L100 100 Z',
    coast:   'M0 100 L0 80 Q15 70 30 80 T60 80 T100 80 L100 100 Z',
  };
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path d={paths[motif] || paths.city} fill={color} opacity={opacity}/>
    </svg>
  );
};

function HeroCard({ trip, theme, lang, onClick }) {
  const L = STR[lang];
  const v = getCityVisual(trip.city);
  const status = tripStatus(trip);
  const isOngoing = status.state === 'ongoing';
  const spent = tripSpent(trip);
  const pct = Math.min(spent / trip.budget, 1);
  const pending = tripPending(trip);

  const countdown = (() => {
    if (isOngoing) {
      const total = (parseDate(trip.end) - parseDate(trip.start)) / 86400000;
      const elapsed = (TODAY - parseDate(trip.start)) / 86400000;
      const remaining = Math.max(0, Math.ceil(total - elapsed));
      return remaining === 0 ? L.lastDay || (lang === 'pt' ? 'Último dia' : 'Last day') :
             `${remaining} ${remaining === 1 ? (lang === 'pt' ? 'dia restante' : 'day left') : (lang === 'pt' ? 'dias restantes' : 'days left')}`;
    }
    if (status.state === 'upcoming') {
      if (status.days === 0) return lang === 'pt' ? 'Hoje' : 'Today';
      if (status.days === 1) return lang === 'pt' ? 'Amanhã' : 'Tomorrow';
      return lang === 'pt' ? `em ${status.days} dias` : `in ${status.days} days`;
    }
    return fmtDateRange(trip.start, trip.end, lang);
  })();

  return (
    <div onClick={onClick} style={{
      borderRadius: 22, cursor: 'pointer', position: 'relative', overflow: 'hidden',
      height: 244,
      background: `linear-gradient(135deg, ${v.from} 0%, ${v.to} 100%)`,
      boxShadow: '0 12px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
    }}>
      {/* Skyline silhouette */}
      <Skyline motif={v.motif} color="#000" opacity={0.22}/>
      <Skyline motif={v.motif} color="#fff" opacity={0.10}/>

      {/* Soft top vignette for legibility of top label */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 35%, transparent 55%, rgba(0,0,0,0.45) 100%)' }}/>

      {/* Top row: status pill + airline */}
      <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 11px 5px 8px', borderRadius: 999,
          background: 'rgba(255,255,255,0.22)',
          backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
          border: '0.5px solid rgba(255,255,255,0.4)',
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: 999, background: '#fff',
            animation: isOngoing ? 'pulse 1.6s ease-in-out infinite' : 'none',
            boxShadow: isOngoing ? '0 0 0 3px rgba(255,255,255,0.35)' : 'none',
          }}/>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {isOngoing ? L.ongoing : L.nextTrip}
          </div>
        </div>
        {trip.airline && AIRLINES[trip.airline] && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px 5px 6px', borderRadius: 999,
            background: 'rgba(255,255,255,0.95)',
          }}>
            <div style={{ display: 'flex' }}>{AIRLINES[trip.airline].logo(20)}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#111', letterSpacing: 0.2 }}>{trip.airline}</div>
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 18, color: '#fff', zIndex: 2 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: 0.2, marginBottom: 2 }}>
          {trip.country === 'US' ? 'United States' : (lang === 'pt' ? 'Brasil' : 'Brazil')}
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: -0.6, lineHeight: 1.05 }}>
          {trip.city}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.92)' }}>
          <div>{fmtDateRange(trip.start, trip.end, lang)}</div>
          <div style={{ width: 3, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.6)' }}/>
          <div style={{ fontWeight: 600 }}>{countdown}</div>
        </div>

        {/* Mini stats row in glass */}
        <div style={{
          marginTop: 14, padding: '10px 12px', borderRadius: 14,
          background: 'rgba(255,255,255,0.18)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '0.5px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{L.spent}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2, letterSpacing: -0.2 }}>
              {fmtMoneyShort(spent)} <span style={{ fontWeight: 500, opacity: 0.75 }}>/ {fmtMoneyShort(trip.budget)}</span>
            </div>
            <div style={{ marginTop: 6, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
              <div style={{ width: `${pct * 100}%`, height: '100%', background: '#fff', borderRadius: 999 }}/>
            </div>
          </div>
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.3)' }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{L.pending}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginTop: 2 }}>
              {pending.length === 0 ? L.allSet : L.itemsPending(pending.length)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniTripCard({ trip, theme, lang, onClick }) {
  const v = getCityVisual(trip.city);
  const status = tripStatus(trip);
  const L = STR[lang];
  const pending = tripPending(trip);
  const isPast = status.state === 'past';
  const labelTop = (() => {
    if (status.state === 'ongoing') return L.ongoing;
    if (status.state === 'upcoming') {
      if (status.days === 0) return L.today;
      if (status.days === 1) return L.tomorrow;
      return L.inDays(status.days);
    }
    return fmtDateRange(trip.start, trip.end, lang);
  })();
  return (
    <div onClick={onClick} style={{
      flexShrink: 0, width: 168, height: 200, cursor: 'pointer',
      borderRadius: 18, overflow: 'hidden', position: 'relative',
      background: `linear-gradient(150deg, ${v.from} 0%, ${v.to} 100%)`,
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
    }}>
      <Skyline motif={v.motif} color="#000" opacity={0.22}/>
      <Skyline motif={v.motif} color="#fff" opacity={0.10}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.10) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)' }}/>

      {/* Top: status pill + airline */}
      <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
        <div style={{
          fontSize: 9.5, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5,
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
          padding: '4px 8px', borderRadius: 999, border: '0.5px solid rgba(255,255,255,0.35)',
        }}>{labelTop}</div>
        {trip.airline && AIRLINES[trip.airline] && (
          <div style={{
            width: 22, height: 22, borderRadius: 999, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}>{AIRLINES[trip.airline].logo(18)}</div>
        )}
      </div>

      {/* Bottom: city + dates + pending indicator */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, color: '#fff', zIndex: 2 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.3, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {trip.city}
        </div>
        <div style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
          {fmtDateRange(trip.start, trip.end, lang)}
        </div>

        {/* Pending / all-set status pill */}
        {!isPast && (
          pending.length > 0 ? (
            <div style={{
              marginTop: 8,
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(255,159,10,0.92)',
              padding: '3px 8px 3px 6px', borderRadius: 999,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <div style={{ display: 'flex' }}>{Icon.alert('#fff', 10)}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.2 }}>
                {L.itemsPending(pending.length)}
              </span>
            </div>
          ) : (
            <div style={{
              marginTop: 8,
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(48,209,88,0.92)',
              padding: '3px 8px 3px 6px', borderRadius: 999,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <div style={{ display: 'flex' }}>{Icon.check('#fff', 10)}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: 0.2 }}>
                {L.allSet}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function CalendarScreen({ theme, lang, trips, onOpenTrip, onNewTrip }) {
  const L = STR[lang];
  const [cursor, setCursor] = React.useState(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dayMap = {};
  trips.forEach(t => {
    const s = parseDate(t.start), e = parseDate(t.end);
    for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        (dayMap[day] ||= []).push(t);
      }
    }
  });

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const monthTrips = trips.filter(t => {
    const s = parseDate(t.start), e = parseDate(t.end);
    return e >= monthStart && s <= monthEnd;
  }).sort((a,b) => parseDate(a.start) - parseDate(b.start));

  const monthExpenses = trips.flatMap(t => t.expenses.filter(e => {
    const d = parseDate(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }));
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);

  const activeTrip = trips.find(t => tripStatus(t).state === 'ongoing');
  const upcoming = trips
    .filter(t => parseDate(t.start) >= TODAY)
    .sort((a,b) => parseDate(a.start) - parseDate(b.start));
  const heroTrip = activeTrip || upcoming[0];
  const otherUpcoming = upcoming.filter(t => !heroTrip || t.id !== heroTrip.id).slice(0, 8);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => (
    TODAY.getFullYear() === year && TODAY.getMonth() === month && TODAY.getDate() === d
  );

  const greeting = (() => {
    const h = TODAY.getHours();
    if (lang === 'pt') {
      if (h < 12) return 'Bom dia';
      if (h < 18) return 'Boa tarde';
      return 'Boa noite';
    }
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  // Year-to-date trip count
  const yearTrips = trips.filter(t => parseDate(t.start).getFullYear() === year).length;

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Greeting header — text left, "new trip" button right */}
      <div style={{
        padding: '4px 22px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, color: theme.textMuted, fontWeight: 500, letterSpacing: 0.1 }}>
            {greeting},
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color: theme.text, letterSpacing: -0.6, lineHeight: 1.1, marginTop: 2 }}>
            {lang === 'pt' ? 'pronto para a próxima viagem?' : 'ready for your next trip?'}
          </div>
        </div>
        <button onClick={onNewTrip} aria-label={L.newTrip} style={{
          width: 44, height: 44, borderRadius: 999, border: 'none',
          background: theme.accent, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
          boxShadow: `0 6px 16px ${theme.accent}55, 0 1px 3px rgba(0,0,0,0.15)`,
        }}>{Icon.plus('#fff', 22)}</button>
      </div>

      {/* Hero trip card */}
      {heroTrip && (
        <div style={{ padding: '0 16px 22px' }}>
          <HeroCard trip={heroTrip} theme={theme} lang={lang} onClick={() => onOpenTrip(heroTrip.id)}/>
        </div>
      )}

      {/* Empty state if no upcoming */}
      {!heroTrip && (
        <div style={{ padding: '0 16px 22px' }}>
          <div style={{
            padding: '38px 18px', textAlign: 'center', borderRadius: 22,
            background: `linear-gradient(135deg, ${theme.accent}18, ${theme.accent}05)`,
            border: `1px dashed ${theme.accent}55`,
          }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>✈️</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, letterSpacing: -0.2 }}>
              {lang === 'pt' ? 'Sem viagens à vista' : 'No trips ahead'}
            </div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4, maxWidth: 260, marginLeft: 'auto', marginRight: 'auto' }}>
              {lang === 'pt' ? 'Quando agendar uma nova viagem ela aparece aqui.' : 'When you book a new trip it shows up here.'}
            </div>
          </div>
        </div>
      )}

      {/* Upcoming carousel */}
      {otherUpcoming.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: '0 22px 12px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
              {lang === 'pt' ? 'Próximas viagens' : 'Upcoming trips'}
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>
              {otherUpcoming.length}
            </div>
          </div>
          <div style={{
            display: 'flex', gap: 12, overflowX: 'auto', overflowY: 'hidden',
            padding: '2px 16px 6px', scrollSnapType: 'x mandatory',
          }}>
            {otherUpcoming.map(t => (
              <div key={t.id} style={{ scrollSnapAlign: 'start' }}>
                <MiniTripCard trip={t} theme={theme} lang={lang} onClick={() => onOpenTrip(t.id)}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar — section header with month switcher */}
      <div style={{
        padding: '6px 22px 12px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
            {L.monthFull[month]} <span style={{ color: theme.textMuted, fontWeight: 600 }}>{year}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} style={navBtn(theme)}>
            {Icon.chevronLeft(theme.text, 16)}
          </button>
          <button onClick={() => setCursor(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))} style={{
            ...navBtn(theme), width: 'auto', padding: '0 12px', fontSize: 12, fontWeight: 700, color: theme.accent,
          }}>{L.jumpToToday}</button>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} style={navBtn(theme)}>
            {Icon.chevronRight(theme.text, 16)}
          </button>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <Card theme={theme} pad={14}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
            {L.weekdays.map((w, i) => (
              <div key={i} style={{
                textAlign: 'center', fontSize: 11, fontWeight: 600,
                color: theme.textMuted, padding: '6px 0', letterSpacing: 0.3,
              }}>{w}</div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
            {cells.map((d, i) => {
              if (d === null) return <div key={i} style={{ aspectRatio: '1' }}/>;
              const dayTrips = dayMap[d] || [];
              const today = isToday(d);
              const trip = dayTrips[0];
              const date = new Date(year, month, d);
              const isStart = trip && parseDate(trip.start).getTime() === date.getTime();
              const isEnd = trip && parseDate(trip.end).getTime() === date.getTime();
              const isSingle = trip && isStart && isEnd;
              return (
                <div key={i} onClick={() => trip && onOpenTrip(trip.id)} style={{
                  aspectRatio: '1', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: trip ? 'pointer' : 'default',
                }}>
                  {trip && (
                    <div style={{
                      position: 'absolute', top: 3, bottom: 3,
                      left: isStart || isSingle ? 4 : 0,
                      right: isEnd || isSingle ? 4 : 0,
                      background: today ? theme.accent : `${theme.accent}1F`,
                      borderTopLeftRadius: isStart || isSingle ? 999 : 0,
                      borderBottomLeftRadius: isStart || isSingle ? 999 : 0,
                      borderTopRightRadius: isEnd || isSingle ? 999 : 0,
                      borderBottomRightRadius: isEnd || isSingle ? 999 : 0,
                    }}/>
                  )}
                  {today && !trip && (
                    <div style={{
                      position: 'absolute',
                      width: 34, height: 34, borderRadius: 999,
                      background: theme.accent,
                    }}/>
                  )}
                  <div style={{
                    position: 'relative', zIndex: 1,
                    fontSize: 15,
                    fontWeight: today ? 700 : (trip ? 600 : 500),
                    color: today ? '#fff' : (trip ? theme.accent : theme.text),
                    letterSpacing: -0.2,
                  }}>{d}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Trips this month */}
      <div style={{ marginTop: 22 }}>
        <div style={{ padding: '0 22px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 19, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
            {lang === 'pt' ? 'Viagens do mês' : 'This month'}
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500 }}>
            {monthTrips.length} {monthTrips.length === 1 ? L.trip : L.trips}
          </div>
        </div>
        {monthTrips.length === 0 ? (
          <div style={{
            margin: '0 16px', padding: '24px 16px', textAlign: 'center',
            color: theme.textMuted, fontSize: 14,
            background: theme.card, borderRadius: theme.cardRadius,
            border: `1px solid ${theme.border}`,
          }}>{L.noTripsMonth}</div>
        ) : (
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {monthTrips.map(t => (
              <TripRow key={t.id} trip={t} theme={theme} lang={lang} onClick={() => onOpenTrip(t.id)}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function nextTripLabel(t, lang) {
  const L = STR[lang];
  const st = tripStatus(t);
  if (st.state === 'ongoing') return `${t.city} · ${L.ongoing}`;
  if (st.state === 'upcoming') {
    if (st.days === 0) return L.today;
    if (st.days === 1) return L.tomorrow;
    return L.inDays(st.days);
  }
  return fmtDateRange(t.start, t.end, lang);
}

function navBtn(theme) {
  return {
    width: 36, height: 36, borderRadius: 999,
    border: 'none', background: theme.card,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', padding: 0,
  };
}

function TripRow({ trip, theme, lang, onClick }) {
  const L = STR[lang];
  const v = getCityVisual(trip.city);
  const spent = tripSpent(trip);
  const pct = Math.min(spent / trip.budget, 1);
  const pending = tripPending(trip);
  const status = tripStatus(trip);
  const over = spent > trip.budget;

  const statusLabel = (() => {
    if (status.state === 'ongoing') return L.ongoing;
    if (status.state === 'upcoming') {
      if (status.days === 0) return L.today;
      if (status.days === 1) return L.tomorrow;
      return L.inDays(status.days);
    }
    return L.daysAgo(status.days);
  })();

  const statusColor = status.state === 'ongoing' ? theme.accent :
                      status.state === 'upcoming' ? theme.text : theme.textMuted;

  return (
    <div onClick={onClick} style={{
      background: theme.card, borderRadius: 18,
      border: `1px solid ${theme.border}`,
      boxShadow: theme.cardShadow, cursor: 'pointer',
      display: 'flex', overflow: 'hidden',
    }}>
      {/* Thumb — gradient + skyline */}
      <div style={{
        width: 88, flexShrink: 0, position: 'relative',
        background: `linear-gradient(140deg, ${v.from} 0%, ${v.to} 100%)`,
      }}>
        <Skyline motif={v.motif} color="#000" opacity={0.22}/>
        <Skyline motif={v.motif} color="#fff" opacity={0.10}/>
        {trip.airline && AIRLINES[trip.airline] && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            width: 22, height: 22, borderRadius: 999, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}>{AIRLINES[trip.airline].logo(18)}</div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                {statusLabel}
              </div>
              {pending.length > 0 && status.state !== 'past' && (
                <Pill bg={`${theme.warning}22`} color={theme.warning}>
                  {L.itemsPending(pending.length)}
                </Pill>
              )}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, letterSpacing: -0.3, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {trip.city}
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
              {fmtDateRange(trip.start, trip.end, lang)}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: over ? theme.danger : theme.text, letterSpacing: -0.2 }}>
              {fmtMoneyShort(spent)}
            </div>
            <div style={{ fontSize: 10.5, color: theme.textMuted }}>
              / {fmtMoneyShort(trip.budget)}
            </div>
          </div>
        </div>
        <div style={{ height: 3, borderRadius: 999, background: 'rgba(120,120,128,0.18)', overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0, width: `${pct * 100}%`,
            background: over ? theme.danger : theme.accent, borderRadius: 999,
            transition: 'width 400ms ease',
          }}/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CalendarScreen, TripRow, nextTripLabel, navBtn, getCityVisual, Skyline, HeroCard, MiniTripCard });
