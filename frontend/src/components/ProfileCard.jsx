// src/components/ProfileCard.jsx
import { useState } from 'react';
import StatsGrid from './StatsGrid';

export default function ProfileCard({ userProfile, userStats }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userProfile.walletAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-bgCard border border-borderDark rounded-xl p-6 sm:p-8">
      
      {/* Profile Header */}
      <div className="flex mb-8">
        <div className="flex w-full flex-col gap-6 min-[520px]:flex-row min-[520px]:justify-between min-[520px]:items-center">
          
          {/* User Info */}
          <div className="flex items-center gap-6">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-24 w-24 sm:min-h-32 sm:w-32 ring-2 ring-primary/50"
              style={{ backgroundImage: `url("${userProfile.avatar}")` }}
            ></div>
            <div className="flex flex-col justify-center gap-1">
              <p className="text-textPrimary text-xl sm:text-[22px] font-bold leading-tight tracking-[-0.015em]">
                {userProfile.walletAddress}
              </p>
              <p className="text-textSecondary text-sm sm:text-base font-normal leading-normal">
                Connected Wallet
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <button 
            className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-bgSecondary hover:bg-bgSecondary/80 text-textPrimary text-sm font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] min-[480px]:w-auto transition-colors"
            onClick={copyToClipboard}
          >
            <span className="material-icons text-lg">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span className="truncate">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>

        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid userStats={userStats} />

    </div>
  );
}