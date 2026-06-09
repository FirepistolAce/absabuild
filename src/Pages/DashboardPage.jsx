import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useNudges } from '../hooks/useNudges'
import PageWrapper from '../components/layout/PageWrapper'
import Card, { CardLabel, CardValue, CardSub } from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import NudgeCard from '../components/ui/NudgeCard'
import DonutChart from '../components/charts/DonutChart'
import { formatZAR, formatPercent } from '../utils/formatters'
import TRACKS from '../data/tracks'

function DashboardPage() {
  const {
    isLoggedIn,
    user,
    profile,
    selectedTrack,
    trackProgress,
    snapshotComplete,
    calculateTakeHome,
    calculateNetWorth,
    calculateFixedCostLoad,
    calculateDebtToIncome,
    calculateSavingsRate,
    calculateDisposableIncome,
  } = useUser()

  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) navigate('/auth')
  }, [isLoggedIn, navigate])

  const takeHome = calculateTakeHome()
  const netWorth = calculateNetWorth()
  const fixedCostLoad = calculateFixedCostLoad()
  const dti = calculateDebtToIncome()
  const savingsRate = calculateSavingsRate()
  const disposable = calculateDisposableIncome()

  const nudges = useNudges({
    profile,
    selectedTrack,
    takeHome,
    fixedCostLoad,
    netWorth,
  })

  const track = selectedTrack ? TRACKS[selectedTrack] : null

  const getTrackProgress = () => {
    if (!track) return 0
    const milestones = track.milestones || []
    if (!milestones.length) return 0
    const progress = trackProgress[selectedTrack] || {}
    const completed = milestones.filter(m => progress[m.id] === 'complete').length
    return Math.round((completed / milestones.length) * 100)
  }

  const trackPct = getTrackProgress()

  const getFixedCostColor = () => {
    if (fixedCostLoad > 75) return 'var(--color-red)'
    if (fixedCostLoad > 60) return 'var(--color-amber)'
    return 'var(--color-teal)'
  }

  const getDTIColor = () => {
    if (dti > 40) return 'var(--color-red)'
    if (dti > 30) return 'var(--color-amber)'
    return 'var(--color-teal)'
  }

  const getSavingsColor = () => {
    if (savingsRate >= 20) return 'var(--color-teal)'
    if (savingsRate >= 10) return 'var(--color-amber)'
    return 'var(--color-red)'
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'

  const quickLinks = [
    {
      label: 'Money Snapshot',
      desc: snapshotComplete ? 'View and edit your financial profile' : 'Set up your financial profile',
      icon: '📊',
      color: 'var(--color-purple)',
      route: '/snapshot',
      badge: snapshotComplete ? null : 'Setup needed',
    },
    {
      label: 'Strategy Tracks',
      desc: track ? `Active: ${track.name}` : 'Choose your 5-year direction',
      icon: '🗺️',
      color: 'var(--color-teal)',
      route: '/tracks',
      badge: track ? null : 'Not selected',
    },
    {
      label: 'Simulation Lab',
      desc: 'Run property, car, and offshore scenarios',
      icon: '⚗️',
      color: 'var(--color-coral)',
      route: '/simulation',
      badge: null,
    },
    {
      label: 'SA Glossary',
      desc: 'Understand every financial term',
      icon: '📖',
      color: 'var(--color-amber)',
      route: '/glossary',
      badge: null,
    },
  ]

  return (
    <div style={styles.page}>
      <PageWrapper>

        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <div style={styles.greeting}>{greeting}, {firstName}.</div>
            <div style={styles.subGreeting}>
              {snapshotComplete
                ? 'Here is your financial overview.'
                : 'Complete your Money Snapshot to unlock your full dashboard.'}
            </div>
          </div>
          {!snapshotComplete && (
            <Button onClick={() => navigate('/snapshot')} size="lg">
              Complete Snapshot →
            </Button>
          )}
        </div>

        {/* NUDGES */}
        {nudges.length > 0 && snapshotComplete && (
          <div style={styles.nudgesSection}>
            <div style={styles.nudgesLabel}>
              <span style={styles.nudgeDot} />
              {nudges.length} active insight{nudges.length !== 1 ? 's' : ''}
            </div>
            <div style={styles.nudgesList}>
              {nudges.slice(0, 2).map(n => (
                <NudgeCard key={n.id} nudge={n} />
              ))}
            </div>
          </div>
        )}

        {/* METRICS GRID */}
        {snapshotComplete ? (
          <>
            <div style={styles.sectionLabel}>Financial overview</div>
            <div style={styles.metricsGrid}>

              {/* Take-home */}
              <Card accent="var(--color-purple)">
                <CardLabel color="var(--color-purple)">Monthly take-home</CardLabel>
                <CardValue large>{formatZAR(takeHome)}</CardValue>
                <CardSub>After PAYE, UIF, RA and medical aid</CardSub>
              </Card>

              {/* Net worth */}
              <Card accent={netWorth >= 0 ? 'var(--color-teal)' : 'var(--color-red)'}>
                <CardLabel color={netWorth >= 0 ? 'var(--color-teal)' : 'var(--color-red)'}>
                  Net worth
                </CardLabel>
                <CardValue large negative={netWorth < 0}>{formatZAR(netWorth)}</CardValue>
                <CardSub>Assets minus all liabilities</CardSub>
              </Card>

              {/* Disposable income */}
              <Card accent="var(--color-amber)">
                <CardLabel color="var(--color-amber)">Disposable income</CardLabel>
                <CardValue large>{formatZAR(disposable)}</CardValue>
                <CardSub>After fixed costs and commitments</CardSub>
              </Card>

              {/* Gross salary */}
              <Card>
                <CardLabel>Gross monthly salary</CardLabel>
                <CardValue large>{formatZAR(profile.grossSalary)}</CardValue>
                <CardSub>Before any deductions</CardSub>
              </Card>

            </div>

            {/* RATIOS ROW */}
            <div style={styles.sectionLabel}>Key ratios</div>
            <div style={styles.ratiosGrid}>

              {/* Fixed cost load */}
              <Card style={styles.ratioCard}>
                <div style={styles.ratioInner}>
                  <DonutChart
                    percentage={fixedCostLoad}
                    color={getFixedCostColor()}
                    size={90}
                    strokeWidth={10}
                  />
                  <div style={styles.ratioText}>
                    <CardLabel>Fixed cost load</CardLabel>
                    <div style={styles.ratioValue}>{formatPercent(fixedCostLoad)}</div>
                    <CardSub>
                      {fixedCostLoad > 75
                        ? 'Danger zone — above 75%'
                        : fixedCostLoad > 60
                        ? 'Above 60% ceiling'
                        : 'Within healthy range'}
                    </CardSub>
                  </div>
                </div>
              </Card>

              {/* Debt to income */}
              <Card style={styles.ratioCard}>
                <div style={styles.ratioInner}>
                  <DonutChart
                    percentage={dti}
                    color={getDTIColor()}
                    size={90}
                    strokeWidth={10}
                  />
                  <div style={styles.ratioText}>
                    <CardLabel>Debt-to-income</CardLabel>
                    <div style={styles.ratioValue}>{formatPercent(dti)}</div>
                    <CardSub>
                      {dti > 40
                        ? 'High — affects bond qualification'
                        : dti > 30
                        ? 'Moderate — monitor closely'
                        : 'Healthy for bond qualification'}
                    </CardSub>
                  </div>
                </div>
              </Card>

              {/* Savings rate */}
              <Card style={styles.ratioCard}>
                <div style={styles.ratioInner}>
                  <DonutChart
                    percentage={savingsRate}
                    color={getSavingsColor()}
                    size={90}
                    strokeWidth={10}
                  />
                  <div style={styles.ratioText}>
                    <CardLabel>Savings rate</CardLabel>
                    <div style={styles.ratioValue}>{formatPercent(savingsRate)}</div>
                    <CardSub>
                      {savingsRate >= 20
                        ? 'On target — keep going'
                        : savingsRate >= 10
                        ? 'Below 20% benchmark'
                        : 'Critical — below 10%'}
                    </CardSub>
                  </div>
                </div>
              </Card>

            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📊</div>
            <div style={styles.emptyTitle}>Your dashboard is waiting</div>
            <div style={styles.emptySub}>
              Complete your Money Snapshot to see your take-home pay, net worth,
              debt-to-income ratio, and savings rate — all calculated with real SARS logic.
            </div>
            <Button onClick={() => navigate('/snapshot')} size="lg" style={{ marginTop: '20px' }}>
              Set up Money Snapshot →
            </Button>
          </div>
        )}

        {/* STRATEGY TRACK STATUS */}
        <div style={styles.sectionLabel}>Strategy track</div>
        {track ? (
          <Card accent={track.color} style={styles.trackCard}>
            <div style={styles.trackInner}>
              <div style={styles.trackLeft}>
                <div style={styles.trackIcon}>{track.icon}</div>
                <div>
                  <div style={styles.trackNum} onClick={() => navigate('/tracks')}>
                    Track {track.number}
                  </div>
                  <div style={styles.trackName}>{track.name}</div>
                  <div style={styles.trackTagline}>{track.tagline}</div>
                </div>
              </div>
              <div style={styles.trackRight}>
                <div style={styles.trackProgressLabel}>
                  Milestone progress
                </div>
                <div style={styles.trackProgressRow}>
                  <div style={styles.trackProgressBar}>
                    <div style={{
                      ...styles.trackProgressFill,
                      width: `${trackPct}%`,
                      background: track.color,
                    }} />
                  </div>
                  <div style={{ ...styles.trackPct, color: track.color }}>
                    {trackPct}%
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/tracks/${selectedTrack}`)}
                  style={{ marginTop: '12px' }}
                >
                  View track →
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card style={styles.trackEmpty}>
            <div style={styles.trackEmptyInner}>
              <div style={styles.trackEmptyText}>
                <div style={styles.trackEmptyTitle}>No track selected</div>
                <div style={styles.trackEmptySub}>
                  Choose a 5-year financial direction — Property Path, Balanced Lifestyle,
                  or Aggressive Global Investor. Each has milestones, trade-offs, and recommendations.
                </div>
              </div>
              <Button onClick={() => navigate('/tracks')} variant="teal">
                Browse tracks →
              </Button>
            </div>
          </Card>
        )}

        {/* QUICK LINKS */}
        <div style={styles.sectionLabel}>Quick access</div>
        <div style={styles.quickGrid}>
          {quickLinks.map(link => (
            <div
              key={link.route}
              style={styles.quickCard}
              onClick={() => navigate(link.route)}
            >
              <div style={styles.quickTop}>
                <div style={styles.quickIcon}>{link.icon}</div>
                {link.badge && (
                  <Badge variant={link.badge === 'Setup needed' ? 'red' : 'amber'}>
                    {link.badge}
                  </Badge>
                )}
              </div>
              <div style={styles.quickLabel}>{link.label}</div>
              <div style={styles.quickDesc}>{link.desc}</div>
              <div style={{ ...styles.quickArrow, color: link.color }}>→</div>
            </div>
          ))}
        </div>

        {/* INCOME BREAKDOWN — only if snapshot complete */}
        {snapshotComplete && profile.grossSalary > 0 && (
          <>
            <div style={styles.sectionLabel}>Income breakdown</div>
            <Card>
              <div style={styles.breakdownGrid}>
                {[
                  {
                    label: 'Gross salary',
                    value: formatZAR(profile.grossSalary),
                    color: 'var(--color-purple)',
                    sub: '100% of gross',
                  },
                  {
                    label: 'RA contribution',
                    value: `− ${formatZAR(profile.raContribution)}`,
                    color: 'var(--color-teal)',
                    sub: 'Pre-tax deduction',
                  },
                  {
                    label: 'PAYE',
                    value: `− ${formatZAR(Math.max(0, profile.grossSalary - takeHome - Math.min(profile.grossSalary * 0.01, 177.12) - (profile.raContribution || 0) - (profile.medicalAid || 0)))}`,
                    color: 'var(--color-red)',
                    sub: 'Income tax (SARS)',
                  },
                  {
                    label: 'UIF',
                    value: `− ${formatZAR(Math.min(profile.grossSalary * 0.01, 177.12))}`,
                    color: 'var(--color-amber)',
                    sub: 'Capped at R177.12',
                  },
                  {
                    label: 'Medical aid',
                    value: `− ${formatZAR(profile.medicalAid)}`,
                    color: 'var(--color-amber)',
                    sub: 'Employee portion',
                  },
                  {
                    label: 'Take-home',
                    value: formatZAR(takeHome),
                    color: 'var(--color-teal)',
                    sub: 'Net monthly pay',
                    highlight: true,
                  },
                ].map((item, i) => (
                  <div key={i} style={{
                    ...styles.breakdownItem,
                    ...(item.highlight ? styles.breakdownHighlight : {}),
                  }}>
                    <div style={{ ...styles.breakdownDot, background: item.color }} />
                    <div style={styles.breakdownContent}>
                      <div style={styles.breakdownLabel}>{item.label}</div>
                      <div style={styles.breakdownSub}>{item.sub}</div>
                    </div>
                    <div style={{ ...styles.breakdownValue, color: item.highlight ? item.color : '#fff' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

      </PageWrapper>
    </div>
  )
}

const styles = {
  page: {
    background: 'var(--color-bg-base)',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  greeting: {
    fontSize: '28px',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: '6px',
  },
  subGreeting: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
  },
  sectionLabel: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: '14px',
    marginTop: '36px',
  },
  nudgesSection: {
    marginBottom: '32px',
  },
  nudgesLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '10px',
  },
  nudgeDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--color-amber)',
    display: 'inline-block',
  },
  nudgesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
    marginBottom: '0',
  },
  ratiosGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
  },
  ratioCard: {
    padding: '20px',
  },
  ratioInner: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  ratioText: {
    flex: 1,
  },
  ratioValue: {
    fontSize: '22px',
    fontWeight: 800,
    color: '#fff',
    letterSpacing: '-0.02em',
    marginBottom: '4px',
    marginTop: '2px',
  },
  trackCard: {
    padding: '24px',
  },
  trackInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  trackLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  trackIcon: {
    fontSize: '32px',
    lineHeight: 1,
  },
  trackNum: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '4px',
    cursor: 'pointer',
  },
  trackName: {
    fontSize: '17px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '4px',
  },
  trackTagline: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    maxWidth: '320px',
  },
  trackRight: {
    minWidth: '200px',
  },
  trackProgressLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '10px',
  },
  trackProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  trackProgressBar: {
    flex: 1,
    height: '6px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '999px',
    overflow: 'hidden',
  },
  trackProgressFill: {
    height: '100%',
    borderRadius: '999px',
    transition: 'width 0.6s ease',
  },
  trackPct: {
    fontSize: '13px',
    fontWeight: 700,
    minWidth: '36px',
    textAlign: 'right',
  },
  trackEmpty: {
    padding: '24px',
  },
  trackEmptyInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
  },
  trackEmptyText: {
    flex: 1,
  },
  trackEmptyTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '6px',
  },
  trackEmptySub: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.6,
    maxWidth: '480px',
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '14px',
  },
  quickCard: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, transform 0.2s',
    position: 'relative',
  },
  quickTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  quickIcon: {
    fontSize: '24px',
    lineHeight: 1,
  },
  quickLabel: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '5px',
  },
  quickDesc: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.5,
    marginBottom: '12px',
  },
  quickArrow: {
    fontSize: '16px',
    fontWeight: 700,
  },
  emptyState: {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-xl)',
    padding: '48px',
    textAlign: 'center',
    marginBottom: '8px',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '10px',
  },
  emptySub: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 1.7,
    maxWidth: '440px',
    margin: '0 auto',
  },
  breakdownGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  breakdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  breakdownHighlight: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '12px',
    borderBottom: 'none',
    marginTop: '4px',
  },
  breakdownDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  breakdownContent: {
    flex: 1,
  },
  breakdownLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.75)',
  },
  breakdownSub: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    marginTop: '1px',
  },
  breakdownValue: {
    fontSize: '14px',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
  },
}

export default DashboardPage