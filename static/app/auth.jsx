// Auth (Sign-in / Sign-up) screen — modern, image-led

function AuthScreen({ theme, lang, onAuthed }) {
  const L = STR[lang];
  const [mode, setMode] = React.useState('signin');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('pedro@exemplo.com');
  const [password, setPassword] = React.useState('demo1234');
  const [showPwd, setShowPwd] = React.useState(false);
  const [enableFaceId, setEnableFaceId] = React.useState(true);

  const isSignUp = mode === 'signup';
  const canSubmit = email && password && (!isSignUp || name);

  const submit = () => {
    if (!canSubmit) return;
    onAuthed({ name: name || 'Pedro Almeida', email, faceId: enableFaceId });
  };

  // ─── Main auth screen ──────────────────────────────────
  return (
    <div style={{
      height: '100%', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      background: '#0a0a0c',
    }}>
      {/* Full-bleed background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(assets/auth-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
      }}/>

      {/* Layered gradients for legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(8,8,12,0.0) 0%, rgba(8,8,12,0.1) 30%, rgba(8,8,12,0.55) 55%, rgba(8,8,12,0.92) 80%, rgba(8,8,12,1) 100%)',
      }}/>

      {/* Top: brand mark */}
      <div style={{ position: 'relative', padding: '34px 28px 0', zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'rgba(255,255,255,0.16)',
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            border: '0.5px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            flexShrink: 0,
          }}>
            {Icon.plane('#fff', 22)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: -0.2, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            Work Travel
          </div>
        </div>
      </div>

      {/* Bottom content sheet */}
      <div style={{
        position: 'relative', zIndex: 2, marginTop: 'auto',
        padding: '0 28px 28px',
      }}>
        {/* Hero copy */}
        <div style={{ marginBottom: 20, paddingTop: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            {lang === 'pt' ? 'Suas viagens, organizadas' : 'Your trips, organized'}
          </div>
          <div style={{
            fontSize: 34, fontWeight: 700, color: '#fff',
            letterSpacing: -0.9, lineHeight: 1.05, marginTop: 12,
            textShadow: '0 2px 14px rgba(0,0,0,0.4)',
          }}>
            {isSignUp
              ? (lang === 'pt' ? 'Vamos começar.' : "Let's get started.")
              : (lang === 'pt' ? 'Bem-vindo de\u00a0volta.' : 'Welcome back.')}
          </div>
        </div>

        {/* Glass form card */}
        <div style={{
          background: 'rgba(20,20,24,0.55)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '0.5px solid rgba(255,255,255,0.16)',
          borderRadius: 24, padding: 18,
          boxShadow: '0 20px 60px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
        }}>
          {/* Segmented */}
          <div style={{
            display: 'flex', padding: 3, borderRadius: 12,
            background: 'rgba(255,255,255,0.08)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            marginBottom: 14,
          }}>
            {[['signin', lang === 'pt' ? 'Entrar' : 'Sign in'], ['signup', lang === 'pt' ? 'Criar conta' : 'Sign up']].map(([k, label]) => (
              <button key={k} onClick={() => setMode(k)} style={{
                flex: 1, padding: '9px 0', border: 'none', borderRadius: 9,
                background: mode === k ? '#fff' : 'transparent',
                color: mode === k ? '#0a0a0c' : 'rgba(255,255,255,0.7)',
                fontSize: 13, fontWeight: mode === k ? 700 : 500,
                cursor: 'pointer', transition: 'all 200ms',
              }}>{label}</button>
            ))}
          </div>

          {isSignUp && (
            <GlassInput icon="user" placeholder={lang === 'pt' ? 'Seu nome' : 'Your name'} value={name} onChange={setName}/>
          )}
          <GlassInput icon="mail" placeholder="email@exemplo.com" value={email} onChange={setEmail} type="email"/>
          <GlassInput
            icon="lock"
            placeholder={lang === 'pt' ? 'Senha' : 'Password'}
            value={password}
            onChange={setPassword}
            type={showPwd ? 'text' : 'password'}
            trailing={
              <button onClick={() => setShowPwd(v => !v)} style={{
                border: 'none', background: 'transparent',
                color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', padding: '4px 0',
              }}>{showPwd ? (lang === 'pt' ? 'Ocultar' : 'Hide') : (lang === 'pt' ? 'Mostrar' : 'Show')}</button>
            }
          />

          {/* Face ID toggle row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 4px 4px',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: 'rgba(255,255,255,0.10)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="17" height="17" viewBox="0 0 100 100" fill="none">
                <path d="M22 30V22h8M70 22h8v8M78 70v8h-8M30 78h-8v-8" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>
                <circle cx="40" cy="45" r="3" fill="#fff"/>
                <circle cx="60" cy="45" r="3" fill="#fff"/>
                <path d="M38 65c3 4 7 5 12 5s9-1 12-5" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
                {lang === 'pt' ? 'Habilitar Face ID' : 'Enable Face ID'}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
                {lang === 'pt' ? 'Entrar sem digitar a senha' : 'Sign in without typing'}
              </div>
            </div>
            <DarkSwitch on={enableFaceId} onChange={setEnableFaceId} accent={theme.accent}/>
          </div>

          {/* Primary CTA */}
          <button onClick={submit} disabled={!canSubmit} style={{
            marginTop: 14, width: '100%', padding: '15px', borderRadius: 14, border: 'none',
            background: canSubmit ? '#fff' : 'rgba(255,255,255,0.18)',
            color: canSubmit ? '#0a0a0c' : 'rgba(255,255,255,0.4)',
            fontSize: 16, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'default',
            letterSpacing: -0.1,
            boxShadow: canSubmit ? '0 8px 24px rgba(255,255,255,0.18)' : 'none',
            transition: 'all 180ms',
          }}>
            {isSignUp
              ? (lang === 'pt' ? 'Criar conta' : 'Create account')
              : (lang === 'pt' ? 'Entrar' : 'Sign in')}
          </button>

          {/* Face ID quick sign-in */}
          {!isSignUp && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                margin: '14px 4px 12px',
              }}>
                <div style={{ flex: 1, height: 0.5, background: 'rgba(255,255,255,0.18)' }}/>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.6 }}>
                  {lang === 'pt' ? 'OU' : 'OR'}
                </div>
                <div style={{ flex: 1, height: 0.5, background: 'rgba(255,255,255,0.18)' }}/>
              </div>
              <button onClick={() => {
                onAuthed({ name: 'Pedro Almeida', email: 'pedro@exemplo.com', faceId: true });
              }} style={{
                width: '100%', padding: '13px', borderRadius: 14,
                border: '0.5px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff', fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                backdropFilter: 'blur(8px)',
              }}>
                <svg width="18" height="18" viewBox="0 0 100 100" fill="none">
                  <path d="M22 30V22h8M70 22h8v8M78 70v8h-8M30 78h-8v-8" stroke="#fff" strokeWidth="6" strokeLinecap="round"/>
                  <circle cx="40" cy="45" r="3" fill="#fff"/>
                  <circle cx="60" cy="45" r="3" fill="#fff"/>
                  <path d="M38 65c3 4 7 5 12 5s9-1 12-5" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none"/>
                </svg>
                {lang === 'pt' ? 'Entrar com Face ID' : 'Sign in with Face ID'}
              </button>
            </>
          )}
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => setMode(isSignUp ? 'signin' : 'signup')} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500,
          }}>
            {isSignUp
              ? (lang === 'pt' ? 'Já tem conta? Entrar' : 'Already have an account? Sign in')
              : (lang === 'pt' ? 'Ainda não tem conta? Criar' : 'No account? Create one')}
          </button>
        </div>
      </div>
    </div>
  );
}

