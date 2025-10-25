// src/pages/Profile.jsx
import Header from '../components/Header';
import ProfileCard from '../components/ProfileCard';
import StatsGrid from '../components/StatsGrid';
import Footer from '../components/Footer';

export default function Profile() {
  const userStats = {
    totalGames: 128,
    totalSol: 7.42,
    extractions: 42,
    eliminations: 97
  };

  const userProfile = {
    walletAddress: "4aB1...c8dE",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRvQT-IuHfEOSJ3Dq5EuyOSIMbNpoQtjoIM2YJ4aAqTpwRNOS6XvLu5E148gAYo0ZEI1WrS_lmKkipWlWlD8m7b3cqGoGSx8LwAs6-hv7hL8H9-Zvn1cMMsuF5eGUxC_Zb96-rGq-jzQCbJxTaXrlpWY3AWYV6271qnYAXUjEjCS2Sk4eOJA86AD0R6ZIxzQj968XTyML2aDoc4jydliDBhpSANH8vZU2UJ2PzQasWbde_lUMueZyl0W1TXM4QJSK4pplvNDDL36-e"
  };

  return (
    <div className="dark min-h-screen bg-bgDark text-textPrimary font-display">
      <div className="flex flex-col min-h-screen">
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
          <div className="flex flex-col w-full max-w-[960px] flex-1">
            
            <Header />
            
            <main className="py-10 px-4 sm:px-6 md:px-10">
              
              {/* Page Heading */}
              <div className="flex flex-wrap justify-between gap-3 mb-8">
                <h1 className="text-textPrimary text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
                  My Profile
                </h1>
              </div>

              {/* Profile Card */}
              <ProfileCard userProfile={userProfile} userStats={userStats} />

            </main>

            <Footer />

          </div>
        </div>
      </div>
    </div>
  );
}