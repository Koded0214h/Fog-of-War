// src/components/LeaderboardRow.jsx
export default function LeaderboardRow({ player }) {
    const { rank, name, avatar, totalSol, gamesPlayed } = player;
  
    const getRankColor = (rank) => {
      if (rank <= 3) return "font-bold text-accentYellow";
      return "font-normal text-textSecondary";
    };
  
    const formatSol = (amount) => {
      return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }) + " SOL";
    };
  
    return (
      <tr className="border-t border-t-borderDark hover:bg-bgSecondary/50 transition-colors">
        
        {/* Rank */}
        <td className="h-[72px] px-4 py-2 w-20">
          <span className={`text-sm leading-normal ${getRankColor(rank)}`}>
            {rank}
          </span>
        </td>
        
        {/* Player Info */}
        <td className="h-[72px] px-4 py-2 w-auto">
          <div className="flex items-center gap-3">
            <div 
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10"
              style={{ backgroundImage: `url("${avatar}")` }}
            ></div>
            <span className="text-textPrimary font-medium text-sm">
              {name}
            </span>
          </div>
        </td>
        
        {/* Total SOL */}
        <td className="h-[72px] px-4 py-2 w-[200px] text-textSecondary text-sm font-normal leading-normal">
          {formatSol(totalSol)}
        </td>
        
        {/* Games Played */}
        <td className="h-[72px] px-4 py-2 w-[150px] text-textSecondary text-sm font-normal leading-normal">
          {gamesPlayed.toLocaleString()}
        </td>
        
      </tr>
    );
  }