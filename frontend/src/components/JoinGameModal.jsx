// src/components/JoinGameModal.jsx
import { useState, useRef } from 'react';

export default function JoinGameModal({ isOpen, onClose, game, onJoinGame }) {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [customAvatar, setCustomAvatar] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen || !game) return null;

  const defaultAvatars = [
    { id: 0, icon: 'person', type: 'default' },
    { id: 1, icon: 'face', type: 'default' },
    { id: 2, icon: 'emoji_people', type: 'default' },
    { id: 3, icon: 'account_circle', type: 'default' },
    { id: 4, icon: 'military_tech', type: 'default' },
    { id: 5, icon: 'security', type: 'default' },
    { id: 6, icon: 'sports_esports', type: 'default' },
    { id: 7, icon: 'psychology', type: 'default' },
  ];

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomAvatar(e.target.result);
        setSelectedAvatar('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = (avatarId) => {
    setSelectedAvatar(avatarId);
    setCustomAvatar(null);
  };

  const handleCustomAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleJoinGame = () => {
    const avatarData = selectedAvatar === 'custom' 
      ? { type: 'custom', url: customAvatar }
      : { type: 'default', id: selectedAvatar, icon: defaultAvatars.find(a => a.id === selectedAvatar)?.icon };
    
    onJoinGame(game, avatarData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WAITING': return 'text-green-400';
      case 'IN_PROGRESS': return 'text-orange-400';
      case 'STARTING_SOON': return 'text-blue-400';
      case 'FULL': return 'text-red-500';
      default: return 'text-textSecondary';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="flex flex-col gap-6 w-full max-w-lg bg-bgCard border border-borderDark rounded-xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-white text-2xl font-bold">Join {game.name}</h2>
          <p className="text-textSecondary">Review the game details and confirm your entry.</p>
        </div>

        {/* Game Details */}
        <div className="grid grid-cols-2 gap-4 border-b border-borderDark pb-6">
          <div className="flex flex-col gap-1">
            <p className="text-textSecondary text-sm font-normal">Entry Fee</p>
            <p className="text-white text-lg font-medium">{game.entryFee} SOL</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-textSecondary text-sm font-normal">Prize Pool</p>
            <p className="text-white text-lg font-medium">{game.prizePool} SOL</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-textSecondary text-sm font-normal">Players</p>
            <p className="text-white text-lg font-medium">{game.players} / {game.maxPlayers}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-textSecondary text-sm font-normal">Status</p>
            <p className={`text-lg font-medium ${getStatusColor(game.status)}`}>
              {game.status.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-base font-medium">Select Your Avatar</h3>
          <div className="grid grid-cols-4 gap-3">
            {/* Default Avatars */}
            {defaultAvatars.map((avatar) => (
              <div 
                key={avatar.id}
                className={`relative group cursor-pointer transition-all duration-200 ${
                  selectedAvatar === avatar.id 
                    ? 'scale-105' 
                    : 'hover:scale-102'
                }`}
                onClick={() => handleAvatarClick(avatar.id)}
              >
                <div className={`aspect-square bg-bgSecondary flex items-center justify-center rounded-lg transition-all ${
                  selectedAvatar === avatar.id
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-bgCard shadow-[0_0_20px_0] shadow-primary/40'
                    : 'ring-2 ring-transparent group-hover:ring-primary/50'
                }`}>
                  <span className="material-icons text-4xl text-textSecondary">
                    {avatar.icon}
                  </span>
                </div>
                {selectedAvatar === avatar.id && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <span className="material-icons text-bgDark text-base font-bold">
                        check
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Custom Avatar Upload */}
            <div 
              className={`relative group cursor-pointer transition-all duration-200 ${
                selectedAvatar === 'custom' 
                  ? 'scale-105' 
                  : 'hover:scale-102'
              }`}
              onClick={handleCustomAvatarClick}
            >
              <div className={`aspect-square bg-bgSecondary flex items-center justify-center rounded-lg transition-all ${
                selectedAvatar === 'custom'
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-bgCard shadow-[0_0_20px_0] shadow-primary/40'
                  : 'ring-2 ring-transparent group-hover:ring-primary/50'
              }`}>
                {customAvatar ? (
                  <img 
                    src={customAvatar} 
                    alt="Custom avatar" 
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <span className="material-icons text-4xl text-textSecondary">
                    add_photo_alternate
                  </span>
                )}
              </div>
              {selectedAvatar === 'custom' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="material-icons text-bgDark text-base font-bold">
                      check
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Upload instructions */}
          <p className="text-textSecondary text-sm text-center">
            Click the camera icon to upload your own avatar
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row-reverse items-center gap-3 pt-2">
          <button 
            className="flex w-full sm:w-auto min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-bgDark text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleJoinGame}
            disabled={!selectedAvatar && !customAvatar}
          >
            <span className="truncate">
              Confirm & Pay {game.entryFee} SOL
            </span>
          </button>
          <button 
            className="flex w-full sm:w-auto cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-transparent text-textSecondary hover:text-white hover:bg-bgSecondary/50 transition-colors text-base font-bold"
            onClick={onClose}
          >
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
}