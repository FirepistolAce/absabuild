import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Button from '../components/ui/Button'

function AuthPage() {
  const { isLoggedIn, login, register } = useUser()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard')
  }, [isLoggedIn, navigate])

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
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
      if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); setLoading(false); return }
      const result = register(form.name.trim(), form.email.trim(), form.password)
      if (!result.success) { setError(result.error); setLoading(false); return }
    } else {
      if (!form.email.includes('@')) { setError('Please enter a valid email address.'); setLoading(false); return }
      if (!form.password) { setError('Please enter your password.'); setLoading(false); return }
      const result = login(form.email.trim(), form.password)
      if (!result.success) { setError(result.error); setLoading(false); return }
    }

    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logoRed}>ABSA</span>
          <span style={styles.logoGrey}>NextGen Wealth Studio</span>
        </div>

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

        <div style={styles.cardBody}>
          <div style={styles.cardTitle}>
            {mode === 'login' ? 'Welcome back' : 'Get started free'}
          </div>
          <div style={styles.cardSub}>
            {mode === 'login'
              ? 'Sign in to access your financial studio.'
              : 'Set up takes about 5 minutes. No bank account linking required.'}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            {mode === 'register' && (
              <Field label="Full name">
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Kefilwe Molefe"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                />
              </Field>
            )}

            <Field label="Email address">
              <input
                style={styles.input}
                type="email"
                placeholder="you@email.com"
                value={form.email}
                onChange={e => update('email', e.target.value)}
              />
            </Field>

            <Field label="Password" hint={mode === 'register' ? 'Minimum 6 characters' : null}>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => update('password', e.target.value)}
              />
            </Field>

            {mode === 'register' && (
              <Field label="Confirm password">
                <input
                  style={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                />
              </Field>
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
              {loading
                ? 'Please wait...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
            </Button>
          </form>

          <div style={styles.switchRow}>
            {mode === 'login'
              ? <>Don't have an account? <span style={styles.switchLink} onClick={() => { setMode('register'); setError('') }}>Create one free</span></>
              : <>Already have an account? <span style={styles.switchLink} onClick={() => { setMode('login'); setError('') }}>Sign in</span></>
            }
          </div>
        </div>

        <div style={styles.disclaimer}>
          Not financial advice · For educational purposes · South African context only
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>{label}</label>
        {hint && <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#1A1A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' },
  card: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', width: '100%', maxWidth: '440px', overflow: 'hidden' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '8px', padding: '24px 28px 0' },
  logoRed: { fontSize: '18px', fontWeight: 800, color: '#CC0000', letterSpacing: '0.04em' },
  logoGrey: { fontSize: '12px', color: 'rgba(255,255,255,0.3)' },
  tabs: { display: 'flex', margin: '20px 28px 0', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '3px' },
  tab: { flex: 1, padding: '8px', fontSize: '13px', fontWeight: 500, border: 'none', background: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', borderRadius: '6px', fontFamily: 'var(--font-family)', transition: 'all 0.2s' },
  tabActive: { background: '#CC0000', color: '#fff', fontWeight: 600 },
  cardBody: { padding: '24px 28px' },
  cardTitle: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' },
  cardSub: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '24px', lineHeight: 1.55 },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#fff', width: '100%', fontFamily: 'var(--font-family)' },
  error: { background: 'rgba(204,0,0,0.1)', border: '1px solid rgba(204,0,0,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#FF6B6B', lineHeight: 1.5 },
  switchRow: { textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '20px' },
  switchLink: { color: 'rgba(255,255,255,0.7)', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' },
  disclaimer: { textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.15)', padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.05)' },
}

export default AuthPage