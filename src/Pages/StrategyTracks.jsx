import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import ProgressBar from '../components/ui/ProgressBar'
import TRACKS, { TRACK_LIST } from '../data/tracks'

// ─── OVERVIEW PAGE (/tracks) ─────────────────────────────────────

function TracksOverview({ selectedTrack, selectTrack, navigate }) {
  return (
    <div style={styles.page}>
      <PageWrapper>
        <div style={styles.eyebrow}>Strategy Tracks</div>
        <h1 style={styles.pageTitle}>Choose your five-year track</h1>
        <p style={styles.pageSub}>
          Three financial strategies. Real tradeoffs. Choose the one that fits where you are going —
          not just where you are right now.
        </p>

        {/* TRACK CARDS */}
        <div style={styles.trackGrid}>
          {TRACK_LIST.map(track => (
            <div
              key={track.id}
              style={{
                ...styles.trackCard,
                borderTop: `4px solid ${track.color}`,
                outline: selectedTrack === track.id ? `2px solid ${track.color}` : 'none',
                outlineOffset: '2px',
              }}
            >
              <div style={styles.trackCardTop}>
                <div style={{ ...styles.trackNum, color: track.color }}>
                  Track {track.number}
                </div>
                <div style={styles.trackIcon}>{track.icon}</div>
              </div>

              <div style={styles.trackName}>{track.name}</div>
              <div style={styles.trackTagline}>{track.tagline}</div>

              <div style={styles.trackDivider} />

              <div style={styles.trackMeta}>
                <div style={styles.trackMetaRow}>
                  <span style={styles.trackMetaLabel}>Best for</span>
                  <span style={styles.trackMetaVal}>{track.bestFor.slice(0, 60)}…</span>
                </div>
                <div style={styles.trackMetaRow}>
                  <span style={styles.trackMetaLabel}>Persona</span>
                  <span style={styles.trackMetaVal}>{track.personas}</span>
                </div>
              </div>

              {/* WARNINGS PREVIEW */}
              <div style={{ ...styles.warningPreview, borderColor: track.color + '33' }}>
                <div style={{ ...styles.warningPreviewLabel, color: track.color }}>
                  Key constraint
                </div>
                <div style={styles.warningPreviewText}>
                  {track.warnings[0]}
                </div>
              </div>

              <div style={styles.trackCardFooter}>
                {selectedTrack === track.id ? (
                  <Badge variant={
                    track.color === 'var(--color-teal)' ? 'teal'
                    : track.color === '#0D7A5F' ? 'teal'
                    : track.color === '#4B44A8' ? 'purple'
                    : 'red'
                  }>
                    ✓ Active track
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      selectTrack(track.id)
                      navigate(`/tracks/${track.id}`)
                    }}
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

        {/* COMPARISON TABLE */}
        <div style={styles.compareSection}>
          <div style={styles.sectionLabel}>Track comparison</div>
          <div style={styles.compareTable}>
            {/* Header */}
            <div style={styles.compareHeaderRow}>
              <div style={styles.compareRowLabel} />
              {TRACK_LIST.map(t => (
                <div
                  key={t.id}
                  style={{ ...styles.compareColHead, background: t.color }}
                >
                  <div style={styles.compareColIcon}>{t.icon}</div>
                  <div>{t.name}</div>
                </div>
              ))}
            </div>

            {[
              { label: 'Primary goal', vals: ['First property in 3–5 yrs', 'Multi-front progress', 'Max portfolio by Year 5'] },
              { label: 'RA contribution', vals: ['Minimum 10%', '10% from Year 1', '27.5% cap from Year 1'] },
              { label: 'TFSA', vals: ['Partial / deferred', 'Maximised annually', 'Maximised from Day 1'] },
              { label: 'Offshore exposure', vals: ['Avoided', 'Optional 20–30%', 'Core strategy 30–40%'] },
              { label: 'Property in 5 yrs', vals: ['Primary objective', 'Revisited at Year 4', 'Deliberately deferred'] },
              { label: 'Lifestyle flexibility', vals: ['Constrained', 'Balanced 30%', 'Highly constrained'] },
              { label: 'Discipline required', vals: ['High', 'Moderate', 'Very high'] },
              { label: 'Year 5 outcome', vals: ['Property registered', 'Portfolio R150K+', 'Portfolio R600K–R800K'] },
            ].map((row, i) => (
              <div
                key={row.label}
                style={{
                  ...styles.compareRow,
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                }}
              >
                <div style={styles.compareRowLabel}>{row.label}</div>
                {row.vals.map((v, j) => (
                  <div key={j} style={styles.compareCell}>{v}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATIONAL NOTE */}
        <div style={styles.eduNote}>
          <div style={styles.eduNoteIcon}>💡</div>
          <div>
            <div style={styles.eduNoteTitle}>Which track is right for you?</div>
            <div style={styles.eduNoteBody}>
              Track 1 suits you if property ownership in Johannesburg or Cape Town is a genuine 3–5 year goal
              and you are willing to constrain your lifestyle to get there. Track 2 suits you if you want
              meaningful progress across multiple financial goals without extreme sacrifice. Track 3 suits
              you if you believe compound interest over five years is worth more than any single asset purchase
              — and you can genuinely commit to that without abandoning the strategy in Year 2.
            </div>
          </div>
        </div>

      </PageWrapper>
    </div>
  )
}

// ─── TRACK DETAIL PAGE (/tracks/:trackId) ────────────────────────

function TrackDetail({ trackId, selectedTrack, selectTrack, trackProgress, updateMilestone, navigate }) {
  const track = TRACKS[trackId]
  const [expandedMilestone, setExpandedMilestone] = useState(null)

  if (!track) {
    navigate('/tracks')
    return null
  }

  const progress = trackProgress[track.id] || {}

  const cycleStatus = (milestoneId) => {
    const current = progress[milestoneId] || 'not_started'
    const next = current === 'not_started'
      ? 'in_progress'
      : current === 'in_progress'
      ? 'complete'
      : 'not_started'
    updateMilestone(track.id, milestoneId, next)
  }

  const completedCount = track.milestones.filter(m => progress[m.id] === 'complete').length
  const inProgressCount = track.milestones.filter(m => progress[m.id] === 'in_progress').length
  const progressPct = Math.round((completedCount / track.milestones.length) * 100)

  const getStatusStyle = (status) => {
    if (status === 'complete') return { bg: 'var(--color-teal)', color: '#fff', label: '✓ Complete' }
    if (status === 'in_progress') return { bg: 'var(--color-amber)', color: '#fff', label: '→ In progress' }
    return { bg: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', label: 'Not started' }
  }

  // Group milestones by year
  const milestonesByYear = track.milestones.reduce((acc, m) => {
    if (!acc[m.year]) acc[m.year] = []
    acc[m.year].push(m)
    return acc
  }, {})

  return (
    <div style={styles.page}>
      <PageWrapper>

        {/* BREADCRUMB */}
        <div style={styles.breadcrumb}>
          <span style={styles.breadcrumbLink} onClick={() => navigate('/tracks')}>
            ← All tracks
          </span>
          <span style={styles.breadcrumbSep}>/</span>
          <span style={{ ...styles.breadcrumbCurrent, color: track.color }}>
            {track.name}
          </span>
          {selectedTrack === track.id && (
            <Badge variant="teal" style={{ marginLeft: 'auto' }}>
              ✓ Active track
            </Badge>
          )}
        </div>

        {/* HERO */}
        <div style={{ ...styles.trackHero, borderTop: `4px solid ${track.color}` }}>
          <div style={styles.trackHeroLeft}>
            <div style={styles.trackHeroIcon}>{track.icon}</div>
            <div>
              <div style={{ ...styles.trackHeroNum, color: track.color }}>
                Track {track.number}
              </div>
              <h1 style={styles.trackHeroName}>{track.name}</h1>
              <p style={styles.trackHeroTagline}>{track.tagline}</p>
              <div style={styles.trackHeroMeta}>
                <div style={styles.trackHeroMetaItem}>
                  <span style={styles.trackHeroMetaLabel}>Best for</span>
                  <span style={styles.trackHeroMetaVal}>{track.bestFor}</span>
                </div>
                <div style={styles.trackHeroMetaItem}>
                  <span style={styles.trackHeroMetaLabel}>Not for</span>
                  <span style={styles.trackHeroMetaVal}>{track.notFor}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={styles.trackHeroRight}>
            {selectedTrack !== track.id ? (
              <Button
                variant="primary"
                onClick={() => selectTrack(track.id)}
                style={{ marginBottom: '12px', width: '100%' }}
              >
                Select this track
              </Button>
            ) : (
              <div style={{ ...styles.activeTrackPill, background: track.color + '22', color: track.color, border: `1px solid ${track.color}44`, marginBottom: '12px' }}>
                ✓ This is your active track
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/simulation')}
              style={{ width: '100%' }}
            >
              Run related studio →
            </Button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div style={styles.mainGrid}>

          {/* LEFT — MILESTONES */}
          <div style={styles.milestonesCol}>

            {/* PROGRESS SUMMARY */}
            <div style={styles.progressCard}>
              <div style={styles.progressCardTop}>
                <div>
                  <div style={styles.sectionLabel}>Milestone progress</div>
                  <div style={styles.progressStats}>
                    <span style={{ color: 'var(--color-teal)' }}>{completedCount} complete</span>
                    {inProgressCount > 0 && (
                      <span style={{ color: 'var(--color-amber)', marginLeft: '12px' }}>
                        {inProgressCount} in progress
                      </span>
                    )}
                    <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '12px' }}>
                      {track.milestones.length - completedCount - inProgressCount} remaining
                    </span>
                  </div>
                </div>
                <div style={{ ...styles.progressPct, color: track.color }}>
                  {progressPct}%
                </div>
              </div>
              <ProgressBar
                value={progressPct}
                max={100}
                color={track.color}
                height={8}
                animate
              />
              <div style={styles.progressNote}>
                Click any milestone to expand it. Click the status button to cycle: Not started → In progress → Complete
              </div>
            </div>

            {/* VISUAL TIMELINE */}
            <div style={styles.sectionLabel}>Five-year timeline</div>
            {Object.entries(milestonesByYear).map(([year, milestones]) => (
              <div key={year} style={styles.yearGroup}>
                <div style={{ ...styles.yearLabel, color: track.color }}>
                  {year}
                </div>
                <div style={styles.yearMilestones}>
                  {milestones.map((m) => {
                    const status = progress[m.id] || 'not_started'
                    const statusStyle = getStatusStyle(status)
                    const isExpanded = expandedMilestone === m.id

                    return (
                      <div
                        key={m.id}
                        style={{
                          ...styles.milestone,
                          borderLeft: `3px solid ${
                            status === 'complete'
                              ? track.color
                              : status === 'in_progress'
                              ? 'var(--color-amber)'
                              : 'rgba(255,255,255,0.1)'
                          }`,
                        }}
                      >
                        <div
                          style={styles.milestoneTop}
                          onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                        >
                          <div style={styles.milestoneMeta}>
                            <div style={styles.milestoneCategoryBadge}>
                              {m.category}
                            </div>
                            <div style={styles.milestoneTitle}>{m.title}</div>
                            <div style={styles.milestoneDesc}>{m.desc}</div>
                            <div style={{ ...styles.milestoneAmount, color: track.color }}>
                              {m.amount}
                            </div>
                          </div>
                          <div style={styles.milestoneActions}>
                            <button
                              style={{
                                ...styles.statusBtn,
                                background: statusStyle.bg,
                                color: statusStyle.color,
                              }}
                              onClick={(e) => { e.stopPropagation(); cycleStatus(m.id) }}
                            >
                              {statusStyle.label}
                            </button>
                            <div style={{ ...styles.expandToggle, color: track.color }}>
                              {isExpanded ? '▲' : '▼'}
                            </div>
                          </div>
                        </div>

                        {/* EXPANDED MILESTONE DETAIL */}
                        {isExpanded && (
                          <div style={styles.milestoneDetail}>
                            <div style={styles.milestoneDetailText}>
                              {m.detail}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* YEAR 5 OUTCOME */}
            <div style={{ ...styles.outcomeCard, borderColor: track.color + '44', background: track.color + '0D' }}>
              <div style={{ ...styles.outcomeLabel, color: track.color }}>Year 5 outcome</div>
              <div style={styles.outcomeText}>{track.year5Outcome}</div>
            </div>

          </div>

          {/* RIGHT — SIDEBAR */}
          <div style={styles.sidebarCol}>

            {/* PHILOSOPHY */}
            <div style={styles.sectionLabel}>Track philosophy</div>
            <Card style={{ marginBottom: '16px' }}>
              <p style={styles.infoText}>{track.philosophy}</p>
            </Card>

            {/* TRADEOFFS */}
            <div style={styles.sectionLabel}>Tradeoffs</div>
            <Card accent="var(--color-coral)" style={{ marginBottom: '16px' }}>
              <p style={styles.infoText}>{track.tradeoffs}</p>
            </Card>

            {/* WARNINGS */}
            <div style={styles.sectionLabel}>Warnings</div>
            <Card style={{ marginBottom: '16px' }}>
              {track.warnings.map((w, i) => (
                <div key={i} style={styles.warningItem}>
                  <div style={styles.warningDot}>⚠</div>
                  <div style={styles.warningText}>{w}</div>
                </div>
              ))}
            </Card>

            {/* PRIORITIES */}
            <div style={styles.sectionLabel}>This track prioritises</div>
            <Card style={{ marginBottom: '16px' }}>
              {track.priorities.map((p, i) => (
                <div key={i} style={styles.listItem}>
                  <div style={{ ...styles.listDot, background: track.color }} />
                  <span style={styles.listText}>{p}</span>
                </div>
              ))}
            </Card>

            {/* AVOIDS */}
            <div style={styles.sectionLabel}>This track avoids</div>
            <Card style={{ marginBottom: '16px' }}>
              {track.avoids.map((a, i) => (
                <div key={i} style={styles.listItem}>
                  <div style={{ ...styles.listDot, background: 'var(--color-red)' }} />
                  <span style={styles.listText}>{a}</span>
                </div>
              ))}
            </Card>

            {/* NUDGE EXAMPLES */}
            <div style={styles.sectionLabel}>Example nudges for this track</div>
            <div style={styles.nudgeBox}>
              {track.nudgeExamples.map((n, i) => (
                <div key={i} style={styles.nudgeItem}>
                  <div style={{ ...styles.nudgeDot, background: track.color }} />
                  <p style={styles.nudgeText}>{n}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => navigate('/simulation')}
              >
                Run Simulation Lab →
              </Button>
              <Button
                fullWidth
                variant="ghost"
                onClick={() => navigate('/glossary')}
              >
                SA Financial Glossary →
              </Button>
            </div>

          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────

function StrategyTracks() {
  const { trackId } = useParams()
  const {
    isLoggedIn,
    selectedTrack,
    selectTrack,
    trackProgress,
    updateMilestone,
  } = useUser()
  const navigate = useNavigate()

  if (!isLoggedIn) { navigate('/auth'); return null }

  if (!trackId) {
    return (
      <TracksOverview
        selectedTrack={selectedTrack}
        selectTrack={selectTrack}
        navigate={navigate}
      />
    )
  }

  return (
    <TrackDetail
      trackId={trackId}
      selectedTrack={selectedTrack}
      selectTrack={selectTrack}
      trackProgress={trackProgress}
      updateMilestone={updateMilestone}
      navigate={navigate}
    />
  )
}

// ─── STYLES ──────────────────────────────────────────────────────

const styles = {
  page: { background: 'var(--color-bg-base)', minHeight: '100vh' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-red)', marginBottom: '12px' },
  pageTitle: { fontSize: '34px', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '10px' },
  pageSub: { fontSize: '15px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: '36px', maxWidth: '520px' },
  sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', marginTop: '24px' },

  // Track grid
  trackGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' },
  trackCard: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' },
  trackCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  trackNum: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
  trackIcon: { fontSize: '22px', lineHeight: 1 },
  trackName: { fontSize: '17px', fontWeight: 800, color: '#fff', lineHeight: 1.2 },
  trackTagline: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55 },
  trackDivider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' },
  trackMeta: { display: 'flex', flexDirection: 'column', gap: '8px' },
  trackMetaRow: { display: 'flex', flexDirection: 'column', gap: '2px' },
  trackMetaLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.25)' },
  trackMetaVal: { fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.4 },
  warningPreview: { background: 'rgba(255,255,255,0.02)', border: '1px solid', borderRadius: 'var(--radius-md)', padding: '10px 12px' },
  warningPreviewLabel: { fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' },
  warningPreviewText: { fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 },
  trackCardFooter: { display: 'flex', gap: '8px', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' },

  // Compare table
  compareSection: { marginTop: '8px' },
  compareTable: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' },
  compareHeaderRow: { display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr' },
  compareColHead: { padding: '14px 16px', fontSize: '12px', fontWeight: 700, color: '#fff', display: 'flex', flexDirection: 'column', gap: '4px' },
  compareColIcon: { fontSize: '16px' },
  compareRow: { display: 'grid', gridTemplateColumns: '160px 1fr 1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.05)' },
  compareRowLabel: { padding: '11px 16px', fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.45)', background: 'rgba(255,255,255,0.02)' },
  compareCell: { padding: '11px 16px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' },

  // Educational note
  eduNote: { background: 'rgba(75,68,168,0.08)', border: '1px solid rgba(75,68,168,0.2)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', marginTop: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' },
  eduNoteIcon: { fontSize: '20px', lineHeight: 1, flexShrink: 0, marginTop: '2px' },
  eduNoteTitle: { fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '6px' },
  eduNoteBody: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 },

  // Detail — breadcrumb
  breadcrumb: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  breadcrumbLink: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' },
  breadcrumbSep: { color: 'rgba(255,255,255,0.2)' },
  breadcrumbCurrent: { fontSize: '13px', fontWeight: 500 },

  // Detail — hero
  trackHero: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' },
  trackHeroLeft: { display: 'flex', alignItems: 'flex-start', gap: '18px', flex: 1 },
  trackHeroIcon: { fontSize: '40px', lineHeight: 1, flexShrink: 0 },
  trackHeroNum: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' },
  trackHeroName: { fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' },
  trackHeroTagline: { fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, maxWidth: '420px', marginBottom: '16px' },
  trackHeroMeta: { display: 'flex', flexDirection: 'column', gap: '8px' },
  trackHeroMetaItem: { display: 'flex', flexDirection: 'column', gap: '2px' },
  trackHeroMetaLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.25)' },
  trackHeroMetaVal: { fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxWidth: '360px' },
  trackHeroRight: { minWidth: '180px' },
  activeTrackPill: { padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: 600, textAlign: 'center' },

  // Detail — main grid
  mainGrid: { display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'flex-start' },
  milestonesCol: {},
  sidebarCol: {},

  // Progress card
  progressCard: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '18px', marginBottom: '24px' },
  progressCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  progressStats: { fontSize: '13px', marginTop: '4px' },
  progressPct: { fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' },
  progressNote: { fontSize: '11px', color: 'rgba(255,255,255,0.25)', marginTop: '10px', lineHeight: 1.5 },

  // Timeline
  yearGroup: { marginBottom: '20px' },
  yearLabel: { fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px', paddingLeft: '16px' },
  yearMilestones: { display: 'flex', flexDirection: 'column', gap: '8px' },

  // Milestone
  milestone: { background: 'var(--color-bg-card)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', overflow: 'hidden' },
  milestoneTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', padding: '14px 16px', cursor: 'pointer' },
  milestoneMeta: { flex: 1 },
  milestoneCategoryBadge: { fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '5px' },
  milestoneTitle: { fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' },
  milestoneDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, marginBottom: '5px' },
  milestoneAmount: { fontSize: '12px', fontWeight: 600 },
  milestoneActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 },
  statusBtn: { border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 12px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-family)', whiteSpace: 'nowrap' },
  expandToggle: { fontSize: '10px', opacity: 0.6 },
  milestoneDetail: { padding: '0 16px 14px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', marginTop: '0' },
  milestoneDetailText: { fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 },

  // Year 5 outcome
  outcomeCard: { border: '1px solid', borderRadius: 'var(--radius-lg)', padding: '18px 20px', marginTop: '20px' },
  outcomeLabel: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' },
  outcomeText: { fontSize: '14px', color: '#fff', fontWeight: 600, lineHeight: 1.5 },

  // Sidebar
  infoText: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 },
  warningItem: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' },
  warningDot: { fontSize: '12px', color: 'var(--color-amber)', flexShrink: 0, marginTop: '1px' },
  warningText: { fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 },
  listItem: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' },
  listDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
  listText: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 },
  nudgeBox: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', padding: '14px' },
  nudgeItem: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '10px' },
  nudgeDot: { width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0, marginTop: '6px' },
  nudgeText: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, fontStyle: 'italic' },
}

export default StrategyTracks