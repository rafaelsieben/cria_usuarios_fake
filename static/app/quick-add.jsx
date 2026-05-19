// Quick-add expense bottom sheet

function QuickAddExpense({ theme, lang, trips, defaultTripId, onClose, onSave }) {
  const L = STR[lang];
  const [amount, setAmount] = React.useState('');
  const [cat, setCat] = React.useState('food');
  const [desc, setDesc] = React.useState('');
  const [tripId, setTripId] = React.useState(defaultTripId || null);
  const [showTripPicker, setShowTripPicker] = React.useState(!defaultTripId);
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (tripId && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [tripId]);

  const selectedTrip = trips.find(t => t.id === tripId);
  const ongoing = trips.find(t => tripStatus(t).state === 'ongoing');
  const eligibleTrips = trips
    .filter(t => tripStatus(t).state !== 'past' ||
      Math.abs(daysBetween(parseDate(t.end), TODAY)) <= 14)
    .sort((a, b) => parseDate(b.start) - parseDate(a.start));

  const catKeys = ['food', 'transport', 'parking', 'hotel', 'flight', 'carRental', 'leisure', 'other'];

  const canSave = amount && parseFloat(amount) > 0 && tripId;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      id: `e-${Date.now()}`,
      tripId,
      date: TODAY.toISOString().slice(0, 10),
      cat,
      amount: parseFloat(amount),
      desc: desc || (lang === 'pt' ? CATEGORIES[cat].labelPt : CATEGORIES[cat].labelEn),
    });
  };

  // ── Trip picker state ─────────────────────────────
  if (showTripPicker) {
    return (
      <div>
        <Handle theme={theme}/>
        <div style={{ padding: '4px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} style={ghostBtn(theme)}>{L.cancel}</button>
          <div style={{ fontSize: 17, fontWeight: 600, color: theme.text }}>
            {lang === 'pt' ? 'Escolher viagem' : 'Choose trip'}
          </div>
          <div style={{ width: 60 }}/>
        </div>
        <div style={{ padding: '14px 16px 32px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {eligibleTrips.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: theme.textMuted, fontSize: 14 }}>
              {lang === 'pt' ? 'Nenhuma viagem disponível' : 'No trips available'}
            </div>
          )}
          {eligibleTrips.map(t => {
            const st = tripStatus(t);
            const label = st.state === 'ongoing' ? L.ongoing :
                          st.state === 'upcoming' ? (st.days === 0 ? L.today : st.days === 1 ? L.tomorrow : L.inDays(st.days)) :
                          L.daysAgo(st.days);
            return (
              <div key={t.id} onClick={() => { setTripId(t.id); setShowTripPicker(false); }} style={{
                background: theme.card, borderRadius: theme.cardRadius, padding: 14,
                border: `1px solid ${theme.border}`, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: st.state === 'ongoing' ? theme.accent : `${theme.accent}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {Icon.pin(st.state === 'ongoing' ? '#fff' : theme.accent, 18)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: theme.text }}>{t.city}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                    {fmtDateRange(t.start, t.end, lang)} · {label}
                  </div>
                </div>
                {Icon.chevronRight(theme.textTertiary, 14)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Handle theme={theme}/>
      <div style={{ padding: '4px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={ghostBtn(theme)}>{L.cancel}</button>
        <div style={{ fontSize: 17, fontWeight: 600, color: theme.text }}>
          {L.newExpense}
        </div>
        <button onClick={handleSave} disabled={!canSave} style={{
          ...ghostBtn(theme), fontWeight: 700,
          color: canSave ? theme.accent : theme.textTertiary,
        }}>{L.save}</button>
      </div>

      {/* Trip context chip */}
      {selectedTrip && (
        <div style={{ padding: '8px 20px 14px' }}>
          <button onClick={() => setShowTripPicker(true)} style={{
            width: '100%', background: theme.dark ? 'rgba(118,118,128,0.2)' : 'rgba(118,118,128,0.12)',
            border: 'none', borderRadius: 10, padding: '10px 14px',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 999, background: theme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {Icon.pin('#fff', 12)}
            </div>
            <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.4, lineHeight: 1 }}>
                {tripStatus(selectedTrip).state === 'ongoing' ? L.ongoing : (lang === 'pt' ? 'Viagem' : 'Trip')}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginTop: 2 }}>
                {selectedTrip.city} · {fmtDateRange(selectedTrip.start, selectedTrip.end, lang)}
              </div>
            </div>
            <div style={{ fontSize: 13, color: theme.accent, fontWeight: 600, flexShrink: 0 }}>
              {lang === 'pt' ? 'Trocar' : 'Change'}
            </div>
          </button>
        </div>
      )}

      {/* Big amount input */}
      <div style={{ padding: '10px 20px 22px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'baseline', gap: 8,
          justifyContent: 'center',
        }}>
          <span style={{ fontSize: 28, color: theme.textMuted, fontWeight: 500 }}>R$</span>
          <input
            ref={inputRef}
            type="number" inputMode="decimal" placeholder="0"
            value={amount} onChange={e => setAmount(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              fontSize: 56, fontWeight: 700, color: theme.text,
              letterSpacing: -1.2, width: 220, textAlign: 'left',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Category chips */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          {catKeys.map(k => {
            const c = CATEGORIES[k];
            const on = cat === k;
            return (
              <button key={k} onClick={() => setCat(k)} style={{
                border: 'none', padding: '12px 4px', borderRadius: 14,
                background: on ? c.color : theme.card,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'background 180ms, transform 120ms',
                transform: on ? 'scale(1)' : 'scale(1)',
                boxShadow: on ? `0 4px 12px ${c.color}55` : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 999,
                  background: on ? 'rgba(255,255,255,0.2)' : `${c.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CatIcon cat={k} size={17} color={on ? '#fff' : c.color}/>
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 600,
                  color: on ? '#fff' : theme.text,
                  lineHeight: 1.1, textAlign: 'center',
                }}>
                  {lang === 'pt' ? c.labelPt : c.labelEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description (optional) */}
      <div style={{ padding: '0 16px 20px' }}>
        <input
          type="text" value={desc} onChange={e => setDesc(e.target.value)}
          placeholder={lang === 'pt' ? 'Descrição (opcional)' : 'Description (optional)'}
          style={{
            width: '100%', background: theme.card, border: `1px solid ${theme.border}`,
            borderRadius: 12, padding: '13px 14px',
            fontSize: 15, color: theme.text, outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Big save */}
      <div style={{ padding: '0 16px 28px' }}>
        <button onClick={handleSave} disabled={!canSave} style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          background: canSave ? theme.accent : (theme.dark ? '#2C2C2E' : '#E5E5EA'),
          color: canSave ? '#fff' : theme.textTertiary,
          fontSize: 17, fontWeight: 700, cursor: canSave ? 'pointer' : 'default',
          letterSpacing: -0.2,
          boxShadow: canSave ? `0 6px 18px ${theme.accent}44` : 'none',
          transition: 'all 180ms',
        }}>
          {amount ? `${L.save} ${fmtMoney(parseFloat(amount))}` : L.save}
        </button>
      </div>
    </div>
  );
}

function Handle({ theme }) {
  return (
    <div style={{
      width: 36, height: 5, borderRadius: 999,
      background: theme.textTertiary,
      margin: '8px auto 4px',
    }}/>
  );
}

function ghostBtn(theme) {
  return {
    border: 'none', background: 'transparent', color: theme.accent,
    fontSize: 17, fontWeight: 500, cursor: 'pointer', padding: 0, minWidth: 60, textAlign: 'left',
  };
}

Object.assign(window, { QuickAddExpense });
