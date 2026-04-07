import Link from 'next/link';

export default function EventDetail() {
  return (
    <div className="bg-background text-on-background antialiased flex flex-col min-h-screen">
      {/* TopNavBar */}
      <header className="w-full top-0 z-50 bg-slate-50 dark:bg-slate-950 font-['Inter'] antialiased">
        <div className="flex justify-between items-center px-8 h-20 max-w-full mx-auto">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black tracking-tighter text-blue-700 dark:text-blue-400 uppercase">TicketRush</Link>
            <nav className="hidden md:flex gap-8">
              <Link href="/events" className="text-blue-700 dark:text-blue-400 font-bold border-b-4 border-blue-700 dark:border-blue-400 pb-1">Events</Link>
              <Link href="/tickets" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-150">My Tickets</Link>
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-150">Dashboard</Link>
              <Link href="/orders" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-150">Orders</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-surface-container-high px-4 py-2 gap-3">
              <span className="material-symbols-outlined text-outline">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-sm w-48" placeholder="Search events..." type="text"/>
            </div>
            <button className="material-symbols-outlined text-slate-600 hover:bg-slate-100 p-2 transition-colors">notifications</button>
            <div className="w-10 h-10 bg-surface-container-highest overflow-hidden">
              <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5zqKHZIuR5En0YaUv1BaUG9a1lDI--KT5FnfU-JdoCZD0d37XDG46r3lsjcQsqyVoj0Ye0ZkNFpGfszc-2SmY4Vnjn1G5kfyjI1GHylwONwJYfMzjDGUNGWdG1aOjxmvKLLSSqv08p1rOS3_Cp4pD9iJb4RJXsAZSGu-u9LTop0Zy-osqnjTURB-bGpSWkH9pU1nZlXe9fzTi7SDnstfRNxvVFeFYE-FcvLC6AINBwsyZmpJZ3tlKlca9_oEDzSiqqHr1iV-fI9_8" />
            </div>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[1px] w-full"></div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[716px] flex items-end">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover grayscale brightness-50" alt="Event Banner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVuuxkY6yXxcqWy9Hv9Cag4ZXBBJ4BispFA7NCF_XQq7lKsQjNdcK7NAsQWSJoordKC0qlTHsZrj3OohSQJBmxZWjtsyWI5_i26aeJYH85xG-LacDMxnIc8t8b2fuaoUW26LMfOC9GCRJoFUbBbrku2J37_wNdgUVOGN8skMIEpLddkDov63A12w38K0HeNZUBabCKHjNCAp60ad38Yyos2XBsEQy-v2S7HxoHefyKfHwAKps83zyftww_SWfyRQ4hxP3jGktWUYmq" />
          </div>
          <div className="relative z-10 w-full px-8 pb-16 bg-gradient-to-t from-black/80 to-transparent">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex flex-col gap-4">
                <div className="inline-flex bg-secondary px-3 py-1 self-start">
                  <span className="text-[0.75rem] font-bold tracking-widest text-on-secondary uppercase">Selling Fast</span>
                </div>
                <h1 className="text-white text-5xl md:text-8xl font-extrabold tracking-tighter leading-none">NEON HORIZON <br/>TOUR 2024</h1>
                <div className="flex flex-wrap gap-8 mt-4">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[0.75rem] font-bold uppercase tracking-widest">Date</span>
                    <span className="text-white text-xl font-semibold">OCTOBER 24, 2024</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-[0.75rem] font-bold uppercase tracking-widest">Venue</span>
                    <span className="text-white text-xl font-semibold">THE CRYSTAL PAVILION</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 min-w-[320px]">
                <div className="bg-primary p-8">
                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-on-primary text-[0.75rem] font-bold uppercase tracking-widest">Starting From</span>
                    <span className="text-white text-4xl font-black">$120.00</span>
                  </div>
                  <Link href="/seats" className="w-full block">
                    <button className="w-full bg-white text-primary font-black py-4 hover:bg-surface-container-low transition-colors uppercase tracking-widest active:scale-95 duration-150">Buy Tickets</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Description */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <h2 className="text-[2rem] font-bold tracking-tighter uppercase border-l-8 border-primary pl-6">About the Event</h2>
              <p className="text-on-surface text-lg leading-relaxed max-w-3xl">
                Experience the zenith of electronic production. Neon Horizon brings together a curated selection of world-class artists, immersive light architecture, and spatial audio technology to redefine the concert experience. This isn't just a show; it's a sensory immersion into the future of sound.
              </p>
              <p className="text-on-surface-variant text-base leading-relaxed max-w-3xl">
                The Crystal Pavilion will be transformed into a kinetic landscape of LED structures and high-fidelity projection mapping. Attendees are invited to explore the intersection of digital art and rhythmic mastery throughout the 8-hour performance window.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-surface-container-high">
              <div className="bg-surface-container-lowest p-8 flex flex-col gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                <h4 className="font-bold uppercase tracking-tighter">Doors Open</h4>
                <p className="text-on-surface-variant">6:00 PM PST</p>
              </div>
              <div className="bg-surface-container-lowest p-8 flex flex-col gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">check</span>
                <h4 className="font-bold uppercase tracking-tighter">Entry Policy</h4>
                <p className="text-on-surface-variant">Strictly 21+ with valid ID</p>
              </div>
              <div className="bg-surface-container-lowest p-8 flex flex-col gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">security</span>
                <h4 className="font-bold uppercase tracking-tighter">Security</h4>
                <p className="text-on-surface-variant">Enhanced screening at all gates</p>
              </div>
              <div className="bg-surface-container-lowest p-8 flex flex-col gap-2">
                <span className="material-symbols-outlined text-primary text-3xl">fastfood</span>
                <h4 className="font-bold uppercase tracking-tighter">Amenities</h4>
                <p className="text-on-surface-variant">Gourmet catering & VIP lounges</p>
              </div>
            </div>
          </div>

          {/* Right: Pricing and Venue */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            {/* Pricing Tiers */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[1.375rem] font-bold uppercase tracking-tighter">Pricing Tiers</h3>
              <div className="flex flex-col gap-4">
                {/* VIP */}
                <div className="bg-surface-container-lowest p-6 flex flex-col gap-4 group cursor-pointer hover:bg-slate-50 transition-colors border-l-4 border-secondary">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">VIP Experience</span>
                    <span className="text-secondary font-black text-xl">$249</span>
                  </div>
                  <ul className="text-xs text-on-surface-variant flex flex-col gap-2 uppercase tracking-wide font-medium">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base">check</span> Priority Entrance</li>
                    <li className="flex items-center gap-2"><span class="material-symbols-outlined text-base">check</span> Private Bar & Restrooms</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base">check</span> Artist Meet & Greet</li>
                  </ul>
                </div>
                {/* General Admission */}
                <div className="bg-surface-container-lowest p-6 flex flex-col gap-4 group cursor-pointer hover:bg-slate-50 transition-colors border-l-4 border-primary">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">General Admission</span>
                    <span className="text-primary font-black text-xl">$120</span>
                  </div>
                  <ul className="text-xs text-on-surface-variant flex flex-col gap-2 uppercase tracking-wide font-medium">
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base">check</span> Standard Entrance</li>
                    <li className="flex items-center gap-2"><span className="material-symbols-outlined text-base">check</span> Floor Access</li>
                  </ul>
                </div>
                {/* Student */}
                <div className="bg-surface-container-lowest p-6 flex justify-between items-center border-l-4 border-outline opacity-60">
                  <span className="font-bold text-lg">Student Discount</span>
                  <span className="text-outline font-black text-xl">SOLD OUT</span>
                </div>
              </div>
            </div>
            
            {/* Venue Map */}
            <div className="flex flex-col gap-6">
              <h3 className="text-[1.375rem] font-bold uppercase tracking-tighter">Venue Location</h3>
              <div className="bg-surface-container-highest h-64 relative overflow-hidden group">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Venue Top View" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPJDpyoLxsqsCQhPj9jZfoi08lU4BYyLWEb8kwBdCXZL6WZAwG8Knlw3VQUGBWl9_2y3_lJlSZCr4lxeOShR6X5EzyUsNQzMjd4IuU0Kj2csJTBXVzQ5UVd5_83SQ4c_kVqUl74zSiL_xMoKnm3b5pG4MgNMPPUmQFIAqJq0-qr-Soswp4i-It2A1b7Rcww9kublyAYh0sQ4f0x4O8-oZ7GrJ6cXEW6kHNu02AM4wnGLLW01_LIC_qEP5muuK2T1zfvVOLGWSoZHs1" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-primary text-white p-3">
                    <span className="material-symbols-outlined text-3xl">location_on</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold">The Crystal Pavilion</span>
                <span className="text-on-surface-variant text-sm">888 Neon District, Los Angeles, CA 90001</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary w-full py-24 px-8 text-center">
          <div className="max-w-3xl mx-auto flex flex-col gap-8 items-center">
            <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Don't Miss the Horizon</h2>
            <p className="text-on-secondary text-xl font-medium">Tickets are 85% sold out. Secure your place in the future of music today.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <button className="bg-white text-secondary font-black px-12 py-5 text-xl uppercase tracking-widest hover:bg-surface-container-low transition-colors">Join Queue</button>
              <button className="border-4 border-white text-white font-black px-12 py-5 text-xl uppercase tracking-widest hover:bg-white/10 transition-colors">Notify Me</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-slate-900 dark:bg-black font-['Inter'] text-sm tracking-wide uppercase font-bold">
        <div className="border-t-0 bg-blue-700 h-2"></div>
        <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 gap-6 max-w-full mx-auto">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-3xl font-black text-white italic">TicketRush</Link>
            <span className="text-slate-400 font-medium normal-case tracking-normal">© 2024 TicketRush. Built for Precision.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Terms of Service</Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Support</Link>
            <Link href="#" className="text-slate-400 hover:text-white transition-colors duration-200">Contact</Link>
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 bg-slate-800 flex items-center justify-center text-white hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined">public</span>
            </button>
            <button className="w-10 h-10 bg-slate-800 flex items-center justify-center text-white hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
