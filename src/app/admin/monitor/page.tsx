"use client";

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

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
  const eventId = searchParams.get('eventId');

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  // --- THUẬT TOÁN TÍNH TOÁN KPI ---
  const totalSeatsCount = seats.length;
  const soldSeats = seats.filter(s => s.status === 'Sold' || s.status === 'Booked');
  const holdSeats = seats.filter(s => s.status === 'Hold' || s.status === 'Locked');
  const totalRevenue = soldSeats.reduce((sum, s) => sum + (s.price || 0), 0);
  const occupancyPercentage = totalSeatsCount > 0 ? (soldSeats.length / totalSeatsCount) * 100 : 0;

  // --- THUẬT TOÁN XÁC ĐỊNH MA TRẬN HÀNG GHẾ ---
  // 1. Lấy danh sách các số hàng duy nhất
  const rowNumbers = Array.from(new Set(seats.map(s => s.rowNumber))).sort((a, b) => a - b);
  // 2. Tìm số lượng ghế lớn nhất trong một hàng để làm chuẩn chia cột
  const maxSeatsInARow = Math.max(0, ...rowNumbers.map(r =>
    seats.filter(s => s.rowNumber === r).length
  ));

  useEffect(() => {
    if (!eventId) return;

    const fetchMonitorData = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken') ?? '';
        const res = await fetch(`${API_BASE}/events/${eventId}/seats`, {
          cache: 'no-store',
          headers: { 'Authorization': `Bearer ${adminToken}` },
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

  const getSeatColorClass = (seat: Seat) => {
    if (seat.status === 'Sold' || seat.status === 'Booked') return 'bg-gray-300';
    if (seat.status === 'Hold' || seat.status === 'Locked') return 'bg-amber-500';
    //if (seat.seatType === 'VIP' || seat.seatType === 'Platinum') return 'bg-secondary';
    return 'bg-primary-container border border-outline-variant/20';
  };

  if (loading) return <div className="min-h-screen bg-black text-primary flex items-center justify-center font-black animate-pulse">CONNECTING TO LIVE STREAM...</div>;

  return (
    <div className="flex min-h-screen bg-surface text-on-surface font-body">
      {/* Sidebar Navigation - Giữ nguyên */}
      <aside className="w-64 bg-surface-container-high hidden md:flex flex-col shrink-0 border-r border-outline-variant/10">
        <div className="px-6 py-8">
          <span className="text-2xl font-black italic tracking-tighter text-blue-600 uppercase">TicketRush</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium uppercase text-[10px] tracking-widest">
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/monitor/list" className="flex items-center gap-3 px-4 py-3 bg-primary text-on-primary font-bold transition-colors uppercase text-[10px] tracking-widest">
            <span className="material-symbols-outlined text-sm">map</span>
            <span>Live Monitor</span>
          </Link>
        </nav>
      </aside>

      <div className="flex-grow flex flex-col min-w-0 overflow-hidden">
        <header className="bg-slate-50 dark:bg-slate-950 flex justify-between items-center w-full px-6 py-4 border-b border-surface-container-high sticky top-0 z-40 shrink-0">
          <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500 uppercase">Live Monitor</h1>
          <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-[10px] font-black text-green-600 uppercase tracking-tighter">System Online</span>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-8 bg-background">
          {/* KPI Grid - Giữ nguyên */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-8 border-[0.5px] border-outline-variant/20 shadow-sm">
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Live Revenue</p>
              <span className="text-3xl font-black text-on-surface tracking-tighter">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Occupancy Rate</p>
              <span className="text-3xl font-black text-on-surface tracking-tighter">{occupancyPercentage.toFixed(1)}%</span>
            </div>
            <div className="bg-surface-container-lowest p-6 border-r border-outline-variant/20">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Active Holds</p>
              <span className="text-3xl font-black text-primary tracking-tighter">{holdSeats.length}</span>
            </div>
            <div className="bg-surface-container-lowest p-6">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1">Inventory</p>
              <span className="text-3xl font-black text-on-surface tracking-tighter">{soldSeats.length}/{totalSeatsCount}</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main Visual Map Section - PHẦN SỬA ĐỂ KHÔNG BỊ TRÀN */}
            <section className="flex-grow w-full bg-surface-container-lowest relative min-h-[600px] border border-outline-variant/20 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-surface-container-high px-6 py-4 flex items-center justify-between border-b border-outline-variant/20">
                <span className="text-[9px] font-black text-outline uppercase tracking-widest">Arena_Matrix_Engine / Live_Sync</span>
                <span className="text-[9px] font-bold text-outline uppercase">Max Seats Per Row: {maxSeatsInARow}</span>
              </div>

              {/* Seating Map Grid - RE-ENGINEERED */}
              <div className="p-12 flex-grow overflow-auto bg-white flex flex-col items-center">
                <div className="w-full max-w-4xl">
                  {/* Stage */}
                  <div className="w-full h-10 bg-on-surface text-surface flex items-center justify-center font-black uppercase tracking-[1em] text-[10px] mb-16 shadow-lg">
                    THE STAGE
                  </div>

                  {/* Render theo từng hàng */}
                  <div className="flex flex-col gap-2">
                    {rowNumbers.map((rowNum) => (
                      <div key={rowNum} className="flex items-center gap-3 w-full">
                        {/* Số hàng bên trái */}
                        <span className="text-[9px] font-black opacity-20 w-6 text-right shrink-0">{rowNum}</span>

                        {/* Lưới ghế động của hàng này */}
                        <div
                          className="grid gap-1 flex-grow"
                          style={{
                            // Tự động chia cột dựa trên số ghế lớn nhất của toàn bộ sự kiện
                            gridTemplateColumns: `repeat(${maxSeatsInARow}, minmax(0, 1fr))`
                          }}
                        >
                          {seats
                            .filter(s => s.rowNumber === rowNum)
                            .sort((a, b) => a.seatNumber - b.seatNumber)
                            .map((seat) => (
                              <div
                                key={seat.seatId}
                                className={`w-full aspect-square rounded-[1px] transition-all duration-500 ${getSeatColorClass(seat)}`}
                                title={`Row ${seat.rowNumber}, Seat ${seat.seatNumber} | ${seat.status}`}
                              ></div>
                            ))}
                        </div>

                        {/* Số hàng bên phải */}
                        <span className="text-[9px] font-black opacity-20 w-6 text-left shrink-0">{rowNum}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="p-6 bg-surface-container-high/30 border-t border-outline-variant/10 flex gap-8 justify-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary-container block border border-outline-variant/20"></span>
                  <span className="text-[9px] font-black uppercase text-outline">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gray-300"></span>
                  <span className="text-[9px] font-black uppercase text-outline">Sold</span>
                </div>
                {/*<div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-secondary block"></span>
                  <span className="text-[9px] font-black uppercase text-outline">Premium</span>
                </div>*/}
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-amber-500"></span>
                  <span className="text-[9px] font-black uppercase text-outline">Holding</span>
                </div>
              </div>
            </section>

            {/* Live Feed Panel - Giữ nguyên */}
            <aside className="w-full lg:w-96 bg-surface-container-lowest border border-outline-variant/20 flex flex-col shrink-0 h-[670px] shadow-sm">
              <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-high/50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
                  <h3 className="text-sm font-black uppercase tracking-tight">Live_Activity</h3>
                </div>
              </div>
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {seats.filter(s => s.status !== 'Available').slice(0, 15).map((s) => (
                  <div key={s.seatId} className="p-4 border-b border-outline-variant/10 bg-surface-container-low/50 hover:bg-surface-container-low transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-[1px] ${s.status === 'Sold' ? 'bg-primary text-white' : 'bg-secondary text-white'}`}>
                        {s.status.toUpperCase()}
                      </span>
                      <span className="text-[8px] font-bold text-outline">LIVE</span>
                    </div>
                    <p className="text-[10px] font-black text-on-surface uppercase">SECTOR_{s.sectionName}</p>
                    <p className="text-[9px] font-bold text-outline pl-2 border-l-2 border-primary mt-1 uppercase tracking-tighter">ROW: {s.rowNumber} | SEAT: {s.seatNumber}</p>
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
    <Suspense fallback={<div className="min-h-screen bg-black text-primary flex items-center justify-center font-black animate-pulse">LOADING MONITOR NODE...</div>}>
      <MonitorContent />
    </Suspense>
  );
}