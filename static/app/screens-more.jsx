// Trips list, Trip detail, New trip, Reports, Settings screens

// ─── Trips list ──────────────────────────────────────────
function TripsListScreen({ theme, lang, trips, onOpenTrip, onNewTrip }) {
  const L = STR[lang];
  const [filter, setFilter] = React.useState('upcoming');

  const filtered = React.useMemo(() => {
    const list = [...trips].sort((a,b) => parseDate(a.start) - parseDate(b.start));
    if (filter === 'upcoming') return list.filter(t => parseDate(t.end) >= TODAY);
    if (filter === 'past') return list.filter(t => parseDate(t.end) < TODAY).reverse();
    return list;
  }, [trips, filter]);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
          {L.tabTrips}
        </div>
        {onNewTrip && (
          <button onClick={onNewTrip} style={{
            height: 36, padding: '0 12px 0 10px', borderRadius: 999, border: 'none',
            background: `${theme.accent}1A`, color: theme.accent,
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {Icon.plus(theme.accent, 15)} {L.newTrip}
          </button>
        )}
      </div>

      {/* Segmented control */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          display: 'flex', padding: 3, borderRadius: 10,
          background: theme.dark ? 'rgba(118,118,128,0.24)' : 'rgba(118,118,128,0.12)',
        }}>
          {[['upcoming', L.upcoming], ['past', L.past], ['all', L.all]].map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} style={{
              flex: 1, padding: '8px 0', border: 'none', borderRadius: 7,
              background: filter === k ? theme.accent : 'transparent',
              color: filter === k ? '#fff' : theme.textMuted,
              fontSize: 13, fontWeight: filter === k ? 700 : 500,
              boxShadow: filter === k ? `0 4px 10px ${theme.accent}33, 0 1px 2px ${theme.accent}22` : 'none',
              cursor: 'pointer', transition: 'all 200ms',
              letterSpacing: filter === k ? 0.1 : 0,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(t => (
          <TripRow key={t.id} trip={t} theme={theme} lang={lang} onClick={() => onOpenTrip(t.id)}/>
        ))}
      </div>
    </div>
  );
}

// ─── Trip detail ─────────────────────────────────────────
function TripDetailScreen({ theme, lang, trip, onBack, onAddExpense, onAddLodging, onAddToCalendar }) {
  const L = STR[lang];
  const spent = tripSpent(trip);
  const pct = spent / trip.budget;
  const remaining = trip.budget - spent;
  const over = spent > trip.budget;
  const pending = tripPending(trip);
  const status = tripStatus(trip);
  const nights = daysBetween(parseDate(trip.start), parseDate(trip.end));

  // Group expenses by date
  const byDate = {};
  [...trip.expenses].sort((a,b) => b.date.localeCompare(a.date)).forEach(e => {
    (byDate[e.date] ||= []).push(e);
  });

  const avgDaily = spent / Math.max(nights, 1);

  // Category breakdown
  const byCat = {};
  trip.expenses.forEach(e => { byCat[e.cat] = (byCat[e.cat] || 0) + e.amount; });
  const catList = Object.entries(byCat).sort((a,b) => b[1]-a[1]);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Top bar */}
      <div style={{ padding: '4px 12px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{
          height: 36, padding: '0 12px 0 8px', borderRadius: 999,
          border: 'none', background: 'transparent', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 2, color: theme.accent,
          fontSize: 17, fontWeight: 500,
        }}>
          {Icon.chevronLeft(theme.accent, 20)} {L.tabTrips}
        </button>
        <button style={{
          height: 36, padding: '0 14px', borderRadius: 999, border: 'none',
          background: 'transparent', color: theme.accent, fontSize: 17,
          fontWeight: 500, cursor: 'pointer',
        }}>{L.edit}</button>
      </div>

      {/* Header */}
      <div style={{ padding: '12px 20px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          {Icon.pin(theme.textMuted, 14)}
          <span style={{ fontSize: 13, color: theme.textMuted, fontWeight: 500 }}>
            {trip.city}, {trip.country}
          </span>
        </div>
        <div style={{ fontSize: 28, fontWeight: 700, color: theme.text, letterSpacing: -0.5, lineHeight: 1.15 }}>
          {trip.name}
        </div>
        <div style={{ fontSize: 15, color: theme.textMuted, marginTop: 4 }}>
          {fmtDateRange(trip.start, trip.end, lang)} · {L.nights(nights)}
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          {onAddToCalendar && (
            <button onClick={onAddToCalendar} style={{
              flex: 1, height: 38, padding: '0 14px', borderRadius: 10, border: 'none',
              background: `${theme.accent}18`, color: theme.accent,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="2"/>
                <path d="M3 9h18"/><path d="M8 3v4"/><path d="M16 3v4"/>
              </svg>
              {L.addToCalendar}
            </button>
          )}
        </div>
      </div>

      {/* Budget card — hero */}
      <div style={{ padding: '0 16px 14px' }}>
        <Card theme={theme} pad={18}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {L.spent}
              </div>
              <div style={{ fontSize: 30, fontWeight: 700, color: over ? theme.danger : theme.text, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 2 }}>
                {fmtMoney(spent)}
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>
                {over ? L.overBudget : `${fmtMoney(remaining)} ${L.budgetLeft.toLowerCase()}`} · {L.budget} {fmtMoneyShort(trip.budget)}
              </div>
            </div>
            <Donut pct={pct} size={72} stroke={8} color={over ? theme.danger : theme.accent}
              track={theme.dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}/>
          </div>

          <CategoryBar expenses={trip.expenses} total={spent || 1}/>

          {/* Key stats */}
          <div style={{ display: 'flex', marginTop: 14, paddingTop: 14, borderTop: `1px solid ${theme.separator}` }}>
            <Stat label={L.avgDaily} value={fmtMoneyShort(avgDaily)} theme={theme}/>
            <div style={{ width: 1, background: theme.separator, margin: '0 4px' }}/>
            <Stat label={L.expenses} value={trip.expenses.length} theme={theme}/>
            <div style={{ width: 1, background: theme.separator, margin: '0 4px' }}/>
            <Stat label={L.duration} value={L.days(nights + 1)} theme={theme}/>
          </div>
        </Card>
      </div>

      {/* Flights (info, not pending) */}
      <SectionHead theme={theme}>{L.flights}</SectionHead>
      <div style={{ padding: '0 16px', marginBottom: 22 }}>
        <FlightsUnifiedCard theme={theme} lang={lang} L={L} trip={trip}/>
      </div>

      {/* Lodging */}
      <SectionHead
        theme={theme}
        action={onAddLodging && trip.checklist.lodging?.done ? (
          <button onClick={onAddLodging} style={{
            border: 'none', background: 'transparent', color: theme.accent,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0,
          }}>{L.edit}</button>
        ) : null}
      >{L.lodging}</SectionHead>
      <div style={{ padding: '0 16px', marginBottom: 22 }}>
        {trip.checklist.lodging?.done ? (
          <Card theme={theme} pad={0}>
            <LodgingRow theme={theme} lang={lang} item={trip.checklist.lodging} L={L}/>
          </Card>
        ) : (
          <button onClick={onAddLodging} style={{
            width: '100%', padding: '18px 16px', borderRadius: theme.cardRadius,
            border: `1.5px dashed ${theme.border}`,
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 12,
            textAlign: 'left',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${theme.accent}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {Icon.plus(theme.accent, 18)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{L.addLodging}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{L.noLodgingYet}</div>
            </div>
            {Icon.chevronRight(theme.textTertiary, 16)}
          </button>
        )}
      </div>

      {/* Notes */}
      {trip.notes && (
        <>
          <SectionHead theme={theme}>{L.tripNotes}</SectionHead>
          <div style={{ padding: '0 16px', marginBottom: 22 }}>
            <Card theme={theme} pad={14}>
              <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {trip.notes}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Category breakdown */}
      {catList.length > 0 && (
        <>
          <SectionHead theme={theme}>{L.byCategory}</SectionHead>
          <div style={{ padding: '0 16px', marginBottom: 22 }}>
            <Card theme={theme} pad={0}>
              {catList.map(([k, v], i) => {
                const cat = CATEGORIES[k];
                const catPct = v / spent;
                return (
                  <div key={k}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: cat.color, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <CatIcon cat={k} size={17}/>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>
                          {lang === 'pt' ? cat.labelPt : cat.labelEn}
                        </div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                          {(catPct * 100).toFixed(0)}% · {trip.expenses.filter(e => e.cat === k).length} {trip.expenses.filter(e => e.cat === k).length === 1 ? 'item' : 'itens'}
                        </div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, letterSpacing: -0.2 }}>
                        {fmtMoney(v)}
                      </div>
                    </div>
                    {i < catList.length - 1 && <Separator theme={theme}/>}
                  </div>
                );
              })}
            </Card>
          </div>
        </>
      )}

      {/* Expenses log */}
      <SectionHead
        theme={theme}
        action={
          <button onClick={onAddExpense} style={{
            border: 'none', background: 'transparent', color: theme.accent,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>{Icon.plus(theme.accent, 14)} {L.addExpense}</button>
        }
      >{L.expenses}</SectionHead>

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {Object.keys(byDate).length === 0 ? (
          <Card theme={theme} pad={22} style={{ textAlign: 'center', color: theme.textMuted, fontSize: 14 }}>
            Sem gastos registrados
          </Card>
        ) : (
          Object.entries(byDate).map(([date, items]) => (
            <div key={date}>
              <div style={{
                fontSize: 12, fontWeight: 600, color: theme.textMuted,
                textTransform: 'uppercase', letterSpacing: 0.5,
                padding: '0 4px 8px',
              }}>{fmtDateLong(date, lang)}</div>
              <Card theme={theme} pad={0}>
                {items.map((e, i) => {
                  const cat = CATEGORIES[e.cat];
                  return (
                    <div key={e.id}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: 9, background: cat.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <CatIcon cat={e.cat} size={15}/>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {e.desc}
                          </div>
                          <div style={{ fontSize: 12, color: theme.textMuted }}>
                            {lang === 'pt' ? cat.labelPt : cat.labelEn}
                          </div>
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, letterSpacing: -0.2 }}>
                          {fmtMoney(e.amount)}
                        </div>
                      </div>
                      {i < items.length - 1 && <Separator theme={theme}/>}
                    </div>
                  );
                })}
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, theme }) {
  return (
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginTop: 3, letterSpacing: -0.2 }}>
        {value}
      </div>
    </div>
  );
}

function Separator({ theme }) {
  return <div style={{ height: 0.5, background: theme.separator, marginLeft: 58 }}/>;
}

function FlightsUnifiedCard({ theme, lang, L, trip }) {
  const out = trip.checklist.flightOut;
  const ret = trip.checklist.flightBack;
  const airline = out?.airline || ret?.airline;
  const useLogo = airline && AIRLINES[airline];
  const booking = out?.booking || ret?.booking;
  const price = trip.flightsPrice;

  const fmtTime = (iso) => {
    if (!iso) return '';
    const t = new Date(iso);
    return `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}`;
  };
  const dayParts = (iso, lang) => {
    const d = parseDate(iso);
    const L2 = STR[lang];
    const wd = (L2.weekShort || L2.dayNames || ['D','S','T','Q','Q','S','S'])[d.getDay()];
    return {
      weekday: (wd || '').toString().toUpperCase(),
      day: d.getDate(),
      month: (L2.monthNames[d.getMonth()] || '').toString().toUpperCase(),
    };
  };

  const outTime = fmtTime(out?.time);
  const retTime = fmtTime(ret?.time);
  const outDay = dayParts(trip.start, lang);
  const retDay = dayParts(trip.end, lang);

  const Leg = ({ label, day, time, code, seat, align = 'left' }) => (
    <div style={{ flex: 1, minWidth: 0, textAlign: align }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginTop: 6,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        flexWrap: 'nowrap',
      }}>
        <div style={{
          fontSize: 30, fontWeight: 700, color: theme.text,
          letterSpacing: -1, lineHeight: 1, fontVariantNumeric: 'tabular-nums',
        }}>{day.day}</div>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: align === 'right' ? 'flex-end' : 'flex-start',
          lineHeight: 1.05,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: theme.text, letterSpacing: 0.5 }}>{day.month}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, letterSpacing: 0.6, marginTop: 2 }}>{day.weekday}</div>
        </div>
      </div>
      <div style={{
        marginTop: 6, fontSize: 13, fontWeight: 500, color: theme.textMuted,
        fontVariantNumeric: 'tabular-nums', letterSpacing: -0.1,
      }}>
        {time || '—'}
      </div>
      {code && (
        <div style={{
          fontSize: 11.5, color: theme.textMuted, marginTop: 4,
          fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: 0.3,
        }}>
          {code}{seat ? ` · ${L.seat || 'Seat'} ${seat}` : ''}
        </div>
      )}
    </div>
  );

  return (
    <Card theme={theme} pad={0}>
      {/* Header: airline + total price */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 14px 12px', gap: 12 }}>
        {useLogo ? (
          <div style={{ width: 40, height: 40, flexShrink: 0 }}>{AIRLINES[airline].logo(40)}</div>
        ) : (
          <div style={{
            width: 40, height: 40, borderRadius: 11, background: `${theme.accent}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>{Icon.plane(theme.accent, 19)}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, letterSpacing: -0.1 }}>
            {airline || L.flights}
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
            {L.roundTrip || (lang === 'pt' ? 'Ida e volta' : 'Round-trip')}
            {booking && <span> · <span style={{ fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: 0.4, fontWeight: 600, color: theme.text }}>{booking}</span></span>}
          </div>
        </div>
        {price != null && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{L.total || (lang === 'pt' ? 'Total' : 'Total')}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, letterSpacing: -0.3, marginTop: 1 }}>{fmtMoneyShort(price)}</div>
          </div>
        )}
      </div>

      <div style={{ height: 0.5, background: theme.separator, marginLeft: 14, marginRight: 14 }}/>

      {/* Route: Outbound → Return — day-first, time secondary */}
      <div style={{ display: 'flex', alignItems: 'stretch', padding: '16px 14px 16px' }}>
        <Leg
          label={L.flightOut}
          day={outDay}
          time={outTime}
          code={out?.code}
          seat={out?.seat}
          align="left"
        />

        {/* Arrow/plane divider */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 10px', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 1, background: theme.separator }}/>
            <div style={{ position: 'relative', background: theme.card, padding: '0 4px', color: theme.textMuted, display: 'flex' }}>
              {Icon.plane(theme.textMuted, 14)}
            </div>
          </div>
        </div>

        <Leg
          label={L.flightBack}
          day={retDay}
          time={retTime}
          code={ret?.code}
          seat={ret?.seat}
          align="right"
        />
      </div>
    </Card>
  );
}

function LodgingRow({ theme, lang, item, L }) {
  const done = item?.done;
  if (!done) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 14px', gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: `${theme.warning}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>{Icon.alert(theme.warning, 17)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.warning }}>{L.noLodgingYet}</div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{L.lodgingPending}</div>
        </div>
        <button style={{
          border: 'none', background: theme.accent, color: '#fff',
          padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', flexShrink: 0,
        }}>{L.addLodging}</button>
      </div>
    );
  }
  const kindLabel = item.kind === 'airbnb' ? L.lodgingAirbnb : L.lodgingHotel;
  const isAirbnb = item.kind === 'airbnb';
  const iconColor = isAirbnb ? '#FF5A5F' : theme.success;
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 14px', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${iconColor}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{isAirbnb ? Icon.airbnbLogo(iconColor, 19) : Icon.building(iconColor, 18)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: theme.text }}>{item.name}</div>
          <div style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
            background: `${theme.accent}22`, color: theme.accent, letterSpacing: 0.4,
          }}>{kindLabel.toUpperCase()}</div>
        </div>
        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {[item.code, item.checkIn && item.checkOut && `${fmtDateShort(item.checkIn, lang)} – ${fmtDateShort(item.checkOut, lang)}`].filter(Boolean).join(' · ')}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
        {item.price != null && (
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, letterSpacing: -0.2 }}>
            {fmtMoneyShort(item.price)}
          </div>
        )}
        {item.paidAt && (
          <div style={{
            fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
            background: item.paidAt === 'onsite' ? `${theme.warning}22` : `${theme.success}22`,
            color: item.paidAt === 'onsite' ? theme.warning : theme.success,
            letterSpacing: 0.3, textTransform: 'uppercase',
          }}>
            {item.paidAt === 'onsite' ? L.paidOnSite : L.paidAtBooking}
          </div>
        )}
      </div>
    </div>
  );
}

