// src/components/FailModal.jsx
export default function FailModal({ isOpen, onClose, killedBy, lootLost }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm">
        <div className="flex flex-col items-center gap-8 rounded-xl border-2 border-accentRed bg-bgDark p-12 text-center text-white shadow-2xl shadow-accentRed/20 max-w-md mx-4">
          
          {/* Death Icon */}
          <div className="flex flex-col items-center gap-4">
            <span className="material-icons text-6xl text-accentRed">
              skull
            </span>
            <h1 className="text-5xl font-bold tracking-widest text-accentRed">
              ELIMINATED
            </h1>
          </div>
  
          {/* Death Message */}
          <div className="text-center">
            <p className="text-lg text-textSecondary">
              You were eliminated by <span className="font-bold text-white">{killedBy}</span>!
            </p>
            <p className="text-lg text-textSecondary mt-2">
              You lost <span className="font-bold text-accentRed">{lootLost} SOL</span>.
            </p>
          </div>
  
          {/* Action Button */}
          <button 
            className="w-full rounded-lg bg-accentRed px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-accentRed focus:ring-offset-2 focus:ring-offset-bgDark"
            onClick={onClose}
          >
            Return to Dashboard
          </button>
  
        </div>
      </div>
    );
  }