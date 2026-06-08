import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import Button from '../components/ui/Button'
import PageWrapper from '../components/layout/PageWrapper'

function LandingPage() {
  const { isLoggedIn } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard')
  }, [isLoggedIn, navigate])

  const pillars = [
    {
      icon: '📊',
      label: 'Money Snapshot',
      color: '#4B44A8',
      desc: 'Your full financial picture — gross to net, debts, goals, and net worth — calculated with actual SARS tax logic.',
    },
    {
      icon: '🗺️',
      label: 'Strategy Tracks',
      color: '#0D7A5F',
      desc: 'Three named five-year financial paths. Real tradeoffs. Milestone tracking. Pick the one that fits where you\'re going.',
    },
    {
      icon: '🔬',
      label: 'Simulation Lab',
      color: '#C4472A',
      desc: 'Model real decisions before you make them — property vs renting, car finance vs investing, local vs offshore.',
    },
    {
      icon: '📚',
      label: 'SA Financial Glossary',
      color: '#B8860B',
      desc: 'Every term used in this product explained in plain language — PAYE, TFSA, transfer duty, bond registration, and more.',
    },
  ]

  const stats = [
    { value: 'R30K–R70K', label: 'Target income band' },
    { value: 'Ages 23–35', label: 'Target cohort' },
    { value: '3 Studios', label: 'Simulation scenarios' },
    { value: 'SARS 2024/25', label: 'Tax tables used' },
  ]

  const problems = [
    {
      icon: '✗',
      title: 'Your bank app',
      desc: 'Shows transactions. Has nothing to say about whether what you spent was wise.',
      color: '#C4472A',
    },
    {
      icon: '✗',
      title: 'A financial advisor',
      desc: 'Requires R500K+ in assets before they\'ll sit with you. Most 26-year-olds don\'t qualify.',
      color: '#C4472A',
    },
    {
      icon: '✗',
      title: 'Generic fintech apps',
      desc: 'Built for the UK or US. They don\'t know what a TFSA is or how prime plus 2 works in SA.',
      color: '#C4472A',
    },
    {
      icon: '✓',
      title: 'NextGen Wealth Studio',
      desc: 'SA-specific, early-career, honest about your real position, and willing to tell you what to do.',
      color: '#0D7A5F',
    },
  ]

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <PageWrapper>
          <div style={styles.heroInner}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>ABSA NextGen Wealth Studio</div>
              <h1 style={styles.headline}>
                Your First Five Years.<br />
                <span style={styles.accent}>Done Right.</span>
              </h1>
              <p style={styles.heroSub}>
                A financial planning studio built exclusively for high-earning young South African professionals.
                Understand your money, choose your direction, and simulate real decisions before you commit.
              </p>
              <div style={styles.heroCtas}>
                <Button size="lg" onClick={() => navigate('/auth')}>
                  Get started — it's free
                </Button>
                <Button size="lg" variant="ghost" onClick={() => navigate('/auth')}>
                  Sign in
                </Button>
              </div>
              <div style={styles.heroNote}>
                Not financial advice · Built for SA professionals · SARS 2024/25 tax logic
              </div>
            </div>
            <div style={styles.heroRight}>
              <div style={styles.heroCard}>
                <div style={styles.heroCardLabel}>Money Snapshot preview</div>
                <div style={styles.heroCardAmount}>R27,400</div>
                <div style={styles.heroCardSub}>Your estimated take-home on R38,000 gross</div>
                <div style={styles.heroCardBreakdown}>
                  {[
                    { label: 'PAYE tax', value: '–R7,240', color: '#CC0000' },
                    { label: 'UIF', value: '–R177', color: '#C4472A' },
                    { label: 'RA (5%)', value: '–R1,900', color: '#B8860B' },
                    { label: 'Medical aid', value: '–R1,283', color: '#888' },
                    { label: 'Take-home', value: 'R27,400', color: '#0D7A5F' },
                  ].map(row => (
                    <div key={row.label} style={styles.heroCardRow}>
                      <span style={styles.heroCardRowLabel}>{row.label}</span>
                      <span style={{ ...styles.heroCardRowVal, color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.heroCardBadge}>Fixed cost load: 67% ⚠</div>
              </div>
            </div>
          </div>
        </PageWrapper>
      </div>

      {/* Stats bar */}
      <div style={styles.statsBar}>
        <PageWrapper>
          <div style={styles.statsRow}>
            {stats.map(s => (
              <div key={s.label} style={styles.statItem}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </div>

      {/* Pillars */}
      <div style={styles.pillarsSection}>
        <PageWrapper>
          <div style={styles.sectionLabel}>What's inside</div>
          <h2 style={styles.sectionTitle}>Four pillars. One studio.</h2>
          <div style={styles.pillarsGrid}>
            {pillars.map(p => (
              <div key={p.label} style={{ ...styles.pillarCard, borderTop: `3px solid ${p.color}` }}>
                <div style={styles.pillarIcon}>{p.icon}</div>
                <div style={{ ...styles.pillarLabel, color: p.color }}>{p.label}</div>
                <div style={styles.pillarDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </div>

      {/* Problem section */}
      <div style={styles.problemSection}>
        <PageWrapper>
          <div style={styles.sectionLabel}>The gap nobody filled</div>
          <h2 style={styles.sectionTitle}>Young SA professionals have three options.<br />None of them work.</h2>
          <div style={styles.problemGrid}>
            {problems.map(p => (
              <div key={p.title} style={{ ...styles.problemCard, borderTop: `3px solid ${p.color}` }}>
                <div style={{ ...styles.problemIcon, color: p.color }}>{p.icon}</div>
                <div style={styles.problemTitle}>{p.title}</div>
                <div style={styles.problemDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </div>

      {/* Personas */}
      <div style={styles.personaSection}>
        <PageWrapper>
          <div style={styles.sectionLabel}>Built for professionals like</div>
          <div style={styles.personaRow}>
            {[
              { initials: 'KM', name: 'Kefilwe, 26', role: 'Investment Analyst · Joburg', color: '#4B44A8', quote: 'I earn well but every month the money just disappears.' },
              { initials: 'TP', name: 'Thabo, 29', role: 'Attorney · Cape Town', color: '#0D7A5F', quote: 'I want to do everything at once — invest, buy, travel. I don\'t know what to prioritise.' },
              { initials: 'NZ', name: 'Nomvula, 24', role: 'Software Engineer · Joburg', color: '#C4472A', quote: 'I want to go aggressive on ETFs but I also have family obligations I can\'t ignore.' },
              { initials: 'RN', name: 'Riyaad, 27', role: 'Medical Intern · Durban', color: '#1A2744', quote: 'Everyone my age seems five years ahead of me. I don\'t know where to start.' },
            ].map(p => (
              <div key={p.initials} style={styles.personaCard}>
                <div style={{ ...styles.personaAvatar, background: p.color }}>{p.initials}</div>
                <div style={styles.personaName}>{p.name}</div>
                <div style={styles.personaRole}>{p.role}</div>
                <div style={styles.personaQuote}>"{p.quote}"</div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </div>

      {/* CTA */}
      <div style={styles.ctaSection}>
        <PageWrapper>
          <div style={styles.ctaInner}>
            <h2 style={styles.ctaTitle}>Ready to understand your money?</h2>
            <p style={styles.ctaSub}>Takes 5 minutes to set up. No bank connection required.</p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start your Money Snapshot →
            </Button>
          </div>
        </PageWrapper>
      </div>
    </div>
  )
}

const styles = {
  page: { background: '#1A1A2E', minHeight: '100vh' },
  hero: { paddingTop: '80px', paddingBottom: '60px', minHeight: '100vh', display: 'flex', alignItems: 'center' },
  heroInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' },
  heroLeft: {},
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '16px' },
  headline: { fontSize: '46px', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '20px' },
  accent: { color: '#CC0000' },
  heroSub: { fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '420px' },
  heroCtas: { display: 'flex', gap: '12px', marginBottom: '16px' },
  heroNote: { fontSize: '11px', color: 'rgba(255,255,255,0.25)' },
  heroRight: {},
  heroCard: { background: '#242438', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' },
  heroCardLabel: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.35)', marginBottom: '8px' },
  heroCardAmount: { fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '4px' },
  heroCardSub: { fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' },
  heroCardBreakdown: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' },
  heroCardRow: { display: 'flex', justifyContent: 'space-between' },
  heroCardRowLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.45)' },
  heroCardRowVal: { fontSize: '12px', fontWeight: 600 },
  heroCardBadge: { background: 'rgba(184,134,11,0.12)', border: '1px solid rgba(184,134,11,0.25)', borderRadius: '8px', padding: '8px 12px', fontSize: '12px', color: '#B8860B', fontWeight: 500 },
  statsBar: { background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 0' },
  statsRow: { display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' },
  statItem: { textAlign: 'center' },
  statValue: { fontSize: '20px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' },
  statLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  pillarsSection: { padding: '80px 0', background: '#111118' },
  sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '12px' },
  sectionTitle: { fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '40px', lineHeight: 1.15 },
  pillarsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  pillarCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' },
  pillarIcon: { fontSize: '24px', marginBottom: '12px' },
  pillarLabel: { fontSize: '13px', fontWeight: 700, marginBottom: '8px' },
  pillarDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  problemSection: { padding: '80px 0', background: '#1A1A2E' },
  problemGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' },
  problemCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' },
  problemIcon: { fontSize: '20px', fontWeight: 800, marginBottom: '10px' },
  problemTitle: { fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
  problemDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  personaSection: { padding: '60px 0', background: '#111118' },
  personaRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' },
  personaCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', textAlign: 'center' },
  personaAvatar: { width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 auto 12px' },
  personaName: { fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '4px' },
  personaRole: { fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' },
  personaQuote: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', lineHeight: 1.55 },
  ctaSection: { padding: '80px 0', background: '#CC0000' },
  ctaInner: { textAlign: 'center' },
  ctaTitle: { fontSize: '32px', fontWeight: 800, color: '#fff', marginBottom: '12px', letterSpacing: '-0.02em' },
  ctaSub: { fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginBottom: '28px' },
}

export default LandingPage