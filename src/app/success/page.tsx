import Link from 'next/link';

export default function OrderSuccess() {
  return (
    <div className="bg-background text-on-background antialiased">
      {/* TopNavBar Suppression: Page is Transactional (Success screen) */}
      <main className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12">
        {/* Header Branding (Manual since Shell is suppressed) */}
        <div className="mb-12 text-center">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 uppercase">TicketRush</Link>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-1 bg-background">
          {/* SUCCESS MESSAGE BLOCK */}
          <div className="md:col-span-12 bg-tertiary p-8 md:p-16 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-white text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-on-tertiary">TRANSACTION COMPLETE</span>
              </div>
              <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tighter leading-none mb-4">ORDER SUCCESSFUL</h1>
              <p className="text-tertiary-container font-semibold tracking-tight text-xl max-w-xl">You're going to the main stage. Your digital admission is secured and ready for entry.</p>
            </div>
            <div className="text-right">
              <span className="block font-['Inter'] font-bold text-xs uppercase tracking-widest text-on-tertiary opacity-70 mb-1">ORDER ID</span>
              <span className="block text-white text-3xl font-black tracking-tighter">TR-8829-44X</span>
            </div>
          </div>

          {/* ASYMMETRIC CONTENT GRID */}
          {/* LEFT COLUMN: TICKET DETAILS */}
          <div className="md:col-span-7 bg-surface-container-lowest p-8 md:p-12 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-on-surface mb-12">ORDER SUMMARY</h2>
              <div className="space-y-12">
                {/* Event Block */}
                <div className="flex gap-8">
                  <div className="w-32 h-32 flex-shrink-0 bg-surface-container">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Event Overview" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAh7ekd7qdGQgXG9bryln89u3zP_0RDh37KoKjMeLx93r__-pkHhjjjOZ16Ic8tXY0jNu6NmQv_ivGZ_cfG4O2dBf77cmaDwHIftpmXqZuZ8dCH6-FJXRFkU4b_jv3AQ-jIdt0hydnJVGmKcok81HdvE8lwnUv_YX5Wz_kSDB_bjqTh7itlcA93XxQTo7A9AQZ6SBeQYuhpRn2_qjM6vcVe8F2gKjd31WDqTWCpVjP1HE-kVDe9-mZg3zObK-XliYKj56WXRtTDSg97"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-primary mb-2">LIVE PERFORMANCE</span>
                    <h3 className="text-2xl font-extrabold tracking-tighter leading-tight mb-2">NEON HORIZON: THE WORLD TOUR</h3>
                    <p className="text-on-surface-variant font-medium">METROPLEX ARENA • SECTION B • ROW 12</p>
                  </div>
                </div>

                {/* Ticket Matrix */}
                <div className="grid grid-cols-2 gap-px bg-surface-container-high">
                  <div className="bg-surface-container-lowest p-4">
                    <span className="block font-['Inter'] font-bold text-xs uppercase tracking-widest text-outline mb-1">DATE</span>
                    <span className="block font-bold text-lg">OCT 24, 2024</span>
                  </div>
                  <div className="bg-surface-container-lowest p-4">
                    <span className="block font-['Inter'] font-bold text-xs uppercase tracking-widest text-outline mb-1">TIME</span>
                    <span className="block font-bold text-lg">19:30 PM</span>
                  </div>
                  <div className="bg-surface-container-lowest p-4">
                    <span className="block font-['Inter'] font-bold text-xs uppercase tracking-widest text-outline mb-1">QUANTITY</span>
                    <span className="block font-bold text-lg">02 TICKETS</span>
                  </div>
                  <div className="bg-surface-container-lowest p-4">
                    <span className="block font-['Inter'] font-bold text-xs uppercase tracking-widest text-outline mb-1">PRICE</span>
                    <span className="block font-bold text-lg">$284.50</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-16 pt-8 border-t-2 border-surface-container flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-primary py-5 px-8 flex items-center justify-center gap-3 group transition-all active:translate-y-0.5">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                <span className="text-white font-bold uppercase tracking-widest text-sm">View My Tickets</span>
              </button>
              <button className="flex-1 bg-surface-container-highest py-5 px-8 flex items-center justify-center gap-3 group transition-all active:translate-y-0.5">
                <span className="material-symbols-outlined text-on-surface">picture_as_pdf</span>
                <span className="text-on-surface font-bold uppercase tracking-widest text-sm">Download PDF</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: QR ACCESS */}
          <div className="md:col-span-5 bg-surface-container-low p-8 md:p-12 flex flex-col items-center justify-center">
            <div className="bg-white p-6 mb-8 w-full max-w-[300px]">
              <div className="relative aspect-square bg-slate-100 flex items-center justify-center">
                <img 
                  className="w-full h-full object-cover p-2" 
                  alt="Entry QR Code" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaSxaJDPl1P2sbKYQIN_Sj_aV1AcYlePEcuAqrwBQhC16hflkb2qnRVJQV5UwwLZfvtueVQW-uLjKVCZbfrbjN7mJkp3WS7h7R-iZiVTJVFBraLPRvMBBfcBM4h4W4WaiWLLqCc-kRSci4kDTVBgfFeOF90iEX3bvhZdIIuoHaKzEyyOEL4Mo-UGfskPn6fpCBM0poki1brmVeM3eeruCN0XEgWVBJCxO212enoEjIViO1gIV4CGsEaT7-jMLt4VkRrJ2qvgJoYjat"
                />
                {/* Decorative corner accents to emphasize the scanning focus */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
              </div>
            </div>
            <div className="text-center">
              <span className="inline-block bg-secondary px-3 py-1 mb-4">
                <span className="text-white font-bold uppercase tracking-widest text-[10px]">DIGITAL ENTRY PERMIT</span>
              </span>
              <h4 className="text-2xl font-black tracking-tight mb-4 uppercase">READY FOR SCAN</h4>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-xs mx-auto">
                Present this QR code at the venue entrance. This code is valid for all 02 attendees in your party.
              </p>
            </div>
            <div className="mt-12 w-full space-y-4">
              <div className="flex justify-between items-center bg-surface-container-high p-4">
                <span className="font-bold text-xs uppercase tracking-widest text-outline">GUEST A</span>
                <span className="font-bold text-sm">ALEXANDER RHEIN</span>
              </div>
              <div className="flex justify-between items-center bg-surface-container-high p-4">
                <span className="font-bold text-xs uppercase tracking-widest text-outline">GUEST B</span>
                <span className="font-bold text-sm">MARCUS VANE</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (JSON AUTHENTICITY) */}
        <div className="w-full max-w-5xl mt-24">
          <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-16 w-full gap-8 bg-slate-900 dark:bg-black">
            <div className="flex flex-col items-center md:items-start">
              <Link href="/" className="text-lg font-black text-white mb-4 uppercase tracking-tighter italic">TICKETRUSH</Link>
              <div className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400">© 2026 TicketRush. ARCHITECTURAL PRECISION IN TICKETING.</div>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Support</Link>
              <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms</Link>
              <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy</Link>
              <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Careers</Link>
            </div>
          </footer>
          {/* Separation Logic from JSON */}
          <div className="bg-blue-600 h-2 w-full"></div>
        </div>
      </main>
    </div>
  );
}
