const FogOfWar = () => {
    return (
      <div className="dark">
        <div className="font-display bg-background-light dark:bg-background-dark text-white">
          <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
              <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                  {/* TopNavBar */}
                  <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-primary/20 px-4 sm:px-10 py-3">
                    <div className="flex items-center gap-4 text-white">
                      <div className="size-6 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
                        </svg>
                      </div>
                      <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">Fog of War</h2>
                    </div>
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
                      <span className="truncate">Connect Wallet</span>
                    </button>
                  </header>
  
                  <main className="flex-grow">
                    {/* HeroSection */}
                    <div className="@container py-16 sm:py-24">
                      <div className="@[480px]:p-4">
                        <div 
                          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-center justify-center p-4"
                          style={{
                            backgroundImage: `linear-gradient(rgba(23, 33, 17, 0.5) 0%, rgba(23, 33, 17, 0.8) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuCb7p5qQ3R8DaJIM5hmk0Dp6Lbx688fOzjpr9KpkTRJZKQi8u4AQf19ps1-ECthNYthtGbernP0CPIIXDKNZb6RHDCK_xyatsGZqKvlSjfpJWJArE48vReb23r_jUSeUs4JuyIy5dND9OuVmSyG5_C-wxU4uUJujfSrEjuFCgnCknQd17UMvZRCd0za7KVCuetm-IWv4Ur53M3qHEK8uLT_esyUTZIiIn1Yt43msFR51CCBVFCVl8KCGlIsreXP1AuCRr-v81XrQhVu")`
                          }}
                        >
                          <div className="flex flex-col gap-4 text-center max-w-3xl">
                            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                              Privacy is the ultimate weapon. Loot is real. Extraction is everything.
                            </h1>
                            <h2 className="text-white/80 text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal">
                              Enter the fog, secure encrypted loot, and extract to claim your earnings on the Solana blockchain.
                            </h2>
                          </div>
                          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 @[480px]:h-14 @[480px]:px-8 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-primary/90 transition-colors transform hover:scale-105">
                            <span className="truncate">View Active Games</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </main>
  
                  {/* Footer */}
                  <footer className="flex flex-col gap-8 px-5 py-10 text-center @container border-t border-solid border-t-primary/20 mt-auto">
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 @[480px]:flex-row @[480px]:justify-around">
                      <a className="text-white/70 hover:text-primary transition-colors text-base font-normal leading-normal min-w-40" href="#">
                        About
                      </a>
                      <a className="text-white/70 hover:text-primary transition-colors text-base font-normal leading-normal min-w-40" href="#">
                        Docs
                      </a>
                      <a className="text-white/70 hover:text-primary transition-colors text-base font-normal leading-normal min-w-40" href="#">
                        Terms of Service
                      </a>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                      <a aria-label="Twitter" href="#">
                        <svg className="text-white/70 hover:text-primary transition-colors" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1-1.4-12.1-5.2-12.1-5.2s-2.8 1.4-4.2 5.2c-1.4 3.8-1.4 7-1.4 7s-7-5.2-8.4-10.5c0 0 2.8 5.2 7 7-1.4 1.4-4.2 1.4-4.2 1.4s2.8 2.8 7 2.8c7 0 11.2-5.6 11.2-11.2 0 0 .7-1.4 1.4-2.8z"></path>
                        </svg>
                      </a>
                      <a aria-label="Discord" href="#">
                        <svg className="text-white/70 hover:text-primary transition-colors" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2a10 10 0 0 0-10 10c0 5.523 4.477 10 10 10s10-4.477 10-10a10 10 0 0 0-10-10Z"></path>
                          <path d="M7 12a5 5 0 0 0 10 0"></path>
                          <path d="m8 12 1-1"></path>
                          <path d="m15 11-1 1"></path>
                        </svg>
                      </a>
                      <a aria-label="Telegram" href="#">
                        <svg className="text-white/70 hover:text-primary transition-colors" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                          <path d="m22 2-7 20-4-9-9-4Z"></path>
                          <path d="M22 2 11 13"></path>
                        </svg>
                      </a>
                    </div>
                    <p className="text-white/50 text-base font-normal leading-normal">© 2024 Fog of War. All rights reserved.</p>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default FogOfWar;