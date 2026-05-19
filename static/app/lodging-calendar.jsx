// Add lodging + Add to calendar modals

// ─── Add Lodging ────────────────────────────────────────
function AddLodgingScreen({ theme, lang, trip, onClose, onSave }) {
  const L = STR[lang];
  const [kind, setKind] = React.useState('hotel');
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [price, setPrice] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [paidAt, setPaidAt] = React.useState('booking'); // 'booking' | 'onsite'

  const canSave = name.trim().length > 0;

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
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' }}>
        <button onClick={onClose} style={{
          border: 'none', background: 'transparent', color: theme.accent,
          fontSize: 17, fontWeight: 500, cursor: 'pointer', padding: 0,
        }}>{L.cancel}</button>
        <div style={{ fontSize: 17, fontWeight: 600, color: theme.text }}>{L.addLodging}</div>
        <button onClick={() => canSave && onSave({ kind, name, code, price, address, paidAt })}
          disabled={!canSave}
          style={{
            border: 'none', background: 'transparent',
            color: canSave ? theme.accent : theme.textTertiary,
            fontSize: 17, fontWeight: 700, cursor: canSave ? 'pointer' : 'default', padding: 0,
          }}>{L.save}</button>
      </div>

      {/* Trip context */}
      <div style={{ padding: '8px 20px 10px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 12px', borderRadius: 999,
          background: theme.dark ? 'rgba(118,118,128,0.2)' : 'rgba(118,118,128,0.12)',
          fontSize: 13, color: theme.textMuted, fontWeight: 500,
        }}>
          {Icon.pin(theme.textMuted, 12)}
          <span style={{ color: theme.text, fontWeight: 600 }}>{trip.city}</span>
          · {fmtDateRange(trip.start, trip.end, lang)}
        </div>
      </div>

      {/* Icon */}
      <div style={{ padding: '14px 20px 4px' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16, margin: '0 auto 6px',
          background: `${theme.accent}22`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon.home(theme.accent, 28)}
        </div>
      </div>

      {/* Kind toggle */}
      <SectionHead theme={theme}>{L.lodgingType}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={10}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['hotel', L.lodgingHotel], ['airbnb', L.lodgingAirbnb]].map(([k, label]) => {
              const on = kind === k;
              return (
                <button key={k} onClick={() => setKind(k)} style={{
                  flex: 1, border: 'none', cursor: 'pointer',
                  background: on ? `${theme.accent}18` : 'transparent',
                  padding: '14px 8px', borderRadius: 12,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  boxShadow: on ? `inset 0 0 0 1.5px ${theme.accent}` : `inset 0 0 0 1px ${theme.border}`,
                  transition: 'all 180ms',
                }}>
                  {k === 'hotel' ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={on ? theme.accent : theme.textMuted} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>
                      <path d="M3 21h18"/>
                      <rect x="8" y="7" width="2.5" height="2.5" rx="0.4" fill={on ? theme.accent : theme.textMuted} stroke="none"/>
                      <rect x="13.5" y="7" width="2.5" height="2.5" rx="0.4" fill={on ? theme.accent : theme.textMuted} stroke="none"/>
                      <rect x="8" y="11.5" width="2.5" height="2.5" rx="0.4" fill={on ? theme.accent : theme.textMuted} stroke="none"/>
                      <rect x="13.5" y="11.5" width="2.5" height="2.5" rx="0.4" fill={on ? theme.accent : theme.textMuted} stroke="none"/>
                      <path d="M10 21v-4h4v4"/>
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={on ? '#FF5A5F' : theme.textMuted} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
                      <path d="M12 2.2c-1.4 0-2.5.9-3.3 2.2-.8 1.3-1.4 2.9-2.9 6.2-1.5 3.3-2.3 5-2.6 6.5-.3 1.5 0 2.9 1 3.9 1 1 2.3 1.3 3.6 1 1.3-.3 2.5-1.2 4-2.6l.3-.3.2.3c1.5 1.4 2.7 2.3 4 2.6 1.3.3 2.6 0 3.6-1 1-1 1.3-2.4 1-3.9-.3-1.5-1.1-3.2-2.6-6.5-1.5-3.3-2.1-4.9-2.9-6.2C14.5 3.1 13.4 2.2 12 2.2z"/>
                    </svg>
                  )}
                  <div style={{ fontSize: 14, fontWeight: on ? 700 : 500, color: on ? (k === 'airbnb' ? '#FF5A5F' : theme.accent) : theme.text }}>{label}</div>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Details */}
      <SectionHead theme={theme}>{L.details}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={0}>
          {field(L.lodgingName, (
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder={kind === 'hotel'
                ? (lang === 'pt' ? 'Ex: Hotel Fasano' : 'e.g. Fasano Hotel')
                : (lang === 'pt' ? 'Ex: Loft Moinhos' : 'e.g. Loft downtown')} style={input} autoFocus/>
          ))}
          {field(L.confirmationCode, (
            <input type="text" value={code} onChange={e => setCode(e.target.value)}
              placeholder={lang === 'pt' ? 'Opcional' : 'Optional'} style={input}/>
          ))}
          {field(L.lodgingAddress, (
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder={lang === 'pt' ? 'Opcional' : 'Optional'} style={input}/>
          ))}
          {field(L.price, (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: theme.textMuted, fontSize: 15 }}>R$</span>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                placeholder="0,00" style={input}/>
            </div>
          ))}
          {field(L.paymentTiming, (
            <div style={{ display: 'flex', gap: 6 }}>
              {[['booking', L.paidAtBooking], ['onsite', L.paidOnSite]].map(([k, label]) => {
                const on = paidAt === k;
                return (
                  <button key={k} onClick={() => setPaidAt(k)} style={{
                    flex: 1, border: 'none', cursor: 'pointer',
                    background: on ? `${theme.accent}18` : (theme.dark ? 'rgba(118,118,128,0.18)' : 'rgba(118,118,128,0.1)'),
                    padding: '8px 10px', borderRadius: 9,
                    fontSize: 13, fontWeight: on ? 700 : 500,
                    color: on ? theme.accent : theme.textMuted,
                    boxShadow: on ? `inset 0 0 0 1.5px ${theme.accent}` : 'none',
                    transition: 'all 150ms',
                  }}>{label}</button>
                );
              })}
            </div>
          ), true)}
        </Card>
        <div style={{ fontSize: 12, color: theme.textMuted, padding: '8px 6px 0', lineHeight: 1.4 }}>
          {lang === 'pt'
            ? (paidAt === 'booking'
                ? 'O valor será lançado como custo na data de início da viagem.'
                : 'O valor será lançado como custo na data de check-out.')
            : (paidAt === 'booking'
                ? 'The amount will be logged as a cost on the trip start date.'
                : 'The amount will be logged as a cost on the check-out date.')}
        </div>
      </div>
    </div>
  );
}

