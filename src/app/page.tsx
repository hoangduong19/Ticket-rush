'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { getToken, clearToken } from '@/lib/auth';

export default function Home() {
  useAuthGuard();
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // --- STATE DỮ LIỆU SỰ KIỆN ---
  const [events, setEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

  useEffect(() => {
    // 1. Fetch Avatar người dùng
    const fetchAvatar = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const res = await fetch(`${API_BASE}/users/me`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.avatarUrl || data.url) setAvatarUrl(data.avatarUrl || data.url);
        }
      } catch (err) { console.error("Lỗi fetch avatar:", err); }
    };

    // 2. Fetch Danh sách sự kiện từ DB
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE}/events`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error("Lỗi fetch events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchAvatar();
    fetchEvents();
  }, [API_BASE]);

  // Chia dữ liệu cho các khu vực giao diện
  const majorFeature = events[0]; // Sự kiện lớn nhất
  const sideFeature = events[1];  // Sự kiện bên cạnh
  const upcomingEvents = events.slice(2, 6); // 4 sự kiện tiếp theo ở hàng dưới

  // Hàm format ngày tháng hiển thị ngắn gọn (ví dụ: AUG 24)
  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <>
      {/* TopNavBar - Giữ nguyên */}
      <header className="bg-slate-50 dark:bg-slate-950 font-['Inter'] font-normal antialiased docked full-width top-0 z-50">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-none">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-black tracking-tighter text-blue-700 dark:text-blue-500 uppercase italic">TicketRush</Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 active:transform active:scale-95 transition-colors duration-100 px-2 py-1" href="/events">Events</Link>
              <Link className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 active:transform active:scale-95 transition-colors duration-100 px-2 py-1" href="/tickets">My Tickets</Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center bg-surface-container-high px-4 py-2 gap-3">
              <span className="material-symbols-outlined text-outline">search</span>
              <input className="bg-transparent border-none focus:ring-0 p-0 text-sm w-64 font-bold" placeholder="Search events..." type="text" />
            </div>
            <div className="flex items-center gap-4">
              <button className="material-symbols-outlined text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 p-2 transition-colors">notifications</button>
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-surface-container-highest overflow-hidden focus:outline-none hover:ring-2 ring-primary">
                  <img className="w-full h-full object-cover" alt="User profile avatar" src={avatarUrl} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 flex flex-col">
                    <Link href="/dashboard" className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">person</span> Profile
                    </Link>
                    <div className="h-px bg-slate-200 dark:bg-slate-700 w-full"></div>
                    <button onClick={() => {
                      clearToken();
                      localStorage.removeItem('userId');
                      window.location.href = '/login';
                    }} className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors flex items-center gap-3">
                      <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      <main>
        {/* Hero Section - Giữ nguyên */}
        <section className="bg-primary px-6 py-24 md:py-32 flex flex-col items-start gap-8">
          <div className="max-w-5xl">
            <h1 className="text-[3.5rem] md:text-[5rem] leading-[0.9] font-black tracking-tighter text-on-primary mb-8">
              ACCESS THE<br />UNFORGETTABLE
            </h1>
            <p className="text-xl md:text-2xl text-on-primary opacity-90 max-w-2xl mb-12 font-medium uppercase tracking-tight">
              The precision platform for live experiences. No queues, no hassle, just the front row.
            </p>
            <div className="w-full max-w-4xl bg-surface-container-lowest p-1 flex flex-col md:flex-row gap-1">
              <div className="flex-1 bg-surface-container-high px-6 py-4 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">search</span>
                <input className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold" placeholder="Artist, venue, or event" type="text" />
              </div>
              <div className="flex-1 bg-surface-container-high px-6 py-4 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <input className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg font-bold" placeholder="City or State" type="text" />
              </div>
              <Link href="/events" className="bg-primary text-on-primary px-12 py-4 font-black uppercase tracking-widest hover:bg-primary-dim transition-colors text-center inline-block">
                FIND TICKETS
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Section - DỮ LIỆU ĐỘNG */}
        <section className="p-6 md:p-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-sm font-bold tracking-[0.2em] text-secondary uppercase mb-2 block">Curation 01</span>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-on-surface uppercase">FEATURED EVENTS</h2>
            </div>
            <Link className="hidden md:flex items-center gap-2 font-bold text-primary group" href="/events">
              VIEW ALL CATEGORIES
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>

          {loadingEvents ? (
            <div className="h-[400px] flex items-center justify-center font-black uppercase tracking-widest opacity-20">Syncing with Node...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[700px]">
              {/* Major Feature - Sự kiện 01 */}
              {majorFeature && (
                <div className="md:col-span-8 bg-surface-container-lowest flex flex-col relative overflow-hidden group border border-outline-variant/20">
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-secondary text-on-secondary px-4 py-1 text-xs font-black uppercase tracking-widest">Live Now</span>
                  </div>
                  <div className="h-2/3 overflow-hidden">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt={majorFeature.title}
                      src={majorFeature.bannerUrl}
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-black tracking-tighter mb-2 uppercase">{majorFeature.title}</h3>
                        <div className="flex gap-4 items-center">
                          <span className="text-sm font-bold text-outline uppercase tracking-widest">{formatShortDate(majorFeature.date)}</span>
                          <div className="w-1 h-1 bg-outline rounded-full"></div>
                          <span className="text-sm font-bold text-outline uppercase tracking-widest">{majorFeature.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-bold text-outline mb-1 uppercase">FROM</span>
                        <span className="text-3xl font-black text-primary">${majorFeature.price?.toFixed(2)}</span>
                      </div>
                    </div>
                    <Link href={`/event/${majorFeature.eventId}`} className="mt-6 self-start bg-on-surface text-surface px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-primary transition-colors">Book Now</Link>
                  </div>
                </div>
              )}

              {/* Side Column */}
              <div className="md:col-span-4 flex flex-col gap-6">
                {/* Rock Concert Card (Side Feature) - Sự kiện 02 */}
                {sideFeature && (
                  <div className="flex-1 bg-surface-container-lowest flex flex-col group border border-outline-variant/20">
                    <div className="h-48 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={sideFeature.title}
                        src={sideFeature.bannerUrl}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-primary text-on-primary px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">Trending</span>
                        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Limited Entry</span>
                      </div>
                      <h4 className="text-xl font-bold tracking-tight mb-4 uppercase">{sideFeature.title}</h4>
                      <div className="flex justify-between items-end">
                        <div className="text-[10px] font-black text-outline uppercase tracking-widest">
                          {formatShortDate(sideFeature.date)} | {sideFeature.location?.substring(0, 15)}...
                        </div>
                        <Link href={`/event/${sideFeature.eventId}`} className="bg-surface-container-highest p-3 hover:bg-primary hover:text-on-primary transition-all shadow-sm">
                          <span className="material-symbols-outlined block text-sm">confirmation_number</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                {/* Promo Block - Giữ nguyên tĩnh */}
                <div className="flex-1 bg-on-surface p-8 flex flex-col justify-center gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-symbols-outlined text-6xl text-white">shield</span></div>
                  <h4 className="text-2xl font-black text-surface tracking-tighter leading-none uppercase">JOIN THE<br />INNER CIRCLE</h4>
                  <p className="text-surface-container-highest text-xs uppercase font-bold tracking-tight opacity-60">Early access, zero fees, and exclusive member pre-sales.</p>
                  <Link href="/signup" className="self-start text-primary font-black uppercase tracking-widest text-xs hover:underline">LEARN MORE —&gt;</Link>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Upcoming Grid - DANH SÁCH CÁC SỰ KIỆN CÒN LẠI */}
        <section className="bg-surface-container-low px-6 py-20 border-t border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
            <h2 className="text-4xl font-extrabold tracking-tighter uppercase">UPCOMING NEAR YOU</h2>
            <div className="flex gap-1 bg-surface-container p-1">
              <button className="bg-surface-container-lowest px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all">Today</button>
              <button className="bg-primary text-on-primary px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg">Global Feed</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-outline-variant/10">
            {upcomingEvents.map((event, index) => (
              <Link
                key={event.eventId}
                href={`/event/${event.eventId}`}
                className="bg-surface-container-lowest p-8 flex flex-col gap-8 group hover:bg-white transition-all duration-300 border-b-4 border-transparent hover:border-primary"
              >
                <div className="text-5xl font-black text-outline opacity-10 group-hover:opacity-100 group-hover:text-primary transition-all duration-500">
                  0{index + 1}
                </div>
                <div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 block">{event.category}</span>
                  <h5 className="text-xl font-bold mb-4 tracking-tighter uppercase leading-tight group-hover:text-primary">{event.title}</h5>
                  <p className="text-[10px] text-outline font-black uppercase tracking-widest italic">{formatShortDate(event.date)} • {event.location}</p>
                </div>
                <div className="flex justify-between items-center mt-auto pt-8 border-t border-outline-variant/10">
                  <span className="font-black text-xl tracking-tighter text-on-surface">${event.price?.toFixed(2)}</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Fallback nếu không đủ sự kiện */}
          {!loadingEvents && events.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-outline-variant/20">
              <p className="font-black uppercase tracking-[0.5em] opacity-20">No active events in database</p>
            </div>
          )}
        </section>

        {/* Newsletter - Giữ nguyên */}
        <section className="bg-secondary p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-on-secondary tracking-tighter leading-[0.9] mb-6 uppercase">NEVER MISS<br />THE BEAT.</h2>
            <p className="text-on-secondary opacity-70 font-bold uppercase text-xs tracking-widest">Get real-time alerts when your favorite artists announce tours.</p>
          </div>
          <div className="w-full max-w-md bg-surface-container-lowest p-1 shadow-2xl">
            <div className="flex">
              <input className="flex-grow border-none focus:ring-0 px-6 py-4 font-bold text-sm uppercase placeholder:text-outline/40" placeholder="EMAIL@DOMAIN.COM" type="email" />
              <button className="bg-on-surface text-surface px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary transition-colors">JOIN</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Giữ nguyên */}
      <footer className="bg-slate-100 dark:bg-black font-['Inter'] text-[10px] font-black uppercase tracking-widest border-t-2 border-slate-200 dark:border-slate-800">
        <div className="w-full py-16 px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <span className="text-2xl font-black text-blue-600 italic tracking-tighter">TicketRush</span>
            <p className="text-slate-400">© 2026 Architectural precision in ticketing.</p>
          </div>
          <div className="flex gap-12 flex-wrap justify-center text-slate-500">
            <Link className="hover:text-blue-600 transition-colors" href="#">Support</Link>
            <Link className="hover:text-blue-600 transition-colors" href="#">Privacy</Link>
            <Link className="hover:text-blue-600 transition-colors" href="#">Terms</Link>
          </div>
          <div className="flex gap-6 opacity-30">
            <span className="material-symbols-outlined">brand_awareness</span>
            <span className="material-symbols-outlined">verified</span>
            <span className="material-symbols-outlined">security</span>
          </div>
        </div>
      </footer>
    </>
  );
}