import { createContext, useContext, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const [profile, setProfile] = useState({
    name: '',
    grossSalary: 0,
    raContribution: 0,
    medicalAid: 0,
    rent: 0,
    vehicleFinance: 0,
    otherFixed: 0,
    studentDebt: 0,
    creditCardDebt: 0,
    vehicleDebt: 0,
    tfsaBalance: 0,
    raBalance: 0,
    savingsBalance: 0,
    depositGoal: 350000,
    depositTimelineYears: 3,
    emergencyFundGoal: 82200,
  })

  const [selectedTrack, setSelectedTrack] = useState(null)
  const [trackProgress, setTrackProgress] = useState({})
  const [snapshotComplete, setSnapshotComplete] = useState(false)

  const login = (name) => {
    setIsLoggedIn(true)
    setUser({ name })
    setProfile(prev => ({ ...prev, name }))
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setSelectedTrack(null)
    setSnapshotComplete(false)
  }

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const selectTrack = (trackId) => {
    setSelectedTrack(trackId)
  }

  const updateMilestone = (trackId, milestoneId, status) => {
    setTrackProgress(prev => ({
      ...prev,
      [trackId]: {
        ...(prev[trackId] || {}),
        [milestoneId]: status
      }
    }))
  }

  const calculateTakeHome = () => {
    const gross = profile.grossSalary
    if (!gross) return 0

    const annualGross = gross * 12
    const raDeduction = Math.min(
      profile.raContribution * 12,
      annualGross * 0.275,
      350000
    )
    const taxableIncome = annualGross - raDeduction

    let annualTax = 0
    if (taxableIncome <= 237100) {
      annualTax = taxableIncome * 0.18
    } else if (taxableIncome <= 370500) {
      annualTax = 42678 + (taxableIncome - 237100) * 0.26
    } else if (taxableIncome <= 512800) {
      annualTax = 77362 + (taxableIncome - 370500) * 0.31
    } else if (taxableIncome <= 673000) {
      annualTax = 121475 + (taxableIncome - 512800) * 0.36
    } else if (taxableIncome <= 857900) {
      annualTax = 179147 + (taxableIncome - 673000) * 0.39
    } else if (taxableIncome <= 1817000) {
      annualTax = 251258 + (taxableIncome - 857900) * 0.41
    } else {
      annualTax = 644489 + (taxableIncome - 1817000) * 0.45
    }

    const primaryRebate = 17235
    const medicalCredit = (profile.medicalAid > 0) ? 364 * 12 : 0
    const netAnnualTax = Math.max(0, annualTax - primaryRebate - medicalCredit)
    const monthlyTax = netAnnualTax / 12

    const uif = Math.min(gross * 0.01, 177.12)

    const takeHome = gross - monthlyTax - uif - profile.raContribution - profile.medicalAid
    return Math.round(takeHome)
  }

  const calculateNetWorth = () => {
    const assets = profile.tfsaBalance + profile.raBalance + profile.savingsBalance
    const liabilities = profile.studentDebt + profile.creditCardDebt + profile.vehicleDebt
    return assets - liabilities
  }

  const calculateFixedCostLoad = () => {
    const takeHome = calculateTakeHome()
    if (!takeHome) return 0
    const fixedCosts = profile.rent + profile.vehicleFinance + profile.otherFixed
    return Math.round((fixedCosts / takeHome) * 100)
  }

  return (
    <UserContext.Provider value={{
      isLoggedIn,
      user,
      profile,
      selectedTrack,
      trackProgress,
      snapshotComplete,
      login,
      logout,
      updateProfile,
      selectTrack,
      updateMilestone,
      setSnapshotComplete,
      calculateTakeHome,
      calculateNetWorth,
      calculateFixedCostLoad,
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}

export default UserContext