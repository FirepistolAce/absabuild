import { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { calculateMonthlyTakeHome } from '../utils/taxCalculations'

const UserContext = createContext(null)

const DEFAULT_PROFILE = {
  name: '',
  grossSalary: 0,
  raContribution: 0,
  medicalAid: 0,
  medicalDependants: 0,
  rent: 0,
  vehicleFinance: 0,
  insurance: 0,
  subscriptions: 0,
  groceries: 0,
  lifestyle: 0,
  otherFixed: 0,
  studentDebt: 0,
  creditCardDebt: 0,
  vehicleDebt: 0,
  personalLoanDebt: 0,
  tfsaBalance: 0,
  raBalance: 0,
  savingsBalance: 0,
  offshoreBalance: 0,
  depositGoal: 350000,
  depositTimelineYears: 3,
  emergencyFundGoal: 82200,
  emergencyFundSaved: 0,
  monthlyDepositSaving: 0,
}

export function UserProvider({ children }) {
  // Auth state — not persisted (login required each session)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // Persisted state via localStorage
  const [profile, setProfile] = useLocalStorage('absa_profile', DEFAULT_PROFILE)
  const [selectedTrack, setSelectedTrack] = useLocalStorage('absa_selected_track', null)
  const [trackProgress, setTrackProgress] = useLocalStorage('absa_track_progress', {})
  const [snapshotComplete, setSnapshotComplete] = useLocalStorage('absa_snapshot_complete', false)
  const [dismissedNudges, setDismissedNudges] = useLocalStorage('absa_dismissed_nudges', [])

  // Registered users stored in localStorage
  const [registeredUsers, setRegisteredUsers] = useLocalStorage('absa_registered_users', [])
  
// Passwords stored in localStorage for demo purposes only
// In production this would use a proper auth service
  const register = (name, email, password) => {
    const exists = registeredUsers.find(u => u.email === email)
    if (exists) return { success: false, error: 'An account with this email already exists.' }
    const newUser = { name, email, password }
    setRegisteredUsers([...registeredUsers, newUser])
    setIsLoggedIn(true)
    setUser({ name, email })
    setProfile(prev => ({ ...prev, name }))
    return { success: true }
  }

  const login = (email, password) => {
    const found = registeredUsers.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Incorrect email or password.' }
    setIsLoggedIn(true)
    setUser({ name: found.name, email: found.email })
    setProfile(prev => ({ ...prev, name: found.name }))
    return { success: true }
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  const updateProfile = (updates) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE)
    setSnapshotComplete(false)
  }

  const selectTrack = (trackId) => {
    setSelectedTrack(trackId)
  }

  const updateMilestone = (trackId, milestoneId, status) => {
    setTrackProgress(prev => ({
      ...prev,
      [trackId]: {
        ...(prev[trackId] || {}),
        [milestoneId]: status,
      },
    }))
  }

  const dismissNudge = (nudgeId) => {
    if (!dismissedNudges.includes(nudgeId)) {
      setDismissedNudges([...dismissedNudges, nudgeId])
    }
  }

  const clearDismissedNudges = () => setDismissedNudges([])

  // Financial calculations
  const calculateTakeHome = () => {
    return calculateMonthlyTakeHome({
      grossMonthly: profile.grossSalary,
      raContribution: profile.raContribution,
      medicalAid: profile.medicalAid,
      medicalDependants: profile.medicalDependants || 0,
    })
  }

  const calculateNetWorth = () => {
    const assets =
      (profile.tfsaBalance || 0) +
      (profile.raBalance || 0) +
      (profile.savingsBalance || 0) +
      (profile.offshoreBalance || 0)
    const liabilities =
      (profile.studentDebt || 0) +
      (profile.creditCardDebt || 0) +
      (profile.vehicleDebt || 0) +
      (profile.personalLoanDebt || 0)
    return assets - liabilities
  }

  const calculateFixedCostLoad = () => {
    const takeHome = calculateTakeHome()
    if (!takeHome) return 0
    const fixedCosts =
      (profile.rent || 0) +
      (profile.vehicleFinance || 0) +
      (profile.insurance || 0) +
      (profile.subscriptions || 0) +
      (profile.otherFixed || 0)
    return Math.round((fixedCosts / takeHome) * 100)
  }

  const calculateDebtToIncome = () => {
    if (!profile.grossSalary) return 0
    const monthlyDebtRepayments =
      (profile.vehicleFinance || 0) +
      (profile.studentDebt ? profile.studentDebt / 60 : 0) +
      (profile.creditCardDebt ? profile.creditCardDebt * 0.03 : 0)
    return Math.round((monthlyDebtRepayments / profile.grossSalary) * 100)
  }

  const calculateSavingsRate = () => {
    const takeHome = calculateTakeHome()
    if (!takeHome) return 0
    const monthlySavings =
      (profile.tfsaBalance ? profile.monthlyDepositSaving || 0 : 0) +
      (profile.raContribution || 0)
    return Math.round((monthlySavings / takeHome) * 100)
  }

  const calculateDisposableIncome = () => {
    const takeHome = calculateTakeHome()
    const fixedCosts =
      (profile.rent || 0) +
      (profile.vehicleFinance || 0) +
      (profile.insurance || 0) +
      (profile.subscriptions || 0) +
      (profile.groceries || 0) +
      (profile.otherFixed || 0)
    return takeHome - fixedCosts
  }

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        profile,
        selectedTrack,
        trackProgress,
        snapshotComplete,
        dismissedNudges,
        register,
        login,
        logout,
        updateProfile,
        resetProfile,
        selectTrack,
        updateMilestone,
        setSnapshotComplete,
        dismissNudge,
        clearDismissedNudges,
        calculateTakeHome,
        calculateNetWorth,
        calculateFixedCostLoad,
        calculateDebtToIncome,
        calculateSavingsRate,
        calculateDisposableIncome,
      }}
    >
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