import Link from 'next/link';

export default function RealtimeSeatMonitor() {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary font-body">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface-container-high hidden md:flex flex-col shrink-0">
        <div className="px-6 py-8">
          <span className="text-2xl font-black tracking-tighter text-blue-600 uppercase">TicketRush</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/events/create" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">event</span>
            <span>Create Event</span>
          </Link>
          {/* <Link href="/admin/seating-map" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">stadium</span>
            <span>Map Configurator</span>
          </Link> */}
          <Link href="/admin/monitor" className="flex items-center gap-3 px-4 py-3 bg-primary text-on-primary font-bold transition-colors">
            <span className="material-symbols-outlined">map</span>
            <span>Live Monitor</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">monitoring</span>
            <span>Analytics</span>
          </Link>
          {/* <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">receipt_long</span>
            <span>Orders</span>
          </Link> */}
        </nav>
        <div className="p-6 bg-surface-container-highest">
          <div className="flex items-center gap-3">
            <img alt="Admin Avatar" className="w-10 h-10 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8XpUv4yqBXDrN1KvICMpWaJHrMpiDTWZwMrNjzP_2ur60ZDgE4MHY2yIyw9IN5k7zr2zIL7fBUtyiBCmVcdnXG0oyYWfTaPF7NFxvWdAt9ajMfjdTw58llPabfSMKOjyPHIrBgNPQezsReKnl1wkkdmvVEPQhdPkJHmyXElIqk1YtkbVyfWnPRd-2xP_9EI2eDvJJ8zRt2fGSY1tTHmsHwCOEGCnav0-zIk1bz6TXw0KYAGS0L1vlKoHDKUWa2507n-DGciQmvUXv"/>
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-on-surface-variant">System Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-slate-50 dark:bg-slate-950 flex justify-between items-center w-full px-6 py-4 max-w-none border-b border-surface-container-high sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500 uppercase">Live Monitor</h1>
            <nav className="hidden lg:flex gap-6">
              <Link href="/admin" className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-100">Dashboard</Link>
              <Link href="/admin/monitor" className="text-blue-600 dark:text-blue-500 font-bold border-b-4 border-blue-600 dark:border-blue-500">Live Monitor</Link>
              <Link href="/admin/analytics" className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-100">Analytics</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input className="bg-surface-container-high border-none px-4 py-2 text-sm w-64 focus:ring-0 focus:border-b-2 border-primary" placeholder="Search events..." type="text"/>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant">notifications</button>
            <img alt="User profile avatar" className="w-8 h-8 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCkfDv5XrdLhl0SVFaGkaQKNQI2HrMIvOjuEFugFnByZ3OcXLpuF33BrZg9iI2kWevmD0EZMznmBkQRjpLdN2SsBvteG-zWQiYliaCyAwwejbEPJe76K3obv40A8e8bu54MVfm12PNJ1Xv32OYTRpCtTktQiKqyf3ikCAZ5bJvhYWGtwPf4ydnLlnYShtxlVA9Aw918CoVoJupO010a3wEEiWU3tqo1WzUFOFz4W6e8y_ZURoRWmytRDtuX4jQ-zLcrC6WsyIyxtBX"/>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <main className="flex-grow overflow-y-auto p-8 bg-background">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-8 border-[0.5px] border-outline-variant/20 shadow-sm">
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Total Revenue</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-on-surface tracking-tighter">$1,248,500</span>
                <span className="text-[10px] font-bold text-tertiary mb-1">+12%</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Total Seats Sold</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-on-surface tracking-tighter">84.2%</span>
                <span className="text-xs font-bold text-outline mb-1">12,630/15,000</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Active Users in Queue</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-primary tracking-tighter">4,812</span>
                <span className="material-symbols-outlined text-primary mb-1 text-sm">groups</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Avg. Purchase Time</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-on-surface tracking-tighter">2m 45s</span>
                <span className="material-symbols-outlined text-outline mb-1 text-sm">timer</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Visual Map Section */}
            <section className="flex-grow w-full bg-surface-container-lowest p-0 relative min-h-[600px] border border-outline-variant/20 shadow-sm">
              {/* Venue Filter Toolbar */}
              <div className="bg-surface-container-high px-6 py-4 flex items-center justify-between border-b border-outline-variant/20">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-outline uppercase tracking-widest">Selected Venue</span>
                    <span className="text-sm font-black text-on-surface uppercase">Arena_Global_X</span>
                  </div>
                  <div className="h-8 w-[1px] bg-outline-variant/30"></div>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase rounded-[1px]">Main Floor</button>
                    <button className="px-4 py-1.5 bg-surface-container text-on-surface text-[10px] font-black uppercase hover:bg-surface-container-highest transition-colors rounded-[1px]">Level 100</button>
                    <button className="px-4 py-1.5 bg-surface-container text-on-surface text-[10px] font-black uppercase hover:bg-surface-container-highest transition-colors rounded-[1px]">VIP Lounges</button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-outline uppercase">Zoom: 100%</span>
                  <div className="flex bg-surface-container rounded-[1px] overflow-hidden">
                    <button className="p-2 border-r border-outline-variant/20 hover:bg-surface-container-highest"><span className="material-symbols-outlined text-sm">add</span></button>
                    <button className="p-2 hover:bg-surface-container-highest"><span className="material-symbols-outlined text-sm">remove</span></button>
                  </div>
                </div>
              </div>

              {/* Seating Map Grid (Abstract Representation) */}
              <div className="p-8 flex flex-col items-center">
                <div className="w-full max-w-4xl">
                  {/* Stage */}
                  <div className="w-full h-12 bg-on-surface text-white flex items-center justify-center font-black uppercase tracking-[0.5em] mb-16 shadow-md rounded-[1px]">
                    THE STAGE
                  </div>
                  {/* Grid of Seats */}
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                    {/* 5 Rows of VIP */}
                    {Array.from({ length: 5 }).map((_, r) => 
                      Array.from({ length: 24 }).map((_, s) => {
                        const isSold = ((r * 24 + s) * 7) % 11 === 0; // Pseudo-random determinism
                        const color = isSold ? 'bg-outline-variant opacity-60' : 'bg-secondary';
                        return <div key={`vip-${r}-${s}`} className={`w-full aspect-square ${color} rounded-[1px]`}></div>;
                      })
                    )}
                    {/* 10 Rows of Regular/Locked */}
                    {Array.from({ length: 10 }).map((_, r) => 
                      Array.from({ length: 24 }).map((_, s) => {
                        const idx = r * 24 + s;
                        let color = 'bg-primary-container'; // Available
                        if (idx % 11 === 0) color = 'bg-error cursor-not-allowed'; // Locked
                        else if (idx % 3 === 0) color = 'bg-primary opacity-90'; // Sold Regular
                        return <div key={`reg-${r}-${s}`} className={`w-full aspect-square ${color} rounded-[1px]`}></div>;
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-6 left-6 flex gap-6 bg-surface-container-lowest p-4 border border-outline-variant/20 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary-container block border border-outline-variant/30"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-on-surface">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary block border border-outline-variant/30"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-on-surface">Sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-secondary block border border-outline-variant/30"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-on-surface">VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-error block border border-outline-variant/30"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-on-surface">Locked</span>
                </div>
              </div>
            </section>

            {/* Live Feed Panel */}
            <aside className="w-full lg:w-96 bg-surface-container-lowest border border-outline-variant/20 flex flex-col shrink-0 h-[600px] shadow-sm">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                  <h3 className="text-sm font-black uppercase tracking-tight">Live_Order_Feed</h3>
                </div>
                <span className="text-[9px] font-bold text-outline">REFRESH: 0.5S</span>
              </div>
              <div className="flex-grow overflow-y-auto">
                <div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-[2px]">#ORD-99214</span>
                    <span className="text-[9px] font-bold text-outline uppercase animate-pulse">2s AGO</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-[2px]">
                      <span className="material-symbols-outlined text-on-surface text-sm">person</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] font-black text-on-surface uppercase">A_HENDERSON</p>
                      <p className="text-[10px] font-bold text-outline border-l-2 border-primary pl-2 mt-0.5">SEC: 102 | ROW: G | SEAT: 12</p>
                    </div>
                    <span className="text-xs font-black text-tertiary">$185.00</span>
                  </div>
                </div>

                <div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors bg-secondary/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black bg-secondary text-white px-2 py-0.5 rounded-[2px]">#VIP-1102</span>
                    <span className="text-[9px] font-bold text-outline uppercase">8s AGO</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-[2px]">
                      <span className="material-symbols-outlined text-secondary text-sm">stars</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] font-black text-on-surface uppercase">M_RODRIGUEZ</p>
                      <p className="text-[10px] font-bold text-outline border-l-2 border-secondary pl-2 mt-0.5">BOX: B | SEAT: 01-04</p>
                    </div>
                    <span className="text-xs font-black text-tertiary">$1,200.00</span>
                  </div>
                </div>

                <div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-[2px]">#ORD-99212</span>
                    <span className="text-[9px] font-bold text-outline uppercase">14s AGO</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-[2px]">
                      <span className="material-symbols-outlined text-on-surface text-sm">person</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] font-black text-on-surface uppercase">S_CHEN</p>
                      <p className="text-[10px] font-bold text-outline border-l-2 border-primary pl-2 mt-0.5">SEC: 201 | ROW: A | SEAT: 45</p>
                    </div>
                    <span className="text-xs font-black text-tertiary">$95.00</span>
                  </div>
                </div>

                <div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-[2px]">#ORD-99211</span>
                    <span className="text-[9px] font-bold text-outline uppercase">32s AGO</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-[2px]">
                      <span className="material-symbols-outlined text-on-surface text-sm">person</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] font-black text-on-surface uppercase">T_WILSON</p>
                      <p className="text-[10px] font-bold text-outline border-l-2 border-primary pl-2 mt-0.5">SEC: 105 | ROW: L | SEAT: 08</p>
                    </div>
                    <span className="text-xs font-black text-tertiary">$210.00</span>
                  </div>
                </div>

                <div className="p-4 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black bg-primary text-white px-2 py-0.5 rounded-[2px]">#ORD-99209</span>
                    <span className="text-[9px] font-bold text-outline uppercase">1m AGO</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-[2px]">
                      <span className="material-symbols-outlined text-on-surface text-sm">person</span>
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] font-black text-on-surface uppercase">J_DOE</p>
                      <p className="text-[10px] font-bold text-outline border-l-2 border-primary pl-2 mt-0.5">SEC: 304 | ROW: D | SEAT: 15</p>
                    </div>
                    <span className="text-xs font-black text-tertiary">$65.00</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-surface-container-high py-4 text-[11px] font-black uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
                VIEW_ALL_TRANSACTIONS
              </button>
            </aside>
          </div>

          {/* Bottom Detail Panel */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-lowest p-6 border border-outline-variant/20 shadow-sm">
              <h4 className="text-xs font-black uppercase mb-4 tracking-widest border-b border-outline-variant/20 pb-2">Sales Velocity (Last 60m)</h4>
              <div className="h-32 flex items-end gap-1 px-2 pt-4">
                {Array.from({ length: 30 }).map((_, i) => {
                  const height = 20 + ((i * 17) % 60); // Deterministic pseudo-random height
                  const color = height > 70 ? 'bg-primary' : 'bg-primary-container';
                  return <div key={i} className={`${color} w-full rounded-t-[1px] opacity-90`} style={{ height: `${height}%` }}></div>;
                })}
              </div>
              <div className="flex justify-between mt-2 text-[9px] font-bold text-outline uppercase">
                <span>60m ago</span>
                <span>Now</span>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-6 border border-outline-variant/20 shadow-sm">
              <h4 className="text-xs font-black uppercase mb-4 tracking-widest border-b border-outline-variant/20 pb-2">Queue Distribution</h4>
              <div className="flex items-center justify-between h-32 px-4 pt-4">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-on-surface">32%</span>
                  <span className="text-[10px] font-bold text-outline uppercase mt-2">Browsing</span>
                </div>
                <div className="w-[1px] h-12 bg-outline-variant/20"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-primary">54%</span>
                  <span className="text-[10px] font-bold text-outline uppercase mt-2">In Cart</span>
                </div>
                <div className="w-[1px] h-12 bg-outline-variant/20"></div>
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-secondary">14%</span>
                  <span className="text-[10px] font-bold text-outline uppercase mt-2">Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
