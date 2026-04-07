import Link from 'next/link';

export default function CustomerLanding() {
  return (
    <div className="bg-background min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* TopNavBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 z-50 font-['Inter'] antialiased flat no-shadows">
        <div className="flex justify-between items-center px-8 h-20 max-w-full mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tighter text-blue-700 dark:text-blue-400 uppercase">TicketRush</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 px-2 py-1">Events</Link>
            <Link href="/tickets" className="text-blue-700 dark:text-blue-400 font-bold border-b-4 border-blue-700 dark:border-blue-400 pb-1 px-2">My Tickets</Link>
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 px-2 py-1">Dashboard</Link>
            <Link href="/orders" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 px-2 py-1">Orders</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-600 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95">notifications</button>
            <div className="w-10 h-10 bg-surface-container-high overflow-hidden">
              <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHOpIOpTbZuj4oyI3iklh8gVxENKWWrN9IFESFtSFs9ylUcUr5G0hYn8dJfGAQ7RHLsGMWYnzZwJB-O1wBYfp_eU4Fb-eQFqB6ZGRCO9iU9Ma1c1ZPAM8H9RethPR70iV0Rs_SMNXDMPrUAHa5Wvkiajmprg4EpJf9-0uN1GRnhzJK7Rk1RMHSUrj7dFDEhOth7tMJy7C4h_eabjLUs4DTvPh75i0mbT_pWqUYGNcMVXWYKg0bVnedID8UkJkgtzZ6Rw7JqtidvBs7" />
            </div>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[1px] w-full"></div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-8 py-12">
        <header className="mb-16">
          <h1 className="text-[3.5rem] font-extrabold tracking-tight text-on-surface leading-none mb-4">My Tickets</h1>
          <p className="text-on-surface-variant font-medium tracking-wide uppercase text-sm">Dashboard Overview • 4 Active Passes</p>
        </header>

        {/* Ticket Section: Upcoming */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-secondary text-on-secondary px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wider">Upcoming</span>
            <div className="flex-grow h-[2px] bg-surface-container-high"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ticket Card 1 */}
            <div className="bg-surface-container-lowest flex flex-col md:flex-row group transition-all">
              <div className="w-full md:w-48 h-64 md:h-auto overflow-hidden">
                <img alt="Event Image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7Kh67w9gyT4eb3MWTu-Fnt6Nzn26W7P9I02R4ekaSKsHDl3t77pFAD0tWR41w4CqjyI_VoJETVpPqTVaED9Rdxom4xOCMxBrx8HU0CJJ7BtLccd2ijARRmrxXX3HsNh2avOEAtUlEu3bCU4g8fWJ_X4yLSRP9i0IjuTk_3aAb8U_QqbH4yvZI8OFTed_MU5ytjR-E6uwsoMfdzd5BxwPNTQswsaYEbGBGwv0YXEWf5VlIt8mTud9zpBClGG36sBjf9roSzBcQVIjb" />
              </div>
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="mb-auto">
                  <p className="text-[0.75rem] font-bold text-primary uppercase tracking-widest mb-2">OCT 24, 2024 • 8:00 PM</p>
                  <h2 className="text-[1.375rem] font-bold text-on-surface mb-1 leading-tight">Neon Horizon Festival</h2>
                  <p className="text-on-surface-variant text-sm font-medium mb-6 uppercase tracking-tight">Main Arena • Section A, Row 12, Seat 45</p>
                  <div className="grid grid-cols-3 gap-4 bg-surface-container-low p-4">
                    <div>
                      <p className="text-[0.625rem] font-bold text-outline uppercase">Gate</p>
                      <p className="text-sm font-bold text-on-surface">NORTH 4</p>
                    </div>
                    <div>
                      <p className="text-[0.625rem] font-bold text-outline uppercase">Price</p>
                      <p className="text-sm font-bold text-on-surface">$189.00</p>
                    </div>
                    <div>
                      <p className="text-[0.625rem] font-bold text-outline uppercase">Type</p>
                      <p className="text-sm font-bold text-on-surface">VIP PASS</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <Link href="/event" className="bg-primary text-on-primary font-bold px-6 py-3 transition-colors hover:bg-primary-dim active:scale-95 text-sm uppercase inline-block text-center">Details</Link>
                  <div className="w-20 h-20 bg-white border border-surface-container-high p-1">
                    <img alt="Ticket QR Code" className="w-full h-full grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTLTOzQM-rLpL6N65sDA8i2fz8nylIsyOeXfyLaddgIpDflNgzqRjmU4ia3046DcjBtHFby98Pi4wfRGD-OFOVNIna2AZ7VYcNNYCJcmd5Q0qIMjKQdW7YCSnnrIB_m9l51Xk7TlcYbrya5yTHnJNW82Wz2Wy_KdljuTEXdIXPkibEkTs6tW1aO7a4TSsQ_mdFCFOY7UabQ4hAnN8qmh7A3Js3eHe3IZ6mD-hyRlyp71IuRAVV7SKBEybliN6IL0_HQX1a7bkvcB8Q" />
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Card 2 */}
            <div className="bg-surface-container-lowest flex flex-col md:flex-row group transition-all">
              <div className="w-full md:w-48 h-64 md:h-auto overflow-hidden">
                <img alt="Event Image" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAP2XJlDgTr7Q3dyFRqHi3jrKzeDp0sMpmbjBCLfeQftEQqi8V6Cs1FHoddr339XgWcBJ-n5ZXbqVbSSlX0jmHJkC4dboE4uKaZf8qE19UiC868GIxCTRLca02hWfqlUIUzFmf6C1Je7H2GjoCHyv-7hR1_f-kLOnfjzKeZijvYADey5xYjUBsIUb1ziVVdgK4JBDQrcQk7S_3cXsOqXZX1D6YRF4Mfv8j20bVS7RqjW-4Rl-HuIR8za2EYrbl8utrN5ByZ6vQxJam" />
              </div>
              <div className="p-8 flex flex-col flex-grow relative">
                <div className="mb-auto">
                  <p className="text-[0.75rem] font-bold text-primary uppercase tracking-widest mb-2">NOV 12, 2024 • 9:00 AM</p>
                  <h2 className="text-[1.375rem] font-bold text-on-surface mb-1 leading-tight">Global Tech Summit</h2>
                  <p className="text-on-surface-variant text-sm font-medium mb-6 uppercase tracking-tight">Convention Center • Hall 3, Seat B-09</p>
                  <div className="grid grid-cols-3 gap-4 bg-surface-container-low p-4">
                    <div>
                      <p className="text-[0.625rem] font-bold text-outline uppercase">Gate</p>
                      <p className="text-sm font-bold text-on-surface">LEVEL 2</p>
                    </div>
                    <div>
                      <p className="text-[0.625rem] font-bold text-outline uppercase">Price</p>
                      <p className="text-sm font-bold text-on-surface">$450.00</p>
                    </div>
                    <div>
                      <p className="text-[0.625rem] font-bold text-outline uppercase">Type</p>
                      <p className="text-sm font-bold text-on-surface">STANDARD</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <button className="bg-primary text-on-primary font-bold px-6 py-3 transition-colors hover:bg-primary-dim active:scale-95 text-sm uppercase">Details</button>
                  <div className="w-20 h-20 bg-white border border-surface-container-high p-1">
                    <img alt="Ticket QR Code" className="w-full h-full grayscale" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMrclZXsP8mi7Fw_xepG2q7tw66SE9RKkWZ45yM4sFmpOX6_e8ibsR891xaC0aHERNLegUwFA9jvwq1Sl306B1yTZoQqGyUt_rue0ExF1rOZjouB2EN1edAbgSwafoP09syMMV0xMXOc6U4fQot8FgvWHhtfMLJ6NJCVp7TeexfgN6lJ0w4934zNNTnaArSzwbCYx3sR8KrHSOyqm6T7yTCilRl1l9lCbi3tp8WsFfmB8OK5RoVu5nqqLtkIpGtEjbQL55QFOXFU11" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ticket Section: Past */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-surface-container-highest text-on-surface-variant px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wider">Past</span>
            <div className="flex-grow h-[2px] bg-surface-container-high"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 opacity-60">
            {/* Past Ticket 1 */}
            <div className="bg-surface-container-lowest p-6 border-b-4 border-surface-container-highest">
              <p className="text-[0.625rem] font-bold text-outline uppercase mb-2">AUG 15, 2024</p>
              <h3 className="text-lg font-bold text-on-surface mb-4">Summer Jazz Nights</h3>
              <div className="flex justify-between items-end">
                <span className="text-[0.75rem] font-bold uppercase tracking-tighter text-outline-variant">Expired</span>
                <div className="w-12 h-12 grayscale opacity-30">
                  <img alt="QR" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9YBPhpUHERQI8cqU5dhjIGJ5X7wMqlBsUDo4JMUIxHo9_aoO8wOV4XHTTusuoa1YtlHIretsXjIq5epsTJwUlBZaAGlLi4wkdG1Bu_YA8-6itYyPOl4iVklKcU2vhDhRk200Kd12KVxF7XPS18_n_UjWAIWONp6aDSJNnWf48_vtFAemgEiTnT6h52SYDRrVVFiZedRmbdac3Fn1sp9cPN5i-dfBl30xa2usZlQJHBKdc5nsXj3WFv-QJpaS2Jmd57akgfyUwGLTL" />
                </div>
              </div>
            </div>
            
            {/* Past Ticket 2 */}
            <div className="bg-surface-container-lowest p-6 border-b-4 border-surface-container-highest">
              <p className="text-[0.625rem] font-bold text-outline uppercase mb-2">JUL 02, 2024</p>
              <h3 className="text-lg font-bold text-on-surface mb-4">Art Gallery Opening</h3>
              <div className="flex justify-between items-end">
                <span className="text-[0.75rem] font-bold uppercase tracking-tighter text-outline-variant">Expired</span>
                <div className="w-12 h-12 grayscale opacity-30">
                  <img alt="QR" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCw_plS0FBhI8OLJy70UPkYph1xJEWRpG6mm7v1tVyC7O5F_g6cp3nEFXgCVF1uKIQQvvQ4knwlq4Bk2WCDDrISyEv7NhEsWYMGBlsLKJLzyVwFP5Fft2bEnaanjQZa-EQSMzWgxKOfXn7z3Y6h7016jUaEzb3sUPVpTHjosj2DuMGhyW_-hqJLcsgHrEF3Z9gLPyMjDoRl4QwlA-lbTqA5eInUhYKiHPxeXdnFsx6x7sTwtgosBpBm78kVqoT4fB5DcNudiL6piw7J" />
                </div>
              </div>
            </div>

            {/* Past Ticket 3 */}
            <div className="bg-surface-container-lowest p-6 border-b-4 border-surface-container-highest">
              <p className="text-[0.625rem] font-bold text-outline uppercase mb-2">JUN 18, 2024</p>
              <h3 className="text-lg font-bold text-on-surface mb-4">Indie Film Screening</h3>
              <div className="flex justify-between items-end">
                <span className="text-[0.75rem] font-bold uppercase tracking-tighter text-outline-variant">Expired</span>
                <div className="w-12 h-12 grayscale opacity-30">
                  <img alt="QR" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0zg9qhFkqpCMSiSGJEkMgHyfogBWR7u2q5JnzHNwsCf18BLitpZMesAZ2uvT9EK69ZbkqSGRXVvrwin74mtxaoklur8siPKYAaqrWXkd2JM--y8yL0bmqFb2LPdnzSf8vPSc6ZNknAdxuOSJyCAd8gJqVDETCJgQc0JiJpGRE9HL8x-YSimN1PmpuUe1N7AZOAT07KB5fr--zX1A1NknS-zfkiw_sEG6zwpENrdHIEFVh9cw1T_7HJiTB2pn8igkaSP43zYDcPCcZ" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full mt-auto border-t-0 flat no-shadows">
        <div className="bg-blue-700 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 gap-6 max-w-full mx-auto">
          <Link href="/" className="text-3xl font-black text-white italic tracking-tighter uppercase">TicketRush</Link>
          <div className="flex flex-wrap justify-center gap-8 font-['Inter'] text-sm tracking-wide uppercase font-bold">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors duration-200">Home</Link>
            <Link href="/events" className="text-slate-400 hover:text-white transition-colors duration-200">Browse Events</Link>
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors duration-200">Support</Link>
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors duration-200">Admin Control</Link>
          </div>
          <div className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-slate-400">
            © 2024 TicketRush. Built for Precision.
          </div>
        </div>
      </footer>
    </div>
  );
}
