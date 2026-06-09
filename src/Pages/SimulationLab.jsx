import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import PageWrapper from '../components/layout/PageWrapper'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatZAR, formatPercent } from '../utils/formatters'
import { calculateTransferDuty, getBondRegistrationCost, getConveyancingCost, getTotalUpfrontCosts } from '../utils/transferDuty'

// ─── MAIN EXPORT ─────────────────────────────────────────────────

function SimulationLab() {
  const { studioId } = useParams()
  const { isLoggedIn, profile, selectedTrack } = useUser()
  const navigate = useNavigate()

  if (!isLoggedIn) { navigate('/auth'); return null }

  if (!studioId) {
    return <LabOverview selectedTrack={selectedTrack} navigate={navigate} />
  }
  if (studioId === 'property') return <PropertyStudio profile={profile} navigate={navigate} />
  if (studioId === 'car') return <CarStudio profile={profile} navigate={navigate} />
  if (studioId === 'offshore') return <OffshoreStudio profile={profile} navigate={navigate} />

  navigate('/simulation')
  return null
}

// ─── LAB OVERVIEW ────────────────────────────────────────────────

function LabOverview({ selectedTrack, navigate }) {
  const studios = [
    {
      id: 'property',
      num: '01',
      title: 'Property vs Renting in Joburg',
      desc: 'Models the five-year financial reality of buying your first property versus staying in rental accommodation — with SA-specific transfer costs, bond rates, and Johannesburg metro pricing.',
      color: 'var(--color-red)',
      teaser: 'Renting costs less in Years 1–3. Buying overtakes from Year 4 in most Joburg scenarios.',
      mins: '~4 min · 6 inputs',
      icon: '🏠',
    },
    {
      id: 'car',
      num: '02',
      title: 'Luxury Car vs Invest the Difference',
      desc: 'Models the five-year wealth gap between two vehicle finance decisions. Includes SA depreciation rates, insurance differentials, and opportunity cost at JSE ETF returns.',
      color: 'var(--color-purple)',
      teaser: 'R500K+ wealth gap at Year 5 between a R650K and R320K vehicle choice.',
      mins: '~3 min · 5 inputs',
      icon: '🚗',
    },
    {
      id: 'offshore',
      num: '03',
      title: 'Local vs Offshore Allocation',
      desc: 'Risk-adjusted return modelling across local and offshore ETF splits. Accounts for rand depreciation, SARS CGT, TFSA wrapper benefits, and the SA foreign allowance rules.',
      color: 'var(--color-teal)',
      teaser: '70/30 split produces ~R420K at Year 5 on R5,000/month contributions.',
      mins: '~5 min · 6 inputs',
      icon: '🌍',
    },
  ]

  return (
    <div style={styles.page}>
      <PageWrapper>
        <div style={styles.eyebrow}>Simulation Lab</div>
        <h1 style={styles.labTitle}>Run the numbers before you make the call.</h1>
        <p style={styles.labSub}>
          Three studios. Real SA inputs. One opinionated verdict per simulation.
          Not a neutral summary of scenarios — an actual position based on your numbers.
        </p>

        {selectedTrack === 'property-path' && (
          <div style={styles.trackBanner}>
            <div style={styles.trackDot} />
            <div style={styles.trackBannerText}>
              <strong>Property Path track active:</strong> Studio 01 is most relevant to your current milestones.
              Run it first.
            </div>
          </div>
        )}
        {selectedTrack === 'aggressive-investor' && (
          <div style={{ ...styles.trackBanner, background: 'rgba(13,122,95,0.08)', borderColor: 'rgba(13,122,95,0.25)' }}>
            <div style={{ ...styles.trackDot, background: 'var(--color-teal)' }} />
            <div style={{ ...styles.trackBannerText, color: '#9FD4C0' }}>
              <strong>Aggressive Global Investor track active:</strong> Studio 03 is most relevant to your strategy.
            </div>
          </div>
        )}

        <div style={styles.studioGrid}>
          {studios.map(s => (
            <div key={s.id} style={{ ...styles.studioCard, borderTop: `3px solid ${s.color}` }}>
              <div style={styles.studioCardTop}>
                <div style={{ ...styles.studioNum, color: s.color }}>Studio {s.num}</div>
                <div style={styles.studioIconLarge}>{s.icon}</div>
              </div>
              <div style={styles.studioTitle}>{s.title}</div>
              <div style={styles.studioDesc}>{s.desc}</div>
              <div style={{ ...styles.teaserBox, borderColor: s.color + '33' }}>
                <div style={styles.teaserLabel}>Teaser result</div>
                <div style={{ ...styles.teaserVal, color: s.color }}>{s.teaser}</div>
              </div>
              <div style={styles.studioFooter}>
                <div style={styles.studioMins}>{s.mins}</div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/simulation/${s.id}`)}
                >
                  Run studio →
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.verdictExplainer}>
          <div style={styles.verdictIcon}>!</div>
          <div>
            <div style={styles.verdictTitle}>What is a Studio Verdict?</div>
            <div style={styles.verdictBody}>
              Each simulation ends with an opinionated verdict based on your exact inputs — not a neutral
              "it depends." The verdict takes a position. You can disagree with it. But it will not hedge.
            </div>
          </div>
        </div>

      </PageWrapper>
    </div>
  )
}

// ─── PROPERTY STUDIO ─────────────────────────────────────────────

function PropertyStudio({ profile, navigate }) {
  const [inputs, setInputs] = useState({
    propertyPrice: 1800000,
    deposit: 180000,
    bondRate: 12.25,
    monthlyRent: 9500,
    rentEscalation: 8,
    appreciation: 5,
    investReturn: 10,
  })
  const [showVerdict, setShowVerdict] = useState(false)

  const upd = (key, val) => setInputs(prev => ({ ...prev, [key]: +val }))

  // ── CORRECT transfer duty using util ──
  const transferDuty = calculateTransferDuty(inputs.propertyPrice)
  const bondAmount = inputs.propertyPrice - inputs.deposit
  const bondReg = getBondRegistrationCost(bondAmount)
  const conveyancing = getConveyancingCost(inputs.propertyPrice)
  const upfrontCosts = inputs.deposit + transferDuty + bondReg + conveyancing

  const r = inputs.bondRate / 100 / 12
  const monthlyBond = bondAmount > 0
    ? (bondAmount * r) / (1 - Math.pow(1 + r, -240))
    : 0

  const leviesAndRates = 2200
  const totalBuyMonthly = monthlyBond + leviesAndRates
  const rentDiff = totalBuyMonthly - inputs.monthlyRent
  const investMonthly = Math.max(500, rentDiff > 0 ? rentDiff : 500)

  // Year 1
  const yr1BuyCost = upfrontCosts + totalBuyMonthly * 12
  const yr1RentCost = inputs.monthlyRent * 12
  const yr1Equity = inputs.deposit + inputs.propertyPrice * (inputs.appreciation / 100)

  // Year 3
  const yr3Equity = inputs.deposit + inputs.propertyPrice * (inputs.appreciation / 100) * 3
  const yr3Portfolio = investMonthly * ((Math.pow(1 + inputs.investReturn / 100 / 12, 36) - 1) / (inputs.investReturn / 100 / 12))

  // Year 5
  const yr5Equity = inputs.deposit + inputs.propertyPrice * (inputs.appreciation / 100) * 5 + bondAmount * 0.08
  const yr5Portfolio = investMonthly * ((Math.pow(1 + inputs.investReturn / 100 / 12, 60) - 1) / (inputs.investReturn / 100 / 12))
  const buyAhead = yr5Equity > yr5Portfolio

  const depositPct = ((inputs.deposit / inputs.propertyPrice) * 100).toFixed(1)

  return (
    <div style={styles.page}>
      <PageWrapper>
        <StudioNav
          num="01"
          title="Property vs Renting in Joburg"
          color="var(--color-red)"
          navigate={navigate}
        />

        <PreBrief color="var(--color-red)">
          This studio models the five-year financial comparison between buying a first property in
          Johannesburg versus renting a comparable property and investing the monthly difference.
          It accounts for SA-specific costs: transfer duty (SARS sliding scale — correctly calculated
          across all six bands), bond registration (~1.2% of bond value), conveyancing fees, and
          sectional title levies. The numbers are simplified but the logic is consistent.
          This is modelling — not financial advice.
        </PreBrief>

        <div style={styles.splitPanel}>
          <div style={styles.inputPanel}>
            <div style={styles.panelTitle}>Inputs</div>

            <SliderInput
              label="Property purchase price"
              value={inputs.propertyPrice}
              min={800000} max={5000000} step={50000}
              onChange={v => upd('propertyPrice', v)}
              fmt={formatZAR}
            />
            <SliderInput
              label="Deposit available"
              value={inputs.deposit}
              min={0} max={inputs.propertyPrice * 0.4} step={10000}
              onChange={v => upd('deposit', v)}
              fmt={formatZAR}
              hint={`${depositPct}% of purchase price`}
            />
            <SliderInput
              label="Bond interest rate"
              value={inputs.bondRate}
              min={8} max={18} step={0.25}
              onChange={v => upd('bondRate', v)}
              fmt={v => `${v}%`}
              hint="Prime + 1% = 12.25% (current)"
            />
            <SliderInput
              label="Monthly rental — comparable property"
              value={inputs.monthlyRent}
              min={4000} max={30000} step={500}
              onChange={v => upd('monthlyRent', v)}
              fmt={formatZAR}
            />
            <SliderInput
              label="Property appreciation per year"
              value={inputs.appreciation}
              min={0} max={15} step={0.5}
              onChange={v => upd('appreciation', v)}
              fmt={v => `${v}%`}
              hint="Conservative Joburg estimate: 5%"
            />
            <SliderInput
              label="Investment return on rent difference"
              value={inputs.investReturn}
              min={5} max={18} step={0.5}
              onChange={v => upd('investReturn', v)}
              fmt={v => `${v}%`}
              hint="JSE ETF long-run nominal average"
            />

            <button
              style={styles.resetBtn}
              onClick={() => setInputs({ propertyPrice: 1800000, deposit: 180000, bondRate: 12.25, monthlyRent: 9500, rentEscalation: 8, appreciation: 5, investReturn: 10 })}
            >
              Reset to defaults
            </button>
          </div>

          <div style={styles.outputPanel}>
            <div style={styles.panelTitle}>Live output</div>

            <div style={styles.outputGrid3}>
              <OutputTile
                label="Year 1 position"
                value={yr1Equity > yr1BuyCost ? 'Buying ahead' : 'Renting cheaper'}
                sub={`Buy total cost: ${formatZAR(yr1BuyCost)}`}
                color={yr1Equity > yr1BuyCost ? 'var(--color-teal)' : 'var(--color-red)'}
              />
              <OutputTile
                label="Year 3 position"
                value={yr3Equity > yr3Portfolio ? 'Equity leading' : 'Portfolio leading'}
                sub={`Equity: ${formatZAR(yr3Equity)} · Portfolio: ${formatZAR(yr3Portfolio)}`}
                color="var(--color-amber)"
              />
              <OutputTile
                label="Year 5 position"
                value={buyAhead ? 'Buying wins' : 'Renting wins'}
                sub={`Equity: ${formatZAR(yr5Equity)} · Portfolio: ${formatZAR(yr5Portfolio)}`}
                color={buyAhead ? 'var(--color-teal)' : 'var(--color-red)'}
              />
            </div>

            <KeyNumbers title="Upfront cost breakdown">
              <KN label="Transfer duty (SARS sliding scale)" val={formatZAR(transferDuty)} highlight />
              <KN label="Bond registration (~1.2% of bond)" val={formatZAR(bondReg)} />
              <KN label="Conveyancing fees" val={formatZAR(conveyancing)} />
              <KN label="Deposit" val={formatZAR(inputs.deposit)} />
              <KN label="Total upfront cash required" val={formatZAR(upfrontCosts)} highlight />
            </KeyNumbers>

            <KeyNumbers title="Monthly cost comparison">
              <KN label="Monthly bond repayment" val={formatZAR(monthlyBond)} />
              <KN label="Levies and rates (estimate)" val={formatZAR(leviesAndRates)} />
              <KN label="Total buy monthly cost" val={formatZAR(totalBuyMonthly)} highlight />
              <KN label="Monthly rental" val={formatZAR(inputs.monthlyRent)} />
              <KN label="Monthly difference" val={rentDiff > 0 ? `+${formatZAR(rentDiff)} more to buy` : `${formatZAR(Math.abs(rentDiff))} cheaper to buy`} />
              <KN label="Amount invested in rent scenario" val={formatZAR(investMonthly)} />
            </KeyNumbers>

            <SAContext>
              Transfer duty is calculated using the full SARS 2024/25 sliding scale across all six bands:
              0% below R1.1M, 3% on R1.1M–R1.5125M, 6% up to R2.1175M, 8% up to R2.7225M, 11% up to R12.1M,
              and 13% above R12.1M. Bond registration is approximately 1–1.5% of the bond value.
              Sectional title levies are estimated at R1,500–R2,500/month. Transfer duty is paid directly
              to SARS — it is not included in the bond.
            </SAContext>

            {!showVerdict ? (
              <Button fullWidth onClick={() => setShowVerdict(true)} style={{ marginTop: '16px' }}>
                Generate Studio Verdict →
              </Button>
            ) : (
              <Verdict color="var(--color-red)">
                {buyAhead
                  ? `On your inputs, buying in Johannesburg puts you ${formatZAR(yr5Equity - yr5Portfolio)} ahead at the five-year mark — driven primarily by property appreciation and equity buildup from Year 4 onward. The first three years cost more due to upfront transfer costs of ${formatZAR(transferDuty + bondReg + conveyancing)} and higher monthly bond repayments. If you plan to stay in this property for 5+ years, buying is the stronger long-term financial position.`
                  : `On your inputs, renting and investing the difference puts you ${formatZAR(yr5Portfolio - yr5Equity)} ahead at the five-year mark. The upfront transfer costs of ${formatZAR(transferDuty + bondReg + conveyancing)} and monthly bond repayment of ${formatZAR(monthlyBond)} are not recovered through appreciation within five years at these settings. If your employment situation may change metro within 3 years, or you want to preserve liquidity and investing discipline, renting preserves more flexibility at comparable or better net wealth.`
                }
              </Verdict>
            )}

            <RelatedConcepts terms={['Transfer duty', 'Bond registration', 'Conveyancing fees', 'Prime rate', 'Fixed cost load']} navigate={navigate} />
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

// ─── CAR STUDIO ──────────────────────────────────────────────────

function CarStudio({ profile, navigate }) {
  const [inputs, setInputs] = useState({
    premiumPrice: 650000,
    practicalPrice: 320000,
    term: 72,
    rate: 13.25,
    investReturn: 10,
  })
  const [showVerdict, setShowVerdict] = useState(false)

  const upd = (key, val) => setInputs(prev => ({ ...prev, [key]: +val }))

  const monthlyPayment = (price) => {
    const r = inputs.rate / 100 / 12
    return price > 0 ? price * r / (1 - Math.pow(1 + r, -inputs.term)) : 0
  }

  const premiumMonthly = monthlyPayment(inputs.premiumPrice)
  const practicalMonthly = monthlyPayment(inputs.practicalPrice)
  const financeGap = premiumMonthly - practicalMonthly
  const insuranceGap = 1600
  const totalMonthlyGap = financeGap + insuranceGap

  // Depreciation: 15% Year 1, 10% per year thereafter
  const depreciateVal = (price) => price * 0.85 * Math.pow(0.90, 4)
  const premiumResidual = depreciateVal(inputs.premiumPrice)
  const practicalResidual = depreciateVal(inputs.practicalPrice)

  // Future value of invested gap
  const yr5Portfolio = totalMonthlyGap * ((Math.pow(1 + inputs.investReturn / 100 / 12, 60) - 1) / (inputs.investReturn / 100 / 12))
  const wealthGap = yr5Portfolio + (practicalResidual - premiumResidual)

  const pctOfTakeHome = profile.grossSalary > 0
    ? Math.round((premiumMonthly / (profile.grossSalary * 0.72)) * 100)
    : 0

  return (
    <div style={styles.page}>
      <PageWrapper>
        <StudioNav
          num="02"
          title="Luxury Car vs Invest the Difference"
          color="var(--color-purple)"
          navigate={navigate}
        />

        <PreBrief color="var(--color-purple)">
          This studio is not telling you not to buy the premium vehicle. It is telling you exactly
          what it costs. The wealth gap between two vehicle finance decisions at Year 5 is the output.
          Depreciation is modelled at 15% in Year 1 and 10% per year thereafter — consistent with
          SA mid-premium segment averages. Insurance gap is estimated at R1,600/month between segments.
          No balloon payment is assumed — if your deal includes one, your monthly is lower but
          you carry a large liability at term end.
        </PreBrief>

        <div style={styles.splitPanel}>
          <div style={styles.inputPanel}>
            <div style={styles.panelTitle}>Inputs</div>

            <SliderInput
              label="Premium vehicle price"
              value={inputs.premiumPrice}
              min={300000} max={2000000} step={25000}
              onChange={v => upd('premiumPrice', v)}
              fmt={formatZAR}
              hint="e.g. BMW 3 Series, Mercedes C-Class"
            />
            <SliderInput
              label="Practical vehicle price"
              value={inputs.practicalPrice}
              min={150000} max={700000} step={10000}
              onChange={v => upd('practicalPrice', v)}
              fmt={formatZAR}
              hint="e.g. VW Polo, Toyota Corolla Cross"
            />
            <SliderInput
              label="Finance term"
              value={inputs.term}
              min={24} max={84} step={12}
              onChange={v => upd('term', v)}
              fmt={v => `${v} months`}
              hint="SA standard: 72 months"
            />
            <SliderInput
              label="Interest rate"
              value={inputs.rate}
              min={8} max={22} step={0.25}
              onChange={v => upd('rate', v)}
              fmt={v => `${v}%`}
              hint="Prime + 2% = 13.25% (typical SA vehicle finance)"
            />
            <SliderInput
              label="Investment return on monthly difference"
              value={inputs.investReturn}
              min={5} max={18} step={0.5}
              onChange={v => upd('investReturn', v)}
              fmt={v => `${v}%`}
              hint="JSE ETF long-run nominal average"
            />
          </div>

          <div style={styles.outputPanel}>
            <div style={styles.panelTitle}>Live output</div>

            <div style={styles.outputGrid3}>
              <OutputTile
                label="Premium monthly payment"
                value={formatZAR(premiumMonthly)}
                sub="Finance only — excludes insurance"
                color="var(--color-red)"
              />
              <OutputTile
                label="Practical monthly payment"
                value={formatZAR(practicalMonthly)}
                sub="Finance only — excludes insurance"
                color="var(--color-teal)"
              />
              <OutputTile
                label="Total monthly gap"
                value={formatZAR(totalMonthlyGap)}
                sub="Finance + insurance differential"
                color="var(--color-amber)"
              />
            </div>

            <KeyNumbers title="Five-year wealth comparison">
              <KN label="Premium vehicle — Year 5 residual value" val={formatZAR(premiumResidual)} />
              <KN label="Practical vehicle — Year 5 residual value" val={formatZAR(practicalResidual)} />
              <KN label="Monthly gap invested at Year 5" val={formatZAR(yr5Portfolio)} highlight />
              <KN label="Total wealth gap at Year 5" val={formatZAR(wealthGap)} highlight />
              <KN label="Insurance gap (estimated)" val="R1,600/month" />
              {pctOfTakeHome > 0 && (
                <KN
                  label="Premium payment as % of estimated take-home"
                  val={`${pctOfTakeHome}%`}
                  warning={pctOfTakeHome > 15}
                />
              )}
            </KeyNumbers>

            <SAContext>
              Balloon payments are common in SA dealer finance — they lower monthly repayments but leave a
              large lump-sum liability at the end of the term. Many buyers are not prepared for this.
              This studio assumes no balloon. Comprehensive insurance on a premium vehicle typically costs
              R2,400–R3,200/month versus R800–R1,200 on a practical vehicle — a gap of approximately
              R1,600/month used in this model. Vehicle finance is assessed by banks at prime + 1–3%
              depending on your credit profile.
            </SAContext>

            {!showVerdict ? (
              <Button fullWidth onClick={() => setShowVerdict(true)} style={{ marginTop: '16px' }}>
                Generate Studio Verdict →
              </Button>
            ) : (
              <Verdict color="var(--color-purple)">
                {`Choosing the ${formatZAR(inputs.premiumPrice)} vehicle over the ${formatZAR(inputs.practicalPrice)} vehicle costs approximately ${formatZAR(totalMonthlyGap)} more per month in combined repayments and insurance. That difference, invested at ${inputs.investReturn}% per year into a JSE-linked ETF, becomes ${formatZAR(yr5Portfolio)} by Year 5. The premium vehicle, after depreciation, is worth approximately ${formatZAR(premiumResidual)} at the same point. Total wealth gap between these two decisions at five years: ${formatZAR(wealthGap)}. This studio is not telling you not to buy the premium vehicle. It is telling you exactly what it costs — so the decision is yours to make with open eyes.`}
              </Verdict>
            )}

            <RelatedConcepts terms={['Balloon payment', 'Prime rate', 'Debt-to-income ratio', 'Fixed cost load']} navigate={navigate} />
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

// ─── OFFSHORE STUDIO ─────────────────────────────────────────────

function OffshoreStudio({ profile, navigate }) {
  const [inputs, setInputs] = useState({
    monthlyContrib: 5000,
    localPct: 70,
    localReturn: 9,
    offshoreReturn: 11,
    randDepreciation: 5,
    years: 5,
  })
  const [showVerdict, setShowVerdict] = useState(false)

  const upd = (key, val) => setInputs(prev => ({ ...prev, [key]: +val }))

  const offshorePct = 100 - inputs.localPct
  const months = inputs.years * 12
  const localContrib = inputs.monthlyContrib * (inputs.localPct / 100)
  const offshoreContrib = inputs.monthlyContrib * (offshorePct / 100)

  const fv = (pmt, ratePA, n) => {
    const r = ratePA / 100 / 12
    return r > 0 ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n
  }

  const localPortfolio = fv(localContrib, inputs.localReturn, months)
  const offshoreRaw = fv(offshoreContrib, inputs.offshoreReturn, months)
  const randMultiplier = Math.pow(1 + inputs.randDepreciation / 100, inputs.years)
  const offshoreZAR = offshoreRaw * randMultiplier
  const totalPortfolio = localPortfolio + offshoreZAR

  // Scenario comparison
  const allLocal = fv(inputs.monthlyContrib, inputs.localReturn, months)
  const allOffshore = fv(inputs.monthlyContrib, inputs.offshoreReturn, months) * randMultiplier
  const totalContributed = inputs.monthlyContrib * months

  return (
    <div style={styles.page}>
      <PageWrapper>
        <StudioNav
          num="03"
          title="Local vs Offshore Allocation"
          color="var(--color-teal)"
          navigate={navigate}
        />

        <PreBrief color="var(--color-teal)">
          This studio models different splits between local JSE and offshore ETF investments over your
          chosen time horizon. Rand depreciation is applied to offshore returns to show the
          ZAR-equivalent value — this is the most important adjustment for SA investors.
          SARS allows R1,000,000 per year offshore without a tax clearance certificate
          (discretionary allowance). Above R1M, a SARS clearance certificate is required.
          CGT of 40% inclusion rate applies to offshore gains outside a TFSA. Use your TFSA
          wrapper for offshore holdings first.
        </PreBrief>

        <div style={styles.splitPanel}>
          <div style={styles.inputPanel}>
            <div style={styles.panelTitle}>Inputs</div>

            <SliderInput
              label="Monthly contribution"
              value={inputs.monthlyContrib}
              min={500} max={30000} step={500}
              onChange={v => upd('monthlyContrib', v)}
              fmt={formatZAR}
            />
            <SliderInput
              label={`Local / Offshore split: ${inputs.localPct}% local · ${offshorePct}% offshore`}
              value={inputs.localPct}
              min={0} max={100} step={5}
              onChange={v => upd('localPct', v)}
              fmt={v => `${v}% local`}
              hint="70/30 is a common balanced starting point"
            />
            <SliderInput
              label="Local ETF return (nominal per year)"
              value={inputs.localReturn}
              min={4} max={18} step={0.5}
              onChange={v => upd('localReturn', v)}
              fmt={v => `${v}%`}
              hint="JSE All Share 10-year average: ~9% nominal"
            />
            <SliderInput
              label="Offshore ETF return (USD nominal per year)"
              value={inputs.offshoreReturn}
              min={4} max={18} step={0.5}
              onChange={v => upd('offshoreReturn', v)}
              fmt={v => `${v}%`}
              hint="S&P 500 / MSCI World 10-year average: ~11%"
            />
            <SliderInput
              label="Rand depreciation vs USD (per year)"
              value={inputs.randDepreciation}
              min={0} max={15} step={0.5}
              onChange={v => upd('randDepreciation', v)}
              fmt={v => `${v}%`}
              hint="10-year ZAR/USD average: ~5% p/a"
            />
            <SliderInput
              label="Time horizon"
              value={inputs.years}
              min={1} max={20} step={1}
              onChange={v => upd('years', v)}
              fmt={v => `${v} year${v !== 1 ? 's' : ''}`}
            />
          </div>

          <div style={styles.outputPanel}>
            <div style={styles.panelTitle}>Projected portfolio at Year {inputs.years}</div>

            <div style={styles.outputGrid3}>
              <OutputTile
                label={`Local (${inputs.localPct}%)`}
                value={formatZAR(localPortfolio)}
                sub={`${inputs.localPct}% of contributions at ${inputs.localReturn}% p/a`}
                color="var(--color-purple)"
              />
              <OutputTile
                label={`Offshore (${offshorePct}%)`}
                value={formatZAR(offshoreZAR)}
                sub={`ZAR value after ${inputs.randDepreciation}% rand depreciation p/a`}
                color="var(--color-teal)"
              />
              <OutputTile
                label="Total portfolio (ZAR)"
                value={formatZAR(totalPortfolio)}
                sub="Combined local + offshore"
                color="var(--color-red)"
              />
            </div>

            <KeyNumbers title="Scenario comparison">
              <KN label="100% local — conservative" val={formatZAR(allLocal)} />
              <KN label={`Your ${inputs.localPct}/${offshorePct} split`} val={formatZAR(totalPortfolio)} highlight />
              <KN label="100% offshore — aggressive" val={formatZAR(allOffshore)} />
              <KN label="Total contributed" val={formatZAR(totalContributed)} />
              <KN label="Total growth (your split)" val={formatZAR(totalPortfolio - totalContributed)} />
              <KN label="Rand depreciation multiplier" val={`×${randMultiplier.toFixed(2)} on offshore`} />
            </KeyNumbers>

            <KeyNumbers title="SARS rules for offshore investing">
              <KN label="Discretionary allowance (no clearance needed)" val="R1,000,000/year" />
              <KN label="Above R1M — SARS clearance certificate required" val="Up to R10M/year" />
              <KN label="CGT inclusion rate (outside TFSA)" val="40% of gain" />
              <KN label="Annual CGT exclusion" val="R40,000" />
              <KN label="Dividend withholding tax (foreign ETFs)" val="15%" />
              <KN label="TFSA offshore holding — CGT" val="Tax-free" highlight />
            </KeyNumbers>

            <SAContext>
              Offshore returns shown here are in USD terms — the rand depreciation multiplier converts
              them to ZAR equivalent. This is the single biggest factor for SA investors: a 11% USD return
              with 5% annual rand depreciation becomes approximately 16.5% in ZAR terms.
              However, rand appreciation (rare but possible) works in reverse. CGT applies to offshore
              gains outside your TFSA at a 40% inclusion rate — meaning 40% of the gain is added to
              your taxable income. Use your R36,000 annual TFSA allowance for offshore holdings first.
            </SAContext>

            {!showVerdict ? (
              <Button fullWidth onClick={() => setShowVerdict(true)} style={{ marginTop: '16px' }}>
                Generate Studio Verdict →
              </Button>
            ) : (
              <Verdict color="var(--color-teal)">
                {`A ${inputs.localPct}/${offshorePct} local/offshore split on your ${formatZAR(inputs.monthlyContrib)}/month contribution produces an estimated ${formatZAR(totalPortfolio)} after ${inputs.years} year${inputs.years !== 1 ? 's' : ''} — ${formatZAR(totalPortfolio - totalContributed)} in growth on ${formatZAR(totalContributed)} contributed. `}
                {offshorePct >= 50
                  ? `Your offshore-heavy allocation benefits from rand depreciation, but introduces meaningful currency volatility. If you are on the Aggressive Global Investor track with a ${inputs.years}+ year horizon, this split is consistent with your strategy. Ensure your offshore holdings sit inside your TFSA wrapper first to eliminate CGT on growth.`
                  : offshorePct > 0
                  ? `Your balanced split reduces currency risk while still providing rand hedging. The ${offshorePct}% offshore allocation is consistent with the Balanced Lifestyle track. Consider increasing offshore gradually as your local emergency fund and RA positions strengthen.`
                  : `A 100% local allocation eliminates currency risk but concentrates your wealth entirely in ZAR-denominated assets. The rand has depreciated approximately 5% p/a against the USD over the past decade — some offshore exposure is typically warranted for long-term SA investors.`
                }
              </Verdict>
            )}

            <RelatedConcepts terms={['TFSA', 'Foreign investment allowance', 'Capital Gains Tax (CGT)', 'Rand hedging', 'ETF']} navigate={navigate} />
          </div>
        </div>
      </PageWrapper>
    </div>
  )
}

// ─── SHARED STUDIO COMPONENTS ────────────────────────────────────

function StudioNav({ num, title, color, navigate }) {
  return (
    <div style={styles.studioNav}>
      <span style={styles.backBtn} onClick={() => navigate('/simulation')}>
        ← Simulation Lab
      </span>
      <span style={styles.navSep}>/</span>
      <span style={{ color, fontSize: '13px', fontWeight: 500 }}>
        Studio {num} — {title}
      </span>
    </div>
  )
}

function PreBrief({ color, children }) {
  return (
    <div style={{ ...styles.prebriefCard, borderLeft: `3px solid ${color}` }}>
      <div style={styles.prebriefTitle}>Before you run this studio</div>
      <div style={styles.prebriefText}>{children}</div>
    </div>
  )
}

function SAContext({ children }) {
  return (
    <div style={styles.saContext}>
      <div style={styles.saContextTitle}>SA-specific context</div>
      <div style={styles.saContextText}>{children}</div>
    </div>
  )
}

function Verdict({ color, children }) {
  return (
    <div style={{ ...styles.verdictPanel, borderLeft: `4px solid ${color}` }}>
      <div style={{ ...styles.verdictLabel, color }}>Studio Verdict</div>
      <p style={styles.verdictText}>{children}</p>
    </div>
  )
}

function KeyNumbers({ title, children }) {
  return (
    <div style={styles.keyNumbers}>
      <div style={styles.keyNumTitle}>{title}</div>
      {children}
    </div>
  )
}

function RelatedConcepts({ terms, navigate }) {
  return (
    <div style={styles.relatedConcepts}>
      <div style={styles.relatedTitle}>Related glossary terms</div>
      <div style={styles.relatedRow}>
        {terms.map(term => (
          <div
            key={term}
            style={styles.relatedTag}
            onClick={() => navigate('/glossary')}
          >
            {term} →
          </div>
        ))}
      </div>
    </div>
  )
}

function SliderInput({ label, value, min, max, step, onChange, fmt, hint }) {
  return (
    <div style={slStyles.wrap}>
      <div style={slStyles.header}>
        <label style={slStyles.label}>{label}</label>
        <span style={slStyles.value}>{fmt(value)}</span>
      </div>
      {hint && <div style={slStyles.hint}>{hint}</div>}
      <input
        type="range"
        min={min} max={max} step={step} value={value}
        onChange={e => onChange(e.target.value)}
        style={slStyles.slider}
      />
      <div style={slStyles.range}>
        <span>{fmt(min)}</span>
        <span>{fmt(max)}</span>
      </div>
    </div>
  )
}

function OutputTile({ label, value, sub, color }) {
  return (
    <div style={styles.outputTile}>
      <div style={styles.outputTileLabel}>{label}</div>
      <div style={{ ...styles.outputTileValue, color }}>{value}</div>
      <div style={styles.outputTileSub}>{sub}</div>
    </div>
  )
}

function KN({ label, val, highlight, warning }) {
  return (
    <div style={{
      ...styles.knRow,
      background: highlight ? 'rgba(255,255,255,0.03)' : 'transparent',
      borderRadius: highlight ? '6px' : '0',
      padding: highlight ? '8px 10px' : '8px 0',
    }}>
      <span style={{ fontSize: '12px', color: warning ? 'var(--color-amber)' : 'rgba(255,255,255,0.45)' }}>
        {label}
      </span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: highlight ? '#fff' : warning ? 'var(--color-amber)' : '#fff' }}>
        {val}
      </span>
    </div>
  )
}

// ─── STYLES ──────────────────────────────────────────────────────

const slStyles = {
  wrap: { marginBottom: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  label: { fontSize: '12px', color: 'rgba(255,255,255,0.6)', flex: 1, paddingRight: '8px' },
  value: { fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 },
  hint: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' },
  slider: { width: '100%', accentColor: 'var(--color-red)', cursor: 'pointer', display: 'block' },
  range: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '3px' },
}

const styles = {
  page: { background: 'var(--color-bg-base)', minHeight: '100vh' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-red)', marginBottom: '12px' },
  labTitle: { fontSize: '32px', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', marginBottom: '10px' },
  labSub: { fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, maxWidth: '520px', marginBottom: '24px' },
  trackBanner: { background: 'rgba(75,68,168,0.08)', border: '1px solid rgba(75,68,168,0.25)', borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' },
  trackDot: { width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-purple)', flexShrink: 0 },
  trackBannerText: { fontSize: '13px', color: '#CECBF6', lineHeight: 1.5 },
  studioGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' },
  studioCard: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  studioCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  studioNum: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
  studioIconLarge: { fontSize: '22px', lineHeight: 1 },
  studioTitle: { fontSize: '15px', fontWeight: 800, color: '#fff', lineHeight: 1.3 },
  studioDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, flex: 1 },
  teaserBox: { border: '1px solid', borderRadius: 'var(--radius-md)', padding: '10px 12px' },
  teaserLabel: { fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' },
  teaserVal: { fontSize: '13px', fontWeight: 700, lineHeight: 1.4 },
  studioFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  studioMins: { fontSize: '10px', color: 'rgba(255,255,255,0.3)' },
  verdictExplainer: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' },
  verdictIcon: { width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', background: 'rgba(184,134,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: 'var(--color-amber)', flexShrink: 0 },
  verdictTitle: { fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '5px' },
  verdictBody: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  studioNav: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' },
  backBtn: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' },
  navSep: { color: 'rgba(255,255,255,0.2)', fontSize: '13px' },
  prebriefCard: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', padding: '14px 18px', marginBottom: '24px' },
  prebriefTitle: { fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '6px' },
  prebriefText: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 },
  splitPanel: { display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px', marginBottom: '20px' },
  inputPanel: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px' },
  outputPanel: { background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '20px' },
  panelTitle: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' },
  resetBtn: { width: '100%', background: 'none', border: 'none', color: 'var(--color-red)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center', marginTop: '4px', fontFamily: 'var(--font-family)', padding: '6px' },
  outputGrid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' },
  outputTile: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 'var(--radius-md)', padding: '14px' },
  outputTileLabel: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.35)', marginBottom: '7px' },
  outputTileValue: { fontSize: '18px', fontWeight: 800, letterSpacing: '-0.01em', marginBottom: '4px' },
  outputTileSub: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 },
  keyNumbers: { background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '14px' },
  keyNumTitle: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' },
  knRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', marginBottom: '2px' },
  saContext: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: '14px' },
  saContextTitle: { fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.07em' },
  saContextText: { fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 },
  verdictPanel: { background: 'var(--color-bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', padding: '18px 20px', marginTop: '16px' },
  verdictLabel: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' },
  verdictText: { fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 },
  relatedConcepts: { marginTop: '16px' },
  relatedTitle: { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.25)', marginBottom: '8px' },
  relatedRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  relatedTag: { background: 'rgba(75,68,168,0.1)', border: '1px solid rgba(75,68,168,0.2)', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontSize: '11px', color: 'var(--color-purple)', cursor: 'pointer' },
}

export default SimulationLab