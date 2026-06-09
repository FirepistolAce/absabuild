import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import Navigation from './components/layout/Navigation'
import Footer from './components/layout/Footer'
import LandingPage from './Pages/LandingPage'
import AuthPage from './Pages/AuthPage'
import DashboardPage from './Pages/DashboardPage'
import MoneySnapshot from './Pages/MoneySnapshot'
import StrategyTracks from './Pages/StrategyTracks'
import SimulationLab from './Pages/SimulationLab'
import GlossaryPage from './Pages/GlossaryPage'
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