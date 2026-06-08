import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import MoneySnapshot from './pages/MoneySnapshot'
import StrategyTracks from './pages/StrategyTracks'
import SimulationLab from './pages/SimulationLab'
import GlossaryPage from './pages/GlossaryPage'
import './App.css'

function App() {
  return (
    <UserProvider>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/snapshot" element={<MoneySnapshot />} />
            <Route path="/tracks" element={<StrategyTracks />} />
            <Route path="/tracks/:trackId" element={<StrategyTracks />} />
            <Route path="/simulation" element={<SimulationLab />} />
            <Route path="/simulation/:studioId" element={<SimulationLab />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </UserProvider>
  )
}

export default App