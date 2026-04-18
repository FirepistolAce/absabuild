import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'
import Button from '../Components/Button'

const TRACKS = {
  'property-path': {
    id: 'property-path',
    number: '01',
    name: 'The Property Path',
    tagline: 'Structured accumulation toward a first property purchase within 3–5 years.',
    color: '#4B44A8',
    lightColor: '#EEEDFE',
    personas: 'Kefilwe & Thabo persona profiles',
    philosophy: `The Property Path is built on one insight: property ownership in South Africa is one of the few vehicles that forces both wealth accumulation (equity) and cost stabilisation (fixed bond vs escalating rent) simultaneously. The short-term sacrifice is real — lifestyle growth will lag income growth for 3–4 years. The break-even point in most Joburg metros arrives around Year 4, after which the financial position diverges significantly in the buyer's favour.`,
    tradeoffs: `This track constrains discretionary spending, offshore investment, and vehicle upgrades during the accumulation phase. It prioritises credit score management and deposit building above everything else. If you are not genuinely committed to buying within 5 years, Track 2 (Balanced) is the more honest choice.`,
    milestones: [
      { id: 'y1-emergency', year: 'Year 1', title: 'Emergency fund established', desc: '3 months of essential expenses saved before anything else. No investing until this is done.', amount: 'R82,000 target' },
      { id: 'y1-cc', year: 'Year 1', title: 'Credit card debt cleared', desc: 'Revolving credit at 20% p/a costs more than any investment earns. Clear it first.', amount: 'R12,000 target' },
      { id: 'y2-deposit', year: 'Year 2', title: 'R100K deposit milestone', desc: 'First major savings milestone. Open a dedicated deposit account — separate from emergency fund.', amount: 'R100,000' },
      { id: 'y2-prequalify', year: 'Year 2', title: 'Bond pre-qualification obtained', desc: 'Approach a bank for a pre-qualification to understand your actual qualifying amount. This may change your target property price.', amount: 'Admin step' },
      { id: 'y3-deposit', year: 'Year 3', title: 'R250K deposit saved', desc: 'With R250K saved, a 10% deposit on a R1.8M–R2M property is within reach. Plus transfer costs.', amount: 'R250,000' },
      { id: 'y3-bond', year: 'Year 3', title: 'Bond application submitted', desc: 'Apply for the bond. Vehicle finance should be cleared or below R2,000/month by this point.', amount: 'Application step' },
      { id: 'y45-transfer', year: 'Year 4–5', title: 'First property registered', desc: 'Property transferred. Bond repayment within 30% of take-home. Resume RA contributions post-purchase.', amount: 'Goal achieved' },
    ],
    nudges: [
      'At your current saving rate, your R350K deposit target is 38 months away — 6 months behind schedule. Increase your monthly deposit contribution by R1,600 to close the gap.',
      'Your vehicle finance is reducing your qualifying bond amount by approximately R180,000. Consider this when setting your property price target.',
      'Your credit utilisation is above 35%. Bring this below 35% before applying for a bond — it affects your credit score and the interest rate you\'ll be offered.',
    ],
    priorities: ['Aggressive deposit accumulation', 'Clearing high-interest debt for better bond qualification', 'Credit score management (Experian / TransUnion)', 'Minimising new depreciating asset commitments'],
    avoids: ['New vehicle finance that reduces bond qualifying amount', 'Offshore investment that locks up liquidity', 'Lifestyle spend competing with the deposit target'],
  },
  'balanced': {
    id: 'balanced',
    number: '02',
    name: 'Balanced Lifestyle & Investing',
    tagline: 'Sustainable wealth growth without putting your entire life on hold.',
    color: '#0D7A5F',
    lightColor: '#E1F5EE',
    personas: 'Riyaad persona profile',
    philosophy: `The Balanced Track acknowledges a truth the other tracks ignore: extreme financial strategies fail because people abandon them. This track uses the 50/30/20 framework adapted for the South African context — 50% needs, 30% wants, 20% wealth-building — because sustainability over 5 years beats perfection for 6 months.`,
    tradeoffs: `This track produces slower progress on any single goal. It will not build a property deposit as fast as Track 1, nor accumulate a portfolio as fast as Track 3. The strength is that users are less likely to abandon it when peer pressure or lifestyle events create friction.`,
    milestones: [
      { id: 'y1-efund', year: 'Year 1', title: 'Emergency fund (3 months)', desc: 'Non-negotiable baseline before any investment contributions.', amount: 'R50,000–R80,000' },
      { id: 'y1-tfsa', year: 'Year 1', title: 'TFSA opened and contributing', desc: 'Open a TFSA and contribute at least R1,500/month. Every month you delay costs compounding returns.', amount: 'R18,000 Year 1' },
      { id: 'y1-ra', year: 'Year 1', title: 'RA at 10% of gross', desc: 'Set up a self-directed RA contributing at least 10% of gross income. This reduces your PAYE immediately.', amount: '10% of gross' },
      { id: 'y2-debt', year: 'Year 2', title: 'High-interest debt fully cleared', desc: 'Any credit card or personal loan debt cleared. Redirect that repayment to your TFSA.', amount: 'Zero target' },
      { id: 'y2-ip', year: 'Year 2', title: 'Income protection insurance', desc: 'A policy covering 75% of income if you cannot work. Essential for anyone without an employer safety net.', amount: '~R500–R1,200/mo' },
      { id: 'y3-tfsa', year: 'Year 3', title: 'TFSA at R108K cumulative', desc: 'Three years of maximised TFSA contributions at R3,000/month. Net worth is now positive.', amount: 'R108,000' },
      { id: 'y45-portfolio', year: 'Year 4–5', title: 'Investment portfolio R150K+', desc: 'Property decision revisited with a full financial picture. No pressure — you have options.', amount: 'R150,000+' },
    ],
    nudges: [
      'Your lifestyle spend this month was above the 30% Balanced Track allocation. A small adjustment next month keeps you on track without derailing the whole plan.',
      'You have not started your RA contribution yet. Year 1 contributions compound the longest — starting now costs less than starting in Year 2.',
      'Your TFSA has unused annual allowance remaining before the February cut-off. Unused allowance does not roll over.',
    ],
    priorities: ['50/30/20 framework adapted for SA context', 'TFSA maximised each year as primary investment vehicle', 'RA at minimum 10% of gross from Year 1', 'Emergency fund as absolute baseline before investing'],
    avoids: ['Single-goal obsession at the expense of everything else', 'Aggressive debt repayment that eliminates investment contributions', 'Lifestyle spend above the 30% allocation'],
  },
  'aggressive-investor': {
    id: 'aggressive-investor',
    number: '03',
    name: 'Aggressive Global Investor',
    tagline: 'Maximum wealth accumulation through disciplined, high-allocation investing — local and offshore.',
    color: '#1A2744',
    lightColor: '#E8EDF5',
    personas: 'Nomvula persona profile',
    philosophy: `The Aggressive Global Investor track is for users who genuinely believe compound interest is the most powerful force in personal finance — and are willing to organise their entire lifestyle around it for five years. The track prioritises TFSA maximisation, RA at the 27.5% tax deduction cap, and offshore allocation via the SARS foreign investment allowance. The payoff by Year 5 is a materially larger portfolio than either other track.`,
    tradeoffs: `No property for five years. No vehicle upgrades. No lifestyle inflation. High risk of user abandonment when peer pressure hits. The mathematics are compelling — the discipline requirement is the variable.`,
    milestones: [
      { id: 'y1-tfsa', year: 'Year 1', title: 'TFSA maxed from day one', desc: 'R36,000 annual limit fully utilised. R3,000/month into a JSE-listed global ETF feeder fund.', amount: 'R36,000 p/a' },
      { id: 'y1-ra', year: 'Year 1', title: 'RA at 20%+ of gross', desc: 'Maximise the pre-tax PAYE benefit. At R45K gross, this reduces your monthly tax bill by approximately R1,800.', amount: '20–27.5% of gross' },
      { id: 'y1-debt', year: 'Year 1', title: 'Zero consumer debt', desc: 'No revolving credit. No personal loans. Vehicle finance — if existing — being cleared aggressively.', amount: 'Zero' },
      { id: 'y2-offshore', year: 'Year 2', title: 'Offshore allocation initiated', desc: 'Begin direct offshore investment via the R1M annual discretionary allowance. No SARS tax clearance required below R1M.', amount: 'R1M limit' },
      { id: 'y2-portfolio', year: 'Year 2', title: 'Portfolio at R150K+', desc: 'Combined TFSA, RA, and offshore portfolio crossing the R150K mark.', amount: 'R150,000+' },
      { id: 'y3-offshore-pct', year: 'Year 3', title: 'Offshore at 30%+ of investable assets', desc: 'Rand hedging in place. Currency diversification reduces exposure to ZAR depreciation over the long term.', amount: '30%+ offshore' },
      { id: 'y45-portfolio', year: 'Year 4–5', title: 'Portfolio R600K–R800K', desc: 'Property decision revisited from a position of real financial strength. You have choices.', amount: 'R600K–R800K' },
    ],
    nudges: [
      'Your RA contribution is below the 27.5% cap. You have unused monthly tax deduction available — increasing now reduces your PAYE immediately.',
      'Your offshore allocation is below the track target of 30–40%. Consider increasing your foreign ETF contribution this month.',
      'You have reached R36,000 in TFSA contributions this tax year. Surplus should now route to a discretionary ETF account — CGT applies but compounding continues.',
    ],
    priorities: ['TFSA maxed from Year 1 (R36K p/a)', 'RA at 27.5% of taxable income — maximum tax deduction', 'Offshore allocation via foreign investment allowance (R1M discretionary)', 'Local ETF core plus direct offshore split'],
    avoids: ['Property purchase within the 5-year window — ties up capital', 'Vehicle finance competing with investment contributions', 'Any revolving consumer credit', 'Currency over-concentration in ZAR assets'],
  },
}

