// Nudge system hook
// Generates contextual financial nudges based on user profile and selected track
// Nudges are prioritised by urgency and capped at 2 visible at a time

import { useMemo } from 'react'

const URGENCY = { alert: 4, warning: 3, info: 2, success: 1 }

export function useNudges({ profile, selectedTrack, takeHome, fixedCostLoad, netWorth }) {
  const nudges = useMemo(() => {
    const generated = []

    if (!profile || !takeHome) return []

    // Fixed cost load nudges
    if (fixedCostLoad > 75) {
      generated.push({
        id: 'fixed-cost-critical',
        type: 'alert',
        color: '#CC0000',
        bg: 'rgba(204,0,0,0.08)',
        title: 'Fixed costs critical',
        text: `Your fixed costs are at ${fixedCostLoad}% of take-home — significantly above the 75% danger zone. You have almost no room to save or invest.`,
        action: 'Edit snapshot',
        actionRoute: '/snapshot',
      })
    } else if (fixedCostLoad > 60) {
      generated.push({
        id: 'fixed-cost-warning',
        type: 'warning',
        color: '#B8860B',
        bg: 'rgba(184,134,11,0.08)',
        title: 'Fixed costs above ceiling',
        text: `Your fixed costs are at ${fixedCostLoad}% of take-home — above the recommended 60% ceiling. Keep an eye on lifestyle creep.`,
        action: 'View snapshot',
        actionRoute: '/snapshot',
      })
    }

    // Vehicle finance nudge
    const vehiclePct = takeHome > 0
      ? Math.round((profile.vehicleFinance / takeHome) * 100)
      : 0
    if (vehiclePct > 15) {
      generated.push({
        id: 'vehicle-high',
        type: 'warning',
        color: '#B8860B',
        bg: 'rgba(184,134,11,0.08)',
        title: 'Vehicle finance above benchmark',
        text: `Your vehicle finance is ${vehiclePct}% of take-home — above the 15% benchmark. This reduces your qualifying bond amount.`,
        action: 'Run car studio',
        actionRoute: '/simulation/car',
      })
    }

    // No investments nudge
    if (!profile.tfsaBalance && !profile.raBalance && profile.grossSalary > 0) {
      generated.push({
        id: 'no-investments',
        type: 'info',
        color: '#4B44A8',
        bg: 'rgba(75,68,168,0.08)',
        title: 'No investments started',
        text: `You haven't started a TFSA or RA yet. Every month of delay in your mid-twenties has a compounding cost that is hard to recover later.`,
        action: 'View tracks',
        actionRoute: '/tracks',
      })
    }

    // Net worth positive milestone
    if (netWorth > 0 && netWorth < 50000) {
      generated.push({
        id: 'net-worth-positive',
        type: 'success',
        color: '#0D7A5F',
        bg: 'rgba(13,122,95,0.08)',
        title: 'Net worth positive',
        text: `Your net worth is positive at R${Math.round(netWorth).toLocaleString('en-ZA')}. This is a meaningful milestone — keep building.`,
        action: null,
      })
    }

    // Credit card debt nudge
    if (profile.creditCardDebt > 0) {
      generated.push({
        id: 'credit-card',
        type: 'warning',
        color: '#B8860B',
        bg: 'rgba(184,134,11,0.08)',
        title: 'Credit card balance',
        text: `You're carrying a revolving credit card balance. At ~20% p/a interest, this costs more than most investments earn. Clear this first.`,
        action: 'View tracks',
        actionRoute: '/tracks',
      })
    }

    // TFSA annual limit approaching
    if (profile.tfsaBalance > 30000 && profile.tfsaBalance < 36000) {
      generated.push({
        id: 'tfsa-limit',
        type: 'info',
        color: '#4B44A8',
        bg: 'rgba(75,68,168,0.08)',
        title: 'TFSA limit approaching',
        text: `Your TFSA has R${(36000 - profile.tfsaBalance).toLocaleString('en-ZA')} of annual allowance remaining. Unused allowance does not roll over after February.`,
        action: null,
      })
    }

    // Track conflict nudge
    if (selectedTrack === 'property-path' && profile.vehicleDebt > 200000) {
      generated.push({
        id: 'track-conflict-vehicle',
        type: 'alert',
        color: '#CC0000',
        bg: 'rgba(204,0,0,0.08)',
        title: 'Track conflict detected',
        text: `You're on the Property Path but have significant vehicle debt. This reduces your qualifying bond amount and delays your deposit timeline.`,
        action: 'View property studio',
        actionRoute: '/simulation/property',
      })
    }

    // Sort by urgency and return top nudges
    return generated.sort((a, b) => URGENCY[b.type] - URGENCY[a.type])
  }, [profile, selectedTrack, takeHome, fixedCostLoad, netWorth])

  return nudges
}

export default useNudges