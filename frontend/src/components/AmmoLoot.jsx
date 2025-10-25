// src/components/AmmoLoot.jsx
export default function AmmoLoot({ ammo, totalLoot }) {
    return (
      <div className="bg-black/70 rounded-lg p-4 border border-[#63df20]/30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-icons text-white text-2xl">military_tech</span>
            <p className="text-xl font-bold text-white font-mono">{ammo} | 🔫</p>
          </div>
          <div className="flex items-center gap-2 text-[#FFD700]">
            <span className="material-icons text-2xl">lock</span>
            <p className="text-xl font-bold font-mono">+{totalLoot.toFixed(2)} SOL</p>
          </div>
        </div>
      </div>
    );
  }