function fmtDateLong(iso, lang) {
  const d = parseDate(iso);
  const L = STR[lang];
  return `${d.getDate()} ${L.monthFull[d.getMonth()]}`;
}

// ─── New trip form ──────────────────────────────────────
function NewTripScreen({ theme, lang, onClose, onSave }) {
  const L = STR[lang];
  const [name, setName] = React.useState('');
  const [city, setCity] = React.useState('');
  const [airline, setAirline] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [budget, setBudget] = React.useState('');

  // Flight details — unified round-trip price
  const [flightOutCode, setFlightOutCode] = React.useState('');
  const [flightOutBooking, setFlightOutBooking] = React.useState('');
  const [flightOutSeat, setFlightOutSeat] = React.useState('');
  const [flightBackCode, setFlightBackCode] = React.useState('');
  const [flightBackBooking, setFlightBackBooking] = React.useState('');
  const [flightBackSeat, setFlightBackSeat] = React.useState('');
  const [flightsPrice, setFlightsPrice] = React.useState(''); // round-trip total
  const [showOpt, setShowOpt] = React.useState(false);

  // Lodging (optional — toggle)
  const [lodgingOn, setLodgingOn] = React.useState(false);
  const [lodgingKind, setLodgingKind] = React.useState('hotel'); // 'hotel' | 'airbnb'
  const [lodgingName, setLodgingName] = React.useState('');
  const [lodgingCode, setLodgingCode] = React.useState('');
  const [lodgingPrice, setLodgingPrice] = React.useState('');
  const [lodgingPaidAt, setLodgingPaidAt] = React.useState('booking'); // 'booking' | 'onsite'

  const input = {
    width: '100%', background: 'transparent', border: 'none',
    fontSize: 16, color: theme.text, outline: 'none',
    fontFamily: 'inherit', padding: 0,
  };

  const field = (label, children, isLast) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
        <div style={{ fontSize: 15, color: theme.text, width: 110, flexShrink: 0 }}>{label}</div>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
      {!isLast && <div style={{ height: 0.5, background: theme.separator, marginLeft: 16 }}/>}
    </div>
  );

  return (
    <div style={{ paddingBottom: 40, minHeight: '100%' }}>
      {/* Modal bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' }}>
        <button onClick={onClose} style={{
          border: 'none', background: 'transparent', color: theme.accent,
          fontSize: 17, fontWeight: 500, cursor: 'pointer', padding: 0,
        }}>{L.cancel}</button>
        <div style={{ fontSize: 17, fontWeight: 600, color: theme.text }}>{L.newTrip}</div>
        <button onClick={() => onSave({
          name, city, airline, notes, start, end, budget,
          flightOutCode, flightOutBooking, flightOutSeat,
          flightBackCode, flightBackBooking, flightBackSeat,
          flightsPrice,
          lodging: lodgingOn ? { kind: lodgingKind, name: lodgingName, code: lodgingCode, price: lodgingPrice, paidAt: lodgingPaidAt } : null,
        })} style={{
          border: 'none', background: 'transparent', color: theme.accent,
          fontSize: 17, fontWeight: 700, cursor: 'pointer', padding: 0,
        }}>{L.save}</button>
      </div>

      <div style={{ padding: '24px 20px 8px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 14px',
          background: `${theme.accent}22`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon.plane(theme.accent, 28)}
        </div>
      </div>

      <SectionHead theme={theme}>{L.details}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={0}>
          {field(L.tripName, (
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder={lang === 'pt' ? 'Ex: Workshop Q2' : 'e.g. Q2 Workshop'} style={input}/>
          ))}
          {field(L.destination, (
            <input type="text" value={city} onChange={e => setCity(e.target.value)}
              placeholder={lang === 'pt' ? 'Cidade, País' : 'City, Country'} style={input}/>
          ), true)}
        </Card>
      </div>

      <SectionHead theme={theme}>{L.dates}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={0}>
          {field(L.departure, (
            <input type="date" value={start} onChange={e => setStart(e.target.value)} style={{ ...input, color: start ? theme.text : theme.textMuted }}/>
          ))}
          {field(L.return, (
            <input type="date" value={end} onChange={e => setEnd(e.target.value)} style={{ ...input, color: end ? theme.text : theme.textMuted }}/>
          ), true)}
        </Card>
      </div>

      <SectionHead theme={theme}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {L.flights}
          <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
            background: theme.accent, color: '#fff', letterSpacing: 0.5,
          }}>{lang === 'pt' ? 'OBRIG.' : 'REQ.'}</span>
        </span>
      </SectionHead>
      <div style={{ padding: '0 16px 6px' }}>
        <Card theme={theme} pad={12}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, padding: '2px 4px 10px' }}>
            {L.airline}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {Object.keys(AIRLINES).map(k => {
              const a = AIRLINES[k];
              const on = airline === k;
              return (
                <button key={k} onClick={() => setAirline(on ? '' : k)} style={{
                  flex: 1, border: 'none', cursor: 'pointer',
                  background: on ? `${a.color}18` : 'transparent',
                  padding: '10px 8px', borderRadius: 12,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  boxShadow: on ? `inset 0 0 0 1.5px ${a.color}` : `inset 0 0 0 1px ${theme.border}`,
                  transition: 'all 180ms',
                }}>
                  {a.logo(30)}
                  <div style={{ fontSize: 12, fontWeight: on ? 700 : 500, color: on ? a.color : theme.text }}>{a.name}</div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
      <div style={{ padding: '10px 16px 20px' }}>
        <Card theme={theme} pad={0}>
          {/* Ida */}
          <div style={{ padding: '12px 14px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, background: `${theme.accent}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {L.flightOut}
            </div>
          </div>
          {field(L.flightNumber, (
            <input type="text" value={flightOutCode} onChange={e => setFlightOutCode(e.target.value.toUpperCase())}
              placeholder={lang === 'pt' ? 'Ex: LA 3032' : 'e.g. LA 3032'}
              style={{ ...input, fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: 0.5 }}/>
          ))}
          {showOpt && (
            <>
              {field(L.confirmationCode, (
                <input type="text" value={flightOutBooking} onChange={e => setFlightOutBooking(e.target.value.toUpperCase())}
                  placeholder="XXXXX6" style={{ ...input, fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: 0.5 }}/>
              ))}
              {field(L.seat, (
                <input type="text" value={flightOutSeat} onChange={e => setFlightOutSeat(e.target.value.toUpperCase())}
                  placeholder={lang === 'pt' ? 'Ex: 12A' : 'e.g. 12A'} style={input}/>
              ))}
            </>
          )}

          <div style={{ height: 0.5, background: theme.separator }}/>

          {/* Volta */}
          <div style={{ padding: '12px 14px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, background: `${theme.accent}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 6l-6 6 6 6"/>
              </svg>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: theme.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {L.flightBack}
            </div>
          </div>
          {field(L.flightNumber, (
            <input type="text" value={flightBackCode} onChange={e => setFlightBackCode(e.target.value.toUpperCase())}
              placeholder={lang === 'pt' ? 'Ex: LA 3033' : 'e.g. LA 3033'}
              style={{ ...input, fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: 0.5 }}/>
          ))}
          {showOpt && (
            <>
              {field(L.confirmationCode, (
                <input type="text" value={flightBackBooking} onChange={e => setFlightBackBooking(e.target.value.toUpperCase())}
                  placeholder="XXXXX6" style={{ ...input, fontFamily: 'ui-monospace, Menlo, monospace', letterSpacing: 0.5 }}/>
              ))}
              {field(L.seat, (
                <input type="text" value={flightBackSeat} onChange={e => setFlightBackSeat(e.target.value.toUpperCase())}
                  placeholder={lang === 'pt' ? 'Ex: 12A' : 'e.g. 12A'} style={input}/>
              ))}
            </>
          )}

          <div style={{ padding: '8px 14px 12px' }}>
            <button onClick={() => setShowOpt(v => !v)} style={{
              border: 'none', background: 'transparent', color: theme.accent,
              fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {showOpt ? '−' : '+'} {showOpt
                ? (lang === 'pt' ? 'Ocultar opcionais' : 'Hide optional')
                : (lang === 'pt' ? 'Localizadores e assentos' : 'Booking refs & seats')}
            </button>
          </div>

          <div style={{ height: 0.5, background: theme.separator }}/>

          {/* Preço total ida+volta */}
          {field((
            <div>
              <div>{L.totalPrice}</div>
              <div style={{ fontSize: 11, fontWeight: 400, color: theme.textMuted, marginTop: 1 }}>
                {lang === 'pt' ? 'ida + volta' : 'round-trip'}
              </div>
            </div>
          ), (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: theme.textMuted, fontSize: 15 }}>R$</span>
              <input type="number" value={flightsPrice} onChange={e => setFlightsPrice(e.target.value)}
                placeholder="0,00" style={input}/>
            </div>
          ), true)}
        </Card>
      </div>

      <SectionHead
        theme={theme}
        action={
          <button onClick={() => setLodgingOn(v => !v)} style={{
            border: 'none', background: 'transparent', color: theme.accent,
            fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0,
          }}>{lodgingOn ? (lang === 'pt' ? 'Cadastrar depois' : 'Add later') : L.addLodging}</button>
        }
      >{L.lodging}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        {!lodgingOn ? (
          <Card theme={theme} pad={16} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${theme.warning}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {Icon.home(theme.warning, 17)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{L.lodgingLater}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                {lang === 'pt' ? 'Ficará como pendência na viagem' : 'Will show as pending on the trip'}
              </div>
            </div>
          </Card>
        ) : (
          <Card theme={theme} pad={12}>
            {/* Hotel / Airbnb toggle */}
            <div style={{ display: 'flex', gap: 8, padding: '2px 4px 14px' }}>
              {[['hotel', L.lodgingHotel, Icon.home], ['airbnb', L.lodgingAirbnb, Icon.home]].map(([k, label, ic]) => {
                const on = lodgingKind === k;
                return (
                  <button key={k} onClick={() => setLodgingKind(k)} style={{
                    flex: 1, border: 'none', cursor: 'pointer',
                    background: on ? `${theme.accent}18` : 'transparent',
                    padding: '10px 8px', borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    boxShadow: on ? `inset 0 0 0 1.5px ${theme.accent}` : `inset 0 0 0 1px ${theme.border}`,
                    transition: 'all 180ms',
                  }}>
                    {k === 'hotel' ? Icon.home(on ? theme.accent : theme.textMuted, 16) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={on ? theme.accent : theme.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C8 2 4.5 5 4.5 9c0 5 7.5 13 7.5 13s7.5-8 7.5-13C19.5 5 16 2 12 2z"/>
                        <circle cx="12" cy="9" r="2.5"/>
                      </svg>
                    )}
                    <div style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? theme.accent : theme.text }}>{label}</div>
                  </button>
                );
              })}
            </div>
            <div style={{ height: 0.5, background: theme.separator, marginBottom: 2 }}/>
            {field(L.lodgingName, (
              <input type="text" value={lodgingName} onChange={e => setLodgingName(e.target.value)}
                placeholder={lodgingKind === 'hotel'
                  ? (lang === 'pt' ? 'Ex: Hotel Fasano' : 'e.g. Fasano Hotel')
                  : (lang === 'pt' ? 'Ex: Loft Moinhos' : 'e.g. Loft downtown')} style={input}/>
            ))}
            {field(L.confirmationCode, (
              <input type="text" value={lodgingCode} onChange={e => setLodgingCode(e.target.value)}
                placeholder={lang === 'pt' ? 'Ex: HTL-123' : 'e.g. HTL-123'} style={input}/>
            ))}
            {field(L.price, (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: theme.textMuted, fontSize: 15 }}>R$</span>
                <input type="number" value={lodgingPrice} onChange={e => setLodgingPrice(e.target.value)}
                  placeholder="0,00" style={input}/>
              </div>
            ))}
            <div style={{ padding: '12px 14px 4px' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                {L.paymentTiming}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['booking', L.paidAtBooking], ['onsite', L.paidOnSite]].map(([k, label]) => {
                  const on = lodgingPaidAt === k;
                  return (
                    <button key={k} onClick={() => setLodgingPaidAt(k)} style={{
                      flex: 1, border: 'none', cursor: 'pointer',
                      background: on ? `${theme.accent}18` : 'transparent',
                      padding: '10px 6px', borderRadius: 10,
                      boxShadow: on ? `inset 0 0 0 1.5px ${theme.accent}` : `inset 0 0 0 1px ${theme.border}`,
                      fontSize: 13, fontWeight: on ? 700 : 500,
                      color: on ? theme.accent : theme.text,
                      transition: 'all 180ms',
                    }}>{label}</button>
                  );
                })}
              </div>
            </div>
          </Card>
        )}
      </div>

      <SectionHead theme={theme}>{L.budget}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={0}>
          {field(L.amount, (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: theme.textMuted, fontSize: 16 }}>R$</span>
              <input type="number" value={budget} onChange={e => setBudget(e.target.value)}
                placeholder="0,00" style={input}/>
            </div>
          ), true)}
        </Card>
      </div>

      <SectionHead theme={theme}>{L.tripNotes}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={14}>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder={L.tripNotesPlaceholder} rows={4}
            style={{ ...input, resize: 'none', minHeight: 72, lineHeight: 1.4 }}/>
        </Card>
      </div>
    </div>
  );
}

