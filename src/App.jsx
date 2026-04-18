import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './Contexts/UserContext'
import Navigation from './Components/Navigation'
import HomePage from './Pages/HomePage'
import MoneySnapshot from './Pages/MoneySnapshot'
import StrategyTrack from './Pages/StrategyTrack'
import SimulationLab from './Pages/SimulationLab'
import './App.css'

function App() {
  return (
    <UserProvider>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/snapshot" element={<MoneySnapshot />} />
            <Route path="/tracks" element={<StrategyTrack />} />
            <Route path="/tracks/:trackId" element={<StrategyTrack />} />
            <Route path="/simulation" element={<SimulationLab />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </UserProvider>
  )
}

export default App