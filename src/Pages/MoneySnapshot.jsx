import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'
import MoneyCard from '../Components/MoneyCard'
import Button from '../Components/Button'

const STEPS = ['Income', 'Fixed Costs', 'Debts', 'Goals']

function MoneySnapshot() {
  const { profile, updateProfile, calculateTakeHome, calculateNetWorth, calculateFixedCostLoad, snapshotComplete, setSnapshotComplete, isLoggedIn } = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [viewMode, setViewMode] = useState(snapshotComplete ? 'dashboard' : 'form')

  if (!isLoggedIn) { navigate('/'); return null }

  const fmt = (n) => `R${Math.abs(n).toLocaleString('en-ZA')}`

  const takeHome = calculateTakeHome()
  const netWorth = calculateNetWorth()
  const fixedLoad = calculateFixedCostLoad()
  const fixedCosts = profile.rent + profile.vehicleFinance + profile.otherFixed

  const handleFinish = () => {
    setSnapshotComplete(true)
    setViewMode('dashboard')
  }

  const fixedLoadColor = fixedLoad < 60 ? '#0D7A5F' : fixedLoad < 75 ? '#B8860B' : '#CC0000'
  const fixedLoadLabel = fixedLoad < 60 ? 'Healthy' : fixedLoad < 75 ? 'Caution' : 'Above ceiling'

  if (viewMode === 'form') {
    return (
      <div style={styles.page}>
        <div style={styles.formWrap}>
          <div style={styles.formHeader}>
            <div style={styles.eyebrow}>Money Snapshot</div>
            <h1 style={styles.formTitle}>Tell us about your finances</h1>
            <p style={styles.formSub}>
              This takes about 4–6 minutes. Your data stays on your device and is never shared.
            </p>
          </div>

          <div style={styles.stepRow}>
            {STEPS.map((s, i) => (
              <div key={s} style={styles.stepItem}>
                <div style={{
                  ...styles.stepDot,
                  background: i <= step ? '#CC0000' : 'rgba(255,255,255,0.1)',
                  color: i <= step ? '#fff' : 'rgba(255,255,255,0.3)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{
                  ...styles.stepLabel,
                  color: i === step ? '#fff' : 'rgba(255,255,255,0.35)',
                }}>{s}</div>
              </div>
            ))}
          </div>

          <div style={styles.formCard}>
            {step === 0 && (
              <div style={styles.fields}>
                <h2 style={styles.stepTitle}>Your income</h2>
                <p style={styles.stepDesc}>We use SARS 2024/25 tax brackets to calculate your actual take-home.</p>
                <Field label="Gross monthly salary (ZAR)" hint="Before any deductions">
                  <input style={styles.input} type="number" placeholder="e.g. 38000"
                    value={profile.grossSalary || ''}
                    onChange={e => updateProfile({ grossSalary: +e.target.value })} />
                </Field>
                <Field label="RA / pension contribution (ZAR per month)" hint="Pre-tax deduction — reduces your PAYE">
                  <input style={styles.input} type="number" placeholder="e.g. 1900"
                    value={profile.raContribution || ''}
                    onChange={e => updateProfile({ raContribution: +e.target.value })} />
                </Field>
                <Field label="Medical aid monthly contribution (ZAR)" hint="A SARS tax credit of R364/month is applied">
                  <input style={styles.input} type="number" placeholder="e.g. 1800"
                    value={profile.medicalAid || ''}
                    onChange={e => updateProfile({ medicalAid: +e.target.value })} />
                </Field>
                <InfoTile
                  title="What is PAYE?"
                  body="Pay As You Earn — the income tax your employer deducts monthly. Calculated on your annualised income using SARS marginal tax brackets (18% up to 45%). A primary rebate of R17,235 per year reduces what you owe."
                />
              </div>
            )}

            {step === 1 && (
              <div style={styles.fields}>
                <h2 style={styles.stepTitle}>Your fixed monthly costs</h2>
                <p style={styles.stepDesc}>These are costs you're committed to every month regardless of what else happens.</p>
                <Field label="Monthly rent (ZAR)" hint="If you own property, enter your bond repayment">
                  <input style={styles.input} type="number" placeholder="e.g. 9200"
                    value={profile.rent || ''}
                    onChange={e => updateProfile({ rent: +e.target.value })} />
                </Field>
                <Field label="Vehicle finance repayment (ZAR)" hint="Benchmark: should not exceed 15% of take-home">
                  <input style={styles.input} type="number" placeholder="e.g. 4800"
                    value={profile.vehicleFinance || ''}
                    onChange={e => updateProfile({ vehicleFinance: +e.target.value })} />
                </Field>
                <Field label="Other fixed costs — subscriptions, insurance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 2000"
                    value={profile.otherFixed || ''}
                    onChange={e => updateProfile({ otherFixed: +e.target.value })} />
                </Field>
                <InfoTile
                  title="What is a fixed cost load?"
                  body="Your fixed cost load is the percentage of your take-home salary committed to fixed obligations — rent, vehicle finance, insurance — before food, lifestyle, or saving. Below 60% is healthy. Above 75% is a warning sign that leaves you with very little room to build wealth."
                />
              </div>
            )}

            {step === 2 && (
              <div style={styles.fields}>
                <h2 style={styles.stepTitle}>Your debts</h2>
                <p style={styles.stepDesc}>Enter outstanding balances. This feeds your net worth calculation — the most important number in the product.</p>
                <Field label="Student loan outstanding balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 95000"
                    value={profile.studentDebt || ''}
                    onChange={e => updateProfile({ studentDebt: +e.target.value })} />
                </Field>
                <Field label="Vehicle finance outstanding balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 280000"
                    value={profile.vehicleDebt || ''}
                    onChange={e => updateProfile({ vehicleDebt: +e.target.value })} />
                </Field>
                <Field label="Credit card / personal loan balance (ZAR)" hint="Carrying a revolving balance at 20% p/a is expensive">
                  <input style={styles.input} type="number" placeholder="e.g. 12000"
                    value={profile.creditCardDebt || ''}
                    onChange={e => updateProfile({ creditCardDebt: +e.target.value })} />
                </Field>
                <Field label="TFSA balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 28000"
                    value={profile.tfsaBalance || ''}
                    onChange={e => updateProfile({ tfsaBalance: +e.target.value })} />
                </Field>
                <Field label="RA / pension balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 15000"
                    value={profile.raBalance || ''}
                    onChange={e => updateProfile({ raBalance: +e.target.value })} />
                </Field>
                <InfoTile
                  title="What is net worth?"
                  body="Net worth = everything you own (savings, investments, property equity) minus everything you owe (all outstanding debt). Many young professionals discover their net worth is negative when they first calculate it honestly. That is not a failure — it is the starting point."
                />
              </div>
            )}

            {step === 3 && (
              <div style={styles.fields}>
                <h2 style={styles.stepTitle}>Your goals</h2>
                <p style={styles.stepDesc}>Set your targets. The Snapshot will tell you if your current savings rate gets you there in time.</p>
                <Field label="Property deposit target (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 350000"
                    value={profile.depositGoal || ''}
                    onChange={e => updateProfile({ depositGoal: +e.target.value })} />
                </Field>
                <Field label="Timeline to deposit goal (years)">
                  <input style={styles.input} type="number" placeholder="e.g. 3"
                    value={profile.depositTimelineYears || ''}
                    onChange={e => updateProfile({ depositTimelineYears: +e.target.value })} />
                </Field>
                <Field label="Emergency fund target (ZAR)" hint="Recommended: 3–6 months of your fixed costs">
                  <input style={styles.input} type="number" placeholder="e.g. 82200"
                    value={profile.emergencyFundGoal || ''}
                    onChange={e => updateProfile({ emergencyFundGoal: +e.target.value })} />
                </Field>
                <InfoTile
                  title="Why an emergency fund first?"
                  body="An emergency fund (3–6 months of essential expenses) is the financial foundation everything else is built on. Without it, any unexpected cost — a medical bill, a car repair, retrenchment — goes straight onto credit card debt at 20% p/a. It is not optional. Build it before investing."
                />
              </div>
            )}

            <div style={styles.formNav}>
              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} style={{ marginLeft: 'auto' }}>
                  Continue →
                </Button>
              ) : (
                <Button onClick={handleFinish} style={{ marginLeft: 'auto' }}>
                  View my Snapshot →
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const depositSaved = profile.savingsBalance || 0
  const depositPct = profile.depositGoal ? Math.min(100, Math.round((depositSaved / profile.depositGoal) * 100)) : 0
  const emergencyPct = profile.emergencyFundGoal ? Math.min(100, Math.round((depositSaved * 0.3 / profile.emergencyFundGoal) * 100)) : 0
  const monthlyNeeded = profile.depositGoal && profile.depositTimelineYears
    ? Math.round((profile.depositGoal - depositSaved) / (profile.depositTimelineYears * 12))
    : 0

  const vehiclePct = takeHome ? Math.round((profile.vehicleFinance / takeHome) * 100) : 0
  const isVehicleHigh = vehiclePct > 15

  const nudges = []
  if (fixedLoad > 75) nudges.push({ type: 'Alert', color: '#CC0000', bg: 'rgba(204,0,0,0.1)', text: `Your fixed costs are at ${fixedLoad}% of take-home — significantly above the 60% recommended ceiling. Your ability to save or invest is severely constrained.` })
  else if (fixedLoad > 60) nudges.push({ type: 'Warning', color: '#B8860B', bg: 'rgba(184,134,11,0.1)', text: `Your fixed costs are at ${fixedLoad}% of take-home — above the 60% recommended ceiling. Keep an eye on lifestyle creep.` })
  if (isVehicleHigh) nudges.push({ type: 'Warning', color: '#B8860B', bg: 'rgba(184,134,11,0.1)', text: `Your vehicle finance is ${vehiclePct}% of take-home — above the 15% benchmark. This may reduce your qualifying bond amount.` })
  if (!profile.tfsaBalance && !profile.raBalance) nudges.push({ type: 'Prompt', color: '#4B44A8', bg: 'rgba(75,68,168,0.1)', text: `You haven't started a TFSA or RA yet. Every month of delay in your mid-twenties has a compounding cost that is hard to recover later.` })

  return (
    <div style={styles.page}>
      <div style={styles.dashWrap}>
        <div style={styles.dashHero}>
          <div>
            <div style={styles.greeting}>Good morning, {profile.name} — your financial snapshot</div>
            <div style={styles.takeHomeLabel}>YOUR TAKE-HOME THIS MONTH</div>
            <div style={styles.takeHomeAmount} className="zar">{fmt(takeHome)}</div>
            <div style={styles.contextSentence}>
              {fixedLoad > 0
                ? `Your fixed costs consume ${fixedLoad}% of that — ${fixedLoad > 60 ? 'above' : 'within'} the 60% recommended ceiling.`
                : 'Complete your income details to see your full picture.'}
              {netWorth < 0 && ` Your net worth is currently negative at ${fmt(netWorth)}.`}
            </div>
          </div>
          <div style={styles.trackBadge}>
            <div style={styles.trackBadgeLabel}>Active track</div>
            <div style={styles.trackBadgeName}>The Property Path</div>
            <div style={styles.trackBadgeSub}>Year 1 of 5</div>
          </div>
        </div>

        <div style={styles.tilesRow3}>
          <MoneyCard label="Income breakdown" accent="#4B44A8">
            <div style={styles.waterfall}>
              {[
                { label: 'Gross salary', value: profile.grossSalary, color: '#1A2744', width: 100 },
                { label: 'PAYE tax', value: -(profile.grossSalary - takeHome - profile.raContribution - profile.medicalAid - Math.min(profile.grossSalary * 0.01, 177.12)), color: '#CC0000', width: Math.round(((profile.grossSalary - takeHome) / profile.grossSalary) * 100) || 30 },
                { label: 'UIF', value: -Math.min(profile.grossSalary * 0.01, 177.12), color: '#C4472A', width: 5 },
                { label: 'RA contribution', value: -profile.raContribution, color: '#B8860B', width: Math.round((profile.raContribution / profile.grossSalary) * 100) || 8 },
                { label: 'Medical aid', value: -profile.medicalAid, color: '#888', width: Math.round((profile.medicalAid / profile.grossSalary) * 100) || 6 },
                { label: 'Take-home', value: takeHome, color: '#0D7A5F', width: Math.round((takeHome / profile.grossSalary) * 100) || 72 },
              ].map(row => (
                <div key={row.label} style={styles.wfRow}>
                  <div style={styles.wfLabel}>{row.label}</div>
                  <div style={styles.wfBarWrap}>
                    <div style={{ ...styles.wfBar, width: `${Math.min(100, Math.abs(row.width))}%`, background: row.color }} />
                  </div>
                  <div style={{ ...styles.wfVal, color: row.color === '#0D7A5F' ? '#1D9E75' : row.label === 'Gross salary' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                    {row.value < 0 ? `–${fmt(Math.abs(row.value))}` : fmt(row.value || 0)}
                  </div>
                </div>
              ))}
            </div>
          </MoneyCard>

          <MoneyCard label="Fixed cost load" accent={fixedLoadColor}>
            <div style={styles.donutWrap}>
              <div style={styles.donutContainer}>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke={fixedLoadColor}
                    strokeWidth="10"
                    strokeDasharray={`${(fixedLoad / 100) * 201} 201`}
                    strokeDashoffset="50"
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                  <text x="40" y="45" textAnchor="middle" fill={fixedLoadColor} fontSize="14" fontWeight="800" fontFamily="Inter">{fixedLoad}%</text>
                </svg>
              </div>
              <div style={styles.donutLegend}>
                <div style={styles.donutRow}>
                  <div style={{ ...styles.dot, background: fixedLoadColor }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Fixed costs {fixedLoad}%</span>
                </div>
                <div style={styles.donutRow}>
                  <div style={{ ...styles.dot, background: '#0D7A5F' }} />
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Discretionary {100 - fixedLoad}%</span>
                </div>
                <div style={{ ...styles.loadStatus, color: fixedLoadColor, marginTop: '8px' }}>
                  {fixedLoadLabel}
                </div>
              </div>
            </div>
          </MoneyCard>

          <MoneyCard
            label="Net worth"
            value={netWorth}
            negative={netWorth < 0}
            accent={netWorth >= 0 ? '#0D7A5F' : '#CC0000'}
            sub={`Assets ${fmt(profile.tfsaBalance + profile.raBalance)} · Liabilities ${fmt(profile.studentDebt + profile.creditCardDebt + profile.vehicleDebt)}`}
          >
            <div style={{
              display: 'inline-block',
              marginTop: '8px',
              background: netWorth >= 0 ? 'rgba(13,122,95,0.15)' : 'rgba(204,0,0,0.15)',
              color: netWorth >= 0 ? '#0D7A5F' : '#CC0000',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: '999px',
            }}>
              {netWorth >= 0 ? 'Positive' : 'Negative'}
            </div>
          </MoneyCard>
        </div>

        <div style={styles.tilesRow2}>
          <div style={{ ...styles.card, flex: 3 }}>
            <div style={styles.cardLabel}>Debt exposure</div>
            <div style={styles.debtList}>
              {[
                { name: 'Vehicle finance', balance: profile.vehicleDebt, monthly: profile.vehicleFinance, color: '#CC0000' },
                { name: 'Student loan', balance: profile.studentDebt, monthly: profile.otherFixed * 0.4, color: '#CC0000' },
                { name: 'Credit card / personal loan', balance: profile.creditCardDebt, monthly: 0, color: '#C4472A' },
              ].filter(d => d.balance > 0).map(debt => (
                <div key={debt.name} style={styles.debtItem}>
                  <div style={styles.debtHeader}>
                    <span style={styles.debtName}>{debt.name}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={styles.debtBalance}>{fmt(debt.balance)}</div>
                      {debt.monthly > 0 && <div style={styles.debtMonthly}>{fmt(debt.monthly)}/mo</div>}
                    </div>
                  </div>
                  <div style={styles.debtBarWrap}>
                    <div style={{ ...styles.debtBar, width: `${Math.min(100, (debt.balance / 400000) * 100)}%`, background: debt.color }} />
                  </div>
                </div>
              ))}
              {(profile.studentDebt + profile.creditCardDebt + profile.vehicleDebt) === 0 && (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No debts entered yet.</div>
              )}
              <div style={styles.debtTotal}>
                Total outstanding: <strong style={{ color: '#fff' }}>
                  {fmt(profile.studentDebt + profile.creditCardDebt + profile.vehicleDebt)}
                </strong>
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, flex: 2 }}>
            <div style={styles.cardLabel}>Goal progress</div>
            <div style={styles.goalList}>
              <GoalBar
                label="Property deposit"
                pct={depositPct}
                color="#4B44A8"
                note={`${fmt(depositSaved)} of ${fmt(profile.depositGoal)} · Need ${fmt(monthlyNeeded)}/mo`}
              />
              <GoalBar
                label="Emergency fund"
                pct={emergencyPct}
                color="#0D7A5F"
                note={`${fmt(profile.emergencyFundGoal * (emergencyPct / 100))} of ${fmt(profile.emergencyFundGoal)}`}
              />
              <GoalBar
                label="TFSA (Year 1 target)"
                pct={Math.min(100, Math.round((profile.tfsaBalance / 36000) * 100))}
                color="#B8860B"
                note={`${fmt(profile.tfsaBalance)} of R36,000`}
              />
            </div>
          </div>
        </div>

        {nudges.length > 0 && (
          <div style={styles.nudgeZone}>
            {nudges.slice(0, 2).map((n, i) => (
              <div key={i} style={{ ...styles.nudgeCard, borderLeft: `3px solid ${n.color}`, background: n.bg }}>
                <div style={{ ...styles.nudgeType, color: n.color }}>{n.type}</div>
                <div style={styles.nudgeText}>{n.text}</div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.eduTile}>
          <div>
            <div style={styles.eduLabel}>Learn</div>
            <div style={styles.eduTitle}>What is your take-home pay, and why is it lower than your salary?</div>
          </div>
          <div style={{ fontSize: '18px', color: '#4B44A8' }}>→</div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <Button variant="ghost" size="sm" onClick={() => setViewMode('form')}>
            Edit my inputs
          </Button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{label}</label>
      {hint && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>{hint}</div>}
      {children}
    </div>
  )
}

function InfoTile({ title, body }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'rgba(75,68,168,0.1)', border: '1px solid rgba(75,68,168,0.25)', borderRadius: '10px', padding: '14px 16px', marginTop: '8px' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#4B44A8' }}>Learn: {title}</div>
        <div style={{ color: '#4B44A8', fontSize: '16px' }}>{open ? '−' : '+'}</div>
      </div>
      {open && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginTop: '10px' }}>{body}</div>}
    </div>
  )
}

function GoalBar({ label, pct, color, note }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#fff' }}>{label}</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{pct}%</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.08)', height: '6px', borderRadius: '3px', marginBottom: '4px' }}>
        <div style={{ width: `${pct}%`, background: color, height: '6px', borderRadius: '3px', transition: 'width 0.6s ease' }} />
      </div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{note}</div>
    </div>
  )
}

const styles = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#0F0F1A', padding: '32px 24px' },
  formWrap: { maxWidth: '680px', margin: '0 auto' },
  formHeader: { marginBottom: '32px' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '10px' },
  formTitle: { fontSize: '28px', fontWeight: 800, color: '#fff', marginBottom: '10px', letterSpacing: '-0.02em' },
  formSub: { fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  stepRow: { display: 'flex', gap: '8px', marginBottom: '28px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1 },
  stepDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 },
  stepLabel: { fontSize: '12px', fontWeight: 500 },
  formCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px' },
  fields: { display: 'flex', flexDirection: 'column', gap: '20px' },
  stepTitle: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '6px' },
  stepDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: '4px' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '11px 14px', fontSize: '14px', color: '#fff', width: '100%', fontFamily: 'var(--font-family)' },
  formNav: { display: 'flex', marginTop: '28px', gap: '12px' },
  dashWrap: { maxWidth: '1200px', margin: '0 auto' },
  dashHero: { background: '#1A1A2E', borderRadius: '14px', padding: '28px 32px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' },
  takeHomeLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' },
  takeHomeAmount: { fontSize: '38px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '8px' },
  contextSentence: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', maxWidth: '420px', lineHeight: 1.55 },
  trackBadge: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 18px', textAlign: 'right' },
  trackBadgeLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' },
  trackBadgeName: { fontSize: '14px', fontWeight: 700, color: '#0D7A5F', marginBottom: '3px' },
  trackBadgeSub: { fontSize: '11px', color: 'rgba(255,255,255,0.25)' },
  tilesRow3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '14px' },
  tilesRow2: { display: 'flex', gap: '14px', marginBottom: '14px' },
  card: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px' },
  cardLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' },
  waterfall: { display: 'flex', flexDirection: 'column', gap: '6px' },
  wfRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  wfLabel: { fontSize: '10px', color: 'rgba(255,255,255,0.45)', minWidth: '90px' },
  wfBarWrap: { flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '3px', height: '5px' },
  wfBar: { height: '5px', borderRadius: '3px', transition: 'width 0.4s ease' },
  wfVal: { fontSize: '10px', fontWeight: 600, minWidth: '70px', textAlign: 'right' },
  donutWrap: { display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' },
  donutContainer: {},
  donutLegend: {},
  donutRow: { display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0 },
  loadStatus: { fontSize: '11px', fontWeight: 700 },
  debtList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  debtItem: {},
  debtHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' },
  debtName: { fontSize: '13px', color: 'rgba(255,255,255,0.7)' },
  debtBalance: { fontSize: '14px', fontWeight: 700, color: '#fff' },
  debtMonthly: { fontSize: '10px', color: 'rgba(255,255,255,0.3)' },
  debtBarWrap: { background: 'rgba(255,255,255,0.06)', height: '4px', borderRadius: '2px' },
  debtBar: { height: '4px', borderRadius: '2px' },
  debtTotal: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  goalList: {},
  nudgeZone: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' },
  nudgeCard: { borderRadius: '0 10px 10px 0', padding: '12px 16px', display: 'flex', gap: '14px', alignItems: 'flex-start' },
  nudgeType: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', flexShrink: 0, marginTop: '2px' },
  nudgeText: { fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 },
  eduTile: { background: 'rgba(75,68,168,0.1)', border: '1px solid rgba(75,68,168,0.2)', borderRadius: '10px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  eduLabel: { fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#4B44A8', marginBottom: '4px' },
  eduTitle: { fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' },
}
// this works but could probably be cleaner - revisit

export default MoneySnapshot