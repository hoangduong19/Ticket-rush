import Link from 'next/link';

export default function OrderManagement() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-['Inter']">
      {/* TopAppBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TicketRush</Link>
            <nav className="hidden md:flex gap-8">
              <Link href="/events" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Events</Link>
              <Link href="/tickets" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">My Tickets</Link>
              <Link href="/dashboard" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Dashboard</Link>
              <Link href="/orders" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-bold tracking-tight uppercase px-2">Orders</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-on-surface text-2xl" data-icon="account_circle">account_circle</span>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      <main className="flex-grow p-8 md:p-12">
        {/* Dashboard Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-2xl">
            <span className="text-label-md font-bold text-primary uppercase tracking-[0.2em] block mb-2">Internal Administration</span>
            <h1 className="text-5xl font-extrabold tracking-tighter text-on-background leading-none">ORDER MANAGEMENT</h1>
            <p className="mt-4 text-on-surface-variant font-medium max-w-md">Real-time oversight of transactional flow. Precisely manage refunds and customer inquiries from a single architectural view.</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-high p-1 w-full md:w-96 border-b-2 border-transparent focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined ml-3 text-outline" data-icon="search">search</span>
            <input 
              className="bg-transparent border-none focus:outline-none focus:ring-0 w-full font-bold text-xs uppercase tracking-widest placeholder:text-outline py-4" 
              placeholder="SEARCH ORDERS, EVENTS, OR CUSTOMERS" 
              type="text"
            />
          </div>
        </div>

        {/* Metric Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-surface-variant mb-12">
          <div className="bg-surface-container-lowest p-8">
            <span className="block text-xs font-bold text-outline tracking-widest uppercase mb-4">Total Revenue</span>
            <span className="text-4xl font-extrabold tracking-tighter text-on-surface">$1,248,902</span>
          </div>
          <div className="bg-surface-container-lowest p-8">
            <span className="block text-xs font-bold text-outline tracking-widest uppercase mb-4">Orders Today</span>
            <span className="text-4xl font-extrabold tracking-tighter text-on-surface">432</span>
          </div>
          <div className="bg-surface-container-lowest p-8">
            <span className="block text-xs font-bold text-secondary tracking-widest uppercase mb-4">Pending Actions</span>
            <span className="text-4xl font-extrabold tracking-tighter text-secondary">18</span>
          </div>
          <div className="bg-surface-container-lowest p-8">
            <span className="block text-xs font-bold text-tertiary tracking-widest uppercase mb-4">Refund Rate</span>
            <span className="text-4xl font-extrabold tracking-tighter text-tertiary">1.2%</span>
          </div>
        </div>

        {/* Data Table Section */}
        <section className="bg-surface-container-lowest overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high">
                <th className="px-6 py-5 text-xs font-bold tracking-widest uppercase text-on-surface-variant">Order ID</th>
                <th className="px-6 py-5 text-xs font-bold tracking-widest uppercase text-on-surface-variant">Customer Name</th>
                <th className="px-6 py-5 text-xs font-bold tracking-widest uppercase text-on-surface-variant">Event</th>
                <th className="px-6 py-5 text-xs font-bold tracking-widest uppercase text-on-surface-variant text-right">Amount</th>
                <th className="px-6 py-5 text-xs font-bold tracking-widest uppercase text-on-surface-variant text-center">Status</th>
                <th className="px-6 py-5 text-xs font-bold tracking-widest uppercase text-on-surface-variant text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {/* Row 1 */}
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-6 font-bold text-sm tracking-tight">TR-882910</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center text-on-primary text-[10px] font-black">AM</div>
                    <span className="font-semibold text-sm">Alexander Mitchell</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-medium">NEON DREAMS TOUR - NYC</td>
                <td className="px-6 py-6 text-right font-bold text-sm">$245.00</td>
                <td className="px-6 py-6 text-center">
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] font-black uppercase tracking-tighter">Completed</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="bg-surface-container-highest hover:bg-surface-dim text-on-surface text-[10px] font-black uppercase px-4 py-2 transition-colors">View Details</button>
                    <button className="bg-secondary hover:bg-secondary-dim text-on-secondary text-[10px] font-black uppercase px-4 py-2 transition-colors">Refund</button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-6 font-bold text-sm tracking-tight">TR-882911</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center text-on-primary text-[10px] font-black">SL</div>
                    <span className="font-semibold text-sm">Sarah Lundgren</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-medium">COACHELLA 2024 - WEEKEND 1</td>
                <td className="px-6 py-6 text-right font-bold text-sm">$899.50</td>
                <td className="px-6 py-6 text-center">
                  <span className="bg-primary text-on-primary px-3 py-1 text-[10px] font-black uppercase tracking-tighter">Pending</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="bg-surface-container-highest hover:bg-surface-dim text-on-surface text-[10px] font-black uppercase px-4 py-2 transition-colors">View Details</button>
                    <button className="bg-secondary hover:bg-secondary-dim text-on-secondary text-[10px] font-black uppercase px-4 py-2 transition-colors">Refund</button>
                  </div>
                </td>
              </tr>
              {/* Row 3 */}
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-6 font-bold text-sm tracking-tight">TR-882912</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center text-on-primary text-[10px] font-black">JK</div>
                    <span className="font-semibold text-sm">Julian Kasper</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-medium">MET OPERA: CARMEN</td>
                <td className="px-6 py-6 text-right font-bold text-sm">$120.00</td>
                <td className="px-6 py-6 text-center">
                  <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 text-[10px] font-black uppercase tracking-tighter">Refunded</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="bg-surface-container-highest hover:bg-surface-dim text-on-surface text-[10px] font-black uppercase px-4 py-2 transition-colors">View Details</button>
                    <button className="opacity-30 cursor-not-allowed bg-secondary text-on-secondary text-[10px] font-black uppercase px-4 py-2">Refund</button>
                  </div>
                </td>
              </tr>
              {/* Row 4 */}
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-6 font-bold text-sm tracking-tight">TR-882913</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center text-on-primary text-[10px] font-black">RE</div>
                    <span className="font-semibold text-sm">Rachel Edwards</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-medium">FORMULA 1 MONACO GP</td>
                <td className="px-6 py-6 text-right font-bold text-sm">$3,400.00</td>
                <td className="px-6 py-6 text-center">
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] font-black uppercase tracking-tighter">Completed</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="bg-surface-container-highest hover:bg-surface-dim text-on-surface text-[10px] font-black uppercase px-4 py-2 transition-colors">View Details</button>
                    <button className="bg-secondary hover:bg-secondary-dim text-on-secondary text-[10px] font-black uppercase px-4 py-2 transition-colors">Refund</button>
                  </div>
                </td>
              </tr>
              {/* Row 5 */}
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-6 font-bold text-sm tracking-tight">TR-882914</td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center text-on-primary text-[10px] font-black">DB</div>
                    <span className="font-semibold text-sm">Daniel Brooks</span>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm font-medium">HANS ZIMMER LIVE</td>
                <td className="px-6 py-6 text-right font-bold text-sm">$185.00</td>
                <td className="px-6 py-6 text-center">
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 text-[10px] font-black uppercase tracking-tighter">Completed</span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="bg-surface-container-highest hover:bg-surface-dim text-on-surface text-[10px] font-black uppercase px-4 py-2 transition-colors">View Details</button>
                    <button className="bg-secondary hover:bg-secondary-dim text-on-secondary text-[10px] font-black uppercase px-4 py-2 transition-colors">Refund</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="p-6 flex justify-between items-center bg-surface-container-low">
            <span className="text-xs font-bold text-outline tracking-widest uppercase">Showing 1-5 of 12,482 orders</span>
            <div className="flex gap-1">
              <button className="bg-surface-container-highest p-3 hover:bg-surface-dim transition-colors">
                <span className="material-symbols-outlined text-sm leading-none" data-icon="chevron_left">chevron_left</span>
              </button>
              <button className="bg-primary text-on-primary px-4 py-2 text-[10px] font-black">1</button>
              <button className="bg-surface-container-lowest text-on-surface px-4 py-2 text-[10px] font-black hover:bg-surface-container-high">2</button>
              <button className="bg-surface-container-lowest text-on-surface px-4 py-2 text-[10px] font-black hover:bg-surface-container-high">3</button>
              <button className="bg-surface-container-highest p-3 hover:bg-surface-dim transition-colors">
                <span className="material-symbols-outlined text-sm leading-none" data-icon="chevron_right">chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        {/* Notification Banner */}
        <div className="mt-12 bg-secondary flex items-center p-6 gap-6">
          <span className="material-symbols-outlined text-on-secondary text-3xl" data-icon="warning" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
          <div className="flex-grow">
            <h4 className="text-on-secondary font-black text-sm uppercase tracking-widest">Urgent Maintenance Notice</h4>
            <p className="text-on-secondary opacity-80 text-xs font-medium uppercase mt-1">Payment gateway synchronization scheduled for 02:00 UTC. Refund processing may be delayed during this window.</p>
          </div>
          <button className="border-2 border-on-secondary text-on-secondary px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-on-secondary hover:text-secondary transition-colors">Dismiss</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full border-t-0 mt-auto">
        <div className="bg-blue-600 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full gap-8">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-lg font-black text-white">TICKETRUSH</Link>
            <span className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest">© 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.</span>
          </div>
          <nav className="flex gap-12">
            <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Support</Link>
            <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Terms</Link>
            <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Privacy</Link>
            <Link href="#" className="text-slate-400 font-['Inter'] font-bold text-xs uppercase tracking-widest hover:text-blue-500 transition-colors">Careers</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
