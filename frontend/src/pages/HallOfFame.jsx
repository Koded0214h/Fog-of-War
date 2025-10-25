// src/pages/HallOfFame.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import LeaderboardTable from '../components/LeaderboardTable';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

export default function HallOfFame() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [players, setPlayers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Sample data - replace with your API call
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPlayers([
        {
          id: 1,
          rank: 1,
          name: "PlayerOne",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIGR8qxSeEPI25WAgq-sJtdV01PiKP_nEK4d_PQIxBbPMpXVC8gfbbK-SdQI3qODHFRFUiQl4aeCwalQkT0xZms5hYEkR1sOpLEJ9Un8NsJzigaWatQNqJcREk6llfqMGMpI7yrK2daxy7K-H0lExsqF-DnaePIdkpsJhUlw5rjl4qqr3QHCF0Mryr4wh6BFlDsxbhqyVRT30o4zbcJq9IbK9X8BtnRV49FjGOQDU5ReraUyF3mZsLxV9VDz2aDA8e_vyaHOM-MPJ6",
          totalSol: 9876.54,
          gamesPlayed: 1204
        },
        {
          id: 2,
          rank: 2,
          name: "PlayerTwo",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrnPfGXj2lJHAJCSU-dbhfwAB3DR72JG_hgwu-qrBV_lEQKuyv-bkx6Y67zB3U6Hnlr6FKrIG7hLeztYcmuPSZdiDTr8s8bXvl-QF9p25Oc6xF_7MdUk6mx9M_ff6HhPMvaOHotYW3BxMMTHk_NkP2-t5PlCIR8tjqvYrYs6g38U4kYpLqY-oneYmzzeYgg43QyZhR1YifCvV31UYg6PNlU16rBBYLm4QgPcPL70xDI6y-zPcgwNwsxzFi4Dbk4FYocHtwchiihCPY",
          totalSol: 8765.43,
          gamesPlayed: 1150
        },
        {
          id: 3,
          rank: 3,
          name: "PlayerThree",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmrXa8Y69gmuwrO5na198TyofK4ZCLndWv-KZA3HN7gKyyDu6mCwwk51_IALhSPSLvmWVigwtzN-JFXhhOlMat7QsMdgKEVZe5u9uzcF7uonmbHb4hru5vhwtdnsfgXRAL3TiFEiNu8zM2yj4I4Lxvg2MgRn4CmQKMIAoqSNrLa0657abaaYzJwGEM95LYzZiN4_I8Lj5kXwViHbn5p7rfexUuW8wDLlnzmV9QyluAqxCo3jE1h8YK3FUNFTLpDpMHCjTlEJC0nkLT",
          totalSol: 7654.32,
          gamesPlayed: 1102
        },
        {
          id: 4,
          rank: 4,
          name: "PlayerFour",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDL0W7JV69HbfzD0HPuT1huV0HSc_ILkKf-eHK4PzEukFMaZE7mcdMX29KEU8dcyld9pkHh8uISCgqa0uNsEQ7ioNW0qUujP63QiE4870enQfJGpTqTMMA_KpT5_2BNcbBn7KPQoWEnI_Ma_pWQrtneNa_mDN0NlV-SMErRIyFycRhh2ffa8kx7uF8l51p7AEFSbUTisOZ_ymwTD7Fd8MF-YIghil5Wy9ht3OpVG_va-q88g5ZRQOZSrM8--HdxMtC-UjIqdRGJO4Gm",
          totalSol: 6543.21,
          gamesPlayed: 1055
        },
        {
          id: 5,
          rank: 5,
          name: "PlayerFive",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsn3MaT0UhVxAh7UFMH3rB-rE8arcng4kxwYArMuIqQ5j9U3DiaGgPKSrEW6njjS6S2WLPgVNyMCZeV1u6CjFaSEOOMDkmDGd9jPfc4IHz7UA3ZZtYIRYBzs6-x_ojlB24w4lSat7yGk7-k2PtVfMqT2dX7EOii3vFq4-uR7MyrRErFRxTTivChA0SqfNSv8VoLkL20xmAYfsH2_4jiY86vgVp2T1dVB1wB_sd_yC1B3Sod9ZF7Uec1CoJ3lFFKhGXL5qVnT6atauZ",
          totalSol: 5432.10,
          gamesPlayed: 987
        }
      ]);
      setTotalPages(10);
      setLoading(false);
    }, 1000);
  }, [currentPage, searchQuery]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="dark min-h-screen bg-bgDark text-textPrimary font-display">
      <div className="flex flex-col min-h-screen">
        <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col max-w-[960px] flex-1 gap-6">
            
            <Header />
            
            <main className="flex flex-col gap-6">
              
              {/* Page Header */}
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <h1 className="text-textPrimary text-4xl font-black leading-tight tracking-[-0.033em]">
                    Hall of Fame
                  </h1>
                  <p className="text-textSecondary text-base font-normal leading-normal">
                    Honoring the most successful players in the Fog of War.
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />

              {/* Loading State */}
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}

              {/* Leaderboard Table */}
              {!loading && (
                <LeaderboardTable players={players} />
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}