"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthGuard } from '@/lib/useAuthGuard';
import { getToken, clearToken } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

function SeatSelectionContent() {
  useAuthGuard();
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [seatsData, setSeatsData] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [isNotBot, setIsNotBot] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [myHeldSeatIds, setMyHeldSeatIds] = useState<Set<string>>(new Set());

  const SERVICE_FEE_RATE = 0.15;

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const storedToken = getToken();
    const savedCart = localStorage.getItem('checkoutCart');
    if (storedId) setUserId(storedId);
    if (storedToken) setToken(storedToken);

    if (savedCart) {
      try {
        const { seats, eventId: savedEventId, holdId } = JSON.parse(savedCart);
        if (savedEventId === eventId && Array.isArray(seats)) {
          setSelectedSeats(seats);
          if (holdId) {
            setMyHeldSeatIds(new Set(seats.map((s: any) => s.seatId)));
            setIsNotBot(true);
          }
        }
      } catch {
        // ignore
      }
    }
    if (!eventId) return;

    const updateSeatsStatus = () => {
      fetch(`${API_BASE}/events/${eventId}/seats`)
        .then(res => {
          if (!res.ok) throw new Error("Status failed");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            // Sắp xếp dữ liệu gốc để fetch ổn định
            const sortedData = [...data].sort((a: any, b: any) => {
              if (a.rowNumber === b.rowNumber) return a.seatNumber - b.seatNumber;
              return a.rowNumber - b.rowNumber;
            });
            setSeatsData(sortedData);
            setLoading(false);
            console.log("Trạng thái ghế đã được cập nhật!");
          }
        })
        .catch(err => console.error("Lỗi cập nhật ghế:", err));
    };

    updateSeatsStatus();
    const intervalId = setInterval(updateSeatsStatus, 3000);

    return () => {
      clearInterval(intervalId);
      console.log("Đã dừng cập nhật ghế.");
    };
  }, [eventId]);

  useEffect(() => {
    if (eventId && userId && token) {
      fetch(`${API_BASE}/queue/status?eventId=${eventId}&userId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "ACTIVE" && data.expiresAt) {
            setExpiresAt(data.expiresAt);
          } else if (data.status === "EXPIRED") {
            alert("Phiên làm việc đã hết hạn!");
            router.push('/events');
          }
        });
    }
  }, [eventId, userId, token, router]);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        alert("Phiên làm việc đã hết hạn!");
        router.push('/events');
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, router]);

  const toggleSeat = (seat: any) => {
    const isAlreadySelected = selectedSeats.some(s => s.seatId === seat.seatId);

    if (isAlreadySelected) {
      setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
      return;
    }

    const isLocked = seat.status === 'Locked';
    const isSold = seat.status === 'Sold' || seat.status === 'Booked';
    const isMyHeldSeat = myHeldSeatIds.has(seat.seatId);

    if (isSold) return;
    if (isLocked && !isMyHeldSeat) return;

    const savedCartStr = localStorage.getItem('checkoutCart');
    let seatToAdd = seat;
    if (savedCartStr && isMyHeldSeat) {
      try {
        const savedCart = JSON.parse(savedCartStr);
        const savedSeat = savedCart.seats?.find((s: any) => s.seatId === seat.seatId);
        if (savedSeat) seatToAdd = savedSeat;
      } catch { /* ignore */ }
    }

    setSelectedSeats(prev =>
      [...prev, seatToAdd].sort((a, b) => {
        if (a.rowNumber === b.rowNumber) return a.seatNumber - b.seatNumber;
        return a.rowNumber - b.rowNumber;
      })
    );
  };

  const removeSeat = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(seat => seat.seatId !== seatId));
  };

  const subtotal = selectedSeats.reduce((sum, seat) => sum + (seat.price || 0), 0);
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const totalPrice = subtotal + serviceFee;

  // --- THUẬT TOÁN TÍNH TOÁN MA TRẬN ĐỘNG ---
  const rowNumbers = Array.from(new Set(seatsData.map(s => s.rowNumber))).sort((a, b) => a - b);
  const maxSeatsInARow = Math.max(0, ...rowNumbers.map(r =>
    seatsData.filter(s => s.rowNumber === r).length
  ));

  const handleConfirmSelection = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế!");
      return;
    }
    if (!isNotBot) {
      alert("Vui lòng xác nhận bạn không phải bot trước khi tiếp tục!");
      return;
    }
    const savedCartStr = localStorage.getItem('checkoutCart');
    if (savedCartStr) {
      const savedCart = JSON.parse(savedCartStr);
      const isSameSelection =
        savedCart.seats.length === selectedSeats.length &&
        selectedSeats.every(s => savedCart.seats.some((ss: any) => ss.seatId === s.seatId));

      if (isSameSelection && savedCart.holdId) {
        router.push('/checkout');
        return;
      }
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/seats/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: eventId,
          userId: userId,
          seatIds: selectedSeats.map(s => s.seatId)
        }),
      });

      if (response.ok) {
        const holdId = await response.json();
        setSelectedSeats([]);
        const cartData = {
          holdId: holdId,
          seats: selectedSeats,
          total: totalPrice,
          eventId: eventId,
          expiresAt: expiresAt
        };
        localStorage.setItem('checkoutCart', JSON.stringify(cartData));
        router.push('/checkout');
      } else {
        const errorMsg = await response.text();
        alert("Không thể giữ ghế: " + errorMsg);
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-background text-on-background flex justify-center items-center text-primary font-black animate-pulse uppercase tracking-[0.4em]">INITIATING ARENA VIEW...</div>;
  }

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest dark:bg-slate-900 w-full sticky top-0 z-50 flex justify-between items-center px-8 h-20 border-b border-surface-container-high shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-extrabold text-primary dark:text-blue-500 tracking-tighter uppercase font-['Inter'] italic">TICKETRUSH</Link>
          <nav className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest">
            <Link href="/events" className="text-primary border-b-2 border-primary py-2 transition-all">Events</Link>
            <Link href="/tickets" className="opacity-40 hover:opacity-100 transition-opacity py-2">My Tickets</Link>
            <Link href="/dashboard" className="opacity-40 hover:opacity-100 transition-opacity py-2">Dashboard</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-primary text-on-primary px-6 h-10 font-bold uppercase tracking-tighter flex items-center gap-3 shadow-lg">
            CART <span className="bg-white text-primary rounded-sm w-5 h-5 flex items-center justify-center text-[10px] font-black">{selectedSeats.length}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Section: Seating Map */}
        <section className="flex-1 bg-surface-container-low p-4 md:p-8 overflow-y-auto w-full relative">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Stage Header */}
            <div className="relative w-full h-20 bg-slate-900 flex items-center justify-center overflow-hidden shadow-2xl">
              <span className="text-white text-2xl font-black tracking-[1em] uppercase z-10">THE STAGE</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-6 justify-center py-4 bg-surface-container-lowest border border-surface-container-high shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary"></div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-tertiary"></div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500"></div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Holding</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-surface-container-highest"></div>
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Sold Out</span>
              </div>
            </div>

            {/* Interactive Map - ĐÃ SỬA ĐỂ CO GIÃN ĐỘNG */}
            <div className="bg-white p-6 md:p-12 overflow-x-auto shadow-inner border border-surface-container-high flex justify-center">
              <div className="flex flex-col gap-2 w-full max-w-4xl">
                {rowNumbers.map((rowNum) => (
                  <div key={rowNum} className="flex items-center gap-3 w-full">
                    {/* Số hàng bên trái */}
                    <span className="text-[9px] font-black opacity-20 w-6 text-right shrink-0">{rowNum}</span>

                    {/* Lưới ghế động */}
                    <div
                      className="grid gap-1 flex-grow"
                      style={{
                        gridTemplateColumns: `repeat(${maxSeatsInARow}, minmax(0, 1fr))`
                      }}
                    >
                      {seatsData
                        .filter(seat => seat.rowNumber === rowNum)
                        .map((seat) => {
                          const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
                          const isLocked = seat.status === 'Locked';
                          const isSold = seat.status === 'Sold' || seat.status === 'Booked';
                          const isMyHeld = myHeldSeatIds.has(seat.seatId);

                          let statusClass = 'bg-primary cursor-pointer hover:scale-125 hover:z-10';
                          if (isSelected) {
                            statusClass = 'bg-tertiary shadow-[0_0_10px_rgba(0,105,71,0.5)] z-10 scale-110';
                          } else if (isLocked && isMyHeld) {
                            statusClass = 'bg-tertiary/40 ring-2 ring-tertiary cursor-pointer hover:scale-125';
                          } else if (isLocked) {
                            statusClass = 'bg-amber-500 animate-pulse cursor-not-allowed';
                          } else if (isSold) {
                            statusClass = 'bg-surface-container-highest opacity-20 cursor-not-allowed';
                          }

                          const isDisabled = !isSelected && (isSold || (isLocked && !isMyHeld));

                          return (
                            <button
                              key={seat.seatId}
                              onClick={() => toggleSeat(seat)}
                              disabled={isDisabled}
                              className={`${statusClass} aspect-square w-full rounded-[1px] transition-all duration-300`}
                              title={`R${seat.rowNumber}:S${seat.seatNumber} | $${seat.price}`}
                            />
                          );
                        })}
                    </div>

                    {/* Số hàng bên phải */}
                    <span className="text-[9px] font-black opacity-20 w-6 text-left shrink-0">{rowNum}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-container-high border border-surface-container-high">
              <div className="bg-surface-container-lowest p-8 shadow-sm">
                <span className="block text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-2">01. Venue Standards</span>
                <h3 className="text-xl font-black tracking-tighter mb-4 uppercase italic">Architectural Integrity</h3>
                <p className="text-[11px] text-on-surface-variant leading-relaxed font-bold uppercase opacity-60">High-fidelity acoustics combined with optimized line-of-sight metrics across all tiers.</p>
              </div>
              <div className="bg-surface-container-lowest p-8 shadow-sm">
                <span className="block text-[10px] font-black text-tertiary uppercase tracking-[0.3em] mb-2">02. Live Feed</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed font-bold uppercase opacity-60">System synchronizing every 3,000ms with global booking nodes to ensure seat validity.</p>
              </div>
            </div>
          </div>
          <div className="h-24 md:hidden"></div>
        </section>

        {/* Right Section: Selection Panel */}
        <aside className="w-full md:w-[400px] flex-shrink-0 bg-white flex flex-col p-8 space-y-8 border-l border-surface-container-high shadow-2xl relative z-20">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-on-surface">Selection</h2>
              <div className="bg-secondary text-on-secondary px-3 py-1 flex items-center gap-2 shadow-md">
                <span className="material-symbols-outlined text-sm font-bold">timer</span>
                <span className="text-xs font-black tracking-widest tabular-nums">{timeLeft || "00:00"}</span>
              </div>
            </div>
            <div className="h-1.5 w-12 bg-primary"></div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-px bg-surface-container-high border-y-2 border-surface-container-high custom-scrollbar">
            {selectedSeats.length === 0 ? (
              <div className="bg-surface-container-lowest py-20 flex flex-col justify-center items-center h-full opacity-20">
                <span className="material-symbols-outlined text-4xl mb-2">event_seat</span>
                <span className="text-[10px] font-black uppercase tracking-widest">No Selection Active</span>
              </div>
            ) : (
              selectedSeats.map(seat => (
                <div key={seat.seatId} className="bg-white py-5 px-4 flex justify-between items-center group border-b border-surface-container">
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-tight text-on-surface">Row {seat.rowNumber} : Seat {seat.seatNumber}</div>
                    <div className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">{seat.sectionName} tier</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-xl font-black tracking-tighter text-on-surface">${seat.price?.toFixed(2)}</div>
                    <button onClick={() => removeSeat(seat.seatId)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-4 pt-4 border-t border-surface-container-high">
            <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40">
              <span>Service Aggregate (15%)</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-xl font-black uppercase tracking-tighter">Total Gross</span>
              <span className="text-4xl font-black text-primary tracking-tighter">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <label className="flex items-center gap-4 cursor-pointer group bg-slate-50 p-5 border border-surface-container-high hover:border-primary transition-all">
              <div className="relative w-6 h-6 border-2 border-surface-container-highest group-hover:border-primary transition-all flex items-center justify-center bg-white rounded-sm">
                <input className="peer hidden" type="checkbox" checked={isNotBot} onChange={(e) => setIsNotBot(e.target.checked)} />
                <div className="w-3 h-3 bg-primary opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100"></div>
              </div>
              <span className="text-[10px] bg-white font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">I am not a bot</span>
            </label>
            <button
              onClick={handleConfirmSelection}
              disabled={loading || selectedSeats.length === 0}
              className="w-full bg-primary text-on-primary py-6 text-sm font-black uppercase tracking-[0.3em] transition-all hover:bg-primary-dim active:scale-[0.97] shadow-2xl disabled:opacity-30"
            >
              {loading ? "INITIALIZING..." : "SECURE TRANSACTION"}
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default function InteractiveSeatSelection() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-blue-500 flex justify-center items-center font-black animate-pulse uppercase tracking-[0.5em]">Syncing System...</div>}>
      <SeatSelectionContent />
    </Suspense>
  );
}