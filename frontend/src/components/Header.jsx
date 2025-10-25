// src/components/Header.jsx
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isConnected, setIsConnected] = useState(true); // Set to true for profile page
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowDropdown(false);
    // Add your wallet disconnection logic here
  };

  const handleProfile = () => {
    setShowDropdown(false);
    // Already on profile page
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-borderDark px-4 sm:px-6 md:px-10 py-3">
      
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-5 h-5 text-primary">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
          </svg>
        </div>
        <h2 className="text-textPrimary text-lg font-bold leading-tight tracking-[-0.015em]">
          Fog of War
        </h2>
      </div>

      {/* Navigation */}
      <div className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link to="/dashboard" className="text-textPrimary text-sm font-medium leading-normal hover:text-primary transition-colors">
            Play
          </Link>
          <Link to="/leaderboard" className="text-textPrimary text-sm font-medium leading-normal hover:text-primary transition-colors">
            Leaderboard
          </Link>
          <a className="text-textPrimary text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">
            Marketplace
          </a>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div 
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 h-10 border-2 border-primary"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdsR81CDd2K63UI2pnWa1k9_X6RO8L1QUg7sa66W2ZKBnvTcZMSgO5po8H7bTDW6DYDWZQeq3fsRNK96lsoNhUJsNXtzBIvMGmoVYUZRYBYB4yzmDuypUiiKTTOVYBt3lmZ_0Z78QVdHfY-BpqWLCRP83iYJb_Lwi7exUomCz4iur3RS54F7WmD6Rv6LY2j90p-TZ6djOgi4at3A7qJ0S-s_q52mwTtwTpt7bnsHincMYhRBcpFlglwPByAehXSfa58Zpl4niaRHYm")'
                }}
              ></div>
              <span className="material-icons text-textPrimary text-xl">
                expand_more
              </span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-12 right-0 w-48 bg-bgCard border border-borderDark rounded-lg shadow-2xl shadow-black/50 z-50 overflow-hidden">
                <div className="py-2">
                  <Link 
                    to="/profile"
                    className="flex items-center gap-3 w-full px-4 py-3 text-textPrimary text-sm hover:bg-bgSecondary transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="material-icons text-lg">person</span>
                    <span>Profile</span>
                  </Link>
                  
                  <button 
                    className="flex items-center gap-3 w-full px-4 py-3 text-textPrimary text-sm hover:bg-bgSecondary transition-colors"
                    onClick={() => {
                      setShowDropdown(false);
                      // Add settings logic
                    }}
                  >
                    <span className="material-icons text-lg">settings</span>
                    <span>Settings</span>
                  </button>

                  <div className="border-t border-borderDark my-1"></div>

                  <button 
                    className="flex items-center gap-3 w-full px-4 py-3 text-accentRed text-sm hover:bg-bgSecondary transition-colors"
                    onClick={handleDisconnect}
                  >
                    <span className="material-icons text-lg">logout</span>
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-textPrimary p-2">
          <span className="material-icons text-2xl">menu</span>
        </button>
      </div>

    </header>
  );
}