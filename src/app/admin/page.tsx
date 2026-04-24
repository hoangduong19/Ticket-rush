import Link from 'next/link';
import Image from 'next/image';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface-container-high hidden md:flex flex-col">
        <div className="px-6 py-8">
          <span className="text-2xl font-black tracking-tighter text-blue-600 uppercase">TicketRush</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary text-on-primary font-bold">
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
          <Link href="/admin/monitor" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopNavBar */}
        <header className="bg-slate-50 dark:bg-slate-950 flex justify-between items-center w-full px-6 py-4 max-w-none">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500 uppercase">Dashboard</h1>
            <nav className="hidden lg:flex gap-6">
              <Link href="/admin" className="text-blue-600 dark:text-blue-500 font-bold border-b-4 border-blue-600 dark:border-blue-500">Dashboard</Link>
              <Link href="/admin/monitor" className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-100">Live Monitor</Link>
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

        {/* Dashboard Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto space-y-8">
          {/* Status Bar */}
          <div className="bg-surface-container-low p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[0.75rem] font-bold uppercase tracking-wider text-on-surface-variant block">CURRENT MONITORING</span>
              <h2 className="text-xl font-bold tracking-tight">Summer Music Festival</h2>
            </div>
            <div className="flex gap-4">
              <div className="bg-secondary px-4 py-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-white animate-pulse"></span>
                <span className="text-[0.75rem] font-bold text-on-secondary uppercase">Live Data Feed</span>
              </div>
              <button className="bg-primary text-on-primary px-6 py-2 font-bold hover:bg-primary-dim transition-colors">EXPORT REPORT</button>
            </div>
          </div>

          {/* Bento Grid for Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6">
            {/* Total Revenue Widget */}
            <div className="lg:col-span-8 bg-surface-container-lowest p-8 flex flex-col justify-between">
              <div>
                <span className="text-[0.75rem] font-bold text-primary uppercase tracking-[0.2em] mb-4 block">Total Revenue</span>
                <div className="text-[3.5rem] font-extrabold leading-none tracking-tighter text-on-surface">
                  $1,250,400
                </div>
              </div>
              <div className="mt-12 flex items-end justify-between border-t border-surface-container py-6">
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface-variant">Growth vs LY</span>
                  <span className="text-tertiary font-bold text-xl">+24.8%</span>
                </div>
                {/* Simple Bar Mockup for Revenue Trend */}
                <div className="flex gap-1 items-end h-16">
                  <div className="bg-surface-container-highest w-4 h-8"></div>
                  <div className="bg-surface-container-highest w-4 h-12"></div>
                  <div className="bg-surface-container-highest w-4 h-10"></div>
                  <div className="bg-primary w-4 h-16"></div>
                </div>
              </div>
            </div>

            {/* Seat Occupancy Widget */}
            <div className="lg:col-span-4 bg-surface-container-lowest p-8 flex flex-col items-center justify-center text-center">
              <span className="text-[0.75rem] font-bold text-secondary uppercase tracking-[0.2em] mb-8 block self-start">Seat Occupancy</span>
              {/* Flat Donut Chart Mockup */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container" cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeWidth="24"></circle>
                  <circle className="text-secondary" cx="50%" cy="50%" fill="transparent" r="40%" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="37.6" strokeWidth="24"></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold">85%</span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase">Sold Out</span>
                </div>
              </div>
              <div className="mt-8 w-full space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span>VIP Section</span>
                  <span className="text-secondary">98%</span>
                </div>
                <div className="w-full h-2 bg-surface-container">
                  <div className="h-full bg-secondary w-[98%]"></div>
                </div>
              </div>
            </div>

            {/* Audience Demographics: Age */}
            <div className="lg:col-span-6 bg-surface-container-lowest p-8">
              <span className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-8 block">Age Demographics</span>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">18-24</span>
                    <span className="text-on-surface-variant">40%</span>
                  </div>
                  <div className="w-full h-8 bg-surface-container-high">
                    <div className="h-full bg-primary w-[40%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">25-34</span>
                    <span className="text-on-surface-variant">30%</span>
                  </div>
                  <div className="w-full h-8 bg-surface-container-high">
                    <div className="h-full bg-primary-container w-[30%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold">35+</span>
                    <span className="text-on-surface-variant">30%</span>
                  </div>
                  <div className="w-full h-8 bg-surface-container-high">
                    <div className="h-full bg-surface-container-highest w-[30%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audience Demographics: Gender */}
            <div className="lg:col-span-6 bg-surface-container-lowest p-8 flex flex-col">
              <span className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-[0.2em] mb-8 block">Gender Split</span>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex h-16 w-full">
                  <div className="bg-primary flex items-center px-4 transition-transform hover:scale-[1.02]" style={{ width: '60%' }}>
                    <span className="text-on-primary font-bold">60% MALE</span>
                  </div>
                  <div className="bg-secondary flex items-center px-4 justify-end transition-transform hover:scale-[1.02]" style={{ width: '40%' }}>
                    <span className="text-on-secondary font-bold">40% FEMALE</span>
                  </div>
                </div>
                <div className="mt-12 flex justify-between items-center bg-surface p-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-3xl">person</span>
                    <div>
                      <p className="text-[0.6rem] font-black uppercase text-on-surface-variant">Active Buyers</p>
                      <p className="text-xl font-bold">12,450</p>
                    </div>
                  </div>
                  <div className="h-10 w-[2px] bg-surface-container-highest"></div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary text-3xl">female</span>
                    <div>
                      <p className="text-[0.6rem] font-black uppercase text-on-surface-variant">Growth Rate</p>
                      <p className="text-xl font-bold">+12%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions / Feed */}
            <div className="lg:col-span-12 bg-surface-container-lowest p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold tracking-tight">Real-Time Ticket Feed</h3>
                <span className="bg-tertiary-container text-on-tertiary-container text-[0.7rem] font-bold px-3 py-1">LIVE UPDATE</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b-2 border-surface-container-high">
                    <tr className="text-[0.7rem] font-black uppercase tracking-widest text-on-surface-variant">
                      <th className="py-4 px-2">Order ID</th>
                      <th className="py-4 px-2">Customer</th>
                      <th className="py-4 px-2">Zone</th>
                      <th className="py-4 px-2">Price</th>
                      <th className="py-4 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 px-2 font-mono text-xs">#TR-89021</td>
                      <td className="py-4 px-2 font-bold">Marcus Thorne</td>
                      <td className="py-4 px-2">Pit A (Standing)</td>
                      <td className="py-4 px-2 font-bold">$189.00</td>
                      <td className="py-4 px-2 text-right">
                        <span className="bg-tertiary text-on-tertiary text-[0.65rem] font-bold px-2 py-1">COMPLETED</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 px-2 font-mono text-xs">#TR-89020</td>
                      <td className="py-4 px-2 font-bold">Sarah Jenkins</td>
                      <td className="py-4 px-2">VIP Terrace</td>
                      <td className="py-4 px-2 font-bold">$450.00</td>
                      <td className="py-4 px-2 text-right">
                        <span className="bg-tertiary text-on-tertiary text-[0.65rem] font-bold px-2 py-1">COMPLETED</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-4 px-2 font-mono text-xs">#TR-89019</td>
                      <td className="py-4 px-2 font-bold">Leo Martinez</td>
                      <td className="py-4 px-2">General Admission</td>
                      <td className="py-4 px-2 font-bold">$120.00</td>
                      <td className="py-4 px-2 text-right">
                        <span className="bg-secondary text-on-secondary text-[0.65rem] font-bold px-2 py-1">PENDING</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-100 dark:bg-slate-900 w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 border-t-2 border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-2">
            <span className="text-lg font-extrabold uppercase text-slate-900 dark:text-slate-100">TicketRush</span>
            <p className="font-['Inter'] text-sm tracking-tight text-slate-500 dark:text-slate-400">© 2026 TicketRush. Precision Engineered.</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center">
            <Link href="#" className="font-['Inter'] text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200">Help Center</Link>
            <Link href="#" className="font-['Inter'] text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200">Privacy Policy</Link>
            <Link href="#" className="font-['Inter'] text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200">Terms of Service</Link>
            <Link href="#" className="font-['Inter'] text-sm tracking-tight text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200">Contact</Link>
          </div>
        </footer>
      </div>

      {/* Mobile Bottom Navigation Shell */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest flex justify-around items-center h-16 border-t border-surface-container-highest z-50">
        <Link href="/admin" className="flex flex-col items-center text-primary">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </Link>
        <Link href="/admin/seating-map" className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">stadium</span>
          <span className="text-[10px] font-bold uppercase">Map</span>
        </Link>
        <Link href="/admin/monitor" className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">map</span>
          <span className="text-[10px] font-bold uppercase">Live feed</span>
        </Link>
        <Link href="/admin/analytics" className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="text-[10px] font-bold uppercase">Stats</span>
        </Link>
      </nav>
    </div>
  );
}
