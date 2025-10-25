// src/components/HealthBar.jsx
export default function HealthBar({ health }) {
    return (
      <div className="bg-black/70 rounded-lg p-4 border border-[#63df20]/30">
        <div className="flex items-center gap-3">
          <span className="material-icons text-red-500 text-2xl">favorite</span>
          <div className="w-48 bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-[#00FF00] h-full rounded-full transition-all duration-300"
              style={{ width: `${health}%` }}
            ></div>
          </div>
          <span className="text-white font-mono text-sm min-w-[3ch]">{health}%</span>
        </div>
      </div>
    );
  }