const STATUS = { not_started: 'Not started', in_progress: 'In progress', done: 'Done' }
const STATUS_COLORS = { not_started: 'rgba(255,255,255,0.2)', in_progress: '#B8860B', done: '#0D7A5F' }

function StrategyTrack() {
  const { trackId } = useParams()
  const { selectedTrack, selectTrack, trackProgress, updateMilestone, isLoggedIn, profile } = useUser()
  const navigate = useNavigate()
  const [learnOpen, setLearnOpen] = useState({})

  if (!isLoggedIn) { navigate('/'); return null }

  if (!trackId) {
    return (
      <div style={styles.page}>
        <div style={styles.wrap}>
          <div style={styles.eyebrow}>Strategy Tracks</div>
          <h1 style={styles.pageTitle}>Choose your five-year track</h1>
          <p style={styles.pageSub}>
            Three financial strategies. Real tradeoffs. Pick the one that fits where you're going — not just where you are.
          </p>

          <div style={styles.trackGrid}>
            {Object.values(TRACKS).map(track => (
              <div
                key={track.id}
                style={{
                  ...styles.trackCard,
                  borderTop: `4px solid ${track.color}`,
                  outline: selectedTrack === track.id ? `2px solid ${track.color}` : 'none',
                }}
              >
                <div style={{ ...styles.trackNum, color: track.color }}>Track {track.number}</div>
                <div style={styles.trackName}>{track.name}</div>
                <div style={styles.trackTagline}>{track.tagline}</div>

                <div style={styles.trackStats}>
                  <div style={styles.trackStat}>
                    <div style={styles.statLabel}>Persona match</div>
                    <div style={styles.statVal}>{track.personas}</div>
                  </div>
                </div>

                <div style={styles.trackCardFooter}>
                  {selectedTrack === track.id ? (
                    <div style={{ ...styles.activeBadge, color: track.color, background: track.lightColor }}>
                      Active track
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { selectTrack(track.id); navigate(`/tracks/${track.id}`) }}
                    >
                      Select track
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/tracks/${track.id}`)}
                  >
                    View details →
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.compareSection}>
            <div style={styles.compareTitle}>Track comparison</div>
            <div style={styles.compareGrid}>
              <div style={styles.compareHeader}>
                <div style={styles.compareRowLabel} />
                {Object.values(TRACKS).map(t => (
                  <div key={t.id} style={{ ...styles.compareColHead, background: t.color }}>{t.name}</div>
                ))}
              </div>
              {[
                { label: 'Primary goal', vals: ['First property', 'Multi-front progress', 'Max portfolio'] },
                { label: 'RA target', vals: ['Minimum 10%', '10% from Year 1', '27.5% cap'] },
                { label: 'TFSA', vals: ['Partial', 'Maximised', 'Maximised'] },
                { label: 'Offshore', vals: ['Avoided', 'Optional', 'Core strategy'] },
                { label: 'Property in 5 yrs', vals: ['Primary goal', 'Possible', 'Deferred'] },
                { label: 'Lifestyle flex', vals: ['Constrained', 'Balanced', 'Highly constrained'] },
              ].map(row => (
                <div key={row.label} style={styles.compareRow}>
                  <div style={styles.compareRowLabel}>{row.label}</div>
                  {row.vals.map((v, i) => (
                    <div key={i} style={styles.compareCell}>{v}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const track = TRACKS[trackId]
  if (!track) { navigate('/tracks'); return null }

  const progress = trackProgress[track.id] || {}

  const toggleLearn = (key) => setLearnOpen(prev => ({ ...prev, [key]: !prev[key] }))

  const cycleStatus = (milestoneId) => {
    const current = progress[milestoneId] || 'not_started'
    const next = current === 'not_started' ? 'in_progress' : current === 'in_progress' ? 'done' : 'not_started'
    updateMilestone(track.id, milestoneId, next)
  }

  const completedCount = track.milestones.filter(m => progress[m.id] === 'done').length
  const progressPct = Math.round((completedCount / track.milestones.length) * 100)

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbLink} onClick={() => navigate('/tracks')}>← All tracks</span>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={{ ...styles.breadcrumbCurrent, color: track.color }}>{track.name}</span>
          {selectedTrack === track.id && (
            <div style={{ ...styles.activeBadge, color: track.color, background: track.lightColor, marginLeft: 'auto' }}>
              Active track
            </div>
          )}
        </div>

        <div style={{ ...styles.trackHero, background: '#1A1A2E' }}>
          <div style={{ ...styles.trackHeroNum, color: track.color }}>Track {track.number}</div>
          <h1 style={styles.trackHeroName}>{track.name}</h1>
          <p style={styles.trackHeroTagline}>{track.tagline}</p>
          {selectedTrack !== track.id && (
            <Button
              variant="primary"
              onClick={() => selectTrack(track.id)}
              style={{ marginTop: '16px' }}
            >
              Select this track
            </Button>
          )}
        </div>

        <div style={styles.mainGrid}>
          <div style={{ flex: 2 }}>
            <div style={styles.sectionHead}>Five-year milestones</div>
            <div style={styles.progressSummary}>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progressPct}%`, background: track.color }} />
              </div>
              <div style={styles.progressLabel}>{completedCount} of {track.milestones.length} milestones {completedCount === track.milestones.length ? 'complete' : 'done'}</div>
            </div>

            <div style={styles.milestones}>
              {track.milestones.map((m, idx) => {
                const status = progress[m.id] || 'not_started'
                return (
                  <div
                    key={m.id}
                    style={{
                      ...styles.milestone,
                      borderLeft: `3px solid ${status === 'done' ? track.color : status === 'in_progress' ? '#B8860B' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  >
                    <div style={styles.milestoneTop}>
                      <div>
                        <div style={{ ...styles.milestoneYear, color: track.color }}>{m.year}</div>
                        <div style={styles.milestoneTitle}>{m.title}</div>
                        <div style={styles.milestoneDesc}>{m.desc}</div>
                        <div style={{ ...styles.milestoneAmount, color: track.color }}>{m.amount}</div>
                      </div>
                      <button
                        style={{
                          ...styles.statusBtn,
                          background: STATUS_COLORS[status],
                          color: status === 'not_started' ? 'rgba(255,255,255,0.4)' : '#fff',
                        }}
                        onClick={() => cycleStatus(m.id)}
                        title="Click to cycle status"
                      >
                        {STATUS[status]}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={styles.sectionHead}>Track philosophy</div>
            <div style={styles.infoCard}>
              <p style={styles.infoText}>{track.philosophy}</p>
            </div>

            <div style={styles.sectionHead} style={{ marginTop: '20px' }}>Tradeoffs</div>
            <div style={{ ...styles.infoCard, borderLeft: `3px solid #C4472A` }}>
              <p style={styles.infoText}>{track.tradeoffs}</p>
            </div>

            <div style={styles.sectionHead}>This track prioritises</div>
            <div style={styles.infoCard}>
              {track.priorities.map((p, i) => (
                <div key={i} style={styles.listItem}>
                  <div style={{ ...styles.listDot, background: track.color }} />
                  <span style={styles.listText}>{p}</span>
                </div>
              ))}
            </div>

            <div style={styles.sectionHead}>This track avoids</div>
            <div style={styles.infoCard}>
              {track.avoids.map((a, i) => (
                <div key={i} style={styles.listItem}>
                  <div style={{ ...styles.listDot, background: '#C4472A' }} />
                  <span style={styles.listText}>{a}</span>
                </div>
              ))}
            </div>

            <div style={styles.sectionHead}>Nudge examples</div>
            <div style={styles.nudgeBox}>
              {track.nudges.map((n, i) => (
                <div key={i} style={styles.nudgeItem}>
                  <div style={{ ...styles.nudgeDot, background: track.color }} />
                  <p style={styles.nudgeText}>"{n}"</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => navigate('/simulation')}
              >
                Run Simulation Lab →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#0F0F1A', padding: '32px 24px' },
  wrap: { maxWidth: '1200px', margin: '0 auto' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '12px' },
  pageTitle: { fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '10px' },
  pageSub: { fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '36px', maxWidth: '520px' },
  trackGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '40px' },
  trackCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' },
  trackNum: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
  trackName: { fontSize: '17px', fontWeight: 800, color: '#fff', lineHeight: 1.2 },
  trackTagline: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 },
  trackStats: { background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '10px 12px' },
  trackStat: {},
  statLabel: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '3px' },
  statVal: { fontSize: '12px', color: 'rgba(255,255,255,0.6)' },
  trackCardFooter: { display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  activeBadge: { fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center' },
  compareSection: { marginTop: '8px' },
  compareTitle: { fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '14px' },
  compareGrid: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' },
  compareHeader: { display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr' },
  compareColHead: { padding: '12px 14px', fontSize: '11px', fontWeight: 700, color: '#fff' },
  compareRow: { display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.05)' },
  compareRowLabel: { padding: '10px 14px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.02)' },
  compareCell: { padding: '10px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' },
  breadcrumbLink: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' },
  breadcrumbSep: { color: 'rgba(255,255,255,0.2)' },
  breadcrumbCurrent: { fontSize: '13px', fontWeight: 500 },
  trackHero: { borderRadius: '14px', padding: '28px 32px', marginBottom: '28px' },
  trackHeroNum: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' },
  trackHeroName: { fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' },
  trackHeroTagline: { fontSize: '14px', color: 'rgba(255,255,255,0.45)', maxWidth: '480px', lineHeight: 1.6 },
  mainGrid: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  sectionHead: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '12px', marginTop: '20px' },
  progressSummary: { marginBottom: '20px' },
  progressBar: { background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '3px', marginBottom: '6px' },
  progressFill: { height: '6px', borderRadius: '3px', transition: 'width 0.5s ease' },
  progressLabel: { fontSize: '12px', color: 'rgba(255,255,255,0.4)' },
  milestones: { display: 'flex', flexDirection: 'column', gap: '12px' },
  milestone: { background: '#1C1C2E', borderRadius: '0 10px 10px 0', padding: '16px 18px' },
  milestoneTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' },
  milestoneYear: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' },
  milestoneTitle: { fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '5px' },
  milestoneDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, marginBottom: '6px' },
  milestoneAmount: { fontSize: '12px', fontWeight: 600 },
  statusBtn: { flexShrink: 0, border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', whiteSpace: 'nowrap' },
  infoCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px', marginBottom: '6px' },
  infoText: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 },
  listItem: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' },
  listDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  listText: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 },
  nudgeBox: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '14px' },
  nudgeItem: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' },
  nudgeDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  nudgeText: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, fontStyle: 'italic' },
}

export default StrategyTrack