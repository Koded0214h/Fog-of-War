// src/components/HUD.jsx
import Timer from './Timer';
import HealthBar from './HealthBar';
import AmmoLoot from './AmmoLoot';
import GameLogs from './GameLogs';
import MobileControls from './MobileControls';

export default function HUD({ gameTime, health, ammo, totalLoot, gameLogs }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
      
      {/* Top Center - Timer */}
      <Timer gameTime={gameTime} />
      
      {/* Top Left - Game Info */}
      <div className="flex flex-col gap-4 items-start">
        <HealthBar health={health} />
        <AmmoLoot ammo={ammo} totalLoot={totalLoot} />
      </div>

      {/* Top Right - Game Logs */}
      <GameLogs gameLogs={gameLogs} />

      {/* Mobile Controls */}
      <MobileControls />

    </div>
  );
}