"use client";

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

// Định nghĩa kiểu dữ liệu ghế
interface Seat {
  seatId: string;
  status: string;
  price: number;
  rowNumber: number;
  seatNumber: number;
  sectionName: string;
  seatType: string;
}

function MonitorContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId'); // Lấy ID từ URL: ?eventId=...

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  // --- THUẬT TOÁN TÍNH TOÁN KPI THỜI GIAN THỰC ---
  const totalSeatsCount = seats.length;
  const soldSeats = seats.filter(s => s.status === 'Sold' || s.status === 'Booked');
  const holdSeats = seats.filter(s => s.status === 'Hold' || s.status === 'Locked');

  const totalRevenue = soldSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const occupancyPercentage = totalSeatsCount > 0 ? (soldSeats.length / totalSeatsCount) * 100 : 0;

  // --- LOGIC FETCH DATA (POLLING 3 GIÂY/LẦN) ---
  useEffect(() => {
    if (!eventId) return;

    const fetchMonitorData = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken') ?? '';
        const res = await fetch(`${API_BASE}/events/${eventId}/seats`, {
          cache: 'no-store',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setSeats(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Monitor fetch error:", err);
      }
    };

    fetchMonitorData();
    const interval = setInterval(fetchMonitorData, 3000);
    return () => clearInterval(interval);
  }, [eventId]);

  // Hàm lấy màu sắc ghế dựa trên trạng thái thật từ DB
  const getSeatColorClass = (seat: Seat) => {
    if (seat.status === 'Sold' || seat.status === 'Booked') return 'bg-primary opacity-90'; // Đã bán (Xanh đậm)
    if (seat.status === 'Hold' || seat.status === 'Locked') return 'bg-error animate-pulse'; // Đang giữ (Đỏ/Cam)
    if (seat.seatType === 'VIP') return 'bg-secondary'; // VIP trống (Tím)
    if (seat.seatType === 'Platinum') return 'bg-secondary';
    return 'bg-primary-container'; // Thường trống (Xanh nhạt)
  };

  if (loading) return <div className="min-h-screen bg-black text-primary flex items-center justify-center font-black animate-pulse">CONNECTING TO LIVE STREAM...</div>;

  return (
    <div className="flex min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary font-body">
      {/* Sidebar Navigation - Giữ nguyên */}
      <aside className="w-64 bg-surface-container-high hidden md:flex flex-col shrink-0">
        <div className="px-6 py-8">
          <span className="text-2xl font-black tracking-tighter text-blue-600 uppercase">TicketRush</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/monitor/list" className="flex items-center gap-3 px-4 py-3 bg-primary text-on-primary font-bold transition-colors">
            <span className="material-symbols-outlined">map</span>
            <span>Live Monitor</span>
          </Link>
        </nav>
        <div className="p-6 bg-surface-container-highest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-white text-xl">A</div>
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-on-surface-variant">System Architect</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-slate-50 dark:bg-slate-950 flex justify-between items-center w-full px-6 py-4 border-b border-surface-container-high sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500 uppercase">Live Monitor</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black text-green-600 uppercase">System Online</span>
            </div>
            <button className="material-symbols-outlined text-on-surface-variant">notifications</button>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8 bg-background">
          {/* KPI Grid - DỮ LIỆU THẬT */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-8 border-[0.5px] border-outline-variant/20 shadow-sm">
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Live Revenue</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-on-surface tracking-tighter">
                  ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Occupancy Rate</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-on-surface tracking-tighter">{occupancyPercentage.toFixed(1)}%</span>
                <span className="text-xs font-bold text-outline mb-1">{soldSeats.length}/{totalSeatsCount}</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Active Holds</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-primary tracking-tighter">{holdSeats.length}</span>
                <span className="material-symbols-outlined text-primary mb-1 text-sm">shopping_cart</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">System Status</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black text-on-surface tracking-tighter italic">NOMINAL</span>
                <span className="material-symbols-outlined text-outline mb-1 text-sm">check_circle</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Visual Map Section - DỮ LIỆU THẬT */}
            <section className="flex-grow w-full bg-surface-container-lowest p-0 relative min-h-[600px] border border-outline-variant/20 shadow-sm">
              <div className="bg-surface-container-high px-6 py-4 flex items-center justify-between border-b border-outline-variant/20">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-outline uppercase tracking-widest">Active Stream</span>
                    <span className="text-sm font-black text-on-surface uppercase">Arena_Matrix_Engine</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase text-outline">
                  Refreshing every 3s
                </div>
              </div>

              {/* Seating Map Grid - VẼ DỰA TRÊN DỮ LIỆU TỪ SERVER */}
              <div className="p-8 flex flex-col items-center overflow-auto max-h-[500px]">
                <div className="w-fit">
                  <div className="w-full h-12 bg-on-surface text-white flex items-center justify-center font-black uppercase tracking-[0.5em] mb-16 shadow-md rounded-[1px]">
                    THE STAGE
                  </div>

                  {/* Grid hiển thị linh hoạt 24 cột */}
                  <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}>
                    {seats.map((seat) => (
                      <div
                        key={seat.seatId}
                        className={`w-4 h-4 rounded-[1px] transition-colors duration-500 ${getSeatColorClass(seat)}`}
                        title={`Row ${seat.rowNumber}, Seat ${seat.seatNumber} - ${seat.status}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-6 left-6 flex gap-6 bg-surface-container-lowest p-4 border border-outline-variant/20 shadow-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary-container block border border-outline-variant/30"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary block"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider">Sold</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-secondary block"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider">VIP</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-error block"></span>
                  <span className="text-[9px] font-black uppercase tracking-wider">Holding</span>
                </div>
              </div>
            </section>

            {/* Live Feed Panel - HIỂN THỊ CÁC GHẾ VỪA ĐỔI TRẠNG THÁI */}
            <aside className="w-full lg:w-96 bg-surface-container-lowest border border-outline-variant/20 flex flex-col shrink-0 h-[600px] shadow-sm">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                  <h3 className="text-sm font-black uppercase tracking-tight">Live_Activity</h3>
                </div>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {/* Lấy 10 ghế mới bị tác động gần đây (Hold hoặc Sold) */}
                {seats.filter(s => s.status !== 'Available').slice(0, 10).map((s) => (
                  <div key={s.seatId} className="p-4 border-b border-outline-variant/10 bg-surface-container-low transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-[2px] ${s.status === 'Sold' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                        {s.status.toUpperCase()}
                      </span>
                      <span className="text-[8px] font-bold text-outline">LIVE</span>
                    </div>
                    <p className="text-[11px] font-black text-on-surface uppercase">SECTOR_{s.sectionName}</p>
                    <p className="text-[10px] font-bold text-outline pl-2 border-l-2 border-primary mt-1">ROW: {s.rowNumber} | SEAT: {s.seatNumber}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function RealtimeSeatMonitor() {
  return (
    <Suspense fallback={<div>Loading Monitor Node...</div>}>
      <MonitorContent />
    </Suspense>
  );
}