"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Checkout() {
  const router = useRouter();
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [timeLeft, setTimeLeft] = useState<string>("--:--");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const cartDataStr = localStorage.getItem('checkoutCart');
    if (!cartDataStr) {
      router.push('/events'); // Không có giỏ hàng thì quay về
      return;
    }

    const cartData = JSON.parse(cartDataStr);
    const expiresAt = cartData.expiresAt;
    
    if (!expiresAt) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const end = new Date(expiresAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        setIsExpired(true);
        alert("Phiên thanh toán đã hết hạn!");
        router.push('/events');
        return false;
      }

      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      return true;
    };

    calculateTime(); // Chạy ngay lập tức
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [router]);
  const handleConfirmPurchase = async () => {
    if (isExpired) {
      alert("Hết thời gian thanh toán!");
      return;
    }

    // 1. Lấy dữ liệu
    const userId = localStorage.getItem('queueUserId');
    const cartDataStr = localStorage.getItem('checkoutCart');
    const token = localStorage.getItem('token');
    
    if (!userId || !token || !cartDataStr) {
      alert("Thông tin phiên làm việc không hợp lệ!");
      return;
    }
    
    const cartData = JSON.parse(cartDataStr);
    const { holdId, eventId } = cartData;

    try {
      // BƯỚC 1: Gọi API Checkout của ông (Tạo vé trong DB)
      const checkoutRes = await fetch(`${NEXT_PUBLIC_API_URL}/checkout?holdId=${holdId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!checkoutRes.ok) {
        const errMsg = await checkoutRes.text();
        throw new Error(errMsg || "Lỗi khi xử lý thanh toán");
      }

      try {
        await fetch(`${NEXT_PUBLIC_API_URL}/queue/complete`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ eventId: eventId, userId: userId })
        });
      } catch (queueErr) {
        console.error("Dọn dẹp hàng chờ thất bại:", queueErr);
      }

      localStorage.removeItem('checkoutCart');
      localStorage.removeItem('queueUserId'); 
      
      alert('Thanh toán thành công! Vé đã được xuất.');
      router.push('/tickets');
      
      return;

    } catch (err: any) {
      alert(err.message);
      console.error("Checkout error:", err);
    }
};

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopAppBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TicketRush</Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Events</Link>
            <Link href="/tickets" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">My Tickets</Link>
            <Link href="/dashboard" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Dashboard</Link>
            <Link href="/orders" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase">Orders</Link>
          </nav>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-blue-700 dark:text-blue-400">account_circle</span>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-8 py-12">
        {/* Urgency Banner: Tonal Block */}
        <div className="bg-secondary text-on-secondary p-6 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>timer</span>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase opacity-80">Reserved Status</p>
              <h2 className="text-2xl font-black tracking-tight uppercase">YOUR SEATS ARE HELD FOR<span className="tabular-nums">{timeLeft}</span></h2>
            </div>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-xs font-bold tracking-widest uppercase opacity-80">Session ID</p>
            <p className="font-mono text-sm">TR-99283-X</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-surface-container">
          {/* Left Column: Checkout Form (8 cols) */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-8 lg:p-12">
            <h1 className="text-[3.5rem] font-extrabold tracking-tighter leading-none mb-12 text-primary">CHECKOUT</h1>
            
            {/* Payment Form Section */}
            <section className="space-y-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-primary text-on-primary w-8 h-8 flex items-center justify-center font-bold">1</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Delivery Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline">First Name</label>
                    <input 
                      className="w-full bg-surface-container-high p-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary placeholder:opacity-30" 
                      placeholder="Alex" 
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline">Last Name</label>
                    <input 
                      className="w-full bg-surface-container-high p-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary placeholder:opacity-30" 
                      placeholder="Russo" 
                      type="text"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline">Email Address</label>
                    <input 
                      className="w-full bg-surface-container-high p-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary placeholder:opacity-30" 
                      placeholder="alex.russo@example.com" 
                      type="email"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="bg-primary text-on-primary w-8 h-8 flex items-center justify-center font-bold">2</span>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Payment Method</h3>
                </div>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline">Card Number</label>
                    <div className="relative">
                      <input 
                        className="w-full bg-surface-container-high p-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary font-mono tracking-widest" 
                        placeholder="0000 0000 0000 0000" 
                        type="text"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">credit_card</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline">Expiry</label>
                      <input 
                        className="w-full bg-surface-container-high p-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary" 
                        placeholder="MM/YY" 
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline">CVV</label>
                      <input 
                        className="w-full bg-surface-container-high p-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary" 
                        placeholder="***" 
                        type="text"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1 space-y-2">
                      <label className="text-[0.75rem] font-bold uppercase tracking-widest text-outline">Zip Code</label>
                      <input 
                        className="w-full bg-surface-container-high p-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-primary" 
                        placeholder="10001" 
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleConfirmPurchase} 
                disabled={isExpired}
                className={`w-full py-6 text-xl font-black uppercase tracking-widest transition-colors active:translate-y-0.5 ${isExpired ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary text-on-primary hover:bg-primary-dim'}`}
              >
                {isExpired ? "Session Expired" : "Confirm Purchase"}
              </button>
              <p className="text-[0.75rem] text-center text-outline-variant font-bold uppercase tracking-tighter">
                By clicking confirm, you agree to the TicketRush Terms of Service
              </p>
            </section>
          </div>

          {/* Right Column: Order Summary (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-1 bg-surface-container">
            {/* Event Identity */}
            <div className="bg-surface-container-low p-8">
              <div className="h-48 w-full bg-surface-dim overflow-hidden mb-6">
                <img 
                  className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" 
                  alt="Event Overview" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2E-oOcRh6hIgv8jfIRDGS6DF7BuxRI2Bb25uJrfHGpWpVFBXiu9qQBDWr9-aitUfMgOG4YjV07lprXHcVEYvFnDGpofIzRrOXPJB_SNIGL1diezkNx4Y6ndlYP0ioDOqKqtUIh50rhXjyn0GkUShghLFLuvIuLgPVP4kbNWB1FC-e3KrvCifNo1dhmz7QvhGtGYqpR8oTyghyUHifTf6BgugFtYtYVpy3vIoDiGSsWBKVw1MPUbEW-Dn2k8g3_A_avoa2j3guByn6"
                />
              </div>
              <p className="text-secondary font-bold uppercase tracking-widest text-xs mb-2">Live Event</p>
              <h2 className="text-2xl font-black tracking-tight leading-none mb-4">NEON HORIZON WORLD TOUR</h2>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-on-surface-variant font-bold uppercase text-[0.75rem]">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  AUG 24, 2024 • 19:30
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-bold uppercase text-[0.75rem]">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  METROPLEX ARENA, SECTOR 7
                </div>
              </div>
            </div>

            {/* Seat Breakdown */}
            <div className="bg-surface-container-lowest p-8 flex-grow">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 border-b-2 border-primary pb-2 inline-block">Order Summary</h3>
              <div className="space-y-6">
                {/* Ticket Item 1 */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-outline uppercase tracking-widest">General Admission</p>
                    <p className="text-lg font-black leading-none">SECTION A, SEAT 12</p>
                  </div>
                  <p className="font-bold text-primary">$185.00</p>
                </div>
                {/* Ticket Item 2 */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-outline uppercase tracking-widest">General Admission</p>
                    <p className="text-lg font-black leading-none">SECTION A, SEAT 13</p>
                  </div>
                  <p className="font-bold text-primary">$185.00</p>
                </div>
                <div className="pt-6 mt-6 border-t border-surface-container-highest space-y-4">
                  <div className="flex justify-between text-on-surface-variant text-sm font-bold uppercase">
                    <span>Subtotal</span>
                    <span>$370.00</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-sm font-bold uppercase">
                    <span>Service Fee</span>
                    <span>$42.50</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant text-sm font-bold uppercase">
                    <span>Tax</span>
                    <span>$12.30</span>
                  </div>
                  <div className="pt-6 border-t-4 border-inverse-surface flex justify-between items-end">
                    <span className="text-sm font-black uppercase tracking-widest">Total</span>
                    <span className="text-4xl font-black text-primary leading-none">$424.80</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Help Section: Asymmetric Layout */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-surface-container-low">
            <span className="material-symbols-outlined text-primary text-3xl mb-4">shield</span>
            <h4 className="font-bold uppercase tracking-tight mb-2">Secure Transaction</h4>
            <p className="text-sm text-on-surface-variant">All payments are encrypted with military-grade 256-bit protocols. Your data is never stored on our servers.</p>
          </div>
          <div className="p-8 bg-surface-container-low">
            <span className="material-symbols-outlined text-primary text-3xl mb-4">local_shipping</span>
            <h4 className="font-bold uppercase tracking-tight mb-2">Instant Delivery</h4>
            <p className="text-sm text-on-surface-variant">Tickets are delivered digitally to your email and TicketRush account immediately after verification.</p>
          </div>
          <div className="p-8 bg-surface-container-low">
            <span className="material-symbols-outlined text-primary text-3xl mb-4">support_agent</span>
            <h4 className="font-bold uppercase tracking-tight mb-2">24/7 Priority Support</h4>
            <p className="text-sm text-on-surface-variant">Our concierge team is standing by to assist with any purchase issues or venue inquiries.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full border-t-0 mt-auto">
        <div className="bg-blue-600 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full gap-8">
          <Link href="/" className="text-lg font-black text-white">TICKETRUSH</Link>
          <nav className="flex gap-8">
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Support</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Careers</Link>
          </nav>
          <div className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-white text-center md:text-right">
            © 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.
          </div>
        </div>
      </footer>
    </div>
  );
}
