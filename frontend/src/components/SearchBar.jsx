// src/components/SearchBar.jsx
export default function SearchBar({ searchQuery, onSearchChange }) {
    return (
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            
            {/* Search Icon */}
            <div className="text-textSecondary flex bg-bgSecondary items-center justify-center pl-4 rounded-l-lg border border-borderDark border-r-0">
              <span className="material-icons">search</span>
            </div>
            
            {/* Search Input */}
            <input 
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-textPrimary focus:outline-0 focus:ring-0 bg-bgSecondary focus:border-primary border border-borderDark h-full placeholder:text-textSecondary px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              placeholder="Search for a player"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            
          </div>
        </label>
      </div>
    );
  }