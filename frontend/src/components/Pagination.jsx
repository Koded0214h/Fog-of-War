// src/components/Pagination.jsx
export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];
    
    // Generate page numbers - show first 5 pages or all if less than 5
    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    const handlePageChange = (page) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };
  
    return (
      <div className="flex items-center justify-center p-4 gap-2">
        
        {/* Previous Button */}
        <button 
          className="flex w-10 h-10 items-center justify-center text-textPrimary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="material-icons">chevron_left</span>
        </button>
        
        <button 
          className="hidden sm:flex text-sm font-normal leading-normal w-10 h-10 items-center justify-center text-textPrimary rounded-full hover:bg-bgSecondary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
  
        {/* First Page */}
        {startPage > 1 && (
          <>
            <button
              className="text-sm font-normal leading-normal flex w-10 h-10 items-center justify-center text-textPrimary rounded-full hover:bg-bgSecondary"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && (
              <span className="text-sm font-normal leading-normal flex w-10 h-10 items-center justify-center text-textPrimary rounded-full">
                ...
              </span>
            )}
          </>
        )}
  
        {/* Page Numbers */}
        {pages.map(page => (
          <button
            key={page}
            className={`text-sm font-normal leading-normal flex w-10 h-10 items-center justify-center rounded-full transition-colors ${
              page === currentPage
                ? 'text-bgDark bg-primary font-bold'
                : 'text-textPrimary hover:bg-bgSecondary'
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
  
        {/* Last Page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-sm font-normal leading-normal flex w-10 h-10 items-center justify-center text-textPrimary rounded-full">
                ...
              </span>
            )}
            <button
              className="text-sm font-normal leading-normal flex w-10 h-10 items-center justify-center text-textPrimary rounded-full hover:bg-bgSecondary"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
  
        {/* Next Button */}
        <button 
          className="hidden sm:flex text-sm font-normal leading-normal w-10 h-10 items-center justify-center text-textPrimary rounded-full hover:bg-bgSecondary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        
        <button 
          className="flex w-10 h-10 items-center justify-center text-textPrimary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="material-icons">chevron_right</span>
        </button>
  
      </div>
    );
  }