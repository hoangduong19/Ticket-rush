"use client"

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const CATEGORIES = [
  { value: 'MUSIC', label: 'Music', icon: 'music_note' },
  { value: 'SPORT', label: 'Sports', icon: 'sports_soccer' },
  { value: 'THEATER', label: 'Theater', icon: 'theater_comedy' },
];

export default function BrowseEvents() {
  // Data state
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Pagination state (applied/active)
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const PAGE_SIZE = 9;

  // Filter state (pending — not yet applied)
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingDateFrom, setPendingDateFrom] = useState('');
  const [pendingDateTo, setPendingDateTo] = useState('');
  const [pendingPriceMin, setPendingPriceMin] = useState('');
  const [pendingPriceMax, setPendingPriceMax] = useState('');

  // Applied filter state (sent to API)
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');
  const [appliedPriceMin, setAppliedPriceMin] = useState('');
  const [appliedPriceMax, setAppliedPriceMax] = useState('');

  // Track if pending differs from applied
  const hasUnappliedChanges =
    JSON.stringify(pendingCategories) !== JSON.stringify(appliedCategories) ||
    pendingDateFrom !== appliedDateFrom ||
    pendingDateTo !== appliedDateTo ||
    pendingPriceMin !== appliedPriceMin ||
    pendingPriceMax !== appliedPriceMax;

  // Fetch events from API
  const fetchEvents = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(PAGE_SIZE));

      appliedCategories.forEach(cat => params.append('category', cat));
      if (appliedDateFrom) params.set('dateFrom', appliedDateFrom);
      if (appliedDateTo) params.set('dateTo', appliedDateTo);
      if (appliedPriceMin) params.set('priceMin', appliedPriceMin);
      if (appliedPriceMax) params.set('priceMax', appliedPriceMax);

      const res = await fetch(`${API_BASE}/events?${params.toString()}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      // Spring Boot Page object
      setEvents(data.content ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotalElements(data.totalElements ?? 0);
      setCurrentPage(data.number ?? page);
    } catch (err) {
      console.error("Lỗi kết nối Backend:", err);
    } finally {
      setLoading(false);
    }
  }, [appliedCategories, appliedDateFrom, appliedDateTo, appliedPriceMin, appliedPriceMax]);

  // Fetch on mount + when applied filters or page change
  useEffect(() => {
    fetchEvents(currentPage);
  }, [fetchEvents, currentPage]);

  // Fetch avatar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${API_BASE}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.avatarUrl || data.url) {
            setAvatarUrl(data.avatarUrl || data.url);
          }
        })
        .catch(err => console.error("Lỗi fetch avatar:", err));
    }
  }, []);

  // Toggle category in pending state
  const toggleCategory = (cat: string) => {
    setPendingCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedCategories([...pendingCategories]);
    setAppliedDateFrom(pendingDateFrom);
    setAppliedDateTo(pendingDateTo);
    setAppliedPriceMin(pendingPriceMin);
    setAppliedPriceMax(pendingPriceMax);
    setCurrentPage(0); // Reset to first page
  };

  // Reset filters
  const resetFilters = () => {
    setPendingCategories([]);
    setPendingDateFrom('');
    setPendingDateTo('');
    setPendingPriceMin('');
    setPendingPriceMax('');
    setAppliedCategories([]);
    setAppliedDateFrom('');
    setAppliedDateTo('');
    setAppliedPriceMin('');
    setAppliedPriceMax('');
    setCurrentPage(0);
  };

  // Pagination helpers
  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Active filter count
  const activeFilterCount = appliedCategories.length +
    (appliedDateFrom ? 1 : 0) + (appliedDateTo ? 1 : 0) +
    (appliedPriceMin ? 1 : 0) + (appliedPriceMax ? 1 : 0);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 sticky z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TICKETRUSH</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase">Events</Link>
            <Link href="/tickets" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 hover:bg-blue-700 hover:text-white transition-colors duration-100 font-['Inter'] tracking-tight uppercase">My Tickets</Link>
          </nav>
          <div className="flex items-center gap-4">
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
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('queueUserId');
                    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                    window.location.href = '/login';
                  }} className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      {/* Search & Results Count Header */}
      <section className="bg-surface px-8 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl w-full">
            <span className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-primary mb-2 block">Search Directory</span>
            <h1 className="text-[2rem] font-bold tracking-tighter leading-none mb-2">EXPLORE LIVE EVENTS</h1>
          </div>
          <div className="text-right">
            <div className="text-[3rem] font-extrabold tracking-tighter leading-none text-primary">{totalElements}</div>
            <div className="font-bold text-xs uppercase tracking-widest text-on-surface-variant">Events Found</div>
          </div>
        </div>
      </section>

      <main className="flex flex-col md:flex-row gap-0 flex-grow">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-80 bg-surface-container-low p-8 border-r-0 flex-shrink-0">
          <div className="sticky top-32 space-y-10">
            {/* Category Filter */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b-2 border-surface-dim pb-2">Category</h3>
              <div className="space-y-2">
                {CATEGORIES.map(cat => {
                  const isSelected = pendingCategories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => toggleCategory(cat.value)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 border ${isSelected
                          ? 'bg-primary text-on-primary border-primary shadow-md'
                          : 'bg-surface-container-lowest border-surface-container-high hover:border-primary hover:bg-surface-container-high'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                      <span className="font-bold text-sm uppercase tracking-wide">{cat.label}</span>
                      {isSelected && <span className="material-symbols-outlined text-[16px] ml-auto">check</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b-2 border-surface-dim pb-2">Date Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-outline block mb-1">From</label>
                  <input
                    type="date"
                    value={pendingDateFrom}
                    onChange={e => setPendingDateFrom(e.target.value)}
                    className="w-full bg-surface-container-highest p-3 font-bold text-sm border-0 border-b-2 border-transparent focus:border-primary focus:outline-none focus:ring-0"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-outline block mb-1">To</label>
                  <input
                    type="date"
                    value={pendingDateTo}
                    onChange={e => setPendingDateTo(e.target.value)}
                    className="w-full bg-surface-container-highest p-3 font-bold text-sm border-0 border-b-2 border-transparent focus:border-primary focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b-2 border-surface-dim pb-2">Price Range</h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-outline block mb-1">Min ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={pendingPriceMin}
                    onChange={e => setPendingPriceMin(e.target.value)}
                    className="w-full bg-surface-container-highest p-3 font-bold text-sm border-0 border-b-2 border-transparent focus:border-primary focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-outline block mb-1">Max ($)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="∞"
                    value={pendingPriceMax}
                    onChange={e => setPendingPriceMax(e.target.value)}
                    className="w-full bg-surface-container-highest p-3 font-bold text-sm border-0 border-b-2 border-transparent focus:border-primary focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={applyFilters}
                disabled={!hasUnappliedChanges}
                className={`w-full py-4 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${hasUnappliedChanges
                    ? 'bg-primary text-on-primary hover:bg-primary-dim shadow-lg'
                    : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed opacity-50'
                  }`}
              >
                <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                Apply Filters
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="w-full py-3 bg-transparent border border-surface-container-highest text-on-surface font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  Clear All ({activeFilterCount})
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Event Grid */}
        <section className="flex-grow p-8 bg-surface">
          {/* Active filters pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {appliedCategories.map(cat => (
                <span key={cat} className="bg-primary/10 text-primary px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  {CATEGORIES.find(c => c.value === cat)?.label || cat}
                  <button onClick={() => {
                    const updated = appliedCategories.filter(c => c !== cat);
                    setAppliedCategories(updated);
                    setPendingCategories(updated);
                    setCurrentPage(0);
                  }} className="hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
              {appliedDateFrom && (
                <span className="bg-primary/10 text-primary px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest">
                  From: {appliedDateFrom}
                </span>
              )}
              {appliedDateTo && (
                <span className="bg-primary/10 text-primary px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest">
                  To: {appliedDateTo}
                </span>
              )}
              {appliedPriceMin && (
                <span className="bg-primary/10 text-primary px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest">
                  Min: ${appliedPriceMin}
                </span>
              )}
              {appliedPriceMax && (
                <span className="bg-primary/10 text-primary px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest">
                  Max: ${appliedPriceMax}
                </span>
              )}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 font-bold uppercase tracking-widest animate-pulse">Loading Live Events...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-1">
              {events.map((event: any) => (
                <div key={event.eventId} className="bg-surface-container-lowest p-6 flex flex-col group relative">
                  {/* Status badge */}
                  {event.status === 'Ended' ? (
                    <div className="absolute top-6 right-6 z-10 bg-slate-700 text-slate-300 px-3 py-1 font-bold text-[10px] uppercase tracking-tighter flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">event_busy</span>
                      Ended
                    </div>
                  ) : (
                    <div className="absolute top-6 right-6 z-10 bg-secondary text-on-secondary px-3 py-1 font-bold text-[10px] uppercase tracking-tighter">
                      Live
                    </div>
                  )}

                  <div className="mb-6 overflow-hidden bg-slate-200">
                    <img
                      className="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                      alt={event.title}
                      src={event.bannerUrl || "https://via.placeholder.com/400x300?text=No+Image"}
                    />
                  </div>

                  <div className="mb-2 flex items-center gap-2">
                    <span className="bg-surface-container-high px-2 py-1 font-bold text-[10px] uppercase">{event.category}</span>
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
                        {event.price && event.price > 0
                          ? `$${Number(event.price).toFixed(2)}`
                          : "FREE"}
                      </span>
                    </div>
                    {event.status === 'Ended' ? (
                      <div className="bg-slate-200 text-slate-400 px-6 py-3 font-black text-xs uppercase tracking-widest cursor-not-allowed select-none">
                        Ended
                      </div>
                    ) : (
                      <Link href={`/event/${event.eventId}`}>
                        <button className="bg-primary text-on-primary px-6 py-3 font-black text-xs uppercase tracking-widest hover:bg-primary-dim transition-colors">
                          Get Tickets
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && events.length === 0 && (
            <div className="text-center py-24">
              <span className="material-symbols-outlined text-6xl text-outline-variant opacity-30 mb-4 block">search_off</span>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-outline-variant">No events found</h2>
              <p className="text-xs uppercase tracking-widest mt-2 text-outline">Try adjusting your filters or check back later</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <div className="flex gap-px bg-surface-container-highest border border-surface-container-highest">
                {/* Previous */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="bg-surface-container-lowest px-4 h-12 flex items-center justify-center font-bold uppercase text-[10px] tracking-widest hover:bg-on-background hover:text-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>

                {/* Page numbers */}
                {getVisiblePages().map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-12 h-12 flex items-center justify-center font-bold transition-colors ${page === currentPage
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest hover:bg-primary hover:text-on-primary'
                      }`}
                  >
                    {page + 1}
                  </button>
                ))}

                {/* Next */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="bg-surface-container-lowest px-4 h-12 flex items-center justify-center font-bold uppercase text-[10px] tracking-widest hover:bg-on-background hover:text-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {/* Page info */}
          {totalPages > 1 && (
            <div className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
              Page {currentPage + 1} of {totalPages} • {totalElements} total events
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full border-t-0 flex flex-col">
        <div className="bg-blue-600 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="text-lg font-black text-white">TICKETRUSH</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}