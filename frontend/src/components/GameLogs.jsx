// src/components/GameLogs.jsx
export default function GameLogs({ gameLogs }) {
    return (
      <div className="absolute top-6 right-6 flex flex-col gap-2 text-right">
        {gameLogs.slice(-3).map((log, index) => (
          <div 
            key={log.id}
            className="bg-black/70 rounded-lg px-4 py-2 border border-[#63df20]/30 animate-fadeOut"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <p className="text-sm text-white">
              {log.type === 'kill' ? (
                <>
                  <span className="font-bold text-[#FF4444]">PlayerX</span> eliminated <span className="font-bold text-gray-300">PlayerY</span>
                </>
              ) : (
                <>
                  <span className="font-bold text-white">You</span> collected <span className="font-bold text-[#FFD700]">+0.5 SOL</span>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    );
  }