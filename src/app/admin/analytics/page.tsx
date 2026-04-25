import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

interface User {
  userId: string;
  username: string;
  age: number;
  displayName: string;
  gender: string;
  avatarUrl: string | null;
}

export default async function AudienceAnalytics() {
  let users: User[] = [];
  try {
    const res = await fetch(`${API_BASE}/users`, { cache: 'no-store' });
    if (res.ok) {
      users = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }

  const totalUsers = users.length;
  const validAges = users.filter((u) => u.age && u.age > 0).map((u) => u.age);
  const avgAge = validAges.length > 0 ? (validAges.reduce((a, b) => a + b, 0) / validAges.length).toFixed(1) : 'N/A';

  let males = 0, females = 0, other = 0;
  users.forEach((u) => {
    if (u.gender === 'MALE') males++;
    else if (u.gender === 'FEMALE') females++;
    else other++;
  });

  const getPctStr = (count: number) => totalUsers > 0 ? ((count / totalUsers) * 100).toFixed(1) : '0.0';
  const getPctNum = (count: number) => totalUsers > 0 ? (count / totalUsers) * 100 : 0;

  const malePct = getPctStr(males);
  const femalePct = getPctStr(females);
  const otherPct = getPctStr(other);

  const maleW = getPctNum(males) + '%';
  const femaleW = getPctNum(females) + '%';
  const otherW = getPctNum(other) + '%';

  const ageDist = { '<25': 0, '25-34': 0, '35-44': 0, '45+': 0 };
  users.forEach((u) => {
    if (u.age == null) return;
    if (u.age < 25) ageDist['<25']++;
    else if (u.age <= 34) ageDist['25-34']++;
    else if (u.age <= 44) ageDist['35-44']++;
    else ageDist['45+']++;
  });

  const maxAgeDist = Math.max(1, ...Object.values(ageDist));
  const getAgeH = (count: number) => count > 0 ? `${(count / maxAgeDist) * 100}%` : '5%';

  return (
    <div className="flex min-h-screen bg-surface text-on-surface selection:bg-primary selection:text-on-primary font-body">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-surface-container-high hidden md:flex flex-col shrink-0">
        <div className="px-6 py-8">
          <span className="text-2xl font-black tracking-tighter text-blue-600 uppercase">TicketRush</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/events/create" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">event</span>
            <span>Create Event</span>
          </Link>
          <Link href="/admin/monitor" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest transition-colors font-medium">
            <span className="material-symbols-outlined">map</span>
            <span>Live Monitor</span>
          </Link>
          <Link href="/admin/analytics" className="flex items-center gap-3 px-4 py-3 bg-primary text-on-primary font-bold transition-colors">
            <span className="material-symbols-outlined">monitoring</span>
            <span>Analytics</span>
          </Link>
        </nav>
        <div className="p-6 bg-surface-container-highest">
          <div className="flex items-center gap-3">
            <img alt="Admin Avatar" className="w-10 h-10 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8XpUv4yqBXDrN1KvICMpWaJHrMpiDTWZwMrNjzP_2ur60ZDgE4MHY2yIyw9IN5k7zr2zIL7fBUtyiBCmVcdnXG0oyYWfTaPF7NFxvWdAt9ajMfjdTw58llPabfSMKOjyPHIrBgNPQezsReKnl1wkkdmvVEPQhdPkJHmyXElIqk1YtkbVyfWnPRd-2xP_9EI2eDvJJ8zRt2fGSY1tTHmsHwCOEGCnav0-zIk1bz6TXw0KYAGS0L1vlKoHDKUWa2507n-DGciQmvUXv" />
            <div>
              <p className="text-sm font-bold">Admin User</p>
              <p className="text-xs text-on-surface-variant">System Architect</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TopNavBar */}
        <header className="bg-slate-50 dark:bg-slate-950 flex justify-between items-center w-full px-6 py-4 max-w-none border-b border-surface-container-high sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500 uppercase">Analytics</h1>
            <nav className="hidden lg:flex gap-6">
              <Link href="/admin" className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-100">Dashboard</Link>
              <Link href="/admin/monitor" className="text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-100">Live Monitor</Link>
              <Link href="/admin/analytics" className="text-blue-600 dark:text-blue-500 font-bold border-b-4 border-blue-600 dark:border-blue-500">Analytics</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input className="bg-surface-container-high border-none px-4 py-2 text-sm w-64 focus:ring-0 focus:border-b-2 border-primary" placeholder="Search events..." type="text" />
            </div>
            <button className="material-symbols-outlined text-on-surface-variant">notifications</button>
            <img alt="User profile avatar" className="w-8 h-8 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCkfDv5XrdLhl0SVFaGkaQKNQI2HrMIvOjuEFugFnByZ3OcXLpuF33BrZg9iI2kWevmD0EZMznmBkQRjpLdN2SsBvteG-zWQiYliaCyAwwejbEPJe76K3obv40A8e8bu54MVfm12PNJ1Xv32OYTRpCtTktQiKqyf3ikCAZ5bJvhYWGtwPf4ydnLlnYShtxlVA9Aw918CoVoJupO010a3wEEiWU3tqo1WzUFOFz4W6e8y_ZURoRWmytRDtuX4jQ-zLcrC6WsyIyxtBX" />
          </div>
        </header>

        {/* Canvas */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto w-full bg-background">
          {/* Page Header */}
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="bg-secondary text-on-secondary px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase mb-2 inline-block">Live Audience Data</span>
              <h3 className="text-[3.5rem] font-extrabold leading-none tracking-tighter text-slate-900 dark:text-white">Audience Insights</h3>
            </div>
            <div className="bg-surface-container-high p-1 flex items-center">
              <button className="px-6 py-2 bg-surface-container-lowest font-bold text-sm text-on-surface">ALL TIME</button>
              <button className="px-4 py-2 material-symbols-outlined text-slate-500">calendar_today</button>
            </div>
          </div>

          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-12 border-l-4 border-primary">
            <div className="bg-surface-container-lowest p-8 border-r border-background">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Total Active Users</p>
              <p className="text-4xl font-black text-primary">{totalUsers.toLocaleString()}</p>
              <div className="mt-4 flex items-center gap-1 text-tertiary font-bold text-xs">
                <span className="material-symbols-outlined text-sm">trending_up</span> Realtime
              </div>
            </div>
            <div className="bg-surface-container-lowest p-8 border-r border-background">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Avg. Age</p>
              <p className="text-4xl font-black text-slate-900">{avgAge}</p>
              <div className="mt-4 flex items-center gap-1 text-slate-400 font-bold text-xs uppercase">
                Median Target Group
              </div>
            </div>
            <div className="bg-surface-container-lowest p-8 border-r border-background">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Gender Split %</p>
              <div className="flex h-6 w-full bg-surface-container-high mt-4">
                <div className="h-full bg-primary" style={{ width: maleW }}></div>
                <div className="h-full bg-secondary" style={{ width: femaleW }}></div>
                <div className="h-full bg-tertiary" style={{ width: otherW }}></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-between text-[9px] font-bold uppercase text-slate-400">
                <span>M: {malePct}%</span>
                <span>F: {femalePct}%</span>
                <span>O: {otherPct}%</span>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-8">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Top Region</p>
              <p className="text-4xl font-black text-slate-900">Global</p>
              <div className="mt-4 flex items-center gap-1 text-slate-400 font-bold text-xs uppercase">
                All Regions
              </div>
            </div>
          </div>

          {/* Main Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Age Distribution (Large Bar Chart) */}
            <div className="lg:col-span-2 bg-surface-container-lowest p-8 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Age Distribution</h4>
                <div className="flex gap-2 items-center">
                  <span className="w-3 h-3 bg-primary"></span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Registered Users</span>
                </div>
              </div>
              <div className="flex items-end gap-12 h-64 border-b-2 border-slate-900 relative mt-8">
                <div className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                  <span className="text-xs font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-20px]">{ageDist['<25']}</span>
                  <div className="w-full bg-primary transition-all duration-300 group-hover:bg-primary-dim" style={{ height: getAgeH(ageDist['<25']) }}></div>
                  <span className="text-[11px] font-black text-slate-900 absolute -bottom-8">{'<25'}</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                  <span className="text-xs font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-20px]">{ageDist['25-34']}</span>
                  <div className="w-full bg-primary transition-all duration-300 group-hover:bg-primary-dim" style={{ height: getAgeH(ageDist['25-34']) }}></div>
                  <span className="text-[11px] font-black text-slate-900 absolute -bottom-8">25-34</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                  <span className="text-xs font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-20px]">{ageDist['35-44']}</span>
                  <div className="w-full bg-primary transition-all duration-300 group-hover:bg-primary-dim" style={{ height: getAgeH(ageDist['35-44']) }}></div>
                  <span className="text-[11px] font-black text-slate-900 absolute -bottom-8">35-44</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-4 group h-full justify-end">
                  <span className="text-xs font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-20px]">{ageDist['45+']}</span>
                  <div className="w-full bg-primary transition-all duration-300 group-hover:bg-primary-dim" style={{ height: getAgeH(ageDist['45+']) }}></div>
                  <span className="text-[11px] font-black text-slate-900 absolute -bottom-8">45+</span>
                </div>
              </div>
            </div>

            {/* Gender Identification (Geometric Block Pie Chart) */}
            <div className="bg-surface-container-lowest p-8 flex flex-col shadow-sm">
              <h4 className="text-xl font-bold tracking-tight text-slate-900 uppercase mb-10">Gender ID</h4>
              <div className="relative w-full h-48 mx-auto mb-8 border-4 border-slate-900 flex shadow-sm overflow-hidden">
                {males > 0 && <div className="h-full bg-primary flex flex-col items-center justify-center text-on-primary font-black px-1" style={{ width: maleW }}><span className="text-xs">M</span><span>{Math.round(getPctNum(males))}%</span></div>}
                {females > 0 && <div className="h-full bg-secondary flex flex-col items-center justify-center text-on-secondary font-black px-1" style={{ width: femaleW }}><span className="text-xs">F</span><span>{Math.round(getPctNum(females))}%</span></div>}
                {other > 0 && <div className="h-full bg-tertiary flex flex-col items-center justify-center text-on-tertiary font-black px-1" style={{ width: otherW }}><span className="text-xs">O</span><span>{Math.round(getPctNum(other))}%</span></div>}
              </div>
              <div className="space-y-3 mt-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary"></span>
                    <span className="text-xs font-bold text-slate-600 uppercase">Male</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{malePct}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-secondary"></span>
                    <span className="text-xs font-bold text-slate-600 uppercase">Female</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{femalePct}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-tertiary"></span>
                    <span className="text-xs font-bold text-slate-600 uppercase">Other/Non-binary</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{otherPct}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="bg-surface-container-lowest mb-12 shadow-sm">
            <div className="px-8 py-6 border-b-4 border-primary">
              <h4 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Recent Registrations</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-white">
                <thead>
                  <tr className="bg-surface-container-low text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-surface-container">
                    <th className="px-8 py-4">User</th>
                    <th className="px-8 py-4">Age</th>
                    <th className="px-8 py-4">Gender</th>
                    <th className="px-8 py-4 text-right">Join Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-on-surface">
                  {users.map((u, i) => {
                    const isMale = u.gender === 'MALE';
                    const isFemale = u.gender === 'FEMALE';
                    const bgClass = isMale ? 'bg-primary text-on-primary' : isFemale ? 'bg-secondary text-on-secondary' : 'bg-tertiary text-on-tertiary';

                    return (
                      <tr key={u.userId || i} className="border-b border-surface-container-low hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6 flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center font-black text-xs ${bgClass}`}>
                            {u.displayName && u.displayName.length >= 2 ? u.displayName.substring(0, 2).toUpperCase() : u.username ? u.username.substring(0, 2).toUpperCase() : 'U'}
                          </div>
                          <span className="text-slate-900">{u.displayName || u.username}</span>
                        </td>
                        <td className="px-8 py-6 text-slate-900">{u.age || '-'}</td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase ${bgClass}`}>
                            {u.gender || 'Other'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right font-medium text-slate-400 uppercase text-xs">Recently</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Footer / Credits */}
        <footer className="p-8 mt-auto border-t-2 border-slate-200 bg-white">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">© 2026 TicketRush Intelligence Platform</p>
            <div className="flex gap-4">
              <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary cursor-pointer hover:underline">Privacy Policy</Link>
              <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary cursor-pointer hover:underline">API Docs</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Contextual FAB - Restricted to Insights */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all shadow-none">
          <span className="material-symbols-outlined scale-125">add_chart</span>
        </button>
      </div>
    </div>
  );
}
