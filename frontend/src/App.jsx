import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage from './pages/Landing'
import Dashboard from './pages/Dashboard';
import GameCanvas from './components/GameCanvas';
import GamePage from './pages/GamePage';
import HallOfFame from './pages/HallOfFame';
import Profile from './pages/Profile';
import FogOfWar from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard/' element={<Dashboard />} />
        <Route path='/game/' element={<GameCanvas />} />
        <Route path='/leaderboard' element={<HallOfFame />} />
        <Route path='/profile' element={<Profile />} />

        <Route path='/test-game/' element={<GamePage />} />

        <Route path='/fog-of-war/' element={<FogOfWar />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App;