// ─── Reports screen ─────────────────────────────────────
function ReportsScreen({ theme, lang, trips }) {
  const L = STR[lang];
  const [scope, setScope] = React.useState('year');

  const year = TODAY.getFullYear();
  const yearTrips = trips.filter(t => parseDate(t.start).getFullYear() === year);
  const yearTotal = yearTrips.reduce((s, t) => s + tripSpent(t), 0);

  // Category totals (year)
  const byCat = {};
  yearTrips.forEach(t => t.expenses.forEach(e => {
    byCat[e.cat] = (byCat[e.cat] || 0) + e.amount;
  }));
  const catList = Object.entries(byCat).sort((a,b) => b[1]-a[1]);

  // Monthly bars
  const monthly = Array(12).fill(0);
  yearTrips.forEach(t => t.expenses.forEach(e => {
    const m = parseDate(e.date).getMonth();
    monthly[m] += e.amount;
  }));
  const maxMonth = Math.max(...monthly, 1);

  // Pendencies: trips with pending items and start date in future
  const pendTrips = yearTrips.filter(t => tripPending(t).length > 0 && parseDate(t.end) >= TODAY);

  // Avg daily (all past/ongoing year trips)
  const completedTrips = yearTrips.filter(t => parseDate(t.start) <= TODAY);
  const totalDays = completedTrips.reduce((s, t) => s + (daysBetween(parseDate(t.start), parseDate(t.end)) + 1), 0);
  const completedTotal = completedTrips.reduce((s, t) => s + tripSpent(t), 0);
  const avgDaily = totalDays ? completedTotal / totalDays : 0;

  const topCat = catList[0];

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '8px 20px 14px' }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
          {L.tabReports}
        </div>
        <div style={{ fontSize: 15, color: theme.textMuted, marginTop: 2 }}>{year}</div>
      </div>

      {/* Hero: yearly total + donut */}
      <div style={{ padding: '0 16px 14px' }}>
        <Card theme={theme} pad={18}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {L.totalSpentYear}
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, color: theme.text, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 2 }}>
                {fmtMoney(yearTotal)}
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>
                {yearTrips.length} {yearTrips.length === 1 ? L.trip : L.trips} · {L.avgDaily} {fmtMoneyShort(avgDaily)}
              </div>
            </div>
          </div>
          <CategoryBar expenses={yearTrips.flatMap(t => t.expenses)} total={yearTotal || 1} height={10} radius={5}/>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', marginTop: 12 }}>
            {catList.slice(0, 5).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: theme.textMuted }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: CATEGORIES[k].color }}/>
                {lang === 'pt' ? CATEGORIES[k].labelPt : CATEGORIES[k].labelEn}
                <span style={{ color: theme.text, fontWeight: 600 }}>{((v/yearTotal)*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly bars */}
      <SectionHead theme={theme}>{L.monthlyAccumulated}</SectionHead>
      <div style={{ padding: '0 16px 22px' }}>
        <Card theme={theme} pad={16}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 120 }}>
            {monthly.map((v, i) => {
              const h = v > 0 ? Math.max((v / maxMonth) * 100, 3) : 0;
              const isCurrent = i === TODAY.getMonth();
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{
                      width: '100%', height: `${h}%`,
                      background: isCurrent ? theme.accent : (v > 0 ? `${theme.accent}55` : theme.separator),
                      borderRadius: '4px 4px 2px 2px',
                      transition: 'height 500ms ease',
                    }}/>
                  </div>
                  <div style={{ fontSize: 9, color: isCurrent ? theme.accent : theme.textMuted, fontWeight: isCurrent ? 700 : 500 }}>
                    {L.monthNames[i][0]}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Category breakdown full */}
      {catList.length > 0 && (
        <>
          <SectionHead theme={theme}>{L.categoryBreakdown}</SectionHead>
          <div style={{ padding: '0 16px 22px' }}>
            <Card theme={theme} pad={0}>
              {catList.map(([k, v], i) => {
                const cat = CATEGORIES[k];
                const pct = v / yearTotal;
                return (
                  <div key={k}>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 9, background: cat.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <CatIcon cat={k} size={15}/>
                        </div>
                        <div style={{ flex: 1, fontSize: 15, color: theme.text }}>
                          {lang === 'pt' ? cat.labelPt : cat.labelEn}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, letterSpacing: -0.2 }}>
                          {fmtMoney(v)}
                        </div>
                      </div>
                      <div style={{
                        marginTop: 7, marginLeft: 42, height: 4, borderRadius: 999,
                        background: theme.dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', overflow: 'hidden',
                      }}>
                        <div style={{ width: `${pct * 100}%`, height: '100%', background: cat.color, borderRadius: 999 }}/>
                      </div>
                    </div>
                    {i < catList.length - 1 && <Separator theme={theme}/>}
                  </div>
                );
              })}
            </Card>
          </div>
        </>
      )}

      {/* Pending */}
      {pendTrips.length > 0 && (
        <>
          <SectionHead theme={theme}>{L.pending}</SectionHead>
          <div style={{ padding: '0 16px 22px' }}>
            <Card theme={theme} pad={0}>
              {pendTrips.map((t, i) => {
                const pend = tripPending(t);
                return (
                  <div key={t.id}>
                    <div style={{ padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: `${theme.warning}22`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        {Icon.alert(theme.warning, 17)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{t.city}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                          {pend.map(p => L[p]).join(' · ')}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: theme.textMuted }}>
                        {fmtDateShort(t.start, lang)}
                      </div>
                    </div>
                    {i < pendTrips.length - 1 && <Separator theme={theme}/>}
                  </div>
                );
              })}
            </Card>
          </div>
        </>
      )}

      {/* Export */}
      <div style={{ padding: '0 16px' }}>
        <button style={{
          width: '100%', padding: '15px', borderRadius: theme.cardRadius,
          border: 'none', background: theme.accent, color: '#fff',
          fontSize: 16, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {Icon.download('#fff', 18)} {L.exportPdf}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  TripsListScreen, TripDetailScreen, NewTripScreen, ReportsScreen,
  Stat, FlightsUnifiedCard, LodgingRow, fmtDateLong,
});
