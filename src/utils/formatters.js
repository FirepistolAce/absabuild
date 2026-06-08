// Currency and number formatting utilities for ZAR
// Used consistently across all components instead of inline formatting

export const formatZAR = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'R0'
  const absAmount = Math.abs(Math.round(amount))
  const formatted = absAmount.toLocaleString('en-ZA')
  return amount < 0 ? `-R${formatted}` : `R${formatted}`
}

export const formatZARShort = (amount) => {
  if (!amount || isNaN(amount)) return 'R0'
  const abs = Math.abs(amount)
  if (abs >= 1000000) return `R${(amount / 1000000).toFixed(1)}M`
  if (abs >= 1000) return `R${(amount / 1000).toFixed(0)}K`
  return formatZAR(amount)
}

export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

export const formatMonths = (months) => {
  if (!months || months <= 0) return '0 months'
  const years = Math.floor(months / 12)
  const remaining = months % 12
  if (years === 0) return `${remaining} month${remaining !== 1 ? 's' : ''}`
  if (remaining === 0) return `${years} year${years !== 1 ? 's' : ''}`
  return `${years}yr ${remaining}mo`
}

export const formatNumber = (n) => {
  if (!n || isNaN(n)) return '0'
  return Math.round(n).toLocaleString('en-ZA')
}