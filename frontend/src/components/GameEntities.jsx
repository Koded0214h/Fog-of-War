// src/components/GameEntities.jsx
export default function GameEntities() {
    return (
      <div className="absolute inset-0">
        
        {/* Enemy Player */}
        <div className="absolute top-40 right-72">
          <Player 
            name="EnemyPlayer1" 
            isEnemy={true}
            health={60}
            position={{ top: 'top-40', right: 'right-72' }}
          />
        </div>
  
        {/* Local Player */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Player 
            name="You" 
            isEnemy={false}
            health={100}
            position={{ top: 'top-1/2', left: 'left-1/2' }}
          />
        </div>
  
        {/* Loot Collection Effect */}
        <div className="absolute top-[45%] left-[55%] animate-float-up opacity-0">
          <p className="text-lg font-bold text-[#FFD700] drop-shadow-[0_0_10px_#000]">+1.25 SOL</p>
        </div>
  
        {/* Additional Enemy */}
        <div className="absolute bottom-48 left-32">
          <Player 
            name="EnemyPlayer2" 
            isEnemy={true}
            health={30}
            position={{ bottom: 'bottom-48', left: 'left-32' }}
          />
        </div>
  
      </div>
    );
  }
  
  // Reusable Player Component
  function Player({ name, isEnemy, health, position }) {
    const playerClass = isEnemy 
      ? "bg-gradient-to-b from-[#8b0000] to-[#660000] border-[#ff4444]"
      : "bg-gradient-to-b from-[#228b22] to-[#006400] border-[#ffd700] shadow-[0_0_20px_#ffd700] animate-pulse";
  
    const healthBarColor = isEnemy ? "bg-red-500" : "bg-green-500";
    
    return (
      <div className={`flex flex-col items-center ${position.top} ${position.bottom} ${position.left} ${position.right}`}>
        <p className="text-xs text-white bg-black/50 px-2 py-1 rounded mb-1">{name}</p>
        <div className={`w-12 h-12 rounded-full border-2 shadow-lg flex items-center justify-center ${playerClass}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isEnemy 
              ? "bg-gradient-to-br from-[#ff6b6b] to-[#ee5a52]" 
              : "bg-gradient-to-br from-[#32cd32] to-[#228b22]"
          }`}>
            <span className="material-icons text-white text-lg">person</span>
          </div>
        </div>
        <div className="w-16 h-1 bg-gray-600 rounded-full mt-1">
          <div 
            className={`h-full rounded-full ${healthBarColor}`}
            style={{ width: `${health}%` }}
          ></div>
        </div>
      </div>
    );
  }