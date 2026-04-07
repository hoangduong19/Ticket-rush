import Link from 'next/link';

export default function CreateEvent() {
  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 sticky z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TicketRush</span>
            <div className="hidden md:flex gap-8">
              <Link href="/admin" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Dashboard</Link>
              <Link href="#" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Create An Event</Link>
              {/* <Link href="#" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase">Dashboard</Link>
              <Link href="#" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Orders</Link> */}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-900 dark:text-slate-100 text-3xl">account_circle</button>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        {/* Hero Title Section */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="bg-secondary text-on-secondary px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Admin Console</span>
              <h1 className="text-[3.5rem] font-extrabold leading-none tracking-tighter text-on-surface uppercase">Create Event</h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-surface-dim transition-colors">Discard Draft</button>
              <Link href="/admin/seating-map" className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-surface-dim transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">chair</span> Configure Map Seating
              </Link>
              <button className="bg-primary text-on-primary px-12 py-4 font-bold uppercase tracking-widest hover:bg-primary-dim transition-colors">Publish Event</button>
            </div>
          </div>
        </header>

        {/* Asymmetric Bento Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 gap-y-1 bg-surface-container">
          {/* Left Column: Core Details */}
          <section className="md:col-span-8 bg-surface-container-lowest p-12 space-y-12">
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Identity</label>
              <input 
                className="w-full text-2xl font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4 placeholder:text-surface-dim" 
                placeholder="ENTER EVENT NAME" 
                type="text"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Date & Time</label>
                <div className="relative">
                  <input 
                    className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4" 
                    type="datetime-local"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Venue Location</label>
                <input 
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4" 
                  placeholder="VENUE NAME OR ADDRESS" 
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Narrative</label>
              <textarea 
                className="w-full font-body bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4 resize-none" 
                placeholder="DESCRIBE THE EXPERIENCE..." 
                rows={6}
              ></textarea>
            </div>

            {/* Ticket Tiers Section */}
            <div className="space-y-6 pt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold uppercase tracking-tight">Ticket Architecture</h2>
                <button className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:opacity-80">
                  <span className="material-symbols-outlined text-lg">add_circle</span> Add Tier
                </button>
              </div>
              <div className="space-y-1 bg-surface-container">
                {/* VIP Tier */}
                <div className="grid grid-cols-12 gap-4 bg-surface-container-lowest p-4 items-center">
                  <div className="col-span-1 text-outline font-black text-xl">01</div>
                  <div className="col-span-5">
                    <input className="w-full font-bold bg-transparent border-0 border-b-2 border-outline-variant/20 focus:outline-none focus:border-primary focus:ring-0 transition-colors px-2 py-2" type="text" defaultValue="VIP" />
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 border-b-2 border-transparent focus-within:border-primary transition-colors">
                      <span className="font-bold text-outline">$</span>
                      <input className="w-full font-bold bg-transparent border-0 focus:ring-0 p-0" type="number" defaultValue="250.00" />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="bg-secondary text-on-secondary text-[10px] px-2 py-0.5 font-black uppercase">Live</span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button className="material-symbols-outlined text-outline hover:text-error transition-colors">delete</button>
                  </div>
                </div>

                {/* General Tier */}
                <div className="grid grid-cols-12 gap-4 bg-surface-container-lowest p-4 items-center">
                  <div className="col-span-1 text-outline font-black text-xl">02</div>
                  <div className="col-span-5">
                    <input className="w-full font-bold bg-transparent border-0 border-b-2 border-outline-variant/20 focus:outline-none focus:border-primary focus:ring-0 transition-colors px-2 py-2" type="text" defaultValue="General Admission" />
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 border-b-2 border-transparent focus-within:border-primary transition-colors">
                      <span className="font-bold text-outline">$</span>
                      <input className="w-full font-bold bg-transparent border-0 focus:ring-0 p-0" type="number" defaultValue="85.00" />
                    </div>
                  </div>
                  <div className="col-span-2 text-right"></div>
                  <div className="col-span-1 text-right">
                    <button className="material-symbols-outlined text-outline hover:text-error transition-colors">delete</button>
                  </div>
                </div>

                {/* Early Bird Tier */}
                <div className="grid grid-cols-12 gap-4 bg-surface-container-lowest p-4 items-center">
                  <div className="col-span-1 text-outline font-black text-xl">03</div>
                  <div className="col-span-5">
                    <input className="w-full font-bold bg-transparent border-0 border-b-2 border-outline-variant/20 focus:outline-none focus:border-primary focus:ring-0 transition-colors px-2 py-2" type="text" defaultValue="Early Bird" />
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2 bg-surface-container-high px-3 py-2 border-b-2 border-transparent focus-within:border-primary transition-colors">
                      <span className="font-bold text-outline">$</span>
                      <input className="w-full font-bold bg-transparent border-0 focus:ring-0 p-0" type="number" defaultValue="45.00" />
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="bg-tertiary text-on-tertiary text-[10px] px-2 py-0.5 font-black uppercase">Active</span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button className="material-symbols-outlined text-outline hover:text-error transition-colors">delete</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Assets & Config */}
          <aside className="md:col-span-4 flex flex-col gap-1">
            {/* Image Upload Block */}
            <div className="bg-surface-container-lowest p-12 flex-grow">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest block mb-4">Visual Asset</label>
              <div className="aspect-[4/5] bg-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 p-8 group cursor-pointer hover:bg-surface-variant transition-colors">
                <span className="material-symbols-outlined text-6xl text-outline mb-4 group-hover:scale-110 transition-transform">add_a_photo</span>
                <p className="font-bold text-sm uppercase tracking-widest text-center">Drag & Drop Cover Image</p>
                <p className="text-xs text-outline-variant mt-2">MIN. 1200 x 1500 PX</p>
              </div>
              <div className="mt-8 space-y-4">
                <div className="p-4 bg-surface-container-low">
                  <h4 className="text-xs font-black uppercase tracking-widest mb-1">Preview Style</h4>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-primary"></div>
                    <div className="w-8 h-8 bg-secondary"></div>
                    <div className="w-8 h-8 bg-tertiary"></div>
                    <div className="w-8 h-8 bg-on-background"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Config */}
            <div className="bg-surface-container-lowest p-12">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest block mb-6">Publication Settings</label>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm uppercase tracking-wider">Private Event</span>
                  <div className="w-12 h-6 bg-surface-container-high relative">
                    <div className="absolute left-0 top-0 h-6 w-6 bg-outline"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm uppercase tracking-wider">Highlight on Home</span>
                  <div className="w-12 h-6 bg-primary relative">
                    <div className="absolute right-0 top-0 h-6 w-6 bg-white"></div>
                  </div>
                </div>
                <div className="pt-6">
                  <button className="w-full bg-on-background text-surface py-4 font-bold uppercase tracking-widest text-sm hover:bg-outline transition-colors">Manage Permissions</button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Secondary Meta Section */}
        <section className="mt-1 gap-1 grid grid-cols-1 md:grid-cols-3">
          <div className="bg-surface-container-lowest p-8 border-t-4 border-primary">
            <span className="material-symbols-outlined text-primary mb-4">analytics</span>
            <h3 className="font-black text-lg uppercase mb-1">Forecasted Reach</h3>
            <p className="text-sm text-on-surface-variant font-body">Based on similar events in your region, expected traffic: <span className="font-bold text-on-surface">12.5k visitors</span>.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 border-t-4 border-secondary">
            <span className="material-symbols-outlined text-secondary mb-4">security</span>
            <h3 className="font-black text-lg uppercase mb-1">Access Control</h3>
            <p className="text-sm text-on-surface-variant font-body">Verification required for VIP check-in. <span className="font-bold text-on-surface">Digital ID only</span>.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 border-t-4 border-tertiary">
            <span className="material-symbols-outlined text-tertiary mb-4">share</span>
            <h3 className="font-black text-lg uppercase mb-1">Global Sync</h3>
            <p className="text-sm text-on-surface-variant font-body">Connect to <span className="font-bold text-on-surface">Instagram & TikTok</span> for automated promotional reels.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full border-t-0 mt-24">
        <div className="bg-blue-600 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="text-lg font-black text-white">TicketRush</span>
            <p className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest">© 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Support</Link>
              <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Terms</Link>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Privacy</Link>
              <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Careers</Link>
            </div>
          </div>
          <div className="flex gap-4">
            <span className="text-white text-2xl material-symbols-outlined cursor-pointer">language</span>
            <span className="text-white text-2xl material-symbols-outlined cursor-pointer">hub</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
