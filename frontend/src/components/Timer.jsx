// src/components/Timer.jsx
export default function Timer({ gameTime }) {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    return (
      <div className="absolute top-6 left-1/2 -translate-x-1/2">
        <div className="bg-black/70 rounded-lg px-6 py-3 border border-[#63df20]/30">
          <p className={`text-4xl font-bold font-mono ${gameTime <= 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {formatTime(gameTime)}
          </p>
        </div>
      </div>
    );
  }