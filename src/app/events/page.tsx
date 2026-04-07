import Link from 'next/link';

export default function BrowseEvents() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 sticky z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TICKETRUSH</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase">Events</Link>
            <Link href="/tickets" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 hover:bg-blue-700 hover:text-white transition-colors duration-100 font-['Inter'] tracking-tight uppercase">My Tickets</Link>
            <Link href="/dashboard" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 hover:bg-blue-700 hover:text-white transition-colors duration-100 font-['Inter'] tracking-tight uppercase">Dashboard</Link>
            <Link href="/orders" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 hover:bg-blue-700 hover:text-white transition-colors duration-100 font-['Inter'] tracking-tight uppercase">Orders</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-900 dark:text-slate-100 p-2">account_circle</button>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      {/* Search & Results Count Header */}
      <section className="bg-surface px-8 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl w-full">
            <span className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-primary mb-2 block">Search Directory</span>
            <h1 className="text-[2rem] font-bold tracking-tighter leading-none mb-6">EXPLORE LIVE EVENTS</h1>
            <div className="relative flex items-center bg-surface-container-high w-full">
              <span className="material-symbols-outlined absolute left-4 text-outline">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 py-4 pl-12 pr-4 font-bold text-sm uppercase placeholder:text-outline-variant border-b-2 border-transparent focus:border-primary" 
                placeholder="SEARCH BY ARTIST, VENUE, OR CITY..." 
                type="text"
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-[3.5rem] font-extrabold tracking-tighter leading-none text-primary">128</div>
            <div className="font-bold text-xs uppercase tracking-widest text-on-surface-variant">Events Found</div>
          </div>
        </div>
      </section>

      <main className="flex flex-col md:flex-row gap-0 flex-grow">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-80 bg-surface-container-low p-8 border-r-0">
          <div className="sticky top-32 space-y-10">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b-2 border-surface-dim pb-2">Category</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox"/>
                  <span className="font-bold text-sm uppercase group-hover:text-primary">All Genres</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox"/>
                  <span className="font-bold text-sm uppercase group-hover:text-primary">Music</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox"/>
                  <span className="font-bold text-sm uppercase group-hover:text-primary">Sports</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox"/>
                  <span className="font-bold text-sm uppercase group-hover:text-primary">Theater</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b-2 border-surface-dim pb-2">Date Range</h3>
              <div className="space-y-4">
                <div className="bg-surface-container-highest p-4">
                  <span className="text-[10px] font-black uppercase text-outline block mb-1">Start Date</span>
                  <span className="font-bold text-sm uppercase">Oct 24, 2024</span>
                </div>
                <div className="bg-surface-container-highest p-4">
                  <span className="text-[10px] font-black uppercase text-outline block mb-1">End Date</span>
                  <span className="font-bold text-sm uppercase">Dec 31, 2024</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b-2 border-surface-dim pb-2">Price Range</h3>
              <div className="relative h-2 bg-surface-container-highest mt-8">
                <div className="absolute left-0 right-1/4 h-full bg-primary"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-on-background"></div>
                <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-4 h-4 bg-on-background"></div>
              </div>
              <div className="flex justify-between mt-4">
                <span className="font-black text-xs">$0</span>
                <span className="font-black text-xs text-primary">$450+</span>
              </div>
            </div>

            <button className="w-full bg-on-background text-surface py-4 font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Event Grid */}
        <section className="flex-grow p-8 bg-surface">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1">
            {/* Card 1 (High Impact) */}
            <div className="bg-surface-container-lowest p-6 flex flex-col group relative">
              <div className="absolute top-6 right-6 z-10 bg-secondary text-on-secondary px-3 py-1 font-bold text-[10px] uppercase tracking-tighter">Live</div>
              <div className="mb-6 overflow-hidden">
                <img 
                  className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                  alt="Neon Velocity Tour" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB69_qzj0EpeeuBbsYDs9SodTZ856wD0cl8b75MXY136ilJWDpP04bk5VdvKpmidzdsRpR-2kY1Cx3QDuiIYO059QIY7OIhCUSc8s2QaTdx9N21LRkngv95mGStppf-An5_V3Ee70MdnZ5-umigePAoi_QmcoPEHcgSCPK9hpPM30MxjkTxpqFEd-UMIRhgwcH-CMSAIlCBEmIHmIXK8pJLRibxn07G0Gw7c4dHg_d3LVJEY__Vn0AFpdjesMumu9JeYtj8Vor2Gkh"
                />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-surface-container-high px-2 py-1 font-bold text-[10px] uppercase">Music</span>
                <span className="font-black text-[10px] uppercase text-outline">Oct 28 • London</span>
              </div>
              <h2 className="text-xl font-bold tracking-tighter leading-tight mb-8 group-hover:text-primary transition-colors">NEON VELOCITY: WORLD TOUR 2024</h2>
              <div className="mt-auto flex items-end justify-between border-t-2 border-surface-container pt-6">
                <div>
                  <span className="text-[10px] font-black text-outline block">FROM</span>
                  <span className="text-2xl font-black tracking-tighter">$89.00</span>
                </div>
                <button className="bg-primary text-on-primary px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">Get Tickets</button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest p-6 flex flex-col group">
              <div className="mb-6 overflow-hidden">
                <img 
                  className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                  alt="Premier League Match" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBQMzCyGBKWwMMTdLrZLGVj95dUfFtmGla3IE82LN1zoYsDXcpZNAxvT9hWe3AyAWmLhAth_keHOOL_ZhqvY0mSN8sAWtqpUdos9TCmFFIoZnhjv4qYafeNsKoI6GXXKmTcIrZ1xWYVkVzm1HJBVYukvqQIoD26Ls_T0YwOcZuKKi5-ORmX8XJ789eJRQ9quDaAKND-mwWIlThFfglMTWrelpk0FnmBferI6eCtj9J2psDicpxXUqWrXWTr1sQNlAy0f6QrbnRIkWF"
                />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-surface-container-high px-2 py-1 font-bold text-[10px] uppercase">Sports</span>
                <span className="font-black text-[10px] uppercase text-outline">Nov 02 • Manchester</span>
              </div>
              <h2 className="text-xl font-bold tracking-tighter leading-tight mb-8 group-hover:text-primary transition-colors">PREMIER LEAGUE: CITY VS UNITED</h2>
              <div className="mt-auto flex items-end justify-between border-t-2 border-surface-container pt-6">
                <div>
                  <span className="text-[10px] font-black text-outline block">FROM</span>
                  <span className="text-2xl font-black tracking-tighter">$145.00</span>
                </div>
                <button className="bg-primary text-on-primary px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">Get Tickets</button>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest p-6 flex flex-col group">
              <div className="mb-6 overflow-hidden">
                <img 
                  className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                  alt="Midnight Jazz" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeatUAhs6eORV6mSiuL5xI9p_tTUYY9jdtONTrgwrU8I1M2J8YyU4mp8QqBFAMZt8MMhoeNxXmgOu_STKfuKyCYDMX-kWXJNxnaP4ExHEBWW5jm3EerOAn7XBtiqFtS1zki42uRZLfyyTUURRqPrMxGjIwAWmzSePuETCo2xU2_3DW0DvA65BcUxw4VH1VfR4FJW6OqTtK76ZCeCFPmFC9QK5z-ZyhUJ5HpgNihOwL2HMGaU9RxB54UBpGpp3NQAAb-4fDGxSaeCZo"
                />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-surface-container-high px-2 py-1 font-bold text-[10px] uppercase">Arts</span>
                <span className="font-black text-[10px] uppercase text-outline">Nov 15 • New York</span>
              </div>
              <h2 className="text-xl font-bold tracking-tighter leading-tight mb-8 group-hover:text-primary transition-colors">MIDNIGHT JAZZ: THE BLUE NOTE SESSIONS</h2>
              <div className="mt-auto flex items-end justify-between border-t-2 border-surface-container pt-6">
                <div>
                  <span className="text-[10px] font-black text-outline block">FROM</span>
                  <span className="text-2xl font-black tracking-tighter">$62.00</span>
                </div>
                <button className="bg-primary text-on-primary px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">Get Tickets</button>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-surface-container-lowest p-6 flex flex-col group">
              <div className="mb-6 overflow-hidden">
                <img 
                  className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                  alt="Sonic Horizon Fest" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeBepghMr9XjJ17ilE2fZRgZlpET3SOLosYzycC9hf1YkzyKn4O_sKokr8B-5GbrVR_bYapgciUpBp64jN9ssLSUV8ZF4KWinelQYVhB1_TiM1FAqNULMQ12WS3yWMYv_jN_aDtnfIc8ew-OhCZlBw3aQl28v-hdPepXizWaL16YMvRxRm6oo_Qv8NDpkPg4h2bugAWj5hreTN5aUMIl5ZNo-6QIH7QemDRh5URQXgAD_DNo7ZcHe6BEjYx07ZeuxQ-AodLkEe51YE"
                />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-surface-container-high px-2 py-1 font-bold text-[10px] uppercase">Festival</span>
                <span className="font-black text-[10px] uppercase text-outline">Dec 01 • Barcelona</span>
              </div>
              <h2 className="text-xl font-bold tracking-tighter leading-tight mb-8 group-hover:text-primary transition-colors">SONIC HORIZON WINTER FEST</h2>
              <div className="mt-auto flex items-end justify-between border-t-2 border-surface-container pt-6">
                <div>
                  <span className="text-[10px] font-black text-outline block">FROM</span>
                  <span className="text-2xl font-black tracking-tighter">$210.00</span>
                </div>
                <button className="bg-primary text-on-primary px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">Get Tickets</button>
              </div>
            </div>

            {/* Card 5 (Sold Out Visual State) */}
            <div className="bg-surface-container-low p-6 flex flex-col group opacity-80">
              <div className="absolute top-6 right-6 z-10 bg-on-surface text-surface px-3 py-1 font-bold text-[10px] uppercase tracking-tighter">Sold Out</div>
              <div className="mb-6 overflow-hidden">
                <img 
                  className="w-full h-64 object-cover grayscale contrast-125" 
                  alt="Synthwave Masters" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSU0EBGwr5SlladoxQmGkhkKtmf8wzOUi9IcgY7gzS-XicI-1gvF8ZJIn2Wh45gSJ_zNyd9b3-SNukE4YkenyTAbJk-aMceXVrXvfmWAt6p_C10Y1zmjo1kqRCu38bgdPYmXVoY2AX5o7ZUEPD5Bk7el1cmlw7ZWA8nJRkKHPTsEH2TrPtXgYWrkxaRE-CDICvaHl88AljHmwtcx1jPu9U2jNxHXxRya2bNyIB9rO4CiOXix5R0hlTeGMF4OCgSa6eCP3mny6i4ev3"
                />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-surface-container-highest px-2 py-1 font-bold text-[10px] uppercase">Tech</span>
                <span className="font-black text-[10px] uppercase text-outline">Dec 05 • Berlin</span>
              </div>
              <h2 className="text-xl font-bold tracking-tighter leading-tight mb-8">SYNTHWAVE MASTERS: LIVE ANALOG</h2>
              <div className="mt-auto flex items-end justify-between border-t-2 border-surface-container pt-6">
                <div>
                  <span className="text-[10px] font-black text-outline block">FROM</span>
                  <span className="text-2xl font-black tracking-tighter line-through opacity-40">$45.00</span>
                </div>
                <button className="bg-surface-container-highest text-outline px-6 py-3 font-black text-xs uppercase tracking-widest cursor-not-allowed" disabled>Waitlist</button>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-surface-container-lowest p-6 flex flex-col group">
              <div className="mb-6 overflow-hidden">
                <img 
                  className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
                  alt="Neo-Tokyo Expo" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPPCJjtFBXh__bp1-Qx_fh0I6z5nYQnoPni6-C9_TZhsfiRfWOFgeE-QoAjivoKTr3hU4N8IMA7zZOf8I3xlyn5NLY2XV-aNiiaAXBO0RJvRRhrzbSZmO6owzea6rPaM63X3sTBiZfc1sPnLjKgp5hjSkoouLuFkute1XWhFcmgbMnklti21o2BfwAiPkQtjBL6ka14d3RtYmwcXPYRW0ZGFUZF8g-6nwAfWGViVGjU-NcB_oB_pqoJkzFXj-HgatSSzxkOAhLkVOC"
                />
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-surface-container-high px-2 py-1 font-bold text-[10px] uppercase">Culture</span>
                <span className="font-black text-[10px] uppercase text-outline">Dec 12 • Tokyo</span>
              </div>
              <h2 className="text-xl font-bold tracking-tighter leading-tight mb-8 group-hover:text-primary transition-colors">NEO-TOKYO: DIGITAL ART EXPO</h2>
              <div className="mt-auto flex items-end justify-between border-t-2 border-surface-container pt-6">
                <div>
                  <span className="text-[10px] font-black text-outline block">FROM</span>
                  <span className="text-2xl font-black tracking-tighter">$35.00</span>
                </div>
                <button className="bg-primary text-on-primary px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">Get Tickets</button>
              </div>
            </div>
          </div>

          {/* Pagination (Flat Style) */}
          <div className="mt-16 flex justify-center">
            <div className="flex gap-px bg-surface-container-highest border border-surface-container-highest">
              <button className="bg-surface-container-lowest w-12 h-12 flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors">1</button>
              <button className="bg-primary text-on-primary w-12 h-12 flex items-center justify-center font-bold">2</button>
              <button className="bg-surface-container-lowest w-12 h-12 flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors">3</button>
              <button className="bg-surface-container-lowest w-12 h-12 flex items-center justify-center font-bold hover:bg-primary hover:text-on-primary transition-colors">4</button>
              <button className="bg-surface-container-lowest px-6 h-12 flex items-center justify-center font-bold uppercase text-[10px] tracking-widest hover:bg-on-background hover:text-surface transition-colors">Next</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full border-t-0 flex flex-col">
        <div className="bg-blue-600 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="text-lg font-black text-white">TICKETRUSH</Link>
            <div className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400">© 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.</div>
          </div>
          <nav className="flex gap-8">
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Support</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Careers</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
