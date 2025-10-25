// src/components/GameMap.jsx
export default function GameMap() {
    return (
      <div className="absolute inset-0">
        
        {/* Destroyed Building - Using SVG */}
        <div className="absolute top-20 left-40 w-48 h-32">
          <Building />
        </div>
  
        {/* Military Vehicle - Using SVG */}
        <div className="absolute bottom-40 left-60 w-40 h-24">
          <MilitaryVehicle />
        </div>
  
        {/* Sandbag Wall - Using SVG */}
        <div className="absolute top-1/2 right-80 w-64 h-16">
          <SandbagWall />
        </div>
  
        {/* Destroyed Tree - Using SVG */}
        <div className="absolute top-32 right-48 w-16 h-24">
          <DestroyedTree />
        </div>
  
        {/* Rock Formation - Using SVG */}
        <div className="absolute bottom-32 right-48 w-24 h-20">
          <RockFormation />
        </div>
  
        {/* Water Puddle - Using SVG */}
        <div className="absolute bottom-20 left-80 w-32 h-20">
          <WaterPuddle />
        </div>
  
        {/* Concrete Barrier - Using SVG */}
        <div className="absolute top-64 left-96 w-16 h-28">
          <ConcreteBarrier />
        </div>
  
        {/* Additional Crates */}
        <div className="absolute top-80 left-40">
          <MilitaryCrate />
        </div>
  
        <div className="absolute bottom-60 right-60">
          <AmmoCrate />
        </div>
  
        {/* Debris Pile */}
        <div className="absolute bottom-80 right-40 w-20 h-16">
          <DebrisPile />
        </div>
  
      </div>
    );
  }
  
  // SVG Asset Components
  function Building() {
    return (
      <svg viewBox="0 0 200 150" className="w-full h-full">
        <defs>
          <linearGradient id="buildingGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8c8c8c" />
            <stop offset="100%" stopColor="#666666" />
          </linearGradient>
          <pattern id="brickPattern" patternUnits="userSpaceOnUse" width="20" height="10">
            <rect width="20" height="10" fill="#7a7a7a"/>
            <path d="M0 10 L20 10 L20 0" stroke="#8c8c8c" strokeWidth="1" fill="none"/>
          </pattern>
        </defs>
        
        {/* Main Building Structure */}
        <rect x="10" y="30" width="180" height="120" fill="url(#brickPattern)" rx="2"/>
        
        {/* Roof */}
        <rect x="5" y="25" width="190" height="8" fill="#a6a6a6" rx="1"/>
        
        {/* Windows */}
        <rect x="25" y="50" width="25" height="20" fill="#4d4d4d" rx="1"/>
        <rect x="65" y="50" width="25" height="20" fill="#4d4d4d" rx="1"/>
        <rect x="105" y="50" width="25" height="20" fill="#4d4d4d" rx="1"/>
        <rect x="145" y="50" width="25" height="20" fill="#4d4d4d" rx="1"/>
        
        {/* Door */}
        <rect x="85" y="90" width="30" height="60" fill="#5c5c5c" rx="1"/>
        
        {/* Damage/Cracks */}
        <path d="M40 30 L60 15 L75 30" fill="#ff6b6b" opacity="0.3"/>
        <path d="M120 25 L135 10 L150 25" fill="#ff6b6b" opacity="0.2"/>
      </svg>
    );
  }
  
  function MilitaryVehicle() {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full">
        <defs>
          <linearGradient id="vehicleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#556B2F" />
            <stop offset="100%" stopColor="#3d4d23" />
          </linearGradient>
        </defs>
        
        {/* Main Body */}
        <rect x="20" y="40" width="160" height="50" fill="url(#vehicleGradient)" rx="5"/>
        
        {/* Cabin */}
        <rect x="100" y="20" width="60" height="30" fill="url(#vehicleGradient)" rx="3"/>
        
        {/* Wheels */}
        <circle cx="50" cy="95" r="12" fill="#2f4f4f" stroke="#1a1a1a" strokeWidth="2"/>
        <circle cx="150" cy="95" r="12" fill="#2f4f4f" stroke="#1a1a1a" strokeWidth="2"/>
        
        {/* Gun Turret */}
        <circle cx="130" cy="35" r="8" fill="#4a4a4a"/>
        <rect x="128" y="20" width="4" height="15" fill="#4a4a4a"/>
        
        {/* Headlights */}
        <circle cx="180" cy="45" r="4" fill="#ffd700"/>
        <circle cx="180" cy="65" r="4" fill="#ffd700"/>
        
        {/* Camouflage Pattern */}
        <path d="M40 45 L60 50 L55 65 Z" fill="#6b8e23" opacity="0.6"/>
        <path d="M120 45 L140 40 L135 55 Z" fill="#8fbc8f" opacity="0.4"/>
      </svg>
    );
  }
  
  function SandbagWall() {
    return (
      <svg viewBox="0 0 300 80" className="w-full h-full">
        <defs>
          <linearGradient id="sandbagGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#deb887" />
            <stop offset="100%" stopColor="#cd853f" />
          </linearGradient>
        </defs>
        
        {/* Sandbag Row 1 */}
        <ellipse cx="30" cy="20" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="80" cy="20" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="130" cy="20" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="180" cy="20" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="230" cy="20" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="280" cy="20" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        
        {/* Sandbag Row 2 */}
        <ellipse cx="55" cy="40" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="105" cy="40" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="155" cy="40" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="205" cy="40" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="255" cy="40" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        
        {/* Sandbag Row 3 */}
        <ellipse cx="30" cy="60" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="80" cy="60" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="130" cy="60" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="180" cy="60" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="230" cy="60" rx="25" ry="15" fill="url(#sandbagGradient)"/>
        <ellipse cx="280" cy="60" rx="25" ry="15" fill="url(#sandbagGradient)"/>
      </svg>
    );
  }
  
  function DestroyedTree() {
    return (
      <svg viewBox="0 0 100 150" className="w-full h-full">
        {/* Trunk */}
        <rect x="45" y="50" width="10" height="80" fill="#8b4513"/>
        
        {/* Broken Branches */}
        <path d="M30 60 L50 40 L45 55 Z" fill="#654321"/>
        <path d="M60 50 L80 30 L65 45 Z" fill="#654321"/>
        <path d="M35 80 L20 70 L40 75 Z" fill="#654321"/>
        
        {/* Stump */}
        <ellipse cx="50" cy="130" rx="15" ry="5" fill="#5d4037"/>
        
        {/* Cracks */}
        <path d="M48 60 L48 90" stroke="#5d4037" strokeWidth="1" fill="none"/>
        <path d="M52 70 L52 100" stroke="#5d4037" strokeWidth="1" fill="none"/>
      </svg>
    );
  }
  
  function RockFormation() {
    return (
      <svg viewBox="0 0 150 120" className="w-full h-full">
        <defs>
          <linearGradient id="rockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#696969" />
            <stop offset="100%" stopColor="#505050" />
          </linearGradient>
        </defs>
        
        {/* Main Rock */}
        <path d="M40 80 Q20 60 40 40 Q60 20 80 40 Q100 20 120 40 Q140 60 120 80 Q100 100 80 80 Q60 100 40 80" 
              fill="url(#rockGradient)"/>
        
        {/* Rock Details */}
        <path d="M60 50 Q70 45 75 55" stroke="#606060" strokeWidth="2" fill="none"/>
        <path d="M85 65 Q95 60 100 70" stroke="#606060" strokeWidth="2" fill="none"/>
        <path d="M50 70 Q55 65 60 75" stroke="#707070" strokeWidth="1" fill="none"/>
      </svg>
    );
  }
  
  function WaterPuddle() {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-full">
        <defs>
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e90ff" />
            <stop offset="100%" stopColor="#00bfff" />
          </linearGradient>
          <linearGradient id="waterHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Water Body */}
        <ellipse cx="80" cy="50" rx="70" ry="35" fill="url(#waterGradient)" opacity="0.7"/>
        
        {/* Water Ripples */}
        <ellipse cx="80" cy="50" rx="60" ry="30" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3"/>
        <ellipse cx="80" cy="50" rx="50" ry="25" fill="none" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2"/>
        
        {/* Water Highlights */}
        <ellipse cx="80" cy="30" rx="40" ry="15" fill="url(#waterHighlight)"/>
      </svg>
    );
  }
  
  function ConcreteBarrier() {
    return (
      <svg viewBox="0 0 80 140" className="w-full h-full">
        <defs>
          <linearGradient id="concreteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#a9a9a9" />
          </linearGradient>
        </defs>
        
        {/* Barrier Body */}
        <rect x="10" y="10" width="60" height="120" fill="url(#concreteGradient)" rx="2"/>
        
        {/* Reinforcement Bands */}
        <rect x="12" y="25" width="56" height="8" fill="#d3d3d3" rx="1"/>
        <rect x="12" y="55" width="56" height="8" fill="#d3d3d3" rx="1"/>
        <rect x="12" y="85" width="56" height="8" fill="#d3d3d3" rx="1"/>
        <rect x="12" y="115" width="56" height="8" fill="#d3d3d3" rx="1"/>
        
        {/* Damage/Weathering */}
        <path d="M20 15 L25 10 L30 15" fill="#8c8c8c" opacity="0.5"/>
        <path d="M60 125 L65 120 L70 125" fill="#8c8c8c" opacity="0.5"/>
      </svg>
    );
  }
  
  function MilitaryCrate() {
    return (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <defs>
          <linearGradient id="crateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b4513" />
            <stop offset="100%" stopColor="#654321" />
          </linearGradient>
        </defs>
        
        {/* Crate Body */}
        <rect x="10" y="15" width="60" height="35" fill="url(#crateGradient)" rx="2"/>
        
        {/* Metal Bands */}
        <rect x="10" y="25" width="60" height="3" fill="#deb887"/>
        <rect x="10" y="35" width="60" height="3" fill="#deb887"/>
        <rect x="25" y="15" width="3" height="35" fill="#deb887"/>
        <rect x="52" y="15" width="3" height="35" fill="#deb887"/>
        
        {/* Military Markings */}
        <rect x="35" y="28" width="10" height="8" fill="#ff4444" opacity="0.8"/>
        <text x="40" y="34" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">!</text>
      </svg>
    );
  }
  
  function AmmoCrate() {
    return (
      <svg viewBox="0 0 80 60" className="w-full h-full">
        <defs>
          <linearGradient id="ammoCrateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2f4f4f" />
            <stop offset="100%" stopColor="#1a2f2f" />
          </linearGradient>
        </defs>
        
        {/* Crate Body */}
        <rect x="10" y="15" width="60" height="35" fill="url(#ammoCrateGradient)" rx="2"/>
        
        {/* Metal Bands */}
        <rect x="10" y="25" width="60" height="3" fill="#708090"/>
        <rect x="10" y="35" width="60" height="3" fill="#708090"/>
        
        {/* Ammo Icon */}
        <path d="M35 25 L45 25 L47 30 L45 35 L35 35 L33 30 Z" fill="#ffd700"/>
        <circle cx="40" cy="30" r="2" fill="#8b0000"/>
      </svg>
    );
  }
  
  function DebrisPile() {
    return (
      <svg viewBox="0 0 120 80" className="w-full h-full">
        {/* Various debris pieces */}
        <rect x="20" y="40" width="15" height="10" fill="#696969" transform="rotate(15 20 40)"/>
        <rect x="45" y="35" width="12" height="8" fill="#8c8c8c" transform="rotate(-10 45 35)"/>
        <rect x="65" y="45" width="18" height="6" fill="#7a7a7a" transform="rotate(5 65 45)"/>
        <circle cx="35" cy="55" r="8" fill="#606060"/>
        <path d="M80 50 L95 45 L90 60 Z" fill="#8c8c8c"/>
        <rect x="50" y="55" width="10" height="15" fill="#5c5c5c" transform="rotate(20 50 55)"/>
      </svg>
    );
  }