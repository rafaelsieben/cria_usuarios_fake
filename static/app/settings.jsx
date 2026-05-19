// Settings screen — profile, preferences, cloud backup, security

const ACCENT_PRESETS = [
  { name: 'Laranja',  value: '#FF6B2C' },
  { name: 'Roxo',     value: '#7C3AED' },
  { name: 'Azul',     value: '#0A84FF' },
  { name: 'Verde',    value: '#16A34A' },
  { name: 'Rosa',     value: '#EC4899' },
  { name: 'Grafite',  value: '#18181B' },
];

const CARD_STYLES = [
  { key: 'soft',     labelPt: 'Suave',    labelEn: 'Soft' },
  { key: 'flat',     labelPt: 'Plano',    labelEn: 'Flat' },
  { key: 'elevated', labelPt: 'Elevado',  labelEn: 'Elevated' },
];

function SettingsScreen({
  theme, lang, accent, onSetAccent, onToggleDark, dark, cardStyle, onSetCardStyle, onSetLang,
  user, onUpdateUser, cloudProvider, onSetCloudProvider, faceIdOn, onToggleFaceId, onSignOut,
  lastSync, onSyncNow, syncing,
}) {
  const L = STR[lang];
  const [editingProfile, setEditingProfile] = React.useState(false);
  const [pickingCloud, setPickingCloud] = React.useState(false);

  const rowBtn = {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '13px 14px', width: '100%', border: 'none',
    background: 'transparent', cursor: 'pointer', textAlign: 'left',
  };

  const CloudIcon = ({ kind, size = 22 }) => {
    if (kind === 'iCloud') return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect width="40" height="40" rx="9" fill="#3C9DF2"/>
        <path d="M12 25h18a3 3 0 000-6 6 6 0 00-11-3 4 4 0 00-7 3 4 4 0 000 6z" fill="#fff"/>
      </svg>
    );
    if (kind === 'googleDrive') return (
      <svg width={size} height={size} viewBox="0 0 40 40">
        <rect width="40" height="40" rx="9" fill="#fff" stroke="#E5E7EB"/>
        <path d="M14 12h12l6 11-6 10H14l-6-10z" fill="none"/>
        <path d="M14 12h12l-6 11H8z" fill="#FFC107"/>
        <path d="M26 12l6 11-6 10-6-10z" fill="#1E88E5"/>
        <path d="M8 23h24l-6 10H14z" fill="#4CAF50"/>
      </svg>
    );
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M6 16h12a3 3 0 000-6 5 5 0 00-9-2 4 4 0 00-3 8z" stroke={theme.textMuted} strokeWidth="1.8"/>
      </svg>
    );
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{ padding: '8px 20px 18px' }}>
        <div style={{ fontSize: 34, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>
          {L.tabSettings}
        </div>
      </div>

      {/* Profile card */}
      <div style={{ padding: '0 16px 22px' }}>
        <Card theme={theme} pad={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 58, height: 58, borderRadius: 999,
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}AA)`,
              color: '#fff', fontSize: 22, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 6px 16px ${theme.accent}55`,
            }}>
              {(user.name || 'U').split(' ').map(s => s[0]).slice(0, 2).join('')}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: -0.3 }}>
                {user.name}
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            </div>
            <button onClick={() => setEditingProfile(true)} style={{
              border: 'none', background: `${theme.accent}1A`, color: theme.accent,
              padding: '8px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>{L.editProfile}</button>
          </div>
        </Card>
      </div>

      {/* Cloud backup */}
      <SectionHead theme={theme}>{L.dataSync}</SectionHead>
      <div style={{ padding: '0 16px 22px' }}>
        <Card theme={theme} pad={0}>
          <button onClick={() => setPickingCloud(true)} style={rowBtn}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: cloudProvider ? 'transparent' : `${theme.textMuted}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {cloudProvider ? <CloudIcon kind={cloudProvider} size={36}/> : <CloudIcon size={20}/>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, color: theme.text, fontWeight: 500 }}>{L.cloudBackup}</div>
              <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
                {cloudProvider ? L[cloudProvider] : L.none}
              </div>
            </div>
            <div style={{ fontSize: 13, color: cloudProvider ? theme.success : theme.textMuted, fontWeight: 600 }}>
              {cloudProvider ? L.backupOn : L.backupOff}
            </div>
            {Icon.chevronRight(theme.textTertiary, 16)}
          </button>
          {cloudProvider && (
            <>
              <div style={{ height: 0.5, background: theme.separator, marginLeft: 60 }}/>
              <div style={rowBtn}>
                <div style={{ width: 36, height: 36 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: theme.text }}>{L.lastSync}</div>
                  <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{lastSync}</div>
                </div>
                <button onClick={onSyncNow} disabled={syncing} style={{
                  border: 'none', background: `${theme.accent}1A`, color: theme.accent,
                  padding: '7px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600,
                  cursor: syncing ? 'default' : 'pointer',
                }}>{syncing ? L.syncing : L.syncNow}</button>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Security */}
      <SectionHead theme={theme}>{L.security}</SectionHead>
      <div style={{ padding: '0 16px 22px' }}>
        <Card theme={theme} pad={0}>
          <div style={rowBtn}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${theme.accent}1A`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                <path d="M22 30V22h8M70 22h8v8M78 70v8h-8M30 78h-8v-8" stroke={theme.accent} strokeWidth="6" strokeLinecap="round"/>
                <circle cx="40" cy="45" r="3" fill={theme.accent}/>
                <circle cx="60" cy="45" r="3" fill={theme.accent}/>
                <path d="M38 65c3 4 7 5 12 5s9-1 12-5" stroke={theme.accent} strokeWidth="5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div style={{ flex: 1, fontSize: 15, color: theme.text }}>{L.faceId}</div>
            <Toggle on={faceIdOn} onChange={onToggleFaceId} theme={theme}/>
          </div>
          <div style={{ height: 0.5, background: theme.separator, marginLeft: 60 }}/>
          <button style={rowBtn}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${theme.textMuted}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="10" width="16" height="11" rx="2" stroke={theme.textMuted} strokeWidth="2"/>
                <path d="M8 10V7a4 4 0 018 0v3" stroke={theme.textMuted} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div style={{ flex: 1, fontSize: 15, color: theme.text }}>{L.changePassword}</div>
            {Icon.chevronRight(theme.textTertiary, 16)}
          </button>
        </Card>
      </div>

      <SectionHead theme={theme}>{L.preferences}</SectionHead>
      <div style={{ padding: '0 16px 16px' }}>
        <Card theme={theme} pad={0}>
          <div style={{ display: 'flex', padding: 4, gap: 4 }}>
            {[['pt', 'Português'], ['en', 'English']].map(([k, label]) => (
              <button key={k} onClick={() => onSetLang(k)} style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
                background: lang === k ? theme.accent : 'transparent',
                color: lang === k ? '#fff' : theme.text, fontSize: 14,
                fontWeight: lang === k ? 600 : 500, cursor: 'pointer',
              }}>{label}</button>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <Card theme={theme} pad={0}>
          <div style={{ display: 'flex', padding: 4, gap: 4 }}>
            {[[false, Icon.sun, L.light], [true, Icon.moon, L.dark]].map(([k, ic, label]) => (
              <button key={String(k)} onClick={() => onToggleDark(k)} style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
                background: dark === k ? theme.accent : 'transparent',
                color: dark === k ? '#fff' : theme.text, fontSize: 14,
                fontWeight: dark === k ? 600 : 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}>
                {ic(dark === k ? '#fff' : theme.text, 15)} {label}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <Card theme={theme} pad={16}>
          <div style={{ fontSize: 11, fontWeight: 600, color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
            {L.accentColor}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            {ACCENT_PRESETS.map(p => {
              const on = accent === p.value;
              return (
                <button key={p.value} onClick={() => onSetAccent(p.value)} style={{
                  width: 38, height: 38, borderRadius: 999, border: 'none',
                  background: p.value, cursor: 'pointer', position: 'relative',
                  boxShadow: on ? `0 0 0 3px ${theme.card}, 0 0 0 5px ${p.value}` : 'none',
                  transition: 'box-shadow 180ms',
                }}/>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ padding: '0 16px 22px' }}>
        <Card theme={theme} pad={0}>
          <div style={{ display: 'flex', padding: 4, gap: 4 }}>
            {CARD_STYLES.map(cs => (
              <button key={cs.key} onClick={() => onSetCardStyle(cs.key)} style={{
                flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
                background: cardStyle === cs.key ? theme.accent : 'transparent',
                color: cardStyle === cs.key ? '#fff' : theme.text, fontSize: 14,
                fontWeight: cardStyle === cs.key ? 600 : 500, cursor: 'pointer',
              }}>{lang === 'pt' ? cs.labelPt : cs.labelEn}</button>
            ))}
          </div>
        </Card>
      </div>

      {/* Sign out */}
      <div style={{ padding: '0 16px 8px' }}>
        <button onClick={onSignOut} style={{
          width: '100%', padding: '14px', borderRadius: theme.cardRadius,
          border: 'none', background: theme.card,
          color: theme.danger, fontSize: 15, fontWeight: 600, cursor: 'pointer',
          boxShadow: theme.cardShadow,
        }}>{L.signOut}</button>
      </div>

      <div style={{ padding: '14px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>Work Travel</div>
        <div style={{ fontSize: 11, color: theme.textTertiary, marginTop: 2 }}>
          {L.version} 1.0
        </div>
      </div>

      {/* Edit profile modal */}
      {editingProfile && (
        <EditProfileSheet theme={theme} lang={lang} user={user}
          onClose={() => setEditingProfile(false)}
          onSave={(u) => { onUpdateUser(u); setEditingProfile(false); }}/>
      )}

      {/* Cloud picker modal */}
      {pickingCloud && (
        <CloudPickerSheet theme={theme} lang={lang} current={cloudProvider}
          onClose={() => setPickingCloud(false)}
          onPick={(p) => { onSetCloudProvider(p); setPickingCloud(false); }}
          CloudIcon={CloudIcon}/>
      )}
    </div>
  );
}

function EditProfileSheet({ theme, lang, user, onClose, onSave }) {
  const L = STR[lang];
  const [name, setName] = React.useState(user.name || '');
  const [email, setEmail] = React.useState(user.email || '');
  const [phone, setPhone] = React.useState(user.phone || '');

  const input = {
    width: '100%', background: 'transparent', border: 'none',
    fontSize: 16, color: theme.text, outline: 'none',
    fontFamily: 'inherit', padding: 0,
  };

  const field = (label, children, isLast) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
        <div style={{ fontSize: 15, color: theme.text, width: 90, flexShrink: 0 }}>{label}</div>
        <div style={{ flex: 1 }}>{children}</div>
      </div>
      {!isLast && <div style={{ height: 0.5, background: theme.separator, marginLeft: 16 }}/>}
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} onClick={onClose}/>
      <div className="modal-enter" style={{
        position: 'absolute', top: 40, left: 0, right: 0, bottom: 0,
        background: theme.bg, borderRadius: '20px 20px 0 0', overflow: 'auto',
      }}>
        <div style={{ width: 36, height: 5, borderRadius: 999, background: theme.textTertiary, margin: '8px auto 4px' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px' }}>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: theme.accent, fontSize: 17, cursor: 'pointer' }}>{L.cancel}</button>
          <div style={{ fontSize: 17, fontWeight: 600, color: theme.text }}>{L.editProfile}</div>
          <button onClick={() => onSave({ ...user, name, email, phone })} style={{ border: 'none', background: 'transparent', color: theme.accent, fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>{L.save}</button>
        </div>

        <div style={{ padding: '28px 20px 8px' }}>
          <div style={{
            width: 82, height: 82, borderRadius: 999, margin: '0 auto 18px',
            background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}AA)`,
            color: '#fff', fontSize: 30, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 22px ${theme.accent}55`,
          }}>
            {(name || 'U').split(' ').map(s => s[0]).slice(0, 2).join('')}
          </div>
        </div>

        <div style={{ padding: '0 16px 20px' }}>
          <Card theme={theme} pad={0}>
            {field(L.name, <input value={name} onChange={e => setName(e.target.value)} style={input}/>)}
            {field(L.email, <input value={email} type="email" onChange={e => setEmail(e.target.value)} style={input}/>)}
            {field(L.phone, <input value={phone} placeholder="+55 11 …" onChange={e => setPhone(e.target.value)} style={input}/>, true)}
          </Card>
        </div>
      </div>
    </div>
  );
}

function CloudPickerSheet({ theme, lang, current, onClose, onPick, CloudIcon }) {
  const L = STR[lang];
  const options = [
    { key: 'iCloud',      label: L.iCloud },
    { key: 'googleDrive', label: L.googleDrive },
    { key: null,          label: L.none },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} onClick={onClose}/>
      <div className="modal-enter" style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: theme.bg, borderRadius: '20px 20px 0 0', padding: '10px 16px 26px',
      }}>
        <div style={{ width: 36, height: 5, borderRadius: 999, background: theme.textTertiary, margin: '0 auto 12px' }}/>
        <div style={{ fontSize: 17, fontWeight: 700, color: theme.text, padding: '4px 4px 14px' }}>{L.changeBackup}</div>
        <Card theme={theme} pad={0}>
          {options.map((o, i) => {
            const on = current === o.key;
            return (
              <div key={o.key || 'none'}>
                <button onClick={() => onPick(o.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '14px', border: 'none', background: 'transparent',
                  cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{
                    width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {o.key ? <CloudIcon kind={o.key} size={36}/> : <CloudIcon size={22}/>}
                  </div>
                  <div style={{ flex: 1, fontSize: 15, color: theme.text, fontWeight: 500 }}>{o.label}</div>
                  {on && Icon.check(theme.accent, 18)}
                </button>
                {i < options.length - 1 && <div style={{ height: 0.5, background: theme.separator, marginLeft: 60 }}/>}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen });
