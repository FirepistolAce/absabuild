// Transfer duty calculation - SARS sliding scale
// This was flagged as incorrect in the MVP - fixed here with full band structure
// Source: SARS Transfer Duty Guide 2024/25

export const calculateTransferDuty = (propertyPrice) => {
  if (!propertyPrice || propertyPrice <= 0) return 0

  // Band 1: R0 - R1,100,000 = 0%
  if (propertyPrice <= 1100000) {
    return 0
  }

  // Band 2: R1,100,001 - R1,512,500 = 3% on amount above R1,100,000
  if (propertyPrice <= 1512500) {
    return (propertyPrice - 1100000) * 0.03
  }

  // Band 3: R1,512,501 - R2,117,500 = R12,375 + 6% on amount above R1,512,500
  if (propertyPrice <= 2117500) {
    return 12375 + (propertyPrice - 1512500) * 0.06
  }

  // Band 4: R2,117,501 - R2,722,500 = R48,675 + 8% on amount above R2,117,500
  if (propertyPrice <= 2722500) {
    return 48675 + (propertyPrice - 2117500) * 0.08
  }

  // Band 5: R2,722,501 - R12,100,000 = R97,075 + 11% on amount above R2,722,500
  if (propertyPrice <= 12100000) {
    return 97075 + (propertyPrice - 2722500) * 0.11
  }

  // Band 6: Above R12,100,000 = R1,128,600 + 13% on amount above R12,100,000
  return 1128600 + (propertyPrice - 12100000) * 0.13
}

export const getBondRegistrationCost = (bondAmount) => {
  // Approximate bond registration cost - typically 1-1.5% of bond value
  if (!bondAmount || bondAmount <= 0) return 0
  return Math.round(bondAmount * 0.012)
}

export const getConveyancingCost = (propertyPrice) => {
  // Approximate conveyancing fees
  if (!propertyPrice || propertyPrice <= 0) return 0
  if (propertyPrice <= 500000) return 8000
  if (propertyPrice <= 1000000) return 12000
  if (propertyPrice <= 2000000) return 18000
  if (propertyPrice <= 5000000) return 25000
  return 35000
}

export const getTotalUpfrontCosts = (propertyPrice, deposit) => {
  const bondAmount = propertyPrice - deposit
  const transferDuty = calculateTransferDuty(propertyPrice)
  const bondReg = getBondRegistrationCost(bondAmount)
  const conveyancing = getConveyancingCost(propertyPrice)
  return {
    deposit,
    transferDuty: Math.round(transferDuty),
    bondRegistration: bondReg,
    conveyancing,
    total: Math.round(deposit + transferDuty + bondReg + conveyancing),
  }
}