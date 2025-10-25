// src/components/SuccessModal.jsx
export default function SuccessModal({ isOpen, onClose, lootEarned }) {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center backdrop-blur-md">
        <div className="flex flex-col items-center gap-8 p-12 bg-bgDark border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20 max-w-md mx-4">
          
          {/* Success Icon */}
          <div className="flex flex-col items-center gap-4">
            <span className="material-icons text-6xl text-primary">
              check_circle
            </span>
            <h1 className="text-5xl font-bold tracking-widest text-primary text-center">
              EXTRACTION SUCCESSFUL
            </h1>
          </div>
  
          {/* Success Message */}
          <div className="text-center">
            <p className="text-lg text-textSecondary mb-2">
              You have secured your loot and escaped the Fog of War.
            </p>
            <div className="flex items-center justify-center gap-2 text-xl font-bold text-accentYellow">
              <span className="material-icons text-2xl">lock</span>
              <span>+{lootEarned} SOL</span>
            </div>
          </div>
  
          {/* Action Button */}
          <button 
            className="w-full rounded-lg bg-primary px-8 py-4 text-lg font-bold text-bgDark transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bgDark"
            onClick={onClose}
          >
            Return to Dashboard
          </button>
  
        </div>
      </div>
    );
  }