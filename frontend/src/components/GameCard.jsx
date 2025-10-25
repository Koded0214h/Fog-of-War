// src/components/GameCard.jsx
export default function GameCard({ game, onJoinGame }) {
    const { 
      name, 
      status, 
      prizePool, 
      players, 
      maxPlayers, 
      entryFee, 
      time, 
      progress,
      backgroundImage 
    } = game;
  
    const getStatusStyles = (status) => {
      switch (status) {
        case 'WAITING':
          return { backgroundColor: '#fef3c7', color: '#92400e' };
        case 'IN_PROGRESS':
          return { backgroundColor: '#fecaca', color: '#dc2626' };
        case 'STARTING_SOON':
          return { backgroundColor: '#dbeafe', color: '#1e40af' };
        case 'FULL':
          return { backgroundColor: '#e5e7eb', color: '#374151' };
        default:
          return { backgroundColor: '#f3f4f6', color: '#374151' };
      }
    };
  
    const getStatusDotColor = (status) => {
      switch (status) {
        case 'WAITING': return 'bg-green-400';
        case 'IN_PROGRESS': return 'bg-orange-400 animate-pulse';
        case 'STARTING_SOON': return 'bg-blue-400';
        case 'FULL': return 'bg-red-500';
        default: return 'bg-gray-400';
      }
    };
  
    const getStatusText = (status) => {
      switch (status) {
        case 'WAITING': return 'Waiting...';
        case 'IN_PROGRESS': return 'In Progress';
        case 'STARTING_SOON': return 'Starting Soon';
        case 'FULL': return 'Full';
        default: return status;
      }
    };
  
    const isJoinDisabled = status !== 'WAITING';
  
    return (
      <div className="flex flex-col gap-4 bg-card-dark border border-border-dark rounded-xl overflow-hidden group hover:border-accentGreen/50 transition-colors">
        {/* Game Image */}
        <div className="relative w-full bg-center bg-no-repeat aspect-video bg-cover">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent"></div>
        </div>
  
        {/* Game Content */}
        <div className="flex flex-col gap-4 px-5 pb-5">
          <h3 className="text-white text-xl font-bold leading-normal">{name}</h3>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <p className="text-text-secondary-dark font-normal">Entry Fee</p>
              <p className="text-white font-medium">{entryFee} SOL</p>
            </div>
            <div>
              <p className="text-text-secondary-dark font-normal">Prize Pool</p>
              <p className="text-white font-medium">{prizePool} SOL</p>
            </div>
            <div>
              <p className="text-text-secondary-dark font-normal">Players</p>
              <p className="text-white font-medium">{players} / {maxPlayers}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`}></div>
              <div>
                <p className="text-text-secondary-dark font-normal">Status</p>
                <p className="text-white font-medium">{getStatusText(status)}</p>
              </div>
            </div>
          </div>
  
          <button 
            className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 text-base font-bold leading-normal tracking-[0.015em] transition-opacity ${
              isJoinDisabled 
                ? 'bg-border-dark text-text-secondary-dark opacity-70 cursor-not-allowed' 
                : 'bg-primary text-background-dark hover:opacity-90'
            }`}
            disabled={isJoinDisabled}
            onClick={() => !isJoinDisabled && onJoinGame(game)}
          >
            <span className="truncate">
              {isJoinDisabled ? 'Join Game' : 'Join Game'}
            </span>
          </button>
        </div>
      </div>
    );
  }