// ─── Add to Calendar ────────────────────────────────────
function AddToCalendarScreen({ theme, lang, trip, onClose, onAdded }) {
  const L = STR[lang];
  const [calendar, setCalendar] = React.useState('personal');
  const [includeFlights, setIncludeFlights] = React.useState(true);
  const [alertKey, setAlertKey] = React.useState('hour2');
  const [adding, setAdding] = React.useState(false);

  const calendars = [
    { k: 'personal', label: L.personal, color: '#FF3B30' },
    { k: 'work',     label: L.work,     color: '#34C759' },
    { k: 'icloud',   label: L.iCloudCal, color: '#007AFF' },
  ];

  const alerts = [
    ['atDeparture', L.atDeparture],
    ['min15', L.min15],
    ['hour1', L.hour1],
    ['hour2', L.hour2],
    ['day1', L.day1],
  ];

  const hasFlights = trip.checklist.flightOut?.code || trip.checklist.flightBack?.code;
  const eventCount = 1 + (includeFlights && hasFlights ? 2 : 0);

  const handleAdd = () => {
    setAdding(true);
    setTimeout(() => onAdded(eventCount), 900);
  };

  const eventPreview = [];
  eventPreview.push({
    title: `📍 ${trip.name}`,
    sub: `${fmtDateRange(trip.start, trip.end, lang)} · ${lang === 'pt' ? 'Dia inteiro' : 'All-day'}`,
  });
  if (includeFlights && trip.checklist.flightOut?.code) {
    const t = trip.checklist.flightOut.time ? new Date(trip.checklist.flightOut.time) : null;
    const timeStr = t ? `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}` : '';
    eventPreview.push({
      title: `✈ ${trip.checklist.flightOut.airline} ${trip.checklist.flightOut.code}`,
      sub: `${fmtDateShort(trip.start, lang)}${timeStr ? ' · ' + timeStr : ''}`,
    });
  }
  if (includeFlights && trip.checklist.flightBack?.code) {
    const t = trip.checklist.flightBack.time ? new Date(trip.checklist.flightBack.time) : null;
    const timeStr = t ? `${String(t.getHours()).padStart(2,'0')}:${String(t.getMinutes()).padStart(2,'0')}` : '';
    eventPreview.push({
      title: `✈ ${trip.checklist.flightBack.airline} ${trip.checklist.flightBack.code}`,
      sub: `${fmtDateShort(trip.end, lang)}${timeStr ? ' · ' + timeStr : ''}`,
    });
  }

  const activeCal = calendars.find(c => c.k === calendar);

  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' }}>
        <button onClick={onClose} style={{
          border: 'none', background: 'transparent', color: theme.accent,
          fontSize: 17, fontWeight: 500, cursor: 'pointer', padding: 0,
        }}>{L.cancel}</button>
        <div style={{ fontSize: 17, fontWeight: 600, color: theme.text }}>{L.addToCalendar}</div>
        <div style={{ width: 60 }}/>
      </div>

      {/* Hero: Calendar icon */}
      <div style={{ padding: '22px 20px 10px', textAlign: 'center' }}>
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 16,
            background: '#fff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}>
            <div style={{
              height: 18, background: '#FF3B30',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: 0.8,
            }}>
              {L.monthNames[new Date(trip.start).getMonth()].toUpperCase()}
            </div>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: '#1c1c1e', letterSpacing: -0.5,
            }}>
              {new Date(trip.start).getDate()}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
          {trip.name}
        </div>
        <div style={{ fontSize: 14, color: theme.textMuted, marginTop: 3 }}>
          {fmtDateRange(trip.start, trip.end, lang)}
        </div>
      </div>

      {/* Choose calendar */}
      <SectionHead theme={theme}>{L.chooseCalendar}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={0}>
          {calendars.map((c, i) => {
            const on = calendar === c.k;
            return (
              <div key={c.k}>
                <button onClick={() => setCalendar(c.k)} style={{
                  width: '100%', border: 'none', background: 'transparent', cursor: 'pointer',
                  padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ width: 14, height: 14, borderRadius: 4, background: c.color, flexShrink: 0 }}/>
                  <div style={{ flex: 1, textAlign: 'left', fontSize: 15, color: theme.text, fontWeight: 500 }}>
                    {c.label}
                  </div>
                  {on && (
                    <div style={{
                      width: 22, height: 22, borderRadius: 999, background: theme.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {Icon.check('#fff', 14)}
                    </div>
                  )}
                </button>
                {i < calendars.length - 1 && <div style={{ height: 0.5, background: theme.separator, marginLeft: 42 }}/>}
              </div>
            );
          })}
        </Card>
      </div>

      {/* Options */}
      <SectionHead theme={theme}>{L.preferences}</SectionHead>
      <div style={{ padding: '0 16px 20px' }}>
        <Card theme={theme} pad={0}>
          {/* Include flights */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, color: theme.text, fontWeight: 500 }}>{L.includeFlights}</div>
              {hasFlights ? (
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{L.includeFlightsSub}</div>
              ) : (
                <div style={{ fontSize: 12, color: theme.textTertiary, marginTop: 1 }}>
                  {lang === 'pt' ? 'Sem nº de voo cadastrado' : 'No flight numbers set'}
                </div>
              )}
            </div>
            <IosSwitch checked={includeFlights && !!hasFlights}
              disabled={!hasFlights}
              onChange={() => hasFlights && setIncludeFlights(!includeFlights)}
              accent={theme.accent}/>
          </div>
          <div style={{ height: 0.5, background: theme.separator, marginLeft: 16 }}/>
          {/* Alert */}
          <div style={{ padding: '13px 16px' }}>
            <div style={{ fontSize: 15, color: theme.text, fontWeight: 500, marginBottom: 8 }}>{L.alertBefore}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {alerts.map(([k, label]) => {
                const on = alertKey === k;
                return (
                  <button key={k} onClick={() => setAlertKey(k)} style={{
                    border: 'none', padding: '6px 12px', borderRadius: 999,
                    background: on ? theme.accent : (theme.dark ? 'rgba(118,118,128,0.2)' : 'rgba(118,118,128,0.12)'),
                    color: on ? '#fff' : theme.text,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 160ms',
                  }}>{label}</button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* Event preview */}
      <SectionHead theme={theme}>
        {lang === 'pt' ? 'Serão criados' : 'Events to create'} · {eventCount}
      </SectionHead>
      <div style={{ padding: '0 16px 24px' }}>
        <Card theme={theme} pad={0}>
          {eventPreview.map((ev, i) => (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 12 }}>
                <div style={{ width: 3, height: 28, borderRadius: 2, background: activeCal.color, flexShrink: 0 }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {ev.title}
                  </div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{ev.sub}</div>
                </div>
              </div>
              {i < eventPreview.length - 1 && <div style={{ height: 0.5, background: theme.separator, marginLeft: 30 }}/>}
            </div>
          ))}
        </Card>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 16px' }}>
        <button onClick={handleAdd} disabled={adding} style={{
          width: '100%', padding: '15px', borderRadius: 14, border: 'none',
          background: theme.accent, color: '#fff',
          fontSize: 16, fontWeight: 700, cursor: adding ? 'default' : 'pointer',
          letterSpacing: -0.2, opacity: adding ? 0.7 : 1,
          boxShadow: `0 6px 18px ${theme.accent}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'opacity 180ms',
        }}>
          {adding ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 800ms linear infinite' }}>
                <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5"/>
                <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              {L.addingToCalendar}
            </>
          ) : (
            <>
              {Icon.plus('#fff', 18)}
              {lang === 'pt' ? `Adicionar ${eventCount} ${eventCount === 1 ? 'evento' : 'eventos'}` : `Add ${eventCount} ${eventCount === 1 ? 'event' : 'events'}`}
            </>
          )}
        </button>
        <div style={{ fontSize: 12, color: theme.textMuted, textAlign: 'center', marginTop: 10, lineHeight: 1.4 }}>
          {lang === 'pt'
            ? 'Será solicitada sua permissão ao Calendário do iPhone'
            : 'iPhone Calendar will ask for permission'}
        </div>
      </div>
    </div>
  );
}

// iOS-style switch
function IosSwitch({ checked, onChange, disabled, accent }) {
  return (
    <button onClick={onChange} disabled={disabled} style={{
      width: 51, height: 31, borderRadius: 999, border: 'none',
      background: checked ? accent : '#E9E9EA',
      position: 'relative', cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'background 220ms',
      padding: 0, flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: checked ? 22 : 2,
        width: 27, height: 27, borderRadius: 999, background: '#fff',
        boxShadow: '0 3px 8px rgba(0,0,0,0.15), 0 1px 1px rgba(0,0,0,0.1)',
        transition: 'left 220ms cubic-bezier(0.4,0,0.2,1)',
      }}/>
    </button>
  );
}

Object.assign(window, { AddLodgingScreen, AddToCalendarScreen, IosSwitch });
