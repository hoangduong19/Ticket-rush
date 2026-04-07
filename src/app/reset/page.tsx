import Link from 'next/link';

export default function AccountRecovery() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-['Inter']">
      {/* Top Navigation (Shell suppressed for transactional page - per guidelines) */}
      {/* We render only the Brand Identity for consistency */}
      <header className="w-full flex justify-center py-12 px-8">
        <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500 uppercase">TicketRush</Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pb-24">
        <div className="w-full max-w-[480px] space-y-12">
          {/* Hero Content */}
          <div className="space-y-4">
            <span className="bg-secondary text-on-secondary px-3 py-1 text-[0.75rem] font-bold uppercase tracking-widest">
              Security Portal
            </span>
            <h2 className="text-[3.5rem] font-extrabold leading-[0.9] tracking-tighter text-on-surface">
              LOST YOUR ACCESS?
            </h2>
            <p className="text-on-surface-variant font-body max-w-sm">
              Enter the email associated with your TicketRush account. We'll transmit a secure recovery link to your inbox.
            </p>
          </div>

          {/* Recovery Form */}
          <form className="space-y-10">
            <div className="space-y-2 group">
              <label className="text-[0.75rem] font-bold uppercase tracking-widest text-on-surface flex items-center gap-2" htmlFor="email">
                <span className="material-symbols-outlined text-[16px]">mail</span>
                Email Address
              </label>
              <input 
                className="w-full h-16 bg-surface-container-high border-none border-b-2 border-transparent focus:outline-none focus:ring-0 focus:border-primary text-on-surface font-bold uppercase placeholder:text-outline-variant transition-all px-4" 
                id="email" 
                placeholder="NAME@DOMAIN.COM" 
                required 
                type="email"
              />
            </div>
            
            <div className="space-y-6">
              <button 
                className="w-full h-16 bg-primary hover:bg-primary-dim text-on-primary font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-3 active:translate-y-0.5" 
                type="submit"
              >
                Send Reset Link
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              
              <Link href="/login" className="flex items-center justify-center gap-2 text-[0.75rem] font-bold uppercase tracking-widest text-on-surface hover:text-primary transition-colors py-2 group">
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                Back to Login
              </Link>
            </div>
          </form>

          {/* Precision Grid Visual (Decorative) */}
          <div className="grid grid-cols-4 gap-1 h-2">
            <div className="bg-primary"></div>
            <div className="bg-surface-container-highest"></div>
            <div className="bg-secondary"></div>
            <div className="bg-tertiary"></div>
          </div>
        </div>
      </main>

      {/* Footer Component (Shared Anchor) */}
      <footer className="bg-slate-900 dark:bg-black w-full flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8">
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-lg font-black text-white uppercase tracking-tighter italic">TicketRush</Link>
          <div className="bg-blue-600 h-2 w-16"></div>
          <p className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-white opacity-90">
            © 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.
          </p>
        </div>
        <nav className="flex gap-8">
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Support</Link>
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms</Link>
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy</Link>
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Careers</Link>
        </nav>
      </footer>
    </div>
  );
}
