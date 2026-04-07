import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="bg-background text-on-background font-body antialiased min-h-[calc(100vh-theme(spacing.1))] flex flex-col">
      {/* TopNavBar */}
      <nav className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 flex justify-between items-center px-8 py-6 max-w-none">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500 font-headline">TicketRush</Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/events" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1 active:translate-y-0.5">Events</Link>
            <Link href="/tickets" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1 active:translate-y-0.5">My Tickets</Link>
            <Link href="/dashboard" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase active:translate-y-0.5">Dashboard</Link>
            <Link href="/orders" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1 active:translate-y-0.5">Orders</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-high px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest w-48" placeholder="SEARCH EVENTS" type="text" />
          </div>
          <button className="text-slate-900 dark:text-slate-100 hover:bg-blue-700 hover:text-white p-2 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>
      <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>

      <main className="max-w-[1440px] mx-auto px-8 py-12 flex-grow w-full">
        {/* Bento Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 mb-12 bg-surface-container">
          {/* User Profile Block */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-12 flex flex-col md:flex-row gap-12 items-start">
            <div className="w-48 h-48 bg-primary relative shrink-0">
              <img 
                className="w-full h-full object-cover grayscale contrast-125" 
                alt="Alexander Von Ticketing" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkOLSwU9FxBpbDeMO5RRftyxQ8r9Yl7wMgXWze6W0aZiz3OhSpy7PdR2cmeEnNHXUw5KANq7K4fXXwvCcUEsA15UGU8jVC4ASp18FSGADwGqfoZ0AFJtKwaA3MTyv40V0toDazOrJpRvAJMRniyO2kRKAfMGpKmDfux86LQEg8eViH-8Q2hgfrFX7xVXNe9JHJrweWw1wPTstTkza3Tb89SXGuBb1CdRP8gh4-VVHMid4rFjce_NSFtbvzswwKdnezKZUvCQSaOsNi"
              />
              <div className="absolute -bottom-4 -right-4 bg-secondary px-4 py-2 text-on-secondary font-bold text-xs uppercase tracking-widest">Verified</div>
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Personal Overview</span>
              <h1 className="text-6xl font-extrabold tracking-tighter text-on-surface mb-8 leading-none">ALEXANDER<br/>VON TICKETING</h1>
              <div className="grid grid-cols-2 gap-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Email Address</p>
                  <p className="font-bold text-lg">a.vonticketing@domain.com</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Member Since</p>
                  <p className="font-bold text-lg">MARCH 2022</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Age / Gender</p>
                  <p className="font-bold text-lg">32 / MALE</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Loyalty Tier</p>
                  <p className="font-bold text-lg text-tertiary">PLATINUM ELITE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Block */}
          <div className="lg:col-span-4 bg-primary p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black text-on-primary tracking-tighter leading-none mb-8">QUICK<br/>ACCESS</h2>
              <div className="flex flex-col gap-4">
                <Link href="#" className="flex justify-between items-center py-4 border-b-2 border-on-primary border-opacity-20 hover:bg-primary-dim transition-colors group">
                  <span className="text-on-primary font-bold uppercase tracking-widest">My Tickets</span>
                  <span className="material-symbols-outlined text-on-primary">arrow_forward</span>
                </Link>
                <Link href="#" className="flex justify-between items-center py-4 border-b-2 border-on-primary border-opacity-20 hover:bg-primary-dim transition-colors group">
                  <span className="text-on-primary font-bold uppercase tracking-widest">Order History</span>
                  <span className="material-symbols-outlined text-on-primary">arrow_forward</span>
                </Link>
                <Link href="#" className="flex justify-between items-center py-4 border-b-2 border-on-primary border-opacity-20 hover:bg-primary-dim transition-colors group">
                  <span className="text-on-primary font-bold uppercase tracking-widest">Security Settings</span>
                  <span className="material-symbols-outlined text-on-primary">arrow_forward</span>
                </Link>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-xs font-bold text-on-primary opacity-60 uppercase tracking-widest">Next Event</p>
              <p className="text-xl font-bold text-on-primary mt-1">SONIC SYMPHONY 2024</p>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Profile Update */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-surface">edit</span>
              </div>
              <h3 className="text-4xl font-extrabold tracking-tighter uppercase">Update Profile</h3>
            </div>
            <div className="bg-surface-container-lowest p-1">
              <form className="flex flex-col gap-8 p-8">
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Full Name</label>
                  <input 
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 font-bold uppercase tracking-tight" 
                    type="text" 
                    defaultValue="Alexander Von Ticketing"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Age</label>
                    <input 
                      className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 font-bold uppercase tracking-tight" 
                      type="number" 
                      defaultValue="32"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Gender</label>
                    <select 
                      className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 font-bold uppercase tracking-tight"
                      defaultValue="Male"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Bio / Preferences</label>
                  <textarea 
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 font-bold tracking-tight resize-none" 
                    rows={3}
                    defaultValue="High-frequency concert goer. Prefer orchestra seating."
                  />
                </div>
                <button className="bg-primary text-on-primary py-6 px-12 font-black uppercase tracking-[0.2em] self-start hover:bg-primary-dim transition-all" type="submit">
                  Save Changes
                </button>
              </form>
            </div>
          </section>

          {/* Security Settings */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary">lock</span>
              </div>
              <h3 className="text-4xl font-extrabold tracking-tighter uppercase">Security</h3>
            </div>
            <div className="bg-surface-container-lowest p-1 h-full flex flex-col">
              <form className="flex flex-col gap-8 p-8 flex-grow">
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Current Password</label>
                  <input 
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 p-4 font-bold tracking-tight" 
                    placeholder="••••••••••••" 
                    type="password"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">New Password</label>
                  <input 
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 p-4 font-bold tracking-tight" 
                    placeholder="MIN. 12 CHARACTERS" 
                    type="password"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Confirm New Password</label>
                  <input 
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 p-4 font-bold tracking-tight" 
                    placeholder="REPEAT PASSWORD" 
                    type="password"
                  />
                </div>
                <div className="bg-secondary-container p-6">
                  <p className="text-on-secondary-container text-xs font-bold uppercase tracking-widest mb-2">Security Advice</p>
                  <p className="text-on-secondary-container text-sm leading-relaxed">Passwords must contain at least one special character and a number. Changing your password will log you out of all active sessions.</p>
                </div>
                <button className="bg-secondary text-on-secondary py-6 px-12 font-black uppercase tracking-[0.2em] self-start hover:bg-secondary-dim transition-all mt-auto" type="submit">
                  Update Password
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full border-t-0 flex flex-col md:flex-row justify-between items-center px-12 py-16 gap-8 relative mt-auto">
        <div className="bg-blue-600 h-2 w-full absolute left-0 bottom-0 md:top-0"></div>
        <div className="flex flex-col gap-4">
          <Link href="/" className="text-lg font-black text-white font-headline">TICKETRUSH</Link>
          <span className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400">© 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.</span>
        </div>
        <div className="flex gap-12">
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Support</Link>
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms</Link>
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy</Link>
          <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Careers</Link>
        </div>
      </footer>
    </div>
  );
}
