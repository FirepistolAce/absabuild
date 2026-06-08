import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Button from '../components/ui/Button'

function AuthPage() {
  const { isLoggedIn, login, register } = useUser()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard')
  }, [isLoggedIn, navigate])

  const upd = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'register') {
      if (!form.name.trim()) { setError('Please enter your full name.'); setLoading(false); return }
      if (!form.email.includes('@')) { setError('Please enter a valid email address.'); setLoading(false); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); setLoading(false); return }
      const result = register(form.name.trim(), form.email.trim(), form.password)
      if (!result.success) { setError(result.error); setLoading(false); return }
    } else {
      if (!form.email) { setError('Please enter your email address.'); setLoading(false); return }
      if (!form.password) { setError('Please enter your password.'); setLoading(false); return }
      const result = login(form.email.trim(), form.password)
      if (!result.success) { setError(result.error); setLoading(false); return }
    }

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftInner}>
          <div style={styles.leftLogo}>
            <span style={styles.logoRed}>ABSA</span>
            <span style={styles.logoGrey}>NextGen Wealth Studio</span>
          </div>
          <h1 style={styles.leftTitle}>
            Your first five years.<br />
            <span style={styles.leftAccent}>Done right.</span>
          </h1>
          <p style={styles.leftSub}>
            A financial planning studio built for South African professionals earning R30K–R70K per month.
          </p>
          <div style={styles.features}>
            {[
              '✓  SARS 2024/25 tax calculations',
              '✓  Three strategy tracks with milestone tracking',
              '✓  Simulation Lab — property, car, offshore',
              '✓  SA financial glossary',
              '✓  Your data saved between sessions',
            ].map(f => (
              <div key={f} style={styles.feature}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(mode === 'login' ? styles.tabActive : {}) }}
              onClick={() => { setMode('login'); setError('') }}
            >
              Sign in
            </button>
            <button
              style={{ ...styles.tab, ...(mode === 'register' ? styles.tabActive : {}) }}
              onClick={() => { setMode('register'); setError('') }}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {mode === 'register' && (
              <Field
                label="Full name"
                value={form.name}
                onChange={v => upd('name', v)}
                placeholder="e.g. Kefilwe Molefe"
                type="text"
              />
            )}
            <Field
              label="Email address"
              value={form.email}
              onChange={v => upd('email', v)}
              placeholder="you@email.com"
              type="email"
            />
            <Field
              label="Password"
              value={form.password}
              onChange={v => upd('password', v)}
              placeholder="••••••••"
              type="password"
              hint={mode === 'register' ? 'Minimum 6 characters' : null}
            />
            {mode === 'register' && (
              <Field
                label="Confirm password"
                value={form.confirm}
                onChange={v => upd('confirm', v)}
                placeholder="••••••••"
                type="password"
              />
            )}

            {error && (
              <div style={styles.error}>{error}</div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading ? 'Please wait...' : mode === 'register' ? 'Create my account' : 'Sign in'}
            </Button>
          </form>

          <div style={styles.switchMode}>
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <span style={styles.switchLink} onClick={() => { setMode('register'); setError('') }}>
                  Create one free
                </span>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <span style={styles.switchLink} onClick={() => { setMode('login'); setError('') }}>
                  Sign in
                </span>
              </>
            )}
          </div>

          <div style={styles.disclaimer}>
            Not financial advice. Your data is stored locally on your device only.
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
        {label}
      </label>
      {hint && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{hint}</div>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '8px',
          padding: '11px 14px',
          fontSize: '14px',
          color: '#fff',
          width: '100%',
          fontFamily: 'var(--font-family)',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    paddingTop: 'var(--nav-height)',
  },
  left: {
    background: '#1A1A2E',
    display: 'flex',
    alignItems: 'center',
    padding: '48px',
  },
  leftInner: { maxWidth: '420px' },
  leftLogo: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' },
  logoRed: { fontSize: '20px', fontWeight: 800, color: '#CC0000' },
  logoGrey: { fontSize: '13px', color: 'rgba(255,255,255,0.35)' },
  leftTitle: { fontSize: '38px', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.025em', marginBottom: '16px' },
  leftAccent: { color: '#CC0000' },
  leftSub: { fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: '32px' },
  features: { display: 'flex', flexDirection: 'column', gap: '10px' },
  feature: { fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 },
  right: {
    background: '#111118',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#1C1C2E',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '32px',
  },
  tabs: {
    display: 'flex',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '8px',
    padding: '4px',
    marginBottom: '28px',
    gap: '4px',
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '13px',
    fontWeight: 500,
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#CC0000',
    color: '#fff',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  error: {
    background: 'rgba(204,0,0,0.1)',
    border: '1px solid rgba(204,0,0,0.25)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#FF6B6B',
  },
  switchMode: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.35)',
    marginTop: '20px',
  },
  switchLink: {
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.2)',
    marginTop: '16px',
    lineHeight: 1.5,
  },
}

export default AuthPage