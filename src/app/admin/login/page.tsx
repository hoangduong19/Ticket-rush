"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin as apiLogin, getToken } from '../../../lib/auth';

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate limit state
  const [rateLimited, setRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Nếu đã đăng nhập (token còn hạn) → redirect về trang chủ
  useEffect(() => {
    if (getToken('admin')) {
      router.replace('/admin/');
    }
  }, [router]);

  // Countdown timer for rate limit
  useEffect(() => {
    if (countdown <= 0) {
      setRateLimited(false);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimited) return;
    setError(null);
    setLoading(true);
    try {
      await apiLogin(email, password);
      router.push('/admin');
    } catch (err: any) {
      if (err?.status === 429) {
        setRateLimited(true);
        setCountdown(60);
        setError(null);
      } else {
        setError('Thông tin đăng nhập không hợp lệ. Vui lòng kiểm tra lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar suppressed per "Destination Rule" for Login Screen */}
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Background Architectural Block */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary opacity-5 -z-10"></div>
        
        <div className="w-full max-w-[480px] bg-surface-container-lowest p-10 md:p-16 flex flex-col gap-10">
          {/* Brand Anchor */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-error font-black text-4xl tracking-tighter uppercase italic">TicketRush</Link>
            <div className="h-1.5 w-12 bg-primary"></div>
          </div>
          
          {/* Header Section */}
          <div className="flex flex-col gap-4">
            <h1 className="text-[3.5rem] font-extrabold leading-[1] tracking-tighter text-on-surface">
              ADMIN<br/>SIGN IN.
            </h1>
            <p className="text-on-surface-variant font-medium tracking-tight">Restricted access. Administrators only.</p>
          </div>
          
          {/* Login Form */}
          <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Admin Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-high border-0 border-b-2 border-transparent py-4 px-0 text-on-surface font-bold placeholder:text-outline-variant focus:ring-0 focus:outline-none focus:border-error transition-colors"
                  placeholder="ADMIN@DOMAIN.COM"
                  type="email"
                  required
                />
              </div>
              
              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Password</label>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-container-high border-0 border-b-2 border-transparent py-4 px-0 text-on-surface font-bold placeholder:text-outline-variant focus:ring-0 focus:outline-none focus:border-error transition-colors"
                  placeholder="••••••••"
                  type="password"
                  required
                />
              </div>
            </div>
            
            {/* Rate Limit Warning */}
            {rateLimited && (
              <div className="flex items-center gap-4 bg-amber-50 border-l-4 border-amber-500 px-5 py-4 animate-[fadeIn_0.3s_ease-out]">
                <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0 animate-pulse">schedule</span>
                <div className="flex-1">
                  <p className="text-amber-800 text-sm font-bold uppercase tracking-wide">Quá nhiều lần thử</p>
                  <p className="text-amber-700 text-xs mt-1">Vui lòng đợi <span className="font-black text-amber-900 text-sm">{countdown}s</span> trước khi thử lại.</p>
                </div>
                <div className="w-10 h-10 border-3 border-amber-300 border-t-amber-600 rounded-full animate-spin shrink-0"></div>
              </div>
            )}

            {/* Action Button */}
            <button
              className={`font-black py-6 text-xl uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                rateLimited
                  ? 'bg-slate-400 text-slate-200 cursor-not-allowed'
                  : 'bg-error text-white hover:bg-red-700 active:scale-[0.98]'
              }`}
              type="submit"
              disabled={loading || rateLimited}
            >
              {rateLimited ? `Đợi ${countdown}s` : loading ? 'Authenticating...' : 'Admin Login'}
              <span className="material-symbols-outlined">{rateLimited ? 'hourglass_top' : 'arrow_forward'}</span>
            </button>
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border-l-4 border-red-500 px-4 py-3 mt-1">
                <span className="material-symbols-outlined text-red-500 text-lg shrink-0">admin_panel_settings</span>
                <p className="text-red-700 text-sm font-semibold">{error}</p>
              </div>
            )}
          </form>
          
          <div className="flex flex-col gap-6 items-start">
            <div className="h-[2px] w-full bg-surface-container"></div>
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant text-sm font-medium">Return to User Portal?</span>
              <Link href="/login" className="text-secondary font-black text-lg uppercase tracking-tight hover:underline">
                User Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Precision Element */}
        <div className="hidden lg:block absolute right-24 bottom-24">
          <div className="flex flex-col items-end text-on-surface-variant opacity-20">
            <span className="font-black text-8xl leading-none">00</span>
            <span className="font-bold uppercase tracking-[0.4em] text-xs text-error">Root Access</span>
          </div>
        </div>
      </main>

      {/* Footer - Built for Precision */}
      <footer className="w-full mt-auto bg-slate-900 dark:bg-black flex flex-col md:flex-row justify-between items-center py-12 px-8 gap-6">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-3xl font-black text-white italic">TicketRush</Link>
          <div className="bg-red-700 h-1 w-20"></div>
        </div>
        <div className="flex gap-8">
          <span className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-slate-400">Internal Use Only</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-slate-400">© 2026 TicketRush. Built for Precision.</span>
        </div>
      </footer>
    </div>
  );
}
