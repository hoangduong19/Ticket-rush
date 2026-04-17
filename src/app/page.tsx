'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';
        const res = await fetch(`${API_BASE}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.avatarUrl || data.url) {
            setAvatarUrl(data.avatarUrl || data.url);
          }
        }
      } catch (err) {
        console.error("Lỗi fetch avatar:", err);
      }
    };
    fetchAvatar();
  }, []);

  return (
    <>
      {/* TopNavBar Component */}
      <header className="bg-slate-50 dark:bg-slate-950 font-['Inter'] font-normal antialiased docked full-width top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-none">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500 uppercase">TicketRush</Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link className="text-blue-600 dark:text-blue-500 font-bold border-b-4 border-blue-600 dark:border-blue-500 active:transform active:scale-95 transition-colors duration-100" href="/events">Events</Link>
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 active:transform active:scale-95 transition-colors duration-100 px-2 py-1" href="/tickets">My Tickets</Link>
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 active:transform active:scale-95 transition-colors duration-100 px-2 py-1" href="/dashboard">Dashboard</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-surface-container-high px-4 py-2 gap-3">
              <span className="material-symbols-outlined text-outline">search</span>
              <input className="bg-transparent border-none focus:ring-0 p-0 text-sm w-64" placeholder="Search events..." type="text"/>
            </div>
            <div className="flex items-center gap-4">
              <button className="material-symbols-outlined text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 transition-colors">notifications</button>
              <div className="w-10 h-10 bg-surface-container-highest overflow-hidden">
                <img className="w-full h-full object-cover" alt="User profile avatar" src={avatarUrl} />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>
      <main>
        {/* Hero Section */}
        <section className="bg-primary px-6 py-24 md:py-32 flex flex-col items-start gap-8">
          <div className="max-w-5xl">
            <h1 className="text-[3.5rem] md:text-[5rem] leading-[0.9] font-black tracking-tighter text-on-primary mb-8">
              ACCESS THE<br/>UNFORGETTABLE
            </h1>
            <p className="text-xl md:text-2xl text-on-primary opacity-90 max-w-2xl mb-12 font-medium">
              The precision platform for live experiences. No queues, no hassle, just the front row.
            </p>
            <div className="w-full max-w-4xl bg-surface-container-lowest p-1 flex flex-col md:flex-row gap-1">
              <div className="flex-1 bg-surface-container-high px-6 py-4 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">search</span>
                <input className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold" placeholder="Artist, venue, or event" type="text"/>
              </div>
              <div className="flex-1 bg-surface-container-high px-6 py-4 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <input className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold" placeholder="City or State" type="text"/>
              </div>
              <Link href="/events" className="bg-primary text-on-primary px-12 py-4 font-black uppercase tracking-widest hover:bg-primary-dim transition-colors text-center inline-block">
                FIND TICKETS
              </Link>
            </div>
          </div>
        </section>
        {/* Featured Section (Bento Inspired Grid) */}
        <section className="p-6 md:p-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-secondary uppercase mb-2 block">Curation 01</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface">FEATURED EVENTS</h2>
            </div>
            <Link className="hidden md:flex items-center gap-2 font-bold text-primary group" href="/events">
              VIEW ALL CATEGORIES
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
            {/* Major Feature */}
            <div className="md:col-span-8 bg-surface-container-lowest flex flex-col relative overflow-hidden group">
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-secondary text-on-secondary px-4 py-1 text-xs font-black uppercase tracking-widest">Live Now</span>
              </div>
              <div className="h-2/3 overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="wide shot of a massive music festival stage at night with dramatic blue lasers and thousands of people silhouettes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTrXY5tCoZWQKerZWyzx29XTsAYL4aBLLm-_MPHoqZfybSm6j3lndlFd7aLwt7IHF705YW5RhMR5Nox4n6tI1WsQfsYG1luPe3-WYu5N2RJw82NnbnkUd24W3UrFe0a0V5b00cMlXbnHbFCKOzA_mqBV_GdW_RdoQYMsciBDVjDQPHcaDXyRzO5Uo6zJjmRKY_0ljuVKrHalfBfjRQjyFpqGIq7OxGENgwqCigEwBjIaemtREqctj-PKOTerdDP-wm6cgMkBfEPaS_"/>
              </div>
              <div className="p-8 flex flex-col justify-between flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter mb-2">Music Festival: Neon Horizon</h3>
                    <div className="flex gap-4 items-center">
                      <span className="text-sm font-bold text-outline uppercase tracking-widest">AUG 24-26</span>
                      <div className="w-1 h-1 bg-outline rounded-full"></div>
                      <span className="text-sm font-bold text-outline uppercase tracking-widest">WEMBLEY STADIUM</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-outline mb-1 uppercase">FROM</span>
                    <span className="text-3xl font-black text-primary">$189.00</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Side Column */}
            <div className="md:col-span-4 flex flex-col gap-6">
              {/* Rock Concert Card */}
              <div className="flex-1 bg-surface-container-lowest flex flex-col group">
                <div className="h-48 overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="dynamic close-up of a rock guitarist performing on stage under red and white spotlights with smoke effects" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5LhEgvP3cgA04eOaodZ1lxp3O9X4aMHvTROhJWlb0aEDSIcQS4FYxUvO25TLCG3D6i5BZYu55AKBcTaHn2VOyvUIgSZS4V6_GgfQ8lrNL1_ECkKVEXK7f9hDW1KXMaR58Rey1LuGS1eLhjqQ8mIrRoRqf4l-EE4Os65j2HtOuUUQ-zg_hGVluIzVd94x7tPV1cY3Is4O4sg19eGkVRh_uBgr_dVUBAPpq3_nnxXP59RtKr_dgQEsyW5JVDjZ01pzkXIIRqJkd2P7N"/>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-primary text-on-primary px-3 py-1 text-[10px] font-black uppercase tracking-widest">Trending</span>
                    <span className="text-sm font-bold text-secondary">8 TICKETS LEFT</span>
                  </div>
                  <h4 className="text-xl font-bold tracking-tight mb-4 uppercase">Rock Concert: The Void Tour</h4>
                  <div className="flex justify-between items-end">
                    <div className="text-sm font-bold text-outline">SEP 12 | MADISON SQUARE</div>
                    <Link href="/event" className="bg-surface-container-highest p-3 hover:bg-primary hover:text-on-primary transition-colors inline-block text-center flex items-center justify-center">
                      <span className="material-symbols-outlined block">local_activity</span>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Promo Block */}
              <div className="flex-1 bg-on-surface p-8 flex flex-col justify-center gap-4">
                <h4 className="text-2xl font-black text-surface tracking-tighter leading-none">JOIN THE<br/>INNER CIRCLE</h4>
                <p className="text-surface-container-highest text-sm">Early access, zero fees, and exclusive member pre-sales.</p>
                <Link href="/signup" className="self-start text-primary font-black uppercase tracking-widest text-sm hover:underline">LEARN MORE —&gt;</Link>
              </div>
            </div>
          </div>
        </section>
        {/* Upcoming Grid */}
        <section className="bg-surface-container-low px-6 py-20">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
            <h2 className="text-4xl font-extrabold tracking-tighter">UPCOMING NEAR YOU</h2>
            <div className="flex gap-2">
              <button className="bg-surface-container-highest px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors">Today</button>
              <button className="bg-primary text-on-primary px-6 py-2 text-xs font-black uppercase tracking-widest">This Weekend</button>
              <button className="bg-surface-container-highest px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors">Next Month</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {/* Iterative Cards */}
            <div className="bg-surface-container-lowest p-6 flex flex-col gap-6 hover:bg-white transition-colors border-b-4 border-transparent hover:border-primary">
              <div className="text-4xl font-black text-outline opacity-20">01</div>
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Techno</span>
                <h5 className="text-xl font-bold mb-4">UNDERGROUND 404</h5>
                <p className="text-sm text-on-surface-variant font-medium">Sat, 14 Sep • Warehouse 7</p>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-black text-lg">$45</span>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 flex flex-col gap-6 hover:bg-white transition-colors border-b-4 border-transparent hover:border-primary">
              <div className="text-4xl font-black text-outline opacity-20">02</div>
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Comedy</span>
                <h5 className="text-xl font-bold mb-4">LATE NIGHT LAUGHS</h5>
                <p className="text-sm text-on-surface-variant font-medium">Tue, 17 Sep • The Comedy Attic</p>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-black text-lg">$25</span>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 flex flex-col gap-6 hover:bg-white transition-colors border-b-4 border-transparent hover:border-primary">
              <div className="text-4xl font-black text-outline opacity-20">03</div>
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Jazz</span>
                <h5 className="text-xl font-bold mb-4">BLUE NOTE SESSIONS</h5>
                <p className="text-sm text-on-surface-variant font-medium">Fri, 20 Sep • Downtown Plaza</p>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-black text-lg">$60</span>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 flex flex-col gap-6 hover:bg-white transition-colors border-b-4 border-transparent hover:border-primary">
              <div className="text-4xl font-black text-outline opacity-20">04</div>
              <div>
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Sport</span>
                <h5 className="text-xl font-bold mb-4">CITY DERBY: LIVE</h5>
                <p className="text-sm text-on-surface-variant font-medium">Sun, 22 Sep • Arena One</p>
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-black text-lg">$120</span>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>
        {/* Newsletter Tonal Block */}
        <section className="bg-secondary p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-on-secondary tracking-tighter leading-none mb-6">NEVER MISS THE BEAT.</h2>
            <p className="text-on-secondary opacity-80 font-medium">Get real-time alerts when your favorite artists announce tours.</p>
          </div>
          <div className="w-full max-w-md">
            <div className="flex bg-surface-container-lowest p-1">
              <input className="flex-grow border-none focus:ring-0 px-6 py-4 font-bold" placeholder="Email Address" type="email"/>
              <button className="bg-on-surface text-surface px-8 py-4 font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">SUBSCRIBE</button>
            </div>
          </div>
        </section>
      </main>
      {/* Footer Component */}
      <footer className="bg-slate-100 dark:bg-slate-900 font-['Inter'] text-sm tracking-tight border-t-2 border-slate-200 dark:border-slate-800">
        <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <Link href="/" className="text-lg font-extrabold uppercase text-slate-900 dark:text-slate-100">TicketRush</Link>
            <p className="text-slate-500 dark:text-slate-400">© 2024 TicketRush. Precision Engineered.</p>
          </div>
          <div className="flex gap-8 flex-wrap justify-center">
            <a className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200" href="#">Help Center</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200" href="#">Privacy Policy</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200" href="#">Terms of Service</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-opacity duration-200" href="#">Contact</a>
          </div>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-600">brand_awareness</span>
            <span className="material-symbols-outlined text-slate-600">verified</span>
            <span className="material-symbols-outlined text-slate-600">security</span>
          </div>
        </div>
      </footer>
    </>
  );
}
