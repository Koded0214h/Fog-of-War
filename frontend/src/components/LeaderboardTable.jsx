// src/components/LeaderboardTable.jsx
import LeaderboardRow from './LeaderboardRow';

export default function LeaderboardTable({ players }) {
  return (
    <div className="px-4 py-3">
      <div className="flex overflow-hidden rounded-lg border border-borderDark bg-bgCard">
        <table className="flex-1">
          
          {/* Table Header */}
          <thead>
            <tr className="bg-bgSecondary">
              <th className="px-4 py-3 text-left text-textPrimary w-20 text-sm font-medium leading-normal">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-textPrimary w-auto text-sm font-medium leading-normal">
                Player
              </th>
              <th className="px-4 py-3 text-left text-textPrimary w-[200px] text-sm font-medium leading-normal">
                Total SOL Extracted
              </th>
              <th className="px-4 py-3 text-left text-textPrimary w-[150px] text-sm font-medium leading-normal">
                Games Played
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {players.map((player) => (
              <LeaderboardRow key={player.id} player={player} />
            ))}
            
            {/* Empty State */}
            {players.length === 0 && (
              <tr>
                <td colSpan="4" className="h-32 px-4 py-2 text-center text-textSecondary">
                  No players found matching your search.
                </td>
              </tr>
            )}
          </tbody>
          
        </table>
      </div>
    </div>
  );
}