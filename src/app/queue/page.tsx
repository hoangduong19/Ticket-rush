"use client"

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function QueueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('queueUserId');
    if (!eventId || !userId) {
      router.push('/events');
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8080/queue/status?eventId=${eventId}&userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ACTIVE') {
            router.push(`/seats?eventId=${eventId}`);
          } else if (data.status === 'WAITING') {
            setPosition(data.position);
          }
        }
      } catch (err) {
        console.error('Queue status check failed', err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000); // 3 seconds interval
    return () => clearInterval(interval);
  }, [eventId, router]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-slate-50 flex justify-between items-center w-full px-6 py-4 max-w-none docked full-width top-0 font-['Inter'] font-normal antialiased">
        <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600 uppercase">TicketRush</Link>
        <div className="hidden md:flex items-center gap-8">
          <span className="text-slate-600 font-medium">Events</span>
          <span className="text-slate-600 font-medium">My Tickets</span>
          <span className="text-slate-600 font-medium">Dashboard</span>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-600 hover:bg-slate-200 transition-colors duration-100 p-2 cursor-pointer">notifications</span>
            <div className="w-8 h-8 bg-surface-container-high overflow-hidden">
              <img alt="User profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3Vdsop8E_lEKPGku5gaxcS_Sxc7LrAeconq146j9523jmD12tnjHQLhwvBcrhEoqGGGYHjM9b2qihWff2OACzcoNY75jFNUG1nZi7r6Q4qvZwGFKrwY2IiFPUAzO41wcTypvk_DMKVd0zhBCtpKFofLBP4yecNlsVmYycqHoq3HIXTFwpRS0W4nst_xVJLiGAnJZJe1wkz_7CvFy4tVxiDgmEkhP3Ov1Ss7xPQ-eekFINZGmXv6DyUWCgRpkwxwJnnSGi0ZrCHydN"/>
            </div>
          </div>
        </div>
        {/* Mobile notification only */}
        <div className="md:hidden">
          <span className="material-symbols-outlined text-slate-600">notifications</span>
        </div>
      </nav>
      <div className="bg-slate-200 h-[2px] w-full"></div>
      
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-2xl bg-surface-container-lowest">
          {/* Live Status Header */}
          <div className="bg-secondary p-4 flex justify-between items-center">
            <span className="text-on-secondary font-bold text-xs tracking-widest uppercase">Live Queue Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-on-secondary animate-pulse"></div>
              <span className="text-on-secondary text-xs font-bold uppercase tracking-widest">Active</span>
            </div>
          </div>
          
          {/* Queue Core Content */}
          <div className="p-12 space-y-12">
            <header className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter leading-none text-on-surface">
                YOU ARE <span className="text-primary">IN LINE.</span>
              </h1>
              <p className="text-xl text-on-surface-variant font-medium max-w-md">
                Please do not refresh this page. You will be redirected automatically when it is your turn.
              </p>
            </header>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-container-high border border-surface-container-high">
              <div className="bg-surface-container-lowest p-8 space-y-1">
                <span className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-widest">Position in queue</span>
                <div className="text-6xl font-black text-on-surface tracking-tighter">{position !== null ? position : '--'}</div>
              </div>
              <div className="bg-surface-container-lowest p-8 space-y-1">
                <span className="text-[0.75rem] font-bold text-on-surface-variant uppercase tracking-widest">Estimated wait</span>
                <div className="text-6xl font-black text-primary tracking-tighter">
                  {position !== null ? Math.ceil(position / 50) : '--'}<span className="text-2xl ml-1">MIN</span>
                </div>
              </div>
            </div>
            
            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[0.75rem] font-bold uppercase tracking-tighter text-on-surface">Queue Progress</span>
                <span className="text-[0.75rem] font-bold uppercase tracking-tighter text-primary">Polling every 3s...</span>
              </div>
              <div className="h-4 bg-surface-container-high w-full overflow-hidden">
                <div className="h-full bg-primary w-1/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
              </div>
            </div>
            
            {/* Anti-Bot Verification Section */}
            <div className="bg-surface-container-low p-8 border-l-8 border-primary">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-on-surface uppercase">Security Check</h3>
                  <p className="text-sm text-on-surface-variant">Verify you are a human to maintain your position.</p>
                </div>
                <div className="bg-surface-container-lowest p-4 flex items-center gap-4 border border-outline-variant/20 min-w-[240px]">
                  <div className="w-6 h-6 border-2 border-outline-variant"></div>
                  <span className="text-sm font-semibold text-on-surface">I am not a robot</span>
                  <div className="ml-auto">
                    <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div>
              <button className="w-full bg-surface-container-highest text-on-surface py-6 font-extrabold uppercase tracking-widest hover:bg-surface-dim transition-colors duration-100 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">sync</span>
                Checking for early access...
              </button>
            </div>
          </div>
          
          {/* Footer-like Meta Info */}
          <div className="bg-surface-container-high p-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <span className="text-[0.65rem] font-bold text-on-surface-variant uppercase">Event ID: {eventId || 'UNKNOWN'}</span>
              <span className="text-[0.65rem] font-bold text-on-surface-variant uppercase">Polled Session</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <span className="text-[0.65rem] font-bold text-tertiary uppercase">Secure Session Active</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-100 font-['Inter'] text-sm tracking-tight border-t-2 border-slate-200">
        <Link href="/" className="text-lg font-extrabold uppercase text-slate-900">TicketRush</Link>
        <div className="flex gap-6">
          <Link href="#" className="text-slate-500 hover:text-blue-600 transition-opacity duration-200">Help Center</Link>
          <Link href="#" className="text-slate-500 hover:text-blue-600 transition-opacity duration-200">Privacy Policy</Link>
          <Link href="#" className="text-slate-500 hover:text-blue-600 transition-opacity duration-200">Terms of Service</Link>
          <Link href="#" className="text-slate-500 hover:text-blue-600 transition-opacity duration-200">Contact</Link>
        </div>
        <div className="text-slate-500">© 2024 TicketRush. Precision Engineered.</div>
      </footer>
    </div>
  );
}

export default function QueueWaitingRoom() {
  return (
    <Suspense fallback={<div>Loading queue...</div>}>
      <QueueContent />
    </Suspense>
  );
}
