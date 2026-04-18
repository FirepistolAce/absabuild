import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'
import Button from '../Components/Button'

function HomePage() {
  const { isLoggedIn, login } = useUser()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  if (isLoggedIn) {
    navigate('/snapshot')
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    login(name.trim())
    navigate('/snapshot')
  }

  const pillars = [
    { label: 'Money Snapshot', color: '#4B44A8', desc: 'Your full financial picture in one place' },
    { label: 'Strategy Tracks', color: '#0D7A5F', desc: 'A five-year financial direction built for you' },
    { label: 'Simulation Lab', color: '#C4472A', desc: 'Run real decisions before you make them' },
    { label: 'SA-Specific', color: '#B8860B', desc: 'Built for SARS, rand, and the SA market' },
  ]

  const personas = [
    { initials: 'KM', name: 'Kefilwe, 26', role: 'Analyst · Joburg', color: '#4B44A8' },
    { initials: 'TP', name: 'Thabo, 29', role: 'Attorney · Cape Town', color: '#0D7A5F' },
    { initials: 'NZ', name: 'Nomvula, 24', role: 'Engineer · Joburg', color: '#C4472A' },
    { initials: 'RN', name: 'Riyaad, 27', role: 'Doctor · Durban', color: '#1A2744' },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.eyebrow}>ABSA NextGen Wealth Studio</div>
          <h1 style={styles.headline}>
            Your First Five Years.<br />
            <span style={styles.headlineAccent}>Done Right.</span>
          </h1>
          <p style={styles.sub}>
            A financial planning studio built for South African professionals. 
            Understand your money, choose your direction, and simulate real 
            decisions before you commit.
          </p>
          <div style={styles.pillarsGrid}>
            {pillars.map(p => (
              <div key={p.label} style={{ ...styles.pillarCard, borderLeft: `3px solid ${p.color}` }}>
                <div style={{ ...styles.pillarLabel, color: p.color }}>{p.label}</div>
                <div style={styles.pillarDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.loginCard}>
            <div style={styles.loginTitle}>
              {isRegistering ? 'Create your account' : 'Sign in to your studio'}
            </div>
            <div style={styles.loginSub}>
              {isRegistering ? 'Set up takes about 5 minutes.' : 'New here? Takes 5 minutes to set up.'}
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Full name</label>
                <input
                  style={styles.input}
                  type="text"
                  placeholder="e.g. Kefilwe Molefe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Email address</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {error && <div style={styles.error}>{error}</div>}

              <Button type="submit" fullWidth size="lg">
                {isRegistering ? 'Create account' : 'Sign in'}
              </Button>
            </form>

            <div style={styles.loginFooter}>
              {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
              <span
                style={styles.toggleLink}
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? 'Sign in' : 'Create one free'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.personaSection}>
        <div style={styles.personaLabel}>Built for professionals like</div>
        <div style={styles.personaRow}>
          {personas.map(p => (
            <div key={p.initials} style={styles.personaCard}>
              <div style={{ ...styles.personaAvatar, background: p.color }}>
                {p.initials}
              </div>
              <div style={styles.personaName}>{p.name}</div>
              <div style={styles.personaRole}>{p.role}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.marketSection}>
        <div style={styles.marketInner}>
          <div style={styles.sectionLabel}>The problem we solve</div>
          <h2 style={styles.marketHeading}>The gap nobody filled</h2>
          <div style={styles.marketGrid}>
            {[
              {
                title: 'Your bank app',
                desc: 'Shows you transactions. Has nothing to say about whether what you spent was wise.',
                icon: '✗',
                color: '#C4472A',
              },
              {
                title: 'A financial advisor',
                desc: 'Requires R500K+ in investable assets before they\'ll sit with you. Most 26-year-olds don\'t qualify.',
                icon: '✗',
                color: '#C4472A',
              },
              {
                title: 'Generic fintech apps',
                desc: 'Built for the UK or US. They don\'t know what a TFSA is or how "prime plus 2" works in SA vehicle finance.',
                icon: '✗',
                color: '#C4472A',
              },
              {
                title: 'NextGen Wealth Studio',
                desc: 'SA-specific, early-career, honest about your real position, and willing to tell you what to do.',
                icon: '✓',
                color: '#0D7A5F',
              },
            ].map(item => (
              <div key={item.title} style={{
                ...styles.marketCard,
                borderTop: `3px solid ${item.color}`,
              }}>
                <div style={{ ...styles.marketIcon, color: item.color, fontSize: '20px', fontWeight: 800, marginBottom: '10px' }}>
                  {item.icon}
                </div>
                <div style={styles.marketTitle}>{item.title}</div>
                <div style={styles.marketDesc}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span style={styles.footerLogo}>ABSA</span>
          <span style={styles.footerText}>
            NextGen Wealth Studio · Built for South African professionals · Not financial advice
          </span>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#1A1A2E',
  },
  hero: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '80px 24px 60px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
  },
  heroLeft: {},
  eyebrow: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#CC0000',
    marginBottom: '16px',
  },
  headline: {
    fontSize: '42px',
    fontWeight: 800,
    color: '#FFFFFF',
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    marginBottom: '20px',
  },
  headlineAccent: {
    color: '#CC0000',
  },
  sub: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.7,
    marginBottom: '32px',
    maxWidth: '420px',
  },
  pillarsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  pillarCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '14px 16px',
  },
  pillarLabel: {
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  pillarDesc: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.5,
  },
  heroRight: {},
  loginCard: {
    background: '#242438',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '32px',
  },
  loginTitle: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '6px',
  },
  loginSub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.03em',
  },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    padding: '11px 14px',
    fontSize: '14px',
    color: '#FFFFFF',
    width: '100%',
    fontFamily: 'var(--font-family)',
    transition: 'border-color 0.2s',
  },
  error: {
    background: 'rgba(204,0,0,0.12)',
    border: '1px solid rgba(204,0,0,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#FF6B6B',
  },
  loginFooter: {
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.35)',
    marginTop: '20px',
  },
  toggleLink: {
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  personaSection: {
    background: 'rgba(0,0,0,0.2)',
    padding: '40px 24px',
    textAlign: 'center',
  },
  personaLabel: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: '24px',
  },
  personaRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
    maxWidth: '700px',
    margin: '0 auto',
  },
  personaCard: {
    textAlign: 'center',
  },
  personaAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 800,
    color: '#FFFFFF',
    margin: '0 auto 10px',
  },
  personaName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '3px',
  },
  personaRole: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
  },
  marketSection: {
    padding: '80px 24px',
    background: '#111118',
  },
  marketInner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#CC0000',
    marginBottom: '12px',
  },
  marketHeading: {
    fontSize: '32px',
    fontWeight: 800,
    color: '#FFFFFF',
    marginBottom: '40px',
    letterSpacing: '-0.02em',
  },
  marketGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
  },
  marketCard: {
    background: '#1C1C2E',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '20px',
  },
  marketIcon: {},
  marketTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  marketDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.6,
  },
  footer: {
    background: '#0C0C14',
    padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  footerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  footerLogo: {
    fontSize: '16px',
    fontWeight: 800,
    color: '#CC0000',
  },
  footerText: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.2)',
  },
}

export default HomePage