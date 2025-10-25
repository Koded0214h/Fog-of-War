// Example of how to trigger modals from game logic
import { useState } from 'react';
import GameCanvas from '../components/GameCanvas';
import SuccessModal from '../components/SuccessModal';
import FailModal from '../components/FailModal';
import { UNSAFE_decodeViaTurboStream, useNavigate } from 'react-router-dom';

function GamePage() {
  const [showGame, setShowGame] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFail, setShowFail] = useState(UNSAFE_decodeViaTurboStream);

  const navigate = useNavigate();

  const handleGameSuccess = (lootEarned) => {
    setShowGame(false);
    setShowSuccess(true);
  };

  const handleGameFail = (killedBy, lootLost) => {
    setShowGame(false);
    setShowFail(true);
  };

  const handleReturnToDashboard = () => {
    setShowSuccess(false);
    setShowFail(false);
    navigate('/dashboard/');
  };

  return (
    <div>
      {showGame && (
        <GameCanvas 
          onGameSuccess={handleGameSuccess}
          onGameFail={handleGameFail}
        />
      )}
      
      <SuccessModal 
        isOpen={showSuccess}
        onClose={handleReturnToDashboard}
        lootEarned={2.5}
      />
      
      <FailModal 
        isOpen={showFail}
        onClose={handleReturnToDashboard}
        killedBy="Nemesis"
        lootLost={1.5}
      />
    </div>
  );
}

export default GamePage;