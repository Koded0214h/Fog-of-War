// src/components/MobileControls.jsx
export default function MobileControls() {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:hidden flex items-center gap-8">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-start-2 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">↑</div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">←</div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">↓</div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">→</div>
        </div>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">F</div>
      </div>
    );
  }