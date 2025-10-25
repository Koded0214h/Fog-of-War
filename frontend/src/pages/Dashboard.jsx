// src/pages/Dashboard.jsx
import { useState } from 'react';
import Header from '../components/Header';
import GameCard from '../components/GameCard';
import CreateGameModal from '../components/CreateGameModal';
import JoinGameModal from '../components/JoinGameModal';

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([
    {
      id: 1,
      name: 'Dungeon Alpha',
      status: 'WAITING',
      prizePool: 50,
      players: 12,
      maxPlayers: 50,
      entryFee: 1,
      time: '--:--',
      progress: 24,
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCb2MBlYwDEQVZgcFYh3A-GDgd3rJAHCu4NDqlGP3MHT-UKz2I0cbicRYIEnleuQ-KDSwnrNPohwLJVswkIrF-y-ODx_MNfoc2zFnPhhNFhqrW2cpaSH27W4DTrRe6sMFezhWG96V1XY730O0tUGeaQCHXIm_QB95q2yJizZzErbTvHE2_fMTjanZNZlfU8g4Uynws5HNMUaPmiW-_Wo5VsgvNxczUHVOzYU3kl_OFnXcukdl7PZGd65JCuyNIMK46Ztl5YabRhY_F'
    },
    {
      id: 2,
      name: 'Sector 7 Ruins',
      status: 'IN_PROGRESS',
      prizePool: 100,
      players: 45,
      maxPlayers: 50,
      entryFee: 2,
      time: '12:34',
      progress: 90,
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2S3cVVxTBDMVW_YYAy2RHRtUITgqpLxz3EFNd_M1rtbuuX3MjRmVaZRYjQjgMu-jVE4ajy2iPpm0_hVePlbPnqboffP4hBTxO6cyykRbgsumFN1pEK8kMeeqg-pHXiDt-beX4KWdtIGj1jCtvZ1AsO2sP8yHlt737sk9qZDA7WsDqYTDBsHLJGB8aM-9NwXhoapGZITnN44jMiuyQyukhH0lZWDGXVlBKl1EbFaiKEC-vBGR1eztfJFEJOth7r417mtnH6x98gb0m'
    },
    // Add more games with background images...
  ]);

  const hasGames = games.length > 0;

  const handleCreateGame = (gameData) => {
    const prizePool = parseFloat(gameData.entryFee) * parseInt(gameData.maxPlayers);
    
    const newGame = {
      id: games.length + 1,
      name: gameData.map,
      status: 'WAITING',
      prizePool: prizePool,
      players: 1,
      maxPlayers: parseInt(gameData.maxPlayers),
      entryFee: parseFloat(gameData.entryFee),
      time: '--:--',
      progress: (1 / parseInt(gameData.maxPlayers)) * 100,
      backgroundImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCb2MBlYwDEQVZgcFYh3A-GDgd3rJAHCu4NDqlGP3MHT-UKz2I0cbicRYIEnleuQ-KDSwnrNPohwLJVswkIrF-y-ODx_MNfoc2zFnPhhNFhqrW2cpaSH27W4DTrRe6sMFezhWG96V1XY730O0tUGeaQCHXIm_QB95q2yJizZzErbTvHE2_fMTjanZNZlfU8g4Uynws5HNMUaPmiW-_Wo5VsgvNxczUHVOzYU3kl_OFnXcukdl7PZGd65JCuyNIMK46Ztl5YabRhY_F'
    };

    setGames([newGame, ...games]);
    setIsCreateModalOpen(false);
  };

  const handleJoinGameClick = (game) => {
    setSelectedGame(game);
    setIsJoinModalOpen(true);
  };

  const handleConfirmJoin = (game, avatarData) => {
    // Handle the actual game joining logic here
    console.log('Joining game:', game.name);
    console.log('Selected avatar:', avatarData);
    
    // Update game players count
    setGames(games.map(g => 
      g.id === game.id 
        ? { ...g, players: g.players + 1, progress: ((g.players + 1) / g.maxPlayers) * 100 }
        : g
    ));
    
    setIsJoinModalOpen(false);
    setSelectedGame(null);
    
    // Here you would typically:
    // 1. Process payment
    // 2. Connect to game server
    // 3. Navigate to game screen
  };

  return (
    <div className="dark min-h-screen bg-bgDark text-textPrimary font-display">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex h-full grow flex-col">
          <Header />
          
          <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
            <div className="flex flex-col w-full max-w-7xl flex-1">
              {/* Page Header */}
              <div className="flex flex-wrap justify-between items-center gap-3 p-4 md:p-6 lg:p-8">
                <div className="flex min-w-72 flex-col gap-1">
                  <p className="text-white text-3xl font-bold tracking-[-0.033em]">Active Games</p>
                </div>
                {hasGames && (
                  <button 
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-accentGreen text-black text-base font-bold tracking-[0.015em] hover:bg-accentGreen/80 transition-colors"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <span className="truncate">Create Game</span>
                  </button>
                )}
              </div>

              {/* Games Grid */}
              {hasGames ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 md:p-6 lg:p-8">
                  {games.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      onJoinGame={handleJoinGameClick}
                    />
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
                  <svg className="w-16 h-16 text-textSecondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-white">No active games</h3>
                    <p className="text-textSecondary">Check back soon or create a new game to get started.</p>
                  </div>
                  <button 
                    className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 bg-accentGreen text-black text-base font-bold tracking-[0.015em] hover:bg-accentGreen/80 transition-colors"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <span className="truncate">Create Game</span>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Create Game Modal */}
      <CreateGameModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateGame={handleCreateGame}
      />

      {/* Join Game Modal */}
      <JoinGameModal 
        isOpen={isJoinModalOpen}
        onClose={() => {
          setIsJoinModalOpen(false);
          setSelectedGame(null);
        }}
        game={selectedGame}
        onJoinGame={handleConfirmJoin}
      />
    </div>
  );
}