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
  // Danh sách seatId mà người dùng đang giữ (từ hold cũ trong localStorage)
  // Dùng để phân biệt "Locked bởi mình" vs "Locked bởi người khác"
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
        // Chỉ khôi phục nếu đúng eventId đang xem
        if (savedEventId === eventId && Array.isArray(seats)) {
          setSelectedSeats(seats);
          // Nếu có holdId → các ghế này đang bị Locked BỞI MÌNH
          // Lưu lại để toggleSeat có thể phân biệt
          if (holdId) {
            setMyHeldSeatIds(new Set(seats.map((s: any) => s.seatId)));
            // User đã xác nhận "not a bot" từ lần trước → tự check lại
            setIsNotBot(true);
          }
        }
      } catch {
        // localStorage corrupted, bỏ qua
      }
    }
    if (!eventId) return; // Nếu không có eventId thì không làm gì cả

    // 1. Định nghĩa hàm lấy dữ liệu (Fetch)
    const updateSeatsStatus = () => {
      fetch(`${API_BASE}/events/${eventId}/seats`) // Gọi API lấy danh sách ghế
        .then(res => {
          if (!res.ok) throw new Error("Status failed");
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            // Sắp xếp ghế theo hàng và số để vẽ đúng ma trận
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

    // 2. Chạy hàm lấy dữ liệu ngay khi vừa vào trang
    updateSeatsStatus();

    // 3. Thiết lập setInterval để tự động gọi lại sau mỗi 3 giây (3000ms)
    const intervalId = setInterval(() => {
      updateSeatsStatus();
    }, 3000);

    // 4. [QUAN TRỌNG NHẤT] Hàm Cleanup: Xóa bộ đếm khi người dùng rời khỏi trang
    // Nếu không có dòng này, trình duyệt sẽ bị treo vì gọi API mãi mãi
    return () => {
      clearInterval(intervalId);
      console.log("Đã dừng cập nhật ghế.");
    };
  }, [eventId]); // Chỉ chạy lại nếu eventId thay đổi
  useEffect(() => {
    if (eventId && userId && token) {
      fetch(`${API_BASE}/queue/status?eventId=${eventId}&userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === "ACTIVE" && data.expiresAt) {
            setExpiresAt(data.expiresAt);
          } else if (data.status === "EXPIRED") {
            // Nếu backend báo EXPIRED ngay từ đầu
            alert("Phiên làm việc đã hết hạn!");
            router.push('/events');
          }
        });
    }
  }, [eventId, userId, token]);

  // 2. Chạy logic đếm ngược
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
  }, [expiresAt]);
  const toggleSeat = (seat: any) => {
    const isAlreadySelected = selectedSeats.some(s => s.seatId === seat.seatId);

    // [ƯU TIÊN SỐ 1] Luôn cho phép bỏ chọn ghế đang selected
    // Không được check bất kỳ status nào ở đây,
    // vì backend trả về available=false khi Locked → sẽ bị chặn sai
    if (isAlreadySelected) {
      setSelectedSeats(prev => prev.filter(s => s.seatId !== seat.seatId));
      return;
    }

    // Từ đây chỉ xử lý trường hợp THÊM ghế mới
    const isLocked = seat.status === 'Locked';
    // Dùng status thay vì !available để tránh false-positive với ghế Locked
    const isSold = seat.status === 'Sold' || seat.status === 'Booked';
    const isMyHeldSeat = myHeldSeatIds.has(seat.seatId);

    if (isSold) return;
    if (isLocked && !isMyHeldSeat) return;

    // Khi re-add ghế từ hold cũ, ưu tiên dùng dữ liệu đã lưu (có price, sectionName, ...)
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

      // Kiểm tra xem danh sách ghế hiện tại có giống hệt ghế đã lưu không
      const isSameSelection =
        savedCart.seats.length === selectedSeats.length &&
        selectedSeats.every(s => savedCart.seats.some((ss: any) => ss.seatId === s.seatId));

      // Nếu giống hệt và vẫn còn holdId, đi thẳng sang Checkout, không gọi API nữa
      if (isSameSelection && savedCart.holdId) {
        console.log("Sử dụng lại Reservation cũ...");
        router.push('/checkout');
        return;
      }
    }
    setLoading(true); // Bật loading khi đang gọi API
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
        const holdId = await response.json(); // Nhận UUID từ Backend

        setSelectedSeats([]); // Xóa các ghế đang chọn ở local để hiển thị màu từ Server

        const cartData = {
          holdId: holdId, // LƯU QUAN TRỌNG: Để trang checkout dùng API getHoldDetails
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
    return <div className="min-h-screen bg-background text-on-background flex justify-center items-center text-primary font-black animate-pulse">LOADING SEATS...</div>;
  }

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest dark:bg-slate-900 w-full sticky top-0 z-50 flex justify-between items-center px-8 h-20 border-b border-surface-container-high shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-extrabold text-primary dark:text-blue-500 tracking-tighter uppercase font-['Inter']">TICKETRUSH</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/events" className="text-primary dark:text-blue-400 border-b-4 border-primary font-['Inter'] font-bold tracking-tighter uppercase py-6 transition-all">Events</Link>
            <Link href="/tickets" className="text-slate-600 dark:text-slate-400 font-bold font-['Inter'] tracking-tighter uppercase py-6 hover:bg-surface dark:hover:bg-slate-800 transition-colors duration-150">My Tickets</Link>
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 font-bold font-['Inter'] tracking-tighter uppercase py-6 hover:bg-surface dark:hover:bg-slate-800 transition-colors duration-150">Dashboard</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-high dark:bg-slate-800 px-4 py-2 hidden md:flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest outline-none w-48" placeholder="SEARCH EVENTS..." type="text" />
          </div>
          <button className="bg-primary text-on-primary px-6 py-2 font-bold uppercase tracking-tighter transition-all hover:bg-primary-dim active:scale-95 flex items-center gap-2">
            CART <span className="bg-white text-primary rounded-[2px] w-5 h-5 flex items-center justify-center text-[10px] font-black">{selectedSeats.length}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Section: Seating Map */}
        <section className="flex-1 bg-surface-container-low p-8 overflow-y-auto w-full relative">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Stage Header */}
            <div className="relative w-full h-24 bg-on-background flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
              <span className="text-white text-3xl font-extrabold tracking-[0.4em] uppercase z-10">STAGE</span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-8 justify-center py-4 bg-surface-container-lowest shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-tertiary"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Locked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-surface-container-highest"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sold</span>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="bg-surface-container-lowest p-6 md:p-12 overflow-x-auto shadow-sm">
              <div className="grid grid-cols-12 gap-2 min-w-[600px] justify-items-center">
                {seatsData.length === 0 ? (
                  <div className="col-span-12 py-12 text-on-surface-variant font-bold">No seat data available</div>
                ) : (
                  seatsData.map((seat) => {
                    const isSelected = selectedSeats.some(s => s.seatId === seat.seatId);
                    const isLocked = seat.status === 'Locked';
                    const isSold = seat.status === 'Sold' || seat.status === 'Booked' || !seat.available;
                    const isMyHeld = myHeldSeatIds.has(seat.seatId);

                    let statusClass = 'bg-primary cursor-pointer hover:scale-105';
                    if (isSelected) {
                      statusClass = 'bg-tertiary cursor-pointer hover:scale-105';
                    } else if (isLocked && isMyHeld) {
                      // Ghế bị locked bởi chính mình → hiển thị như available để user biết có thể re-add
                      statusClass = 'bg-tertiary/50 cursor-pointer hover:scale-105 ring-2 ring-tertiary ring-offset-1';
                    } else if (isLocked) {
                      statusClass = 'bg-amber-500 cursor-not-allowed';
                    } else if (isSold) {
                      statusClass = 'bg-surface-container-highest cursor-not-allowed opacity-50';
                    }

                    // Ghế đang selected → KHÔNG BAO GIỜ disable (luôn cho phép bỏ chọn)
                    // Ghế available=false khi Locked → dùng status thay vì available
                    const isSoldStrict = seat.status === 'Sold' || seat.status === 'Booked';
                    const isDisabled = !isSelected && (isSoldStrict || (isLocked && !isMyHeld));

                    return (
                      <button
                        key={seat.seatId}
                        onClick={() => toggleSeat(seat)}
                        disabled={isDisabled}
                        className={`w-6 h-6 sm:w-8 sm:h-8 ${statusClass} transition-all flex items-center justify-center group ${isSelected ? 'shadow-[0_0_8px_rgba(0,105,71,0.6)]' : ''}`}
                        title={`${seat.sectionName} - Row ${seat.rowNumber}, Seat ${seat.seatNumber} | $${seat.price}${isMyHeld ? ' (your hold)' : ''}`}
                      >
                        <span className="text-[8px] sm:text-[10px] text-white opacity-0 group-hover:opacity-100 font-bold transition-opacity">{seat.rowNumber}-{seat.seatNumber}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Venue Info & Perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-container-high">
              <div className="bg-surface-container-lowest p-6 shadow-sm">
                <span className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Section Highlight</span>
                <h3 className="text-xl font-bold tracking-tighter mb-2 uppercase">VENUE ACCESSIBILITY</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">Prime visibility with clear line-of-sight to center stage. Real-time updated seat status ensuring you get what you book.</p>
              </div>
              <div className="bg-surface-container-lowest p-6 shadow-sm">
                <span className="block text-[10px] font-bold text-tertiary uppercase tracking-[0.2em] mb-2">Exclusive Perks</span>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-bold uppercase">Dynamic Seat Assignment</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-bold uppercase">Live Pricing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-bold uppercase">Fast Checkout Experience</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Bottom Padding for Mobile Nav */}
          <div className="h-24 md:hidden"></div>
        </section>

        {/* Right Section: Selection Panel */}
        <aside className="w-full md:w-[400px] flex-shrink-0 bg-surface-container-lowest flex flex-col p-8 space-y-8 border-l border-surface-container-high shadow-xl md:shadow-none relative z-20">
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <h2 className="text-3xl font-extrabold tracking-tighter uppercase italic text-on-surface">YOUR SELECTION</h2>
              <div className="bg-secondary text-on-secondary px-3 py-1 flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span className="text-xs font-bold tracking-widest tabular-nums animate-pulse">{timeLeft}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block pt-2">HOLD TIMER ACTIVE</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-px bg-surface-container-high border-y border-surface-container-high">
            {/* Selected Items */}
            {selectedSeats.length === 0 ? (
              <div className="bg-surface-container-lowest py-8 flex justify-center items-center h-full">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">No seats selected</span>
              </div>
            ) : (
              selectedSeats.map(seat => (
                <div key={seat.seatId} className="bg-surface-container-lowest py-4 flex justify-between items-center group px-2">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-tight text-on-surface">{seat.sectionName} - Row {seat.rowNumber}, Seat {seat.seatNumber}</div>
                    <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{seat.seatType || 'Standard'} Admission</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-lg font-bold tracking-tighter text-on-surface">${seat.price?.toFixed(2)}</div>
                    <button
                      onClick={() => removeSeat(seat.seatId)}
                      className="text-secondary hover:text-on-surface transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove seat"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Service Fee (15%)</span>
              <span className="text-sm font-bold text-on-surface">${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-baseline border-t-2 border-surface-container-highest pt-4">
              <span className="text-xl font-bold uppercase tracking-tighter text-on-surface">Total Price</span>
              <span className="text-3xl font-extrabold text-primary tracking-tighter">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-6 pt-4 flex-none">
            <label className="flex items-center gap-4 cursor-pointer group bg-surface-container-low p-4 border border-transparent hover:border-outline-variant transition-colors">
              <div className="relative w-6 h-6 border-2 border-surface-container-highest group-hover:border-primary transition-all flex items-center justify-center bg-white">
                <input
                  className="peer hidden"
                  type="checkbox"
                  checked={isNotBot}
                  onChange={(e) => setIsNotBot(e.target.checked)}
                />
                <div className="w-3 h-3 bg-primary opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-xs font-bold uppercase tracking-tight text-on-surface-variant group-hover:text-on-surface transition-colors">I AM NOT A BOT</span>
            </label>
            <button
              onClick={handleConfirmSelection}
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 text-lg font-extrabold uppercase tracking-[0.1em] transition-all hover:bg-primary-dim active:scale-[0.98] flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {loading ? "PROCESSING..." : "CONFIRM SELECTION"}
            </button>
          </div>

          <div className="mt-auto pb-24 md:pb-0 flex-none">
            <div className="p-4 bg-surface-container border border-surface-container-high flex items-start gap-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <div>
                <div className="text-[10px] font-bold text-on-surface uppercase tracking-widest mb-1">SECURE TRANSACTION</div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed uppercase">TicketRush uses 256-bit encryption for all purchase transactions. Your data is strictly confidential.</p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full h-16 flex justify-around items-stretch z-50 bg-white dark:bg-slate-900 border-t border-surface-container-high shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <Link href="/events" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 h-full px-4 active:bg-slate-50">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
          <span className="text-[10px] font-bold uppercase mt-1">Discover</span>
        </Link>
        <Link href="/tickets" className="flex flex-col items-center justify-center bg-primary text-on-primary h-full px-4 w-1/4 shadow-inner">
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="text-[10px] font-bold uppercase mt-1">Tickets</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 h-full px-4 active:bg-slate-50">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold uppercase mt-1">Account</span>
        </Link>
      </nav>
    </div>
  );
}

export default function InteractiveSeatSelection() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-on-background flex justify-center items-center text-primary font-black animate-pulse">LOADING APP...</div>}>
      <SeatSelectionContent />
    </Suspense>
  );
}
