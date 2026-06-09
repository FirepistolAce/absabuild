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
      number: '01',
      title: 'Money Snapshot',
      desc: 'Your full financial picture in one place. Gross to take-home, debt exposure, net worth, and goal progress — calculated with actual SARS 2024/25 tax logic.',
      color: '#4B44A8',
      icon: '📊',
    },
    {
      number: '02',
      title: 'Strategy Tracks',
      desc: 'Three named five-year financial directions with real tradeoffs. Property Path, Balanced Lifestyle, or Aggressive Global Investor — each fully built out with milestones and recommendations.',
      color: '#0D7A5F',
      icon: '🗺️',
    },
    {
      number: '03',
      title: 'Simulation Lab',
      desc: 'Run real decisions before you make them. Property vs Renting, Car vs Invest, Local vs Offshore — with SA-specific defaults, live inputs, and an opinionated Studio Verdict.',
      color: '#C4472A',
      icon: '⚗️',
    },
    {
      number: '04',
      title: 'SA Glossary',
      desc: 'Every financial term used in this product explained in plain language — PAYE, TFSA, transfer duty, bond registration, CGT, and more. Built for South Africans.',
      color: '#B8860B',
      icon: '📖',
    },
  ]

  const stats = [
    { value: 'R30K–R70K', label: 'Target income band' },
    { value: '23–35', label: 'Target age range' },
    { value: '3 Studios', label: 'Financial simulations' },
    { value: '20+ Terms', label: 'SA financial glossary' },
  ]

  const problems = [
    {
      title: 'Your bank app',
      desc: 'Shows transactions. Has nothing to say about whether what you spent was wise.',
      icon: '✗',
      color: '#C4472A',
    },
    {
      title: 'A financial advisor',
      desc: 'Requires R500K+ in investable assets before they will sit with you. Most 26-year-olds do not qualify.',
      icon: '✗',
      color: '#C4472A',
    },
    {
      title: 'Generic fintech apps',
      desc: 'Built for the UK or US. They do not know what a TFSA is or how prime plus 2 works in SA vehicle finance.',
      icon: '✗',
      color: '#C4472A',
    },
    {
      title: 'NextGen Wealth Studio',
      desc: 'SA-specific, early-career, honest about your real position, and willing to tell you what to do.',
      icon: '✓',
      color: '#0D7A5F',
    },
  ]

  return (
    <div style={styles.page}>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroLeft}>
            <div style={styles.eyebrow}>ABSA NextGen Wealth Studio</div>
            <h1 style={styles.headline}>
              Your First Five Years.<br />
              <span style={styles.headlineRed}>Done Right.</span>
            </h1>
            <p style={styles.heroSub}>
              A financial planning studio built exclusively for high-earning young South African professionals.
              Understand your money, choose your direction, and simulate real decisions before you commit.
            </p>
            <div style={styles.heroButtons}>
              <Button size="lg" onClick={() => navigate('/auth')}>
                Get started free →
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate('/auth')}>
                Sign in
              </Button>
            </div>
            <div style={styles.heroNote}>
              Not financial advice · Built for SA context · No account linking required
            </div>
          </div>

          <div style={styles.heroRight}>
            <div style={styles.statsGrid}>
              {stats.map(s => (
                <div key={s.label} style={styles.statCard}>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={styles.personaStrip}>
              <div style={styles.personaLabel}>Designed for</div>
              <div style={styles.personaRow}>
                {[
                  { i: 'KM', n: 'Kefilwe, 26', r: 'Analyst · Joburg', c: '#4B44A8' },
                  { i: 'TP', n: 'Thabo, 29', r: 'Attorney · Cape Town', c: '#0D7A5F' },
                  { i: 'NZ', n: 'Nomvula, 24', r: 'Engineer · Joburg', c: '#C4472A' },
                  { i: 'RN', n: 'Riyaad, 27', r: 'Doctor · Durban', c: '#1A2744' },
                ].map(p => (
                  <div key={p.i} style={styles.persona}>
                    <div style={{ ...styles.personaAvatar, background: p.c }}>{p.i}</div>
                    <div style={styles.personaName}>{p.n}</div>
                    <div style={styles.personaRole}>{p.r}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <div style={styles.problemSection}>
        <PageWrapper>
          <div style={styles.sectionEyebrow}>The problem we solve</div>
          <h2 style={styles.sectionTitle}>The gap nobody filled</h2>
          <p style={styles.sectionSub}>
            A young South African professional earning R45,000 a month currently has three options for financial guidance. None of them work.
          </p>
          <div style={styles.problemGrid}>
            {problems.map(p => (
              <div key={p.title} style={{
                ...styles.problemCard,
                borderTop: `3px solid ${p.color}`,
              }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: p.color, marginBottom: '10px' }}>
                  {p.icon}
                </div>
                <div style={styles.problemTitle}>{p.title}</div>
                <div style={styles.problemDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </div>

      {/* PILLARS SECTION */}
      <div style={styles.pillarsSection}>
        <PageWrapper>
          <div style={styles.sectionEyebrow}>What's inside</div>
          <h2 style={styles.sectionTitle}>Four pillars. One studio.</h2>
          <div style={styles.pillarsGrid}>
            {pillars.map(p => (
              <div key={p.number} style={{
                ...styles.pillarCard,
                borderLeft: `3px solid ${p.color}`,
              }}>
                <div style={styles.pillarTop}>
                  <span style={styles.pillarIcon}>{p.icon}</span>
                  <span style={{ ...styles.pillarNum, color: p.color }}>
                    {p.number}
                  </span>
                </div>
                <div style={styles.pillarTitle}>{p.title}</div>
                <div style={styles.pillarDesc}>{p.desc}</div>
              </div>
            ))}
          </div>
        </PageWrapper>
      </div>

      {/* SA CONTEXT SECTION */}
      <div style={styles.contextSection}>
        <PageWrapper>
          <div style={styles.contextInner}>
            <div>
              <div style={styles.sectionEyebrow}>Built for South Africa</div>
              <h2 style={styles.sectionTitle}>Not adapted. Built.</h2>
              <p style={styles.contextDesc}>
                Every calculation in this product uses actual South African financial parameters —
                not approximations borrowed from a US or UK product.
              </p>
              <div style={styles.contextTags}>
                {[
                  'SARS 2024/25 tax brackets',
                  'UIF cap R177.12/mo',
                  'RA deduction 27.5%',
                  'TFSA R36K annual limit',
                  'Transfer duty sliding scale',
                  'Prime rate 11.25%',
                  'Foreign allowance R1M',
                  'Medical aid tax credit',
                ].map(tag => (
                  <div key={tag} style={styles.contextTag}>{tag}</div>
                ))}
              </div>
            </div>
            <div style={styles.contextCTA}>
              <div style={styles.ctaCard}>
                <div style={styles.ctaTitle}>Ready to see where you actually stand?</div>
                <div style={styles.ctaSub}>Takes 5 minutes. No bank account linking required.</div>
                <Button fullWidth size="lg" onClick={() => navigate('/auth')} style={{ marginTop: '20px' }}>
                  Build your Snapshot →
                </Button>
              </div>
            </div>
          </div>
        </PageWrapper>
      </div>

    </div>
  )
}

const styles = {
  page: { background: '#1A1A2E', minHeight: '100vh' },
  hero: { background: '#1A1A2E', padding: '80px 24px 60px', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center' },
  heroInner: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', width: '100%' },
  heroLeft: {},
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '16px' },
  headline: { fontSize: '48px', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '20px' },
  headlineRed: { color: '#CC0000' },
  heroSub: { fontSize: '16px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '440px' },
  heroButtons: { display: 'flex', gap: '12px', marginBottom: '16px' },
  heroNote: { fontSize: '11px', color: 'rgba(255,255,255,0.25)' },
  heroRight: { display: 'flex', flexDirection: 'column', gap: '16px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  statCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px', textAlign: 'center' },
  statValue: { fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '4px' },
  statLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.35)' },
  personaStrip: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px 20px' },
  personaLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', marginBottom: '14px' },
  personaRow: { display: 'flex', justifyContent: 'space-between' },
  persona: { textAlign: 'center' },
  personaAvatar: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff', margin: '0 auto 6px' },
  personaName: { fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: '2px' },
  personaRole: { fontSize: '10px', color: 'rgba(255,255,255,0.25)' },
  problemSection: { background: '#111118', padding: '80px 0' },
  sectionEyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '12px' },
  sectionTitle: { fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '16px' },
  sectionSub: { fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: '40px', maxWidth: '520px' },
  problemGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' },
  problemCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px' },
  problemTitle: { fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
  problemDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  pillarsSection: { background: '#1A1A2E', padding: '80px 0' },
  pillarsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' },
  pillarCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' },
  pillarTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  pillarIcon: { fontSize: '22px' },
  pillarNum: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em' },
  pillarTitle: { fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '8px' },
  pillarDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 },
  contextSection: { background: '#0F0F1A', padding: '80px 0' },
  contextInner: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' },
  contextDesc: { fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '420px' },
  contextTags: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  contextTag: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '5px 12px' },
  contextCTA: {},
  ctaCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '32px' },
  ctaTitle: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.3 },
  ctaSub: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 },
}

export default LandingPage