import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import PageWrapper from '../components/layout/PageWrapper'
import Card, { CardLabel, CardValue, CardSub } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import DonutChart from '../components/charts/DonutChart'
import WaterfallChart from '../components/charts/WaterfallChart'
import ProgressBar from '../components/ui/ProgressBar'
import { formatZAR, formatPercent } from '../utils/formatters'
import TRACKS from '../data/tracks'

const STEPS = ['Income', 'Fixed Costs', 'Debts & Assets', 'Goals']

function MoneySnapshot() {
  const {
    profile,
    updateProfile,
    calculateTakeHome,
    calculateNetWorth,
    calculateFixedCostLoad,
    calculateDebtToIncome,
    calculateSavingsRate,
    calculateDisposableIncome,
    snapshotComplete,
    setSnapshotComplete,
    isLoggedIn,
    selectedTrack,
  } = useUser()

  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [viewMode, setViewMode] = useState(snapshotComplete ? 'dashboard' : 'form')

  if (!isLoggedIn) { navigate('/auth'); return null }

  const takeHome = calculateTakeHome()
  const netWorth = calculateNetWorth()
  const fixedLoad = calculateFixedCostLoad()
  const dti = calculateDebtToIncome()
  const savingsRate = calculateSavingsRate()
  const disposable = calculateDisposableIncome()

  const track = selectedTrack ? TRACKS[selectedTrack] : null

  const handleFinish = () => {
    setSnapshotComplete(true)
    setViewMode('dashboard')
  }

  const fixedLoadColor = fixedLoad < 60
    ? 'var(--color-teal)'
    : fixedLoad < 75
    ? 'var(--color-amber)'
    : 'var(--color-red)'

  const fixedLoadLabel = fixedLoad < 60
    ? 'Healthy'
    : fixedLoad < 75
    ? 'Above ceiling'
    : 'Danger zone'

  // ─── FORM VIEW ───────────────────────────────────────────────
  if (viewMode === 'form') {
    return (
      <div style={styles.page}>
        <PageWrapper style={{ maxWidth: '700px' }}>
          <div style={styles.formHeader}>
            <div style={styles.eyebrow}>Money Snapshot</div>
            <h1 style={styles.formTitle}>Tell us about your finances</h1>
            <p style={styles.formSub}>
              This takes about 4–6 minutes. Your data stays on your device — nothing is shared or transmitted.
            </p>
          </div>

          {/* STEP PROGRESS */}
          <div style={styles.stepRow}>
            {STEPS.map((s, i) => (
              <div key={s} style={styles.stepItem}>
                <div style={{
                  ...styles.stepDot,
                  background: i < step ? 'var(--color-teal)' : i === step ? 'var(--color-red)' : 'rgba(255,255,255,0.08)',
                  color: i <= step ? '#fff' : 'rgba(255,255,255,0.3)',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{
                  ...styles.stepLabel,
                  color: i === step ? '#fff' : 'rgba(255,255,255,0.3)',
                }}>{s}</div>
              </div>
            ))}
          </div>

          <div style={styles.formCard}>

            {/* STEP 0 — INCOME */}
            {step === 0 && (
              <div style={styles.fields}>
                <div style={styles.stepTitle}>Your income</div>
                <div style={styles.stepDesc}>
                  We use SARS 2024/25 tax brackets to calculate your actual take-home pay.
                </div>

                <Field label="Gross monthly salary (ZAR)" hint="Before any deductions">
                  <input style={styles.input} type="number" placeholder="e.g. 38000"
                    value={profile.grossSalary || ''}
                    onChange={e => updateProfile({ grossSalary: +e.target.value })} />
                </Field>

                <Field label="RA / pension contribution per month (ZAR)" hint="Pre-tax deduction — reduces your PAYE immediately">
                  <input style={styles.input} type="number" placeholder="e.g. 1900"
                    value={profile.raContribution || ''}
                    onChange={e => updateProfile({ raContribution: +e.target.value })} />
                </Field>

                <Field label="Medical aid monthly contribution (ZAR)" hint="SARS tax credit of R364/month per main member is applied">
                  <input style={styles.input} type="number" placeholder="e.g. 1800"
                    value={profile.medicalAid || ''}
                    onChange={e => updateProfile({ medicalAid: +e.target.value })} />
                </Field>

                <Field label="Medical aid dependants" hint="Each adds R246/month in tax credits">
                  <input style={styles.input} type="number" placeholder="e.g. 0"
                    value={profile.medicalDependants || ''}
                    onChange={e => updateProfile({ medicalDependants: +e.target.value })} />
                </Field>

                <InfoTile title="How is your take-home calculated?">
                  PAYE is calculated on your annualised gross income using SARS 2024/25 marginal brackets (18% to 45%).
                  Your RA contribution reduces taxable income before PAYE is applied — this is the pre-tax benefit.
                  A primary rebate of R17,235 per year, plus medical aid tax credits, reduce what you owe.
                  UIF is 1% of gross, capped at R177.12 per month.
                </InfoTile>
              </div>
            )}

            {/* STEP 1 — FIXED COSTS */}
            {step === 1 && (
              <div style={styles.fields}>
                <div style={styles.stepTitle}>Your fixed monthly costs</div>
                <div style={styles.stepDesc}>
                  Costs you are committed to every month regardless of what else happens.
                  These determine your fixed cost load — one of the most important numbers in the product.
                </div>

                <div style={styles.categoryLabel}>🏠 Housing</div>
                <Field label="Monthly rent or bond repayment (ZAR)" hint="If you own, enter your bond repayment">
                  <input style={styles.input} type="number" placeholder="e.g. 9200"
                    value={profile.rent || ''}
                    onChange={e => updateProfile({ rent: +e.target.value })} />
                </Field>

                <div style={styles.categoryLabel}>🚗 Mobility</div>
                <Field label="Vehicle finance monthly repayment (ZAR)" hint="Benchmark: should not exceed 15% of take-home">
                  <input style={styles.input} type="number" placeholder="e.g. 4800"
                    value={profile.vehicleFinance || ''}
                    onChange={e => updateProfile({ vehicleFinance: +e.target.value })} />
                </Field>

                <div style={styles.categoryLabel}>🛡️ Protection</div>
                <Field label="Insurance — vehicle, life, income protection (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 2200"
                    value={profile.insurance || ''}
                    onChange={e => updateProfile({ insurance: +e.target.value })} />
                </Field>

                <div style={styles.categoryLabel}>📱 Lifestyle</div>
                <Field label="Subscriptions — streaming, gym, data (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 1200"
                    value={profile.subscriptions || ''}
                    onChange={e => updateProfile({ subscriptions: +e.target.value })} />
                </Field>

                <Field label="Monthly groceries and household basics (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 3500"
                    value={profile.groceries || ''}
                    onChange={e => updateProfile({ groceries: +e.target.value })} />
                </Field>

                <Field label="Other fixed commitments (ZAR)" hint="Anything that recurs monthly not listed above">
                  <input style={styles.input} type="number" placeholder="e.g. 800"
                    value={profile.otherFixed || ''}
                    onChange={e => updateProfile({ otherFixed: +e.target.value })} />
                </Field>

                {takeHome > 0 && (
                  <div style={styles.liveFeedback}>
                    <div style={styles.liveFeedbackLabel}>Live fixed cost load</div>
                    <div style={{ ...styles.liveFeedbackVal, color: fixedLoadColor }}>
                      {fixedLoad}% of take-home — {fixedLoadLabel}
                    </div>
                    <ProgressBar value={fixedLoad} max={100} color={fixedLoadColor} height={5} />
                  </div>
                )}

                <InfoTile title="What is a fixed cost load?">
                  Your fixed cost load is the percentage of your take-home pay committed to non-negotiable monthly obligations
                  before food, lifestyle, or saving. Below 60% is healthy. Above 75% is a warning zone — you have
                  almost no room to build wealth. High fixed cost loads are usually caused by vehicle finance or
                  rent taking up too large a share of income.
                </InfoTile>
              </div>
            )}

            {/* STEP 2 — DEBTS & ASSETS */}
            {step === 2 && (
              <div style={styles.fields}>
                <div style={styles.stepTitle}>Your debts and assets</div>
                <div style={styles.stepDesc}>
                  Enter outstanding balances honestly. This feeds your net worth calculation — the most
                  important single number in the product. Many young professionals discover a negative
                  net worth here for the first time. That is not a failure — it is the starting point.
                </div>

                <div style={styles.categoryLabel}>📉 Liabilities</div>
                <Field label="Vehicle finance outstanding balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 280000"
                    value={profile.vehicleDebt || ''}
                    onChange={e => updateProfile({ vehicleDebt: +e.target.value })} />
                </Field>

                <Field label="Student loan outstanding balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 95000"
                    value={profile.studentDebt || ''}
                    onChange={e => updateProfile({ studentDebt: +e.target.value })} />
                </Field>

                <Field label="Credit card balance (ZAR)" hint="Revolving balance at ~20% p/a is the most expensive debt">
                  <input style={styles.input} type="number" placeholder="e.g. 12000"
                    value={profile.creditCardDebt || ''}
                    onChange={e => updateProfile({ creditCardDebt: +e.target.value })} />
                </Field>

                <Field label="Personal loan outstanding balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 0"
                    value={profile.personalLoanDebt || ''}
                    onChange={e => updateProfile({ personalLoanDebt: +e.target.value })} />
                </Field>

                <div style={styles.categoryLabel}>📈 Assets</div>
                <Field label="TFSA balance (ZAR)" hint="Tax-free savings account — all growth is exempt">
                  <input style={styles.input} type="number" placeholder="e.g. 28000"
                    value={profile.tfsaBalance || ''}
                    onChange={e => updateProfile({ tfsaBalance: +e.target.value })} />
                </Field>

                <Field label="RA / pension fund balance (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 15000"
                    value={profile.raBalance || ''}
                    onChange={e => updateProfile({ raBalance: +e.target.value })} />
                </Field>

                <Field label="Cash savings balance (ZAR)" hint="Emergency fund, money market, notice accounts">
                  <input style={styles.input} type="number" placeholder="e.g. 70000"
                    value={profile.savingsBalance || ''}
                    onChange={e => updateProfile({ savingsBalance: +e.target.value })} />
                </Field>

                <Field label="Offshore / other investments (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 0"
                    value={profile.offshoreBalance || ''}
                    onChange={e => updateProfile({ offshoreBalance: +e.target.value })} />
                </Field>

                {profile.grossSalary > 0 && (
                  <div style={styles.liveFeedback}>
                    <div style={styles.liveFeedbackLabel}>Live net worth</div>
                    <div style={{
                      ...styles.liveFeedbackVal,
                      color: netWorth >= 0 ? 'var(--color-teal)' : 'var(--color-red)',
                    }}>
                      {formatZAR(netWorth)} — {netWorth >= 0 ? 'Positive' : 'Negative'}
                    </div>
                  </div>
                )}

                <InfoTile title="What is net worth?">
                  Net worth is everything you own minus everything you owe. Assets include savings, investments,
                  and property equity. Liabilities include all outstanding debt balances — not monthly payments,
                  but the full outstanding amount. A negative net worth in your mid-twenties is common and
                  recoverable. The goal is to know the honest number and move it in the right direction.
                </InfoTile>
              </div>
            )}

            {/* STEP 3 — GOALS */}
            {step === 3 && (
              <div style={styles.fields}>
                <div style={styles.stepTitle}>Your financial goals</div>
                <div style={styles.stepDesc}>
                  Set your targets. The Snapshot will show you if your current savings rate
                  gets you there in time — and how far you are from each goal today.
                </div>

                <Field label="Monthly deposit saving (ZAR)" hint="Amount you are actively setting aside for a property deposit each month">
                  <input style={styles.input} type="number" placeholder="e.g. 5000"
                    value={profile.monthlyDepositSaving || ''}
                    onChange={e => updateProfile({ monthlyDepositSaving: +e.target.value })} />
                </Field>

                <Field label="Property deposit target (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 350000"
                    value={profile.depositGoal || ''}
                    onChange={e => updateProfile({ depositGoal: +e.target.value })} />
                </Field>

                <Field label="Target timeline to deposit goal (years)">
                  <input style={styles.input} type="number" placeholder="e.g. 3"
                    value={profile.depositTimelineYears || ''}
                    onChange={e => updateProfile({ depositTimelineYears: +e.target.value })} />
                </Field>

                <Field label="Emergency fund target (ZAR)" hint="Recommended: 3–6 months of your fixed monthly costs">
                  <input style={styles.input} type="number" placeholder="e.g. 82200"
                    value={profile.emergencyFundGoal || ''}
                    onChange={e => updateProfile({ emergencyFundGoal: +e.target.value })} />
                </Field>

                <Field label="Emergency fund currently saved (ZAR)">
                  <input style={styles.input} type="number" placeholder="e.g. 20000"
                    value={profile.emergencyFundSaved || ''}
                    onChange={e => updateProfile({ emergencyFundSaved: +e.target.value })} />
                </Field>

                <InfoTile title="Why the emergency fund comes first">
                  An emergency fund covering 3–6 months of essential expenses is the financial foundation
                  everything else is built on. Without it, any unexpected event — a car repair, medical bill,
                  or retrenchment — goes straight onto credit card debt at 20% p/a interest. Build this
                  before investing aggressively in anything else.
                </InfoTile>
              </div>
            )}

            {/* FORM NAVIGATION */}
            <div style={styles.formNav}>
              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep(step - 1)}>
                  ← Back
                </Button>
              )}
              <div style={{ marginLeft: 'auto' }}>
                {step < STEPS.length - 1 ? (
                  <Button onClick={() => setStep(step + 1)}>
                    Continue →
                  </Button>
                ) : (
                  <Button onClick={handleFinish}>
                    View my Snapshot →
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PageWrapper>
      </div>
    )
  }

  // ─── DASHBOARD VIEW ──────────────────────────────────────────
  const totalDebts =
    (profile.studentDebt || 0) +
    (profile.creditCardDebt || 0) +
    (profile.vehicleDebt || 0) +
    (profile.personalLoanDebt || 0)

  const totalAssets =
    (profile.tfsaBalance || 0) +
    (profile.raBalance || 0) +
    (profile.savingsBalance || 0) +
    (profile.offshoreBalance || 0)

  const depositSaved = profile.savingsBalance || 0
  const depositPct = profile.depositGoal
    ? Math.min(100, Math.round((depositSaved / profile.depositGoal) * 100))
    : 0
  const emergencyPct = profile.emergencyFundGoal
    ? Math.min(100, Math.round(((profile.emergencyFundSaved || 0) / profile.emergencyFundGoal) * 100))
    : 0
  const tfsaPct = Math.min(100, Math.round(((profile.tfsaBalance || 0) / 36000) * 100))

  const monthlyNeeded = profile.depositGoal && profile.depositTimelineYears
    ? Math.round((profile.depositGoal - depositSaved) / (profile.depositTimelineYears * 12))
    : 0

  const vehiclePct = takeHome > 0
    ? Math.round((profile.vehicleFinance / takeHome) * 100)
    : 0

  // Waterfall items for income breakdown
  const uif = Math.min((profile.grossSalary || 0) * 0.01, 177.12)
  const paye = Math.max(0,
    (profile.grossSalary || 0) - takeHome - uif - (profile.raContribution || 0) - (profile.medicalAid || 0)
  )
  const waterfallItems = [
    { label: 'Gross salary', value: profile.grossSalary, color: 'var(--color-purple)', formatted: formatZAR(profile.grossSalary) },
    { label: 'RA contribution', value: profile.raContribution, color: 'var(--color-teal)', formatted: `− ${formatZAR(profile.raContribution)}` },
    { label: 'PAYE tax', value: paye, color: 'var(--color-red)', formatted: `− ${formatZAR(paye)}` },
    { label: 'UIF', value: uif, color: 'var(--color-amber)', formatted: `− ${formatZAR(uif)}` },
    { label: 'Medical aid', value: profile.medicalAid, color: 'var(--color-amber)', formatted: `− ${formatZAR(profile.medicalAid)}` },
    { label: 'Take-home', value: takeHome, color: 'var(--color-teal)', formatted: formatZAR(takeHome), highlight: true },
  ]

  // Fixed cost category breakdown
  const fixedCategories = [
    { label: 'Housing', value: profile.rent || 0, color: 'var(--color-purple)', icon: '🏠' },
    { label: 'Mobility', value: profile.vehicleFinance || 0, color: 'var(--color-red)', icon: '🚗' },
    { label: 'Insurance', value: profile.insurance || 0, color: 'var(--color-teal)', icon: '🛡️' },
    { label: 'Subscriptions', value: profile.subscriptions || 0, color: 'var(--color-amber)', icon: '📱' },
    { label: 'Groceries', value: profile.groceries || 0, color: 'var(--color-coral)', icon: '🛒' },
    { label: 'Other fixed', value: profile.otherFixed || 0, color: 'rgba(255,255,255,0.3)', icon: '📦' },
  ].filter(c => c.value > 0)

  const totalFixed = fixedCategories.reduce((sum, c) => sum + c.value, 0)

  // Narrative generation
  const getNarrative = () => {
    if (!profile.grossSalary) return null
    const lines = []
    if (fixedLoad > 75) {
      lines.push(`Your fixed costs are consuming ${fixedLoad}% of take-home — well above the 75% danger zone. Your ability to save or invest is severely constrained.`)
    } else if (fixedLoad > 60) {
      lines.push(`Your fixed costs are at ${fixedLoad}% of take-home — above the 60% ceiling. Lifestyle creep is likely limiting your savings rate.`)
    } else {
      lines.push(`Your fixed costs are at ${fixedLoad}% of take-home — within the healthy range. You have meaningful room to save and invest.`)
    }
    if (vehiclePct > 15) {
      lines.push(`Your vehicle finance is ${vehiclePct}% of take-home — above the 15% benchmark. This is reducing your qualifying bond amount.`)
    }
    if (savingsRate < 10 && profile.grossSalary > 0) {
      lines.push(`Your savings rate is below 10%. At this rate, meaningful wealth accumulation in the first five years is very difficult.`)
    } else if (savingsRate >= 20) {
      lines.push(`Your savings rate of ${savingsRate}% is on target. Sustaining this over 5 years builds a materially different financial position.`)
    }
    return lines
  }

  const narrativeLines = getNarrative()

  return (
    <div style={styles.page}>
      <PageWrapper>

        {/* HERO HEADER */}
        <div style={styles.dashHero}>
          <div style={styles.dashHeroLeft}>
            <div style={styles.eyebrow}>Money Snapshot</div>
            <div style={styles.takeHomeLabel}>Monthly take-home pay</div>
            <div style={styles.takeHomeAmount}>{formatZAR(takeHome)}</div>
            {narrativeLines && narrativeLines.length > 0 && (
              <div style={styles.narrativeBlock}>
                {narrativeLines.map((line, i) => (
                  <div key={i} style={styles.narrativeLine}>
                    <span style={styles.narrativeDot}>›</span>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={styles.dashHeroRight}>
            {track ? (
              <div style={{ ...styles.trackBadge, borderColor: track.color }}>
                <div style={styles.trackBadgeLabel}>Active track</div>
                <div style={{ ...styles.trackBadgeName, color: track.color }}>{track.name}</div>
                <div style={styles.trackBadgeSub}>{track.tagline.slice(0, 48)}…</div>
              </div>
            ) : (
              <div style={styles.trackBadge}>
                <div style={styles.trackBadgeLabel}>No track selected</div>
                <div style={styles.trackBadgeName}>Choose a track</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate('/tracks')}
                  style={{ marginTop: '8px' }}
                >
                  Browse tracks →
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* KEY METRICS ROW */}
        <div style={styles.sectionLabel}>Key metrics</div>
        <div style={styles.metricsGrid}>
          <Card accent={netWorth >= 0 ? 'var(--color-teal)' : 'var(--color-red)'}>
            <CardLabel color={netWorth >= 0 ? 'var(--color-teal)' : 'var(--color-red)'}>Net worth</CardLabel>
            <CardValue negative={netWorth < 0}>{formatZAR(netWorth)}</CardValue>
            <CardSub>Assets {formatZAR(totalAssets)} · Debts {formatZAR(totalDebts)}</CardSub>
            <Badge
              variant={netWorth >= 0 ? 'teal' : 'red'}
              style={{ marginTop: '10px' }}
            >
              {netWorth >= 0 ? 'Positive' : 'Negative'}
            </Badge>
          </Card>

          <Card accent="var(--color-purple)">
            <CardLabel color="var(--color-purple)">Disposable income</CardLabel>
            <CardValue>{formatZAR(disposable)}</CardValue>
            <CardSub>After all fixed costs</CardSub>
          </Card>

          <Card accent={fixedLoadColor}>
            <CardLabel color={fixedLoadColor}>Fixed cost load</CardLabel>
            <div style={styles.ratioInner}>
              <DonutChart percentage={fixedLoad} color={fixedLoadColor} size={72} strokeWidth={9} />
              <div>
                <CardValue>{formatPercent(fixedLoad)}</CardValue>
                <CardSub>{fixedLoadLabel}</CardSub>
              </div>
            </div>
          </Card>

          <Card accent={dti > 40 ? 'var(--color-red)' : dti > 30 ? 'var(--color-amber)' : 'var(--color-teal)'}>
            <CardLabel>Debt-to-income</CardLabel>
            <CardValue>{formatPercent(dti)}</CardValue>
            <CardSub>{dti > 40 ? 'High — affects bond qualification' : dti > 30 ? 'Moderate' : 'Healthy'}</CardSub>
          </Card>

          <Card accent={savingsRate >= 20 ? 'var(--color-teal)' : savingsRate >= 10 ? 'var(--color-amber)' : 'var(--color-red)'}>
            <CardLabel>Savings rate</CardLabel>
            <CardValue>{formatPercent(savingsRate)}</CardValue>
            <CardSub>{savingsRate >= 20 ? 'On target' : savingsRate >= 10 ? 'Below 20% benchmark' : 'Critical — below 10%'}</CardSub>
          </Card>
        </div>

        {/* INCOME BREAKDOWN + FIXED COST CATEGORIES */}
        <div style={styles.twoColGrid}>

          {/* Income waterfall */}
          <Card accent="var(--color-purple)">
            <CardLabel color="var(--color-purple)">Income breakdown</CardLabel>
            <WaterfallChart items={waterfallItems} />
          </Card>

          {/* Fixed cost categories */}
          <Card accent="var(--color-amber)">
            <CardLabel color="var(--color-amber)">Fixed cost breakdown</CardLabel>
            {fixedCategories.length > 0 ? (
              <div style={styles.categoryList}>
                {fixedCategories.map((cat, i) => {
                  const pctOfFixed = totalFixed > 0
                    ? Math.round((cat.value / totalFixed) * 100)
                    : 0
                  const pctOfTakeHome = takeHome > 0
                    ? Math.round((cat.value / takeHome) * 100)
                    : 0
                  return (
                    <div key={i} style={styles.categoryRow}>
                      <div style={styles.categoryRowLeft}>
                        <span style={styles.categoryIcon}>{cat.icon}</span>
                        <div>
                          <div style={styles.categoryName}>{cat.label}</div>
                          <div style={styles.categorySub}>{pctOfTakeHome}% of take-home</div>
                        </div>
                      </div>
                      <div style={styles.categoryRowRight}>
                        <div style={styles.categoryValue}>{formatZAR(cat.value)}</div>
                        <div style={{ ...styles.categoryPct, color: cat.color }}>{pctOfFixed}%</div>
                      </div>
                    </div>
                  )
                })}
                <div style={styles.categoryTotal}>
                  <span>Total fixed costs</span>
                  <span style={{ color: fixedLoadColor, fontWeight: 700 }}>{formatZAR(totalFixed)}</span>
                </div>
              </div>
            ) : (
              <div style={styles.emptyNote}>No fixed costs entered yet.</div>
            )}
          </Card>
        </div>

        {/* DEBT EXPOSURE */}
        <div style={styles.sectionLabel}>Debt exposure</div>
        <Card>
          {totalDebts > 0 ? (
            <div style={styles.debtList}>
              {[
                { name: 'Vehicle finance', balance: profile.vehicleDebt || 0, monthly: profile.vehicleFinance || 0, color: 'var(--color-red)', max: 500000 },
                { name: 'Student loan', balance: profile.studentDebt || 0, monthly: 0, color: 'var(--color-coral)', max: 300000 },
                { name: 'Credit card balance', balance: profile.creditCardDebt || 0, monthly: 0, color: 'var(--color-amber)', max: 50000, warning: 'Revolving at ~20% p/a' },
                { name: 'Personal loan', balance: profile.personalLoanDebt || 0, monthly: 0, color: 'var(--color-amber)', max: 100000 },
              ].filter(d => d.balance > 0).map((debt, i) => (
                <div key={i} style={styles.debtItem}>
                  <div style={styles.debtHeader}>
                    <div>
                      <div style={styles.debtName}>{debt.name}</div>
                      {debt.warning && (
                        <div style={{ fontSize: '10px', color: 'var(--color-amber)', marginTop: '2px' }}>
                          ⚠ {debt.warning}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={styles.debtBalance}>{formatZAR(debt.balance)}</div>
                      {debt.monthly > 0 && (
                        <div style={styles.debtMonthly}>{formatZAR(debt.monthly)}/mo</div>
                      )}
                    </div>
                  </div>
                  <ProgressBar
                    value={debt.balance}
                    max={debt.max}
                    color={debt.color}
                    height={4}
                    animate
                  />
                </div>
              ))}
              <div style={styles.debtTotal}>
                Total outstanding debt
                <span style={{ color: 'var(--color-red)', fontWeight: 700, marginLeft: '8px' }}>
                  {formatZAR(totalDebts)}
                </span>
              </div>
            </div>
          ) : (
            <div style={styles.emptyNote}>No debts entered. If you have outstanding balances, add them to see your full net worth picture.</div>
          )}
        </Card>

        {/* GOAL PROGRESS */}
        <div style={styles.sectionLabel}>Goal progress</div>
        <div style={styles.goalsGrid}>
          <Card accent="var(--color-purple)">
            <CardLabel color="var(--color-purple)">Property deposit</CardLabel>
            <div style={styles.goalValue}>{formatZAR(depositSaved)}</div>
            <div style={styles.goalTarget}>of {formatZAR(profile.depositGoal || 0)} target</div>
            <ProgressBar value={depositPct} max={100} color="var(--color-purple)" height={6} showLabel animate />
            {monthlyNeeded > 0 && (
              <div style={styles.goalNote}>
                Need {formatZAR(monthlyNeeded)}/month to reach target in {profile.depositTimelineYears} year{profile.depositTimelineYears !== 1 ? 's' : ''}
              </div>
            )}
          </Card>

          <Card accent="var(--color-teal)">
            <CardLabel color="var(--color-teal)">Emergency fund</CardLabel>
            <div style={styles.goalValue}>{formatZAR(profile.emergencyFundSaved || 0)}</div>
            <div style={styles.goalTarget}>of {formatZAR(profile.emergencyFundGoal || 0)} target</div>
            <ProgressBar value={emergencyPct} max={100} color="var(--color-teal)" height={6} showLabel animate />
            <div style={styles.goalNote}>
              {emergencyPct >= 100
                ? '✓ Emergency fund complete'
                : `${formatZAR((profile.emergencyFundGoal || 0) - (profile.emergencyFundSaved || 0))} remaining`}
            </div>
          </Card>

          <Card accent="var(--color-amber)">
            <CardLabel color="var(--color-amber)">TFSA — annual limit</CardLabel>
            <div style={styles.goalValue}>{formatZAR(profile.tfsaBalance || 0)}</div>
            <div style={styles.goalTarget}>of R36,000 annual limit</div>
            <ProgressBar value={tfsaPct} max={100} color="var(--color-amber)" height={6} showLabel animate />
            <div style={styles.goalNote}>
              {tfsaPct >= 100
                ? '✓ Annual limit reached'
                : `${formatZAR(36000 - (profile.tfsaBalance || 0))} of annual allowance remaining`}
            </div>
          </Card>
        </div>

        {/* ASSETS SUMMARY */}
        <div style={styles.sectionLabel}>Asset summary</div>
        <Card>
          <div style={styles.assetGrid}>
            {[
              { label: 'TFSA', value: profile.tfsaBalance || 0, color: 'var(--color-amber)', icon: '📈', note: 'Tax-free growth' },
              { label: 'RA / Pension', value: profile.raBalance || 0, color: 'var(--color-teal)', icon: '🏦', note: 'Retirement fund' },
              { label: 'Cash savings', value: profile.savingsBalance || 0, color: 'var(--color-purple)', icon: '💰', note: 'Liquid savings' },
              { label: 'Offshore', value: profile.offshoreBalance || 0, color: 'var(--color-coral)', icon: '🌍', note: 'Foreign investments' },
            ].map((asset, i) => (
              <div key={i} style={styles.assetItem}>
                <div style={styles.assetIcon}>{asset.icon}</div>
                <div style={styles.assetContent}>
                  <div style={styles.assetLabel}>{asset.label}</div>
                  <div style={{ ...styles.assetValue, color: asset.value > 0 ? asset.color : 'rgba(255,255,255,0.2)' }}>
                    {formatZAR(asset.value)}
                  </div>
                  <div style={styles.assetNote}>{asset.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.assetTotal}>
            <span>Total assets</span>
            <span style={{ color: 'var(--color-teal)', fontWeight: 700 }}>{formatZAR(totalAssets)}</span>
          </div>
        </Card>

        {/* EDIT BUTTON */}
        <div style={{ textAlign: 'right', marginTop: '24px', paddingBottom: '8px' }}>
          <Button variant="ghost" size="sm" onClick={() => { setStep(0); setViewMode('form') }}>
            Edit my inputs
          </Button>
        </div>

      </PageWrapper>
    </div>
  )
}

// ─── HELPER COMPONENTS ───────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>
          {label}
        </label>
        {hint && (
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'right', maxWidth: '180px' }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function InfoTile({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      background: 'rgba(75,68,168,0.08)',
      border: '1px solid rgba(75,68,168,0.2)',
      borderRadius: '10px',
      padding: '12px 16px',
      marginTop: '4px',
    }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-purple)' }}>
          Learn: {title}
        </div>
        <div style={{ color: 'var(--color-purple)', fontSize: '16px', lineHeight: 1 }}>
          {open ? '−' : '+'}
        </div>
      </div>
      {open && (
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginTop: '10px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────

const styles = {
  page: { background: 'var(--color-bg-base)', minHeight: '100vh' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-red)', marginBottom: '10px' },
  formHeader: { marginBottom: '28px' },
  formTitle: { fontSize: '28px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '8px' },
  formSub: { fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  stepRow: { display: 'flex', gap: '6px', marginBottom: '24px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1 },
  stepDot: { width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, flexShrink: 0 },
  stepLabel: { fontSize: '12px', fontWeight: 500 },
  formCard: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '28px' },
  fields: { display: 'flex', flexDirection: 'column', gap: '20px' },
  stepTitle: { fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '4px' },
  stepDesc: { fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  categoryLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: '4px' },
  input: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-md)', padding: '11px 14px', fontSize: '14px', color: '#fff', width: '100%', fontFamily: 'var(--font-family)' },
  liveFeedback: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '12px 14px' },
  liveFeedbackLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' },
  liveFeedbackVal: { fontSize: '15px', fontWeight: 700, marginBottom: '8px' },
  formNav: { display: 'flex', marginTop: '28px', gap: '12px', alignItems: 'center' },
  dashHero: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: '28px 32px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' },
  dashHeroLeft: { flex: 1 },
  takeHomeLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '6px' },
  takeHomeAmount: { fontSize: '42px', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '14px', fontVariantNumeric: 'tabular-nums' },
  narrativeBlock: { display: 'flex', flexDirection: 'column', gap: '6px' },
  narrativeLine: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, display: 'flex', gap: '8px', alignItems: 'flex-start' },
  narrativeDot: { color: 'var(--color-red)', fontWeight: 700, flexShrink: 0, marginTop: '1px' },
  dashHeroRight: {},
  trackBadge: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', minWidth: '200px' },
  trackBadgeLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' },
  trackBadgeName: { fontSize: '14px', fontWeight: 700, marginBottom: '4px' },
  trackBadgeSub: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 },
  sectionLabel: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', marginTop: '32px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '0' },
  ratioInner: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' },
  twoColGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '14px' },
  categoryList: { display: 'flex', flexDirection: 'column', gap: '2px' },
  categoryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  categoryRowLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  categoryIcon: { fontSize: '16px', lineHeight: 1 },
  categoryName: { fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.75)' },
  categorySub: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' },
  categoryRowRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  categoryValue: { fontSize: '13px', fontWeight: 600, color: '#fff' },
  categoryPct: { fontSize: '11px', fontWeight: 700, minWidth: '30px', textAlign: 'right' },
  categoryTotal: { display: 'flex', justifyContent: 'space-between', paddingTop: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' },
  emptyNote: { fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' },
  debtList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  debtItem: { display: 'flex', flexDirection: 'column', gap: '8px' },
  debtHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  debtName: { fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.8)' },
  debtBalance: { fontSize: '15px', fontWeight: 700, color: '#fff' },
  debtMonthly: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', textAlign: 'right' },
  debtTotal: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center' },
  goalsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' },
  goalValue: { fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '2px', fontVariantNumeric: 'tabular-nums' },
  goalTarget: { fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginBottom: '12px' },
  goalNote: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '8px', lineHeight: 1.5 },
  assetGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '16px' },
  assetItem: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  assetIcon: { fontSize: '20px', lineHeight: 1, marginTop: '2px' },
  assetContent: {},
  assetLabel: { fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' },
  assetValue: { fontSize: '18px', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '2px', fontVariantNumeric: 'tabular-nums' },
  assetNote: { fontSize: '10px', color: 'rgba(255,255,255,0.25)' },
  assetTotal: { display: 'flex', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: 'rgba(255,255,255,0.4)' },
}

export default MoneySnapshot