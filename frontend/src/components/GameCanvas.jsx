// src/components/GameCanvas.jsx
import { useState, useEffect } from 'react';
import GameMap from './GameMap';
import HUD from './HUD';
import GameEntities from './GameEntities';
import SuccessModal from './SuccessModal';
import FailModal from './FailModal';

export default function GameCanvas() {
  const [gameTime, setGameTime] = useState(180);
  const [health, setHealth] = useState(85);
  const [ammo, setAmmo] = useState(30);
  const [totalLoot, setTotalLoot] = useState(2.35);
  const [gameLogs, setGameLogs] = useState([
    { id: 1, message: 'PlayerX eliminated PlayerY', type: 'kill', timestamp: Date.now() - 3000 },
    { id: 2, message: 'You collected +0.5 SOL', type: 'loot', timestamp: Date.now() - 2000 },
  ]);
  
  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailModal, setShowFailModal] = useState(false);
  const [gameResult, setGameResult] = useState(null);

  // Game timer
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleGameEnd('success');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate game events
  useEffect(() => {
    // Simulate player death after 30 seconds for testing
    const deathTimer = setTimeout(() => {
      // Uncomment to test fail modal
      // handleGameEnd('fail', 'Nemesis', 1.5);
    }, 30000);

    return () => clearTimeout(deathTimer);
  }, []);

  const handleGameEnd = (result, killedBy = null, lootAmount = null) => {
    if (result === 'success') {
      setGameResult({ type: 'success', lootEarned: totalLoot });
      setShowSuccessModal(true);
    } else {
      setGameResult({ 
        type: 'fail', 
        killedBy: killedBy || 'EnemyPlayer', 
        lootLost: lootAmount || totalLoot 
      });
      setShowFailModal(true);
    }
  };

  const handleReturnToDashboard = () => {
    setShowSuccessModal(false);
    setShowFailModal(false);
    setGameResult(null);
    // Navigate back to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-hidden font-display">
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* Main Game Container */}
        <div className="relative w-[1200px] h-[800px] bg-gradient-to-br from-[#1a3a19] to-[#0f2a0e] border-2 border-[#314625] overflow-hidden">
          
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 223, 32, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 223, 32, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>

          <GameMap />
          <GameEntities />
          <HUD 
            gameTime={gameTime}
            health={health}
            ammo={ammo}
            totalLoot={totalLoot}
            gameLogs={gameLogs}
          />

        </div>

        {/* Success Modal */}
        <SuccessModal 
          isOpen={showSuccessModal}
          onClose={handleReturnToDashboard}
          lootEarned={gameResult?.lootEarned || 0}
        />

        {/* Fail Modal */}
        <FailModal 
          isOpen={showFailModal}
          onClose={handleReturnToDashboard}
          killedBy={gameResult?.killedBy || 'EnemyPlayer'}
          lootLost={gameResult?.lootLost || 0}
        />

      </div>
    </div>
  );
}