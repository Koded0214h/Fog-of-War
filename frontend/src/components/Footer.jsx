// src/components/Footer.jsx
export default function Footer() {
    return (
      <footer className="flex flex-col gap-6 px-5 py-10 text-center mt-auto border-t border-solid border-borderDark">
        
        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 min-[480px]:flex-row min-[480px]:justify-around">
          <a className="text-textSecondary hover:text-textPrimary transition-colors text-base font-normal leading-normal min-w-40" href="#">
            Terms of Service
          </a>
          <a className="text-textSecondary hover:text-textPrimary transition-colors text-base font-normal leading-normal min-w-40" href="#">
            Privacy Policy
          </a>
        </div>
  
        {/* Social Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-textSecondary hover:text-textPrimary transition-colors" href="#">
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
            </svg>
          </a>
          <a className="text-textSecondary hover:text-textPrimary transition-colors" href="#">
            <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.27 5.33C17.94 4.7 16.5.55 16.5.55L15.96 2.08C13.84 1.54 11.91 1.25 10 1.25C8.09 1.25 6.16 1.54 4.04 2.08L3.5 1.55S2.06 4.7 1.27 5.33C1.27 5.33 .61 8.05.16 11.08C1.59 12.3 3.58 13.26 5.25 13.73C5.9 14.88 7 16.63 8.53 17.5C9.69 17.15 10.74 16.63 11.64 15.97C12.11 16.32 12.58 16.65 13.03 16.96C13.43 17.2 13.82 17.43 14.2 17.65C15.65 16.68 16.8 14.9 17.5 13.75C19.2 13.26 21.17 12.28 22.58 11.06C22.11 8.09 21.48 5.33 19.27 5.33M8.03 11.96C7.3 11.96 6.72 11.38 6.72 10.65C6.72 9.92 7.3 9.34 8.03 9.34C8.76 9.34 9.34 9.92 9.34 10.65C9.34 11.4 8.76 11.96 8.03 11.96M14.72 11.96C13.98 11.96 13.4 11.38 13.4 10.65C13.4 9.92 13.98 9.34 14.72 9.34C15.45 9.34 16.03 9.92 16.03 10.65C16.03 11.4 15.45 11.96 14.72 11.96Z"></path>
            </svg>
          </a>
        </div>
  
        {/* Copyright */}
        <p className="text-textSecondary text-base font-normal leading-normal">
          © 2024 Fog of War. All rights reserved.
        </p>
  
      </footer>
    );
  }