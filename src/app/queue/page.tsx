"use client"

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

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
        const res = await fetch(`${API_BASE}/queue/status?eventId=${eventId}&userId=${userId}`);
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
            
            {/* Position Card */}
            <div className="bg-surface-container-low border border-surface-container-high p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[0.7rem] font-bold text-on-surface-variant uppercase tracking-widest">Position in queue</span>
                  <div className="text-7xl font-black text-primary tracking-tighter leading-none">
                    {position !== null ? `#${position}` : '--'}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[0.7rem] font-bold text-on-surface-variant uppercase tracking-widest">Est. wait</span>
                  <div className="text-3xl font-black text-on-surface tracking-tighter leading-none">
                    {position !== null ? `~${Math.max(1, Math.ceil(position * 0.5))}` : '--'}
                    <span className="text-sm ml-1 font-bold text-on-surface-variant">min</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[0.65rem] font-bold text-on-surface-variant uppercase tracking-widest">Processing queue...</span>
                  <span className="text-[0.65rem] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    Live
                  </span>
                </div>
                <div className="h-1.5 bg-surface-container-high w-full overflow-hidden rounded-full">
                  <div className="h-full bg-primary rounded-full animate-[pulse_2s_ease-in-out_infinite]" style={{ width: position !== null ? `${Math.max(10, 100 - position * 5)}%` : '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer-like Meta Info */}
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center gap-8 bg-slate-100 font-['Inter'] text-sm tracking-tight border-t-2 border-slate-200">
        <Link href="/" className="text-lg font-extrabold uppercase text-slate-900">TicketRush</Link>
        <div className="text-slate-500">© 2026 TicketRush. Precision Engineered.</div>
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
