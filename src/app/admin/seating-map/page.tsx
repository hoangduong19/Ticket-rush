import Link from 'next/link';

export default function SeatingMapConfigurator() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TicketRush</div>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/admin" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase">Dashboard</Link>
            <Link href="/admin/monitor" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase">Live Monitor</Link>
            <Link href="/admin/analytics" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase">Analytics</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <input
                className="bg-surface-container-high border-none px-4 py-2 text-sm w-64 focus:ring-0 focus:outline-none focus:border-b-2 border-transparent focus:border-primary transition-colors"
                placeholder="Search venues..."
                type="text"
              />
            </div>
            <button className="material-symbols-outlined text-slate-900 dark:text-slate-100">account_circle</button>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-full md:w-80 bg-surface-container-low flex flex-col shrink-0">
          {/* Tool Header */}
          <div className="p-6 bg-surface-container-highest">
            <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant mb-2">MAP CONFIGURATOR</p>
            <h1 className="text-xl font-bold tracking-tight">ARENA_SEATING_V4</h1>
          </div>
          <div className="p-6 space-y-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Tool Palette */}
            <section>
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant mb-4">Placement Tools</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-primary text-on-primary p-4 flex flex-col items-center gap-2 hover:bg-primary-dim transition-colors">
                  <span className="material-symbols-outlined">add_box</span>
                  <span className="font-bold text-[0.75rem] uppercase">Add Section</span>
                </button>
                <button className="bg-surface-container-lowest text-on-surface p-4 flex flex-col items-center gap-2 hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined">grid_view</span>
                  <span className="font-bold text-[0.75rem] uppercase">Mass Edit</span>
                </button>
              </div>
            </section>

            {/* Section Properties */}
            <section className="space-y-4">
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant">Section Detail</p>
              <div className="bg-surface-container-lowest p-4 space-y-4">
                <div>
                  <label className="block font-bold text-[0.65rem] uppercase mb-1">Section Label</label>
                  <input
                    className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
                    type="text"
                    defaultValue="VIP NORTH"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[0.65rem] uppercase mb-1">Rows</label>
                    <input
                      className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
                      type="number"
                      defaultValue="12"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[0.65rem] uppercase mb-1">Seats/Row</label>
                    <input
                      className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
                      type="number"
                      defaultValue="24"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-[0.65rem] uppercase mb-1">Price Tier</label>
                  <select
                    className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
                    defaultValue="VIP - $249.00"
                  >
                    <option value="PLATINUM - $499.00">PLATINUM - $499.00</option>
                    <option value="VIP - $249.00">VIP - $249.00</option>
                    <option value="GENERAL - $89.00">GENERAL - $89.00</option>
                  </select>
                </div>
                <button className="w-full bg-secondary text-on-secondary py-3 font-bold text-[0.75rem] uppercase hover:bg-secondary-dim transition-colors">Apply Changes</button>
              </div>
            </section>

            {/* Legend */}
            <section>
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant mb-4">Status Indicators</p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-primary"></div>
                  <span className="text-[0.75rem] font-bold uppercase">Active Section</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-tertiary"></div>
                  <span className="text-[0.75rem] font-bold uppercase">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-secondary"></div>
                  <span className="text-[0.75rem] font-bold uppercase">Reserved/Sold</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-surface-dim"></div>
                  <span className="text-[0.75rem] font-bold uppercase">Disabled</span>
                </div>
              </div>
            </section>
          </div>
        </aside>

        {/* Canvas Area */}
        <section className="flex-grow bg-surface relative overflow-hidden flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-surface-container border-b-0 px-6 py-4 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">zoom_in</button>
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">zoom_out</button>
              <div className="h-8 w-[1px] bg-outline-variant opacity-20"></div>
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">undo</button>
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">redo</button>
            </div>
            <div className="flex gap-2">
              <span className="bg-secondary px-3 py-1 text-on-secondary font-bold text-[0.65rem] tracking-tighter uppercase self-center">LIVE SYNC ACTIVE</span>
              <button className="bg-surface-container-lowest px-4 py-2 font-bold text-[0.75rem] uppercase border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors">Save Draft</button>
            </div>
          </div>

          {/* The Grid Interface */}
          <div className="flex-grow overflow-auto p-12 bg-surface cursor-crosshair">
            {/* Mockup Seating Layout */}
            <div className="mx-auto w-fit space-y-12">
              {/* Stage Graphic */}
              <div className="w-[600px] h-20 bg-on-surface flex items-center justify-center mx-auto">
                <span className="text-surface font-black tracking-[0.5em] text-xl">STAGE</span>
              </div>

              {/* Seating Grid Asymmetric */}
              <div className="flex flex-col items-center gap-16">
                {/* VIP Front Section */}
                <div className="relative group">
                  <div className="absolute -top-6 left-0 text-[0.65rem] font-bold text-primary uppercase">Section VIP_NORTH</div>
                  <div className="flex flex-col gap-1">
                    {/* Dynamically Rendered Seat Rows */}
                    <div className="flex gap-1 mb-1">
                      {/* Logic for rows */}
                      <div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div>
                      <div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div>
                      <div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div>
                      <div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div>
                    </div>
                    <div className="flex gap-1 mb-1">
                      <div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div>
                      <div className="w-4 h-4 bg-primary outline outline-offset-2 outline-primary"></div><div className="w-4 h-4 bg-primary outline outline-offset-2 outline-primary"></div><div className="w-4 h-4 bg-primary outline outline-offset-2 outline-primary"></div>
                      <div className="w-4 h-4 bg-primary outline outline-offset-2 outline-primary"></div><div className="w-4 h-4 bg-tertiary"></div><div class="w-4 h-4 bg-tertiary"></div>
                      <div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div>
                      <div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div>
                      <div className="w-4 h-4 bg-tertiary"></div><div class="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div>
                      <div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div><div className="w-4 h-4 bg-secondary"></div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 cursor-pointer"></div>
                </div>

                {/* Lower Bowl Left/Right */}
                <div className="flex gap-24">
                  {/* Left */}
                  <div className="space-y-1">
                    <div className="flex gap-1"><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div></div>
                  </div>
                  {/* Right */}
                  <div className="space-y-1">
                    <div className="flex gap-1"><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-surface-dim"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-surface-dim"></div><div className="w-4 h-4 bg-surface-dim"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-surface-dim"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div></div>
                    <div className="flex gap-1"><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div><div className="w-4 h-4 bg-tertiary"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zoom / Position Metadata */}
          <div className="absolute bottom-6 right-6 bg-surface-container-highest p-4 font-['Inter'] text-[0.7rem] font-bold uppercase tracking-widest flex gap-8">
            <div>X: 1,422px</div>
            <div>Y: 980px</div>
            <div className="text-primary">ZOOM: 125%</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full shrink-0 mt-auto">
        <div className="bg-blue-600 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-12 w-full gap-8">
          <div className="text-lg font-black text-white">TICKETRUSH</div>
          <div className="flex gap-8">
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Support</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Careers</Link>
          </div>
          <p className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400">© 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.</p>
        </div>
      </footer>
    </div>
  );
}
