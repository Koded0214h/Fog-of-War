// src/components/CreateGameModal.jsx
export default function CreateGameModal({ isOpen, onClose, onCreateGame }) {
    if (!isOpen) return null;
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const gameData = {
        map: formData.get('map'),
        maxPlayers: formData.get('maxPlayers'),
        entryFee: formData.get('entryFee')
      };
      onCreateGame(gameData);
    };
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="relative w-full max-w-md rounded-xl border border-borderDark bg-bgCard shadow-2xl shadow-primary/10">
          <div className="flex flex-col space-y-6 p-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-textPrimary">Create New Game Session</h1>
              <p className="text-textSecondary">Configure the settings for your new game.</p>
            </div>
            
            <form className="flex flex-col space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Map Selection */}
                <div>
                  <label className="text-sm font-medium uppercase tracking-wider text-textSecondary" htmlFor="map-selection">
                    Map Selection
                  </label>
                  <div className="relative mt-2">
                    <select 
                      className="block w-full appearance-none rounded-md border border-borderDark bg-bgDark py-2 pl-3 pr-10 text-textPrimary placeholder-textSecondary/50 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" 
                      id="map-selection"
                      name="map"
                      defaultValue="Dungeon Alpha"
                    >
                      <option>Dungeon Alpha</option>
                      <option>Sector 7 Ruins</option>
                      <option>Station Omega</option>
                      <option>The Forgotten City</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-textSecondary">
                      <span className="material-icons">expand_more</span>
                    </div>
                  </div>
                </div>
  
                {/* Max Players */}
                <div>
                  <label className="text-sm font-medium uppercase tracking-wider text-textSecondary" htmlFor="max-players">
                    Max Players
                  </label>
                  <input 
                    className="mt-2 block w-full rounded-md border border-borderDark bg-bgDark px-3 py-2 text-textPrimary placeholder-textSecondary/50 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" 
                    id="max-players" 
                    name="maxPlayers"
                    max="100" 
                    min="2" 
                    placeholder="e.g., 50" 
                    type="number" 
                    defaultValue="50"
                  />
                </div>
  
                {/* Entry Fee */}
                <div>
                  <label className="text-sm font-medium uppercase tracking-wider text-textSecondary" htmlFor="entry-fee">
                    Entry Fee (SOL)
                  </label>
                  <div className="relative mt-2">
                    <input 
                      className="block w-full rounded-md border border-borderDark bg-bgDark px-3 py-2 pl-8 font-mono text-accentYellow placeholder-textSecondary/50 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm" 
                      id="entry-fee" 
                      name="entryFee"
                      placeholder="1" 
                      step="0.1" 
                      type="number" 
                      defaultValue="1"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-4 w-4 text-accentYellow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-9.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 flex items-start space-x-2 text-yellow-500/80">
                    <span className="material-icons text-base leading-tight">warning</span>
                    <p className="text-xs">Modifying the entry fee may impact game balance and player interest.</p>
                  </div>
                </div>
              </div>
  
              {/* Buttons */}
              <div className="flex flex-col space-y-3 pt-2">
                <button 
                  className="flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-base font-bold text-bgDark transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50" 
                  type="submit"
                >
                  Create Game
                </button>
                <button 
                  className="flex h-11 items-center justify-center rounded-lg bg-transparent px-6 text-base font-medium text-textSecondary transition-colors hover:bg-white/5" 
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }