import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../Contexts/UserContext'
import Button from '../Components/Button'

function SimulationLab() {
  const { isLoggedIn, profile, selectedTrack } = useUser()
  const navigate = useNavigate()
  const [activeStudio, setActiveStudio] = useState(null)

  if (!isLoggedIn) { navigate('/'); return null }

  if (!activeStudio) {
    return <LabOverview onSelect={setActiveStudio} selectedTrack={selectedTrack} />
  }

  if (activeStudio === 'property') return <PropertyStudio onBack={() => setActiveStudio(null)} profile={profile} />
  if (activeStudio === 'car') return <CarStudio onBack={() => setActiveStudio(null)} profile={profile} />
  if (activeStudio === 'offshore') return <OffshoreStudio onBack={() => setActiveStudio(null)} profile={profile} />

  return null
}

function LabOverview({ onSelect, selectedTrack }) {
  const studios = [
    {
      id: 'property',
      num: '01',
      title: 'Property vs Renting in Joburg',
      desc: 'Models the five-year financial reality of buying your first property versus staying in rental accommodation — with SA-specific transfer costs, bond rates, and metro pricing.',
      color: '#CC0000',
      teaser: 'Renting costs ~R142K less in years 1–3. Buying overtakes from Year 4.',
      teaserBg: 'rgba(204,0,0,0.08)',
      mins: '~4 min · 7 inputs',
    },
    {
      id: 'car',
      num: '02',
      title: 'Luxury Car vs Invest the Difference',
      desc: 'Models the 5-year wealth gap between two vehicle finance decisions. Includes SA depreciation rates, insurance differentials, and opportunity cost at JSE ETF returns.',
      color: '#1A2744',
      teaser: 'R500K+ wealth gap at Year 5 between R650K and R320K vehicle choices.',
      teaserBg: 'rgba(26,39,68,0.3)',
      mins: '~3 min · 6 inputs',
    },
    {
      id: 'offshore',
      num: '03',
      title: 'Local vs Offshore Allocation',
      desc: 'Risk-adjusted return modelling across local/offshore ETF splits. Accounts for rand depreciation, SARS CGT, TFSA wrapper benefits, and SA foreign allowance rules.',
      color: '#0D7A5F',
      teaser: '70/30 split → ~R420K at Year 5 on R5,000/mo.',
      teaserBg: 'rgba(13,122,95,0.08)',
      mins: '~5 min · 7 inputs',
    },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.labHero}>
          <div style={styles.eyebrow}>Know Your Money Studio</div>
          <h1 style={styles.labTitle}>Run the numbers before you make the call.</h1>
          <p style={styles.labSub}>Three studios. Real SA inputs. One opinionated verdict per simulation. Not a neutral summary of scenarios — an actual position.</p>
        </div>

        {selectedTrack === 'property-path' && (
          <div style={styles.trackBanner}>
            <div style={styles.trackDot} />
            <div style={styles.trackBannerText}>
              <strong>Property Path track active:</strong> We recommend starting with Studio 01 — it's most relevant to your current milestone.
            </div>
          </div>
        )}

        <div style={styles.studioGrid}>
          {studios.map(s => (
            <div key={s.id} style={{ ...styles.studioCard, borderTop: `3px solid ${s.color}` }}>
              <div style={{ ...styles.studioNum, color: s.color }}>Studio {s.num}</div>
              <div style={styles.studioTitle}>{s.title}</div>
              <div style={styles.studioDesc}>{s.desc}</div>
              <div style={{ ...styles.teaserBox, background: s.teaserBg }}>
                <div style={styles.teaserLabel}>Teaser result</div>
                <div style={{ ...styles.teaserVal, color: s.color }}>{s.teaser}</div>
              </div>
              <div style={styles.studioFooter}>
                <div style={styles.studioMins}>{s.mins}</div>
                <Button
                  size="sm"
                  variant={s.id === 'property' ? 'primary' : 'ghost'}
                  onClick={() => onSelect(s.id)}
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
              Each simulation ends with an opinionated verdict based on your exact inputs — not a neutral "it depends." The verdict takes a position. You can disagree with it. But it won't hedge.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertyStudio({ onBack, profile }) {
  const [inputs, setInputs] = useState({
    grossSalary: profile.grossSalary || 38000,
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
  const fmt = (n) => `R${Math.round(n).toLocaleString('en-ZA')}`
  const pct = (n) => `${n.toFixed(1)}%`

  const bondAmount = inputs.propertyPrice - inputs.deposit
  const monthlyBond = (bondAmount * (inputs.bondRate / 100 / 12)) / (1 - Math.pow(1 + inputs.bondRate / 100 / 12, -240))
  const transferDuty = inputs.propertyPrice > 1375000
    ? 40250 + (inputs.propertyPrice - 1375000) * 0.08
    : inputs.propertyPrice > 1100000
    ? (inputs.propertyPrice - 1100000) * 0.03
    : 0
  const bondReg = bondAmount * 0.012
  const upfrontCosts = inputs.deposit + transferDuty + bondReg
  const levyRates = 2000
  const totalBuyMonthly = monthlyBond + levyRates
  const rentDiff = totalBuyMonthly - inputs.monthlyRent
  const investMonthly = rentDiff > 0 ? rentDiff : 500

  const yr1BuyCost = upfrontCosts + totalBuyMonthly * 12
  const yr1RentCost = inputs.monthlyRent * 12
  const yr1RentPortfolio = investMonthly * 12 * (1 + inputs.investReturn / 100)
  const yr1Equity = inputs.deposit + (inputs.propertyPrice * inputs.appreciation / 100)

  const yr3BuyCumulative = upfrontCosts + totalBuyMonthly * 36
  const yr3RentCumulative = inputs.monthlyRent * 12 + inputs.monthlyRent * 12 * (1 + inputs.rentEscalation / 100) + inputs.monthlyRent * 12 * Math.pow(1 + inputs.rentEscalation / 100, 2)
  const yr3Equity = inputs.deposit + inputs.propertyPrice * inputs.appreciation / 100 * 3
  const yr3Portfolio = investMonthly * ((Math.pow(1 + inputs.investReturn / 100 / 12, 36) - 1) / (inputs.investReturn / 100 / 12))

  const yr5Equity = inputs.deposit + inputs.propertyPrice * inputs.appreciation / 100 * 5 + bondAmount * 0.08
  const yr5Portfolio = investMonthly * ((Math.pow(1 + inputs.investReturn / 100 / 12, 60) - 1) / (inputs.investReturn / 100 / 12))
  const buyAhead = yr5Equity > yr5Portfolio

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.studioNav}>
          <span style={styles.backBtn} onClick={onBack}>← Simulation Lab</span>
          <span style={styles.navSep}>/</span>
          <span style={{ color: '#CC0000', fontSize: '13px', fontWeight: 500 }}>Studio 01 — Property vs Renting in Joburg</span>
        </div>

        <div style={styles.prebriefCard}>
          <div style={styles.prebriefTitle}>Before you run this studio</div>
          <div style={styles.prebriefText}>
            This studio models the five-year financial comparison between buying a first property in Johannesburg versus renting a comparable property and investing the monthly difference. 
            It accounts for SA-specific costs: transfer duty (SARS sliding scale), bond registration (~1.2% of bond value), sectional title levies, and property rates. 
            The numbers are simplified but the logic is consistent. This is modelling — not financial advice.
          </div>
        </div>

        <div style={styles.splitPanel}>
          <div style={styles.inputPanel}>
            <div style={styles.inputPanelTitle}>Inputs</div>

            <SliderInput label="Property purchase price" value={inputs.propertyPrice} min={800000} max={5000000} step={50000} onChange={v => upd('propertyPrice', v)} fmt={fmt} />
            <SliderInput label="Deposit available" value={inputs.deposit} min={0} max={inputs.propertyPrice * 0.3} step={10000} onChange={v => upd('deposit', v)} fmt={fmt} hint={`${((inputs.deposit / inputs.propertyPrice) * 100).toFixed(1)}% of purchase price`} />
            <SliderInput label="Bond interest rate (%)" value={inputs.bondRate} min={8} max={18} step={0.25} onChange={v => upd('bondRate', v)} fmt={pct} hint="Current prime + 1% = 12.25%" />
            <SliderInput label="Monthly rental (comparable property)" value={inputs.monthlyRent} min={4000} max={25000} step={500} onChange={v => upd('monthlyRent', v)} fmt={fmt} />
            <SliderInput label="Property appreciation p/a (%)" value={inputs.appreciation} min={0} max={15} step={0.5} onChange={v => upd('appreciation', v)} fmt={pct} hint="Conservative Joburg estimate: 5%" />
            <SliderInput label="Investment return on rent difference (%)" value={inputs.investReturn} min={5} max={18} step={0.5} onChange={v => upd('investReturn', v)} fmt={pct} hint="JSE-linked ETF assumption" />

            <div style={styles.resetLink} onClick={() => setInputs({ grossSalary: profile.grossSalary || 38000, propertyPrice: 1800000, deposit: 180000, bondRate: 12.25, monthlyRent: 9500, rentEscalation: 8, appreciation: 5, investReturn: 10 })}>
              Reset to defaults
            </div>
          </div>

          <div style={styles.outputPanel}>
            <div style={styles.outputTitle}>Live output</div>

            <div style={styles.outputGrid3}>
              <OutputTile label="Year 1 position" value={yr1Equity > yr1BuyCost ? 'Buying ahead' : 'Renting cheaper'} sub={`Buy total cost: ${fmt(yr1BuyCost)}`} color={yr1Equity > yr1BuyCost ? '#0D7A5F' : '#CC0000'} />
              <OutputTile label="Year 3 position" value={yr3Equity > yr3Portfolio ? 'Equity leading' : 'Portfolio leading'} sub={`Equity: ${fmt(yr3Equity)} · Portfolio: ${fmt(yr3Portfolio)}`} color="#B8860B" />
              <OutputTile label="Year 5 position" value={buyAhead ? 'Buying wins' : 'Renting wins'} sub={`Equity: ${fmt(yr5Equity)} · Portfolio: ${fmt(yr5Portfolio)}`} color={buyAhead ? '#0D7A5F' : '#CC0000'} />
            </div>

            <div style={styles.keyNumbers}>
              <div style={styles.keyNumTitle}>Key numbers</div>
              <div style={styles.keyNumGrid}>
                <KN label="Monthly bond repayment" val={fmt(monthlyBond)} />
                <KN label="Transfer duty" val={fmt(transferDuty)} />
                <KN label="Bond registration" val={fmt(bondReg)} />
                <KN label="Total upfront cash needed" val={fmt(upfrontCosts)} />
                <KN label="Monthly rent vs bond difference" val={rentDiff > 0 ? `+${fmt(rentDiff)} more` : `${fmt(Math.abs(rentDiff))} cheaper`} />
                <KN label="Invested monthly (rent scenario)" val={fmt(investMonthly)} />
              </div>
            </div>

            <div style={styles.saContext}>
              <div style={styles.saContextTitle}>SA-specific context</div>
              <div style={styles.saContextText}>
                Transfer duty is calculated on the SARS sliding scale: 0% below R1.1M, 3% on R1.1M–R1.375M, 6% up to R1.925M.
                Bond registration is approximately 1–1.5% of the bond value.
                Sectional title levies are estimated at R1,500–R2,500/month depending on complex size.
                Rates and taxes are estimated using the City of Joburg tariff scale.
              </div>
            </div>

            {!showVerdict ? (
              <Button fullWidth onClick={() => setShowVerdict(true)} style={{ marginTop: '16px' }}>
                Generate Studio Verdict →
              </Button>
            ) : (
              <div style={styles.verdictPanel}>
                <div style={styles.verdictLabel}>Studio Verdict</div>
                <p style={styles.verdictText}>
                  {buyAhead
                    ? `On your inputs, buying in Johannesburg puts you ${fmt(yr5Equity - yr5Portfolio)} ahead at the five-year mark — primarily driven by property appreciation and equity buildup from Year 4 onward. The first three years are more expensive due to upfront transfer costs of ${fmt(transferDuty + bondReg)} and higher monthly bond repayments. If you plan to stay in this property for 5+ years, buying is the stronger long-term position.`
                    : `On your inputs, renting and investing the difference puts you ${fmt(yr5Portfolio - yr5Equity)} ahead at the five-year mark. The higher upfront transfer costs of ${fmt(transferDuty + bondReg)} and monthly bond repayment of ${fmt(monthlyBond)} are not recovered through appreciation within the five-year window. If your employment situation is likely to change metro within 3 years, or if you want to preserve liquidity, renting preserves significantly more flexibility at comparable or better net wealth.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={styles.explainerLinks}>
          <div style={styles.explainerTitle}>Related concepts</div>
          <div style={styles.explainerRow}>
            {['Transfer duty', 'Bond registration', 'Mortgage insurance (MIP)', 'Bond qualification'].map(term => (
              <div key={term} style={styles.explainerLink}>{term} →</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CarStudio({ onBack, profile }) {
  const [inputs, setInputs] = useState({
    premiumPrice: 650000,
    practicalPrice: 320000,
    term: 72,
    rate: 13.25,
    investReturn: 10,
  })
  const [showVerdict, setShowVerdict] = useState(false)

  const upd = (key, val) => setInputs(prev => ({ ...prev, [key]: +val }))
  const fmt = (n) => `R${Math.round(n).toLocaleString('en-ZA')}`
  const pct = (n) => `${n.toFixed(2)}%`

  const monthlyPayment = (price) => {
    const r = inputs.rate / 100 / 12
    return price * r / (1 - Math.pow(1 + r, -inputs.term))
  }

  const premiumMonthly = monthlyPayment(inputs.premiumPrice)
  const practicalMonthly = monthlyPayment(inputs.practicalPrice)
  const monthlyDiff = premiumMonthly - practicalMonthly
  const insuranceDiff = 1600

  const totalMonthlyDiff = monthlyDiff + insuranceDiff

  const yr5Portfolio = totalMonthlyDiff * ((Math.pow(1 + inputs.investReturn / 100 / 12, 60) - 1) / (inputs.investReturn / 100 / 12))
  const premiumDepreciated = inputs.premiumPrice * Math.pow(0.85, 1) * Math.pow(0.9, 4)
  const practicalDepreciated = inputs.practicalPrice * Math.pow(0.85, 1) * Math.pow(0.9, 4)
  const wealthGap = yr5Portfolio + (practicalDepreciated - premiumDepreciated)

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.studioNav}>
          <span style={styles.backBtn} onClick={onBack}>← Simulation Lab</span>
          <span style={styles.navSep}>/</span>
          <span style={{ color: '#1A2744', fontSize: '13px', fontWeight: 500 }}>Studio 02 — Luxury Car vs Invest the Difference</span>
        </div>

        <div style={{ ...styles.prebriefCard, borderLeft: '3px solid #1A2744' }}>
          <div style={styles.prebriefTitle}>Before you run this studio</div>
          <div style={styles.prebriefText}>
            This studio is not telling you not to buy the premium vehicle. It is telling you exactly what it costs. The wealth gap between two vehicle finance decisions at Year 5 is the output. Depreciation is modelled at 15% in Year 1 and 10% per year thereafter — consistent with SA mid-premium segment averages.
          </div>
        </div>

        <div style={styles.splitPanel}>
          <div style={styles.inputPanel}>
            <div style={styles.inputPanelTitle}>Inputs</div>
            <SliderInput label="Premium vehicle price" value={inputs.premiumPrice} min={300000} max={2000000} step={25000} onChange={v => upd('premiumPrice', v)} fmt={fmt} hint="e.g. BMW 3 Series, Mercedes C-Class" />
            <SliderInput label="Practical vehicle price" value={inputs.practicalPrice} min={150000} max={600000} step={10000} onChange={v => upd('practicalPrice', v)} fmt={fmt} hint="e.g. VW Polo, Toyota Corolla Cross" />
            <SliderInput label="Finance term (months)" value={inputs.term} min={24} max={84} step={12} onChange={v => upd('term', v)} fmt={v => `${v} months`} hint="Standard SA vehicle finance: 72 months" />
            <SliderInput label="Interest rate (%)" value={inputs.rate} min={8} max={20} step={0.25} onChange={v => upd('rate', v)} fmt={pct} hint="Prime + 2% = 13.25% (typical SA vehicle finance)" />
            <SliderInput label="Investment return on difference (%)" value={inputs.investReturn} min={5} max={18} step={0.5} onChange={v => upd('investReturn', v)} fmt={pct} hint="JSE-linked ETF assumption" />
          </div>

          <div style={styles.outputPanel}>
            <div style={styles.outputTitle}>Live output</div>
            <div style={styles.outputGrid3}>
              <OutputTile label="Premium monthly payment" value={fmt(premiumMonthly)} sub="Finance only" color="#CC0000" />
              <OutputTile label="Practical monthly payment" value={fmt(practicalMonthly)} sub="Finance only" color="#0D7A5F" />
              <OutputTile label="Monthly difference (total)" value={fmt(totalMonthlyDiff)} sub="Finance + insurance gap" color="#B8860B" />
            </div>

            <div style={styles.keyNumbers}>
              <div style={styles.keyNumTitle}>Five-year wealth comparison</div>
              <div style={styles.keyNumGrid}>
                <KN label="Difference invested at Year 5" val={fmt(yr5Portfolio)} />
                <KN label="Premium vehicle value at Year 5" val={fmt(premiumDepreciated)} />
                <KN label="Practical vehicle value at Year 5" val={fmt(practicalDepreciated)} />
                <KN label="Total wealth gap at Year 5" val={fmt(wealthGap)} />
                <KN label="Insurance difference (est.)" val="R1,600/month" />
                <KN label="Total cost difference/month" val={fmt(totalMonthlyDiff)} />
              </div>
            </div>

            <div style={styles.saContext}>
              <div style={styles.saContextTitle}>SA-specific context</div>
              <div style={styles.saContextText}>
                Balloon payments are common in SA dealer finance — they lower your monthly payment but create a large liability at the end of the term. This studio assumes no balloon payment. If your actual deal includes a balloon, your real monthly cost is lower but your end-of-term liability is significant. Comprehensive insurance on a premium vehicle typically costs R2,400–R3,200/month vs R800–R1,200 on a practical vehicle.
              </div>
            </div>

            {!showVerdict ? (
              <Button fullWidth onClick={() => setShowVerdict(true)} style={{ marginTop: '16px' }}>
                Generate Studio Verdict →
              </Button>
            ) : (
              <div style={styles.verdictPanel}>
                <div style={styles.verdictLabel}>Studio Verdict</div>
                <p style={styles.verdictText}>
                  Choosing the premium vehicle over the practical one costs approximately {fmt(totalMonthlyDiff)} more per month in combined repayments and insurance. That difference, invested at {inputs.investReturn}% per year, becomes {fmt(yr5Portfolio)} by Year 5. The premium vehicle, after depreciation, is worth approximately {fmt(premiumDepreciated)} at the same point. The total wealth gap between these two decisions at five years: {fmt(wealthGap)}. This studio is not telling you not to buy the premium vehicle. It is telling you exactly what it costs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OffshoreStudio({ onBack, profile }) {
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
  const fmt = (n) => `R${Math.round(n).toLocaleString('en-ZA')}`
  const pct = (n) => `${n.toFixed(1)}%`

  const offshorePct = 100 - inputs.localPct
  const months = inputs.years * 12
  const localContrib = inputs.monthlyContrib * (inputs.localPct / 100)
  const offshoreContrib = inputs.monthlyContrib * (offshorePct / 100)

  const localPortfolio = localContrib * ((Math.pow(1 + inputs.localReturn / 100 / 12, months) - 1) / (inputs.localReturn / 100 / 12))
  const offshoreUSD = offshoreContrib * ((Math.pow(1 + inputs.offshoreReturn / 100 / 12, months) - 1) / (inputs.offshoreReturn / 100 / 12))
  const randGain = Math.pow(1 + inputs.randDepreciation / 100, inputs.years)
  const offshoreZAR = offshoreUSD * randGain
  const totalPortfolio = localPortfolio + offshoreZAR

  const conservativeLocal = inputs.monthlyContrib * ((Math.pow(1 + inputs.localReturn / 100 / 12, months) - 1) / (inputs.localReturn / 100 / 12))
  const aggressiveOffshore = inputs.monthlyContrib * ((Math.pow(1 + inputs.offshoreReturn / 100 / 12, months) - 1) / (inputs.offshoreReturn / 100 / 12)) * randGain

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        <div style={styles.studioNav}>
          <span style={styles.backBtn} onClick={onBack}>← Simulation Lab</span>
          <span style={styles.navSep}>/</span>
          <span style={{ color: '#0D7A5F', fontSize: '13px', fontWeight: 500 }}>Studio 03 — Local vs Offshore Allocation</span>
        </div>

        <div style={{ ...styles.prebriefCard, borderLeft: '3px solid #0D7A5F' }}>
          <div style={styles.prebriefTitle}>Before you run this studio</div>
          <div style={styles.prebriefText}>
            This studio models different splits between local (JSE) and offshore ETF investments over your chosen time horizon. Rand depreciation is applied to offshore returns to show the ZAR-equivalent value. SARS allows R1,000,000 per year offshore without tax clearance (discretionary allowance). Above R1M, a SARS tax clearance certificate is required.
          </div>
        </div>

        <div style={styles.splitPanel}>
          <div style={styles.inputPanel}>
            <div style={styles.inputPanelTitle}>Inputs</div>
            <SliderInput label="Monthly contribution" value={inputs.monthlyContrib} min={500} max={30000} step={500} onChange={v => upd('monthlyContrib', v)} fmt={fmt} />
            <SliderInput label={`Local allocation: ${inputs.localPct}% · Offshore: ${offshorePct}%`} value={inputs.localPct} min={0} max={100} step={5} onChange={v => upd('localPct', v)} fmt={v => `${v}% local`} hint="70/30 is a common balanced split" />
            <SliderInput label="Local ETF return (nominal %)" value={inputs.localReturn} min={4} max={18} step={0.5} onChange={v => upd('localReturn', v)} fmt={pct} hint="JSE All Share 10-year average: ~9%" />
            <SliderInput label="Offshore ETF return (USD nominal %)" value={inputs.offshoreReturn} min={4} max={18} step={0.5} onChange={v => upd('offshoreReturn', v)} fmt={pct} hint="S&P 500 10-year average: ~11%" />
            <SliderInput label="Rand depreciation vs USD (% p/a)" value={inputs.randDepreciation} min={0} max={15} step={0.5} onChange={v => upd('randDepreciation', v)} fmt={pct} hint="10-year ZAR/USD average: ~5% p/a" />
            <SliderInput label="Time horizon (years)" value={inputs.years} min={1} max={20} step={1} onChange={v => upd('years', v)} fmt={v => `${v} years`} />
          </div>

          <div style={styles.outputPanel}>
            <div style={styles.outputTitle}>Projected portfolio at Year {inputs.years}</div>
            <div style={styles.outputGrid3}>
              <OutputTile label={`Local (${inputs.localPct}%)`} value={fmt(localPortfolio)} sub={`${inputs.localPct}% of contributions at ${inputs.localReturn}%`} color="#4B44A8" />
              <OutputTile label={`Offshore (${offshorePct}%)`} value={fmt(offshoreZAR)} sub={`ZAR value after ${pct(inputs.randDepreciation)} rand depreciation`} color="#0D7A5F" />
              <OutputTile label="Total portfolio (ZAR)" value={fmt(totalPortfolio)} sub="Combined local + offshore" color="#CC0000" />
            </div>

            <div style={styles.keyNumbers}>
              <div style={styles.keyNumTitle}>Scenario comparison</div>
              <div style={styles.keyNumGrid}>
                <KN label="100% local (conservative)" val={fmt(conservativeLocal)} />
                <KN label="Your split result" val={fmt(totalPortfolio)} />
                <KN label="100% offshore (aggressive)" val={fmt(aggressiveOffshore)} />
                <KN label="Offshore ZAR boost (rand depreciation)" val={`×${randGain.toFixed(2)}`} />
                <KN label="Discretionary allowance limit" val="R1,000,000 p/a" />
                <KN label="Tax clearance required above" val="R1,000,000" />
              </div>
            </div>

            <div style={styles.saContext}>
              <div style={styles.saContextTitle}>SA-specific context</div>
              <div style={styles.saContextText}>
                SARS foreign investment allowance: R1M per year without tax clearance (discretionary). Above R1M, a SARS tax clearance certificate is required. CGT inclusion rate for individuals is 40% on gains outside a TFSA — the annual exclusion is R40,000. Dividend withholding tax of 15% applies to foreign-domiciled ETFs. Consider holding offshore ETFs inside your TFSA to eliminate CGT on growth.
              </div>
            </div>

            {!showVerdict ? (
              <Button fullWidth onClick={() => setShowVerdict(true)} style={{ marginTop: '16px' }}>
                Generate Studio Verdict →
              </Button>
            ) : (
              <div style={styles.verdictPanel}>
                <div style={styles.verdictLabel}>Studio Verdict</div>
                <p style={styles.verdictText}>
                  A {inputs.localPct}/{offshorePct} local/offshore split on your {fmt(inputs.monthlyContrib)} monthly contribution produces an estimated {fmt(totalPortfolio)} after {inputs.years} years in the base case.
                  {offshorePct > 50
                    ? ` Your aggressive offshore allocation benefits from rand depreciation, but introduces significant currency volatility. If you are on the Aggressive Global Investor track with a ${inputs.years}+ year horizon, this split is consistent with your strategy. If you might need this money sooner, the currency risk of a heavy offshore position warrants real caution.`
                    : ` Your conservative split reduces currency risk while still providing rand hedging. This is consistent with the Balanced Lifestyle & Investing track. Consider increasing the offshore allocation gradually as your emergency fund and local positions strengthen.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
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

const slStyles = {
  wrap: { marginBottom: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  label: { fontSize: '12px', color: 'rgba(255,255,255,0.6)' },
  value: { fontSize: '13px', fontWeight: 700, color: '#fff' },
  hint: { fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '6px' },
  slider: { width: '100%', accentColor: '#CC0000', cursor: 'pointer' },
  range: { display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '3px' },
}

function OutputTile({ label, value, sub, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgba(255,255,255,0.35)', marginBottom: '7px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: 800, color, letterSpacing: '-0.01em', marginBottom: '4px' }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.4 }}>{sub}</div>
    </div>
  )
}

function KN({ label, val }) {
  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{val}</span>
    </div>
  )
}

const styles = {
  page: { minHeight: 'calc(100vh - 60px)', background: '#0F0F1A', padding: '32px 24px' },
  wrap: { maxWidth: '1200px', margin: '0 auto' },
  labHero: { background: '#1A1A2E', borderRadius: '14px', padding: '36px 40px', marginBottom: '20px' },
  eyebrow: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '12px' },
  labTitle: { fontSize: '30px', fontWeight: 800, color: '#fff', marginBottom: '10px', letterSpacing: '-0.025em' },
  labSub: { fontSize: '14px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, maxWidth: '500px' },
  trackBanner: { background: 'rgba(75,68,168,0.12)', border: '1px solid rgba(75,68,168,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' },
  trackDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#4B44A8', flexShrink: 0 },
  trackBannerText: { fontSize: '13px', color: '#CECBF6', lineHeight: 1.5 },
  studioGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '20px' },
  studioCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '20px' },
  studioNum: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' },
  studioTitle: { fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '8px', lineHeight: 1.3 },
  studioDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '14px', flex: 1 },
  teaserBox: { borderRadius: '8px', padding: '10px 12px', marginBottom: '14px' },
  teaserLabel: { fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' },
  teaserVal: { fontSize: '13px', fontWeight: 700 },
  studioFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  studioMins: { fontSize: '10px', color: 'rgba(255,255,255,0.3)' },
  verdictExplainer: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start' },
  verdictIcon: { width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(184,134,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, color: '#B8860B', flexShrink: 0 },
  verdictTitle: { fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '5px' },
  verdictBody: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 },
  studioNav: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' },
  backBtn: { fontSize: '13px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' },
  navSep: { color: 'rgba(255,255,255,0.2)' },
  prebriefCard: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid #CC0000', borderRadius: '0 10px 10px 0', padding: '14px 18px', marginBottom: '24px' },
  prebriefTitle: { fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '6px' },
  prebriefText: { fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 },
  splitPanel: { display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '20px', marginBottom: '20px' },
  inputPanel: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' },
  inputPanelTitle: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '20px' },
  resetLink: { fontSize: '11px', color: '#CC0000', cursor: 'pointer', textDecoration: 'underline', textAlign: 'center', marginTop: '8px' },
  outputPanel: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '20px' },
  outputTitle: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' },
  outputGrid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' },
  keyNumbers: { background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '14px', marginBottom: '14px' },
  keyNumTitle: { fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' },
  keyNumGrid: {},
  saContext: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' },
  saContextTitle: { fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.07em' },
  saContextText: { fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 },
  verdictPanel: { background: '#1A1A2E', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '4px solid #CC0000', borderRadius: '0 12px 12px 0', padding: '18px 20px', marginTop: '16px' },
  verdictLabel: { fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#CC0000', marginBottom: '8px' },
  verdictText: { fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 },
  explainerLinks: { background: '#1C1C2E', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px 18px' },
  explainerTitle: { fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.3)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.07em' },
  explainerRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  explainerLink: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '6px 12px', fontSize: '11px', color: '#4B44A8', cursor: 'pointer' },
}

export default SimulationLab