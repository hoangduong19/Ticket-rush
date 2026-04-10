"use client" // Bắt buộc phải có để sử dụng useState và useEffect trong App Router

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function BrowseEvents() {
  // 1. Khai báo các State để quản lý dữ liệu
  const [events, setEvents] = useState([]); // Danh sách sự kiện từ API
  const [searchQuery, setSearchQuery] = useState(""); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState(true); // Trạng thái đang tải

  // 2. Fetch dữ liệu từ Backend Java (Spring Boot)
  useEffect(() => {
    fetch("http://localhost:8080/events")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi kết nối Backend:", err);
        setLoading(false);
      });
  }, []);

  // 3. Logic tìm kiếm: Lọc danh sách dựa trên tiêu đề hoặc địa điểm
  const filteredEvents = events.filter((event: any) =>
    event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật từ khóa khi gõ
              />
            </div>
          </div>
          <div className="text-right">
            {/* Hiển thị số lượng tìm thấy thật từ filteredEvents */}
            <div className="text-[3.5rem] font-extrabold tracking-tighter leading-none text-primary">
              {filteredEvents.length}
            </div>
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
                  <input defaultChecked className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox" />
                  <span className="font-bold text-sm uppercase group-hover:text-primary">All Genres</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox" />
                  <span className="font-bold text-sm uppercase group-hover:text-primary">Music</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox" />
                  <span className="font-bold text-sm uppercase group-hover:text-primary">Sports</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input className="form-checkbox bg-surface-container-highest border-none text-primary focus:ring-0 w-5 h-5" type="checkbox" />
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

            <button
              onClick={() => setSearchQuery("")}
              className="w-full bg-on-background text-surface py-4 font-black text-xs uppercase tracking-widest hover:bg-primary transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        {/* Event Grid - HIỂN THỊ DỮ LIỆU THẬT */}
        <section className="flex-grow p-8 bg-surface">
          {loading ? (
            <div className="text-center py-20 font-bold uppercase tracking-widest animate-pulse">Loading Live Events...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1">
              {filteredEvents.map((event: any) => (
                <div key={event.eventId} className="bg-surface-container-lowest p-6 flex flex-col group relative">
                  {/* Tag Live - Giả định nếu có price thì là Live */}
                  <div className="absolute top-6 right-6 z-10 bg-secondary text-on-secondary px-3 py-1 font-bold text-[10px] uppercase tracking-tighter">
                    Live
                  </div>

                  <div className="mb-6 overflow-hidden bg-slate-200">
                    <img
                      className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      alt={event.title}
                      src={event.bannerUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                    />
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-surface-container-high px-2 py-1 font-bold text-[10px] uppercase">Music</span>
                    <span className="font-black text-[10px] uppercase text-outline">
                      {event.location}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold tracking-tighter leading-tight mb-8 group-hover:text-primary transition-colors uppercase">
                    {event.title}
                  </h2>

                  <div className="mt-auto flex items-end justify-between border-t-2 border-surface-container pt-6">
                    <div>
                      <span className="text-[10px] font-black text-outline block">FROM</span>
                      <span className="text-2xl font-black tracking-tighter">
                        ${event.price ? event.price.toFixed(2) : "0.00"}
                      </span>
                    </div>
                    {/* Chuyển hướng sang trang chi tiết bằng eventId */}
                    <Link href={`/event/${event.eventId}`}>
                      <button className="bg-primary text-on-primary px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">
                        Get Tickets
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Hiển thị khi không tìm thấy kết quả */}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-24">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-outline-variant">No events found for "{searchQuery}"</h2>
              <p className="text-xs uppercase tracking-widest mt-2 text-outline">Try searching for another artist or city</p>
            </div>
          )}

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