function GlassInput({ icon, placeholder, value, onChange, type = 'text', trailing }) {
  const icons = {
    user: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/></svg>,
    mail: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><path d="M3 7l9 7 9-7" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinejoin="round"/></svg>,
    lock: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><path d="M8 10V7a4 4 0 018 0v3" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round"/></svg>,
  };
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '0.5px solid rgba(255,255,255,0.12)',
      borderRadius: 13,
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '0 14px', marginBottom: 9,
      transition: 'all 150ms',
    }}>
      <div style={{ display: 'flex', flexShrink: 0 }}>{icons[icon]}</div>
      <input
        type={type} placeholder={placeholder}
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          padding: '14px 0', fontSize: 15, color: '#fff', fontFamily: 'inherit',
          minWidth: 0,
        }}
      />
      {trailing}
    </div>
  );
}

function DarkSwitch({ on, onChange, accent }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 46, height: 28, borderRadius: 999, border: 'none',
      background: on ? accent : 'rgba(255,255,255,0.18)',
      position: 'relative', cursor: 'pointer', transition: 'background 200ms',
      padding: 0, flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 24, height: 24, borderRadius: 999, background: '#fff',
        transition: 'left 200ms cubic-bezier(.2,.8,.2,1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}/>
    </button>
  );
}

// Keep old Toggle name for callers
const Toggle = DarkSwitch;
const AuthInput = GlassInput;

Object.assign(window, { AuthScreen, Toggle, AuthInput, GlassInput, DarkSwitch });
