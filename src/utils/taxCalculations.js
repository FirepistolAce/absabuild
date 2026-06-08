// SARS 2024/25 tax calculations
// Extracted from UserContext for reusability and testability
// Brackets verified against SARS website: https://www.sars.gov.za

const TAX_BRACKETS = [
  { min: 0, max: 237100, base: 0, rate: 0.18 },
  { min: 237101, max: 370500, base: 42678, rate: 0.26 },
  { min: 370501, max: 512800, base: 77362, rate: 0.31 },
  { min: 512801, max: 673000, base: 121475, rate: 0.36 },
  { min: 673001, max: 857900, base: 179147, rate: 0.39 },
  { min: 857901, max: 1817000, base: 251258, rate: 0.41 },
  { min: 1817001, max: Infinity, base: 644489, rate: 0.45 },
]

const PRIMARY_REBATE = 17235
const MEDICAL_CREDIT_MAIN = 364
const MEDICAL_CREDIT_DEPENDANT = 246
const UIF_RATE = 0.01
const UIF_CAP = 177.12

export const calculateAnnualTax = (annualTaxableIncome) => {
  if (!annualTaxableIncome || annualTaxableIncome <= 0) return 0
  const bracket = TAX_BRACKETS.find(
    b => annualTaxableIncome >= b.min && annualTaxableIncome <= b.max
  )
  if (!bracket) return 0
  return bracket.base + (annualTaxableIncome - bracket.min) * bracket.rate
}

export const calculateMonthlyTakeHome = ({
  grossMonthly = 0,
  raContribution = 0,
  medicalAid = 0,
  medicalDependants = 0,
}) => {
  if (!grossMonthly || grossMonthly <= 0) return 0

  const annualGross = grossMonthly * 12

  // RA deduction is pre-tax - reduces taxable income
  const annualRA = raContribution * 12
  const raDeductionCap = Math.min(annualGross * 0.275, 350000)
  const actualRADeduction = Math.min(annualRA, raDeductionCap)

  const taxableIncome = annualGross - actualRADeduction

  // Calculate annual tax using brackets
  const grossAnnualTax = calculateAnnualTax(taxableIncome)

  // Apply rebates - these reduce tax owed directly
  const medicalCredits =
    MEDICAL_CREDIT_MAIN * 12 +
    medicalDependants * MEDICAL_CREDIT_DEPENDANT * 12

  const netAnnualTax = Math.max(0, grossAnnualTax - PRIMARY_REBATE - medicalCredits)
  const monthlyTax = netAnnualTax / 12

  // UIF is 1% of gross capped at R177.12/month
  const uif = Math.min(grossMonthly * UIF_RATE, UIF_CAP)

  const takeHome = grossMonthly - monthlyTax - uif - raContribution - medicalAid

  return Math.round(Math.max(0, takeHome))
}

export const calculateEffectiveTaxRate = ({ grossMonthly, raContribution = 0 }) => {
  if (!grossMonthly) return 0
  const takeHome = calculateMonthlyTakeHome({ grossMonthly, raContribution })
  const totalDeductions = grossMonthly - takeHome
  return Math.round((totalDeductions / grossMonthly) * 100)
}

export const getMonthlyUIF = (grossMonthly) => {
  return Math.min(grossMonthly * UIF_RATE, UIF_CAP)
}

export const getMonthlyPAYE = ({ grossMonthly, raContribution = 0, medicalAid = 0, medicalDependants = 0 }) => {
  if (!grossMonthly) return 0
  const takeHome = calculateMonthlyTakeHome({ grossMonthly, raContribution, medicalAid, medicalDependants })
  const uif = getMonthlyUIF(grossMonthly)
  return Math.round(grossMonthly - takeHome - uif - raContribution - medicalAid)
}