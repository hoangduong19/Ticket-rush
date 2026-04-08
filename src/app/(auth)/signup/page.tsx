"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup as apiSignup } from '../../../lib/auth';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await apiSignup({ email, password });
      // after successful signup, navigate to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar suppressed per "Destination Rule" for Sign-up Screen */}
      {/* Auth Shell Suppression: Per instructions, TopNavBar is suppressed for transactional pages like Sign-up */}
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Branding/Copy Column */}
        <section className="hidden md:flex md:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <div className="mb-8">
              <Link href="/" className="text-4xl font-black tracking-tighter text-on-primary uppercase italic">TicketRush</Link>
            </div>
            <h1 className="text-6xl font-extrabold text-on-primary leading-none tracking-tighter mb-6 uppercase">
              Your Access <br/>To Every <br/>Front Row.
            </h1>
            <p className="text-xl text-on-primary opacity-90 max-w-md font-medium">
              Join the premier destination for live experiences. High-speed booking, zero hidden fees, and absolute precision.
            </p>

            <div className="mt-12 space-y-4">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary-fixed text-3xl">confirmation_number</span>
                <span className="text-on-primary font-bold tracking-wide uppercase text-sm">Instant Digital Ticketing</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-tertiary-fixed text-3xl">shield</span>
                <span className="text-on-primary font-bold tracking-wide uppercase text-sm">Verified Authentic Entries</span>
              </div>
            </div>
          </div>
          {/* Background Accent Shape */}
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-dim"></div>
        </section>

        {/* Form Column */}
        <section className="w-full md:w-1/2 bg-surface-container-lowest flex items-center justify-center p-8 md:p-24">
          <div className="w-full max-w-md">
            {/* Mobile Branding */}
            <div className="md:hidden mb-10">
              <Link href="/" className="text-2xl font-black tracking-tighter text-primary uppercase">TicketRush</Link>
            </div>

            <header className="mb-10">
              <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Create Account</h2>
              <p className="text-on-surface-variant font-medium">Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link></p>
            </header>

            <form className="space-y-6" onSubmit={onSubmit}>
              {/* Email Field */}
              <div className="space-y-1">
                <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Email Address</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-high border-0 border-b-2 border-transparent h-14 px-4 font-medium text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                  placeholder="name@example.com"
                  type="email"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent h-14 px-4 font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>
                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Confirm Password</label>
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent h-14 px-4 font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                    placeholder="••••••••"
                    type="password"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age Field */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Age</label>
                  <input 
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent h-14 px-4 font-medium text-on-surface focus:outline-none focus:border-primary focus:ring-0 transition-colors" 
                    placeholder="21" 
                    type="number" 
                  />
                </div>
                {/* Gender Selection */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Gender</label>
                  <select 
                    defaultValue="" 
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent h-14 px-4 font-medium text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                  >
                    <option disabled value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* CAPTCHA Section */}
              <div className="bg-surface-container p-4 flex items-center justify-between border-l-4 border-primary">
                <div className="flex items-center gap-3">
                  <input 
                    className="w-6 h-6 border-2 border-outline bg-surface-container-lowest text-primary focus:ring-0 rounded-none cursor-pointer" 
                    id="captcha" 
                    type="checkbox" 
                  />
                  <label className="text-sm font-bold uppercase tracking-tight text-on-surface cursor-pointer" htmlFor="captcha">I am not a robot</label>
                </div>
                <div className="flex flex-col items-center">
                  <img alt="CAPTCHA" className="w-8 h-8 grayscale opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPTiSIrPKE_-vZ-_4m5t6Z2gu1toECbynaUEGw8wqA-cmWl3SYJg62PSBERe5P02hb2zSS8YS6vuCoSWH7vVEZA9zKSOh9Hl_R9FLgtsEhr7b9fZB2lu95sWHZGh9xQJ3-WjkQixN1WDzEwCdaxQV2PUh0VjgphoWywKo7GAdgEAh943wthSYKEerG-f1WENZ-TCbgSrhYLia592d-SdJPf9BsEooPCfYnpiDFmGJjpZFDnkngdRVpv8fY1fEpqF1HmV9zeuPFtfLp" />
                  <span className="text-[10px] text-outline font-bold uppercase">Privacy</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-primary h-16 flex items-center justify-center gap-2 group hover:bg-primary-dim transition-colors"
                type="submit"
                disabled={loading}
              >
                <span className="text-on-primary font-black uppercase tracking-widest text-lg">{loading ? 'Creating...' : 'Complete Registration'}</span>
                <span className="material-symbols-outlined text-on-primary group-active:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              {error && <div className="text-negative font-bold text-center">{error}</div>}

              <p className="text-[0.7rem] text-on-surface-variant text-center uppercase font-bold tracking-wider leading-relaxed">
                By clicking registration, you agree to our <br/>
                <Link className="text-primary hover:underline" href="#">Terms of Service</Link> and <Link className="text-primary hover:underline" href="#">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </section>
      </main>

      {/* Footer: Using Mandatory Styles from JSON */}
      <footer className="w-full mt-auto bg-slate-900 dark:bg-black flex flex-col items-center py-12 px-8 gap-6 relative">
        {/* Structural Note: The JSON defines separation logic as a 2px blue height bar, but the footer background is slate-900. Reconciling for the Architect UI. */}
        <div className="w-full bg-blue-700 h-2 absolute left-0 top-0"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 w-full max-w-screen-2xl mx-auto pt-4">
          <Link href="/" className="text-3xl font-black text-white italic">TicketRush</Link>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-slate-400 hover:text-white transition-colors duration-200">Terms of Service</Link>
            <Link href="#" className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-slate-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
            <Link href="#" className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-slate-400 hover:text-white transition-colors duration-200">Support</Link>
            <Link href="#" className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-slate-400 hover:text-white transition-colors duration-200">Contact</Link>
          </div>
          <div className="md:ml-auto">
            <p className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-white">© 2024 TicketRush. Built for Precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
