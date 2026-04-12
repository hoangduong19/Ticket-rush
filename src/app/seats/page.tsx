"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InteractiveSeatSelection() {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [isNotBot, setIsNotBot] = useState(false);

  const SEAT_PRICE = 189.00;
  const SERVICE_FEE_RATE = 0.15;

  const toggleSeat = (index: number) => {
    // Prevent selecting locked or sold out seats
    const isLocked = index % 13 === 0;
    const isSold = index % 7 === 0 && !isLocked;
    if (isLocked || isSold) return;

    setSelectedSeats(prev => {
      if (prev.includes(index)) {
        return prev.filter(seat => seat !== index);
      } else {
        return [...prev, index].sort((a, b) => a - b);
      }
    });
  };

  const removeSeat = (index: number) => {
    setSelectedSeats(prev => prev.filter(seat => seat !== index));
  };

  const handleConfirmSelection = (e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat.");
      return;
    }
    if (!isNotBot) {
      alert("Please confirm you are not a bot.");
      return;
    }

    const cartData = {
      seats: selectedSeats.map(index => ({
        id: index,
        row: String.fromCharCode(65 + Math.floor(index / 12)),
        seatNumber: index + 1,
        label: `Orchestra Left - Row ${String.fromCharCode(65 + Math.floor(index / 12))}, Seat ${index + 1}`,
        type: 'General Admission',
        price: SEAT_PRICE
      })),
      subtotal,
      fee: serviceFee,
      total: totalPrice
    };

    localStorage.setItem('checkoutCart', JSON.stringify(cartData));
    router.push('/checkout');
  };

  const subtotal = selectedSeats.length * SEAT_PRICE;
  const serviceFee = subtotal * SERVICE_FEE_RATE;
  const totalPrice = subtotal + serviceFee;

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen">
      {/* TopAppBar */}
      <header className="bg-surface-container-lowest dark:bg-slate-900 w-full sticky top-0 z-50 flex justify-between items-center px-8 h-20 border-b border-surface-container-high md:border-none shadow-sm md:shadow-none">
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

      <main className="min-h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden">
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
                {/* Dynamically Generated Seats */}
                {Array.from({ length: 120 }).map((_, i) => {
                  let statusClass = 'bg-primary cursor-pointer hover:scale-105';
                  const isSelected = selectedSeats.includes(i);
                  const isLocked = i % 13 === 0;
                  const isSold = i % 7 === 0 && !isLocked;

                  if (isSelected) {
                    statusClass = 'bg-tertiary cursor-pointer hover:scale-105';
                  } else if (isSold) {
                    statusClass = 'bg-surface-container-highest cursor-not-allowed opacity-50';
                  } else if (isLocked) {
                    statusClass = 'bg-amber-500 cursor-not-allowed';
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => toggleSeat(i)}
                      disabled={isSold || isLocked}
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${statusClass} transition-all flex items-center justify-center group ${isSelected ? 'shadow-[0_0_8px_rgba(0,105,71,0.6)]' : ''}`}
                    >
                      <span className="text-[8px] sm:text-[10px] text-white opacity-0 group-hover:opacity-100 font-bold transition-opacity">{i + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Venue Info & Perks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-container-high">
              <div className="bg-surface-container-lowest p-6 shadow-sm">
                <span className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Section Highlight</span>
                <h3 className="text-xl font-bold tracking-tighter mb-2 uppercase">ORCHESTRA LEFT</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">Prime visibility with clear line-of-sight to center stage. All seats in this section feature premium ergonomic support.</p>
              </div>
              <div className="bg-surface-container-lowest p-6 shadow-sm">
                <span className="block text-[10px] font-bold text-tertiary uppercase tracking-[0.2em] mb-2">Exclusive Perks</span>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-bold uppercase">Private Lounge Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-bold uppercase">Early Entry Pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-bold uppercase">Complimentary Welcome Drink</span>
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
                <span className="text-xs font-bold tracking-widest tabular-nums animate-pulse">09:52</span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block pt-2">HOLD TIMER ACTIVE</span>
          </div>

          <div className="space-y-px bg-surface-container-high border-y border-surface-container-high">
            {/* Selected Items */}
            {selectedSeats.length === 0 ? (
              <div className="bg-surface-container-lowest py-8 flex justify-center items-center">
                <span className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">No seats selected</span>
              </div>
            ) : (
              selectedSeats.map(index => {
                const row = String.fromCharCode(65 + Math.floor(index / 12));
                const seatNum = index + 1;
                return (
                  <div key={index} className="bg-surface-container-lowest py-4 flex justify-between items-center group">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-tight text-on-surface">Orchestra Left - Row {row}, Seat {seatNum}</div>
                      <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">General Admission</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold tracking-tighter text-on-surface">${SEAT_PRICE.toFixed(2)}</div>
                      <button
                        onClick={() => removeSeat(index)}
                        className="text-secondary hover:text-on-surface transition-colors opacity-100 md:opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Remove seat"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  </div>
                );
              })
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

          <div className="space-y-6 pt-4 flex-grow">
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
              className="w-full bg-primary text-on-primary py-5 text-lg font-extrabold uppercase tracking-[0.1em] transition-all hover:bg-primary-dim active:scale-[0.98] flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              CONFIRM SELECTION
            </button>
          </div>

          <div className="mt-auto pb-24 md:pb-0">
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
