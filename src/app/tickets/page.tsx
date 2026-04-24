"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { getToken, clearToken } from '@/lib/auth';


interface Ticket {
  ticketId: string;      
  eventName: string;
  sectionName: string;
  rowNumber: number;     
  seatNumber: number;
  price: number;         
  qrCodeData: string;    
  purchaseDate: string;  
  bannerUrl: string;     
}
export default function MyTicketsPage() {
  useAuthGuard();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    const token = getToken();
    
    fetch(`${NEXT_PUBLIC_API_URL}/tickets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch tickets", err);
        setLoading(false);
      });

    if (token) {
      fetch(`${NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.avatarUrl || data.url) {
            setAvatarUrl(data.avatarUrl || data.url);
          }
        })
        .catch(err => console.error("Failed to fetch avatar", err));
    }
  }, []);

  if (loading) return <div className="p-20 text-center font-bold">Loading Tickets...</div>;
  return (
    <div className="bg-background min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* TopNavBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 z-50 font-['Inter'] antialiased flat no-shadows">
        <div className="flex justify-between items-center px-8 h-20 max-w-full mx-auto">
          <Link href="/" className="text-2xl font-black tracking-tighter text-blue-700 dark:text-blue-400 uppercase">TicketRush</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150 px-2 py-1">Events</Link>
            <Link href="/tickets" className="text-blue-700 dark:text-blue-400 font-bold border-b-4 border-blue-700 dark:border-blue-400 pb-1 px-2">My Tickets</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-600 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95">notifications</button>
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 bg-surface-container-highest overflow-hidden focus:outline-none hover:ring-2 ring-primary">
                <img alt="User profile" className="w-full h-full object-cover" src={avatarUrl} />
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
                    localStorage.removeItem('queueUserId');
                    window.location.href = '/login';
                  }} className="px-4 py-3 text-sm font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left transition-colors flex items-center gap-3">
                    <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[1px] w-full"></div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-8 py-12">
        <header className="mb-16">
          <h1 className="text-[3.5rem] font-extrabold tracking-tight text-on-surface leading-none mb-4">My Tickets</h1>
          <p className="text-on-surface-variant font-medium tracking-wide uppercase text-sm">Dashboard Overview • {tickets.length} Active Passes</p>
        </header>

        {/* Ticket Section: Upcoming */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-secondary text-on-secondary px-3 py-1 text-[0.75rem] font-bold uppercase tracking-wider">Upcoming</span>
            <div className="flex-grow h-[2px] bg-surface-container-high"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tickets.length === 0 ? (
              <div className="col-span-2 py-20 text-center opacity-50 font-bold uppercase">
                Bạn chưa có vé nào.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div key={ticket.ticketId} className="bg-surface-container-lowest flex flex-col md:flex-row group transition-all border border-surface-container-high hover:shadow-lg">
                  {/* Sử dụng bannerUrl từ DTO */}
                  <div className="w-full md:w-48 h-64 md:h-auto overflow-hidden bg-slate-200">
                    <img 
                      alt={ticket.eventName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      src={ticket.bannerUrl || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=500"} 
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow relative">
                    <div className="mb-auto">
                      <p className="text-[0.75rem] font-bold text-primary uppercase tracking-widest mb-2">
                        {new Date(ticket.purchaseDate).toLocaleString('vi-VN')}
                      </p>
                      <h2 className="text-[1.375rem] font-bold text-on-surface mb-1 leading-tight">
                        {ticket.eventName}
                      </h2>
                      {/* Thêm cả Row Number vào đây cho chi tiết */}
                      <p className="text-on-surface-variant text-sm font-medium mb-6 uppercase tracking-tight">
                        {ticket.sectionName} • Hàng {ticket.rowNumber} • Ghế {ticket.seatNumber}
                      </p>

                      <div className="grid grid-cols-3 gap-4 bg-surface-container-low p-4">
                        <div className="col-span-1">
                          <p className="text-[0.625rem] font-bold text-outline uppercase">Giá vé</p>
                          <p className="text-sm font-bold text-on-surface">${ticket.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                     
                      <div className="w-20 h-20 bg-white border border-surface-container-high p-1">
                        {/* QR encode toàn bộ ticket JSON — khi quét sẽ ra đầy đủ thông tin */}
                        <img
                          alt="QR Code"
                          className="w-full h-full grayscale"
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify({
                            ticketId: ticket.ticketId,
                            eventName: ticket.eventName,
                            sectionName: ticket.sectionName,
                            rowNumber: ticket.rowNumber,
                            seatNumber: ticket.seatNumber,
                            price: ticket.price,
                            purchaseDate: ticket.purchaseDate
                          }, null, 2))}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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
