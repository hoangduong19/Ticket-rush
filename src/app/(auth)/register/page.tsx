"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup as apiSignup } from '../../../lib/auth';

// --- Validation helpers (mirrors backend DTO rules) ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_RE   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

// --- Friendly server error messages ---
function parseServerError(raw: string): string {
  if (!raw) return 'Đã xảy ra lỗi, vui lòng thử lại.';
  if (/duplicate key.*users_email_key/i.test(raw) || /already exists/i.test(raw))
    return 'Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.';
  if (/không đúng định dạng JSON|sai kiểu dữ liệu/i.test(raw))
    return 'Dữ liệu gửi lên không hợp lệ. Vui lòng kiểm tra lại thông tin.';
  return raw;
}

function validateEmail(v: string) {
  if (!v.trim()) return 'Email không được để trống';
  if (!EMAIL_RE.test(v)) return 'Email không hợp lệ';
  return '';
}
function validatePassword(v: string) {
  if (!v) return 'Mật khẩu không được để trống';
  if (v.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
  if (!PWD_RE.test(v)) return 'Mật khẩu phải chứa chữ hoa, chữ thường và số';
  return '';
}
function validateConfirm(pwd: string, cfm: string) {
  if (!cfm) return 'Vui lòng xác nhận mật khẩu';
  if (pwd !== cfm) return 'Mật khẩu xác nhận không khớp';
  return '';
}
function validateAge(v: string) {
  if (v === '') return '';               // optional field
  const n = Number(v);
  if (isNaN(n) || n < 0 || n > 120) return 'Tuổi không hợp lệ (0–120)';
  return '';
}
function validateDisplayName(v: string) {
  if (v === '') return '';               // optional field
  if (v.length < 2) return 'Tên hiển thị phải có ít nhất 2 ký tự';
  return '';
}

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Field-level errors — only shown after user touches the field
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const touch = (field: string) => setTouched(t => ({ ...t, [field]: true }));

  const fieldErrors = {
    email:       validateEmail(email),
    password:    validatePassword(password),
    confirm:     validateConfirm(password, confirm),
    age:         validateAge(age),
    displayName: validateDisplayName(displayName),
  };
  const hasErrors = Object.values(fieldErrors).some(Boolean);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark all fields as touched so errors are visible on submit
    setTouched({ email: true, password: true, confirm: true, age: true, displayName: true });
    if (hasErrors) return;
    setError(null);
    setLoading(true);
    try {
      const normalizeGender = (g: string) => {
        switch (g) {
          case 'male':            return 'MALE';
          case 'female':          return 'FEMALE';
          case 'other':           return 'OTHER';
          case 'prefer-not-to-say': return 'OTHER';
          default:                return undefined;
        }
      };

      const payload: Record<string, any> = {
        username: email,
        password,
        ...(age         && { age: Number(age) }),
        ...(displayName && { displayName }),
        ...(gender      && { gender: normalizeGender(gender) }),
        ...(avatarUrl   && { avatarUrl }),
      };

      await apiSignup(payload);
      router.push('/dashboard');
    } catch (err: any) {
      const raw = err?.message || 'Đã xảy ra lỗi, vui lòng thử lại.';
      setError(parseServerError(raw));
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
                  onBlur={() => touch('email')}
                  className={`w-full bg-surface-container-high border-0 border-b-2 h-14 px-4 font-medium text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-0 transition-colors ${touched.email && fieldErrors.email ? 'border-error' : 'border-transparent focus:border-primary'}`}
                  placeholder="name@example.com"
                  type="email"
                />
                {touched.email && fieldErrors.email && <p className="text-error text-xs font-semibold mt-1">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Display Name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onBlur={() => touch('displayName')}
                  className={`w-full bg-surface-container-high border-0 border-b-2 h-14 px-4 font-medium text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-0 transition-colors ${touched.displayName && fieldErrors.displayName ? 'border-error' : 'border-transparent focus:border-primary'}`}
                  placeholder="Hoang Quoc Duong"
                  type="text"
                />
                {touched.displayName && fieldErrors.displayName && <p className="text-error text-xs font-semibold mt-1">{fieldErrors.displayName}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Field */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Password</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => touch('password')}
                    className={`w-full bg-surface-container-high border-0 border-b-2 h-14 px-4 font-medium text-on-surface focus:outline-none focus:ring-0 transition-colors ${touched.password && fieldErrors.password ? 'border-error' : 'border-transparent focus:border-primary'}`}
                    placeholder="••••••••"
                    type="password"
                  />
                  {touched.password && fieldErrors.password && <p className="text-error text-xs font-semibold mt-1">{fieldErrors.password}</p>}
                </div>
                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Confirm Password</label>
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onBlur={() => touch('confirm')}
                    className={`w-full bg-surface-container-high border-0 border-b-2 h-14 px-4 font-medium text-on-surface focus:outline-none focus:ring-0 transition-colors ${touched.confirm && fieldErrors.confirm ? 'border-error' : 'border-transparent focus:border-primary'}`}
                    placeholder="••••••••"
                    type="password"
                  />
                  {touched.confirm && fieldErrors.confirm && <p className="text-error text-xs font-semibold mt-1">{fieldErrors.confirm}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age Field */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Age</label>
                  <input
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onBlur={() => touch('age')}
                    className={`w-full bg-surface-container-high border-0 border-b-2 h-14 px-4 font-medium text-on-surface focus:outline-none focus:ring-0 transition-colors ${touched.age && fieldErrors.age ? 'border-error' : 'border-transparent focus:border-primary'}`}
                    placeholder="21"
                    type="number"
                    min={0}
                    max={120}
                  />
                  {touched.age && fieldErrors.age && <p className="text-error text-xs font-semibold mt-1">{fieldErrors.age}</p>}
                </div>
                {/* Gender Selection */}
                <div className="space-y-1">
                  <label className="block text-[0.75rem] font-bold tracking-wide uppercase text-on-surface-variant">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-surface-container-high border-0 border-b-2 border-transparent h-14 px-4 font-medium text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-0 transition-colors"
                  >
                    <option disabled value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
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
                className={`w-full h-16 flex items-center justify-center gap-2 group transition-colors ${loading || hasErrors ? 'bg-primary opacity-60 cursor-not-allowed' : 'bg-primary hover:bg-primary-dim'}`}
                type="submit"
                disabled={loading}
              >
                <span className="text-on-primary font-black uppercase tracking-widest text-lg">{loading ? 'Creating...' : 'Complete Registration'}</span>
                <span className="material-symbols-outlined text-on-primary group-active:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              {error && (
                <div className="flex items-start gap-3 bg-error-container/20 border border-error text-error px-4 py-3">
                  <span className="material-symbols-outlined text-xl shrink-0 mt-0.5">error</span>
                  <p className="text-sm font-semibold leading-snug">{error}</p>
                </div>
              )}

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
            <p className="font-['Inter'] text-sm tracking-wide uppercase font-bold text-white">© 2026 TicketRush. Built for Precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
