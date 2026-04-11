'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:8080';

export default function CreateEvent() {
  const router = useRouter();
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    bannerUrl: '',
    category: 'MUSIC'
  });

  const [loading, setLoading] = useState(false);
  const [seatingMap, setSeatingMap] = useState<any>(null);

  useEffect(() => {
    const draft = localStorage.getItem('seatingMapDraft');
    if (draft) {
      try {
        setSeatingMap(JSON.parse(draft));
      } catch (e) {
        console.error('Failed to parse seating map draft', e);
      }
    }
  }, []);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const payload = {
        ...eventData,
        seatingMap,
      };
      const response = await fetch(`${API_BASE}/admin/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': 'Bearer ' + yourToken 
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Event Published Successfully! ID: ' + result.eventId);
      } else {
        const error = await response.json();
        alert('Error: ' + (error.message || 'Failed to create event'));
      }
    } catch (err) {
      alert('Connection failed. Please check your backend.');
    } finally {
      setLoading(false);
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      // Tạm thời lấy link mẫu để đẩy lên DB vì chưa có API upload ảnh thật
      setEventData({ ...eventData, bannerUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000" });
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <nav className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 sticky z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TicketRush</span>
            <div className="hidden md:flex gap-8">
              <Link href="/admin" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1">Dashboard</Link>
              <Link href="#" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase px-2 py-1">Create An Event</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-900 dark:text-slate-100 text-3xl">account_circle</button>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <span className="bg-secondary text-on-secondary px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Admin Console</span>
              <h1 className="text-[3.5rem] font-extrabold leading-none tracking-tighter text-on-surface uppercase">Create Event</h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-surface-dim transition-colors">Discard Draft</button>

              {/* NÚT ĐIỀU HƯỚNG SANG TRANG GHẾ */}
              <button
                onClick={handleConfigureSeating}
                className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-surface-dim transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chair</span> Configure Map Seating
              </button>

              <button className="bg-primary text-on-primary px-12 py-4 font-bold uppercase tracking-widest opacity-50 cursor-not-allowed">Publish Event</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 gap-y-1 bg-surface-container">
          <section className="md:col-span-8 bg-surface-container-lowest p-12 space-y-12">
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Identity</label>
              <input
                className="w-full text-2xl font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4 placeholder:text-surface-dim"
                placeholder="ENTER EVENT NAME"
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Date & Time</label>
                <input
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4"
                  type="datetime-local"
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Category</label>
                <select
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4"
                  onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                >
                  <option value="MUSIC">MUSIC</option>
                  <option value="SPORT">SPORT</option>
                  <option value="THEATER">THEATER</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Venue Location</label>
                <input
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4"
                  placeholder="VENUE NAME OR ADDRESS"
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Narrative</label>
              <textarea
                className="w-full font-body bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4 resize-none"
                placeholder="DESCRIBE THE EXPERIENCE..."
                rows={6}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              ></textarea>
            </div>

            {/* Ticket Tiers Section */}
            {seatingMap && (
              <div className="space-y-4 pt-8 border-t-2 border-surface-container-high">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Configured Seating Map</label>
                <div className="bg-surface-container-high p-6 flex flex-col gap-2 relative">
                  <div className="text-xl font-bold uppercase">{seatingMap.sectionLabel}</div>
                  <div className="text-sm font-bold text-outline">{seatingMap.rows} Rows × {seatingMap.seatsPerRow} Seats = {seatingMap.rows * seatingMap.seatsPerRow} Total Seats</div>
                  <button
                    onClick={() => {
                      localStorage.removeItem('seatingMapDraft');
                      setSeatingMap(null);
                    }}
                    className="text-xs font-bold text-red-500 uppercase self-start mt-4 hover:underline"
                  >
                    Remove Layout
                  </button>
                </div>
              </div>
            )}

          </section>

          <aside className="md:col-span-4 flex flex-col gap-1">
            <div className="bg-surface-container-lowest p-12 flex-grow">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest block mb-4 cursor-pointer">
                Visual Asset
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="aspect-[4/5] bg-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 p-8 group hover:bg-surface-variant transition-colors relative overflow-hidden mt-4">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-6xl text-outline mb-4">add_a_photo</span>
                      <p className="font-bold text-sm uppercase tracking-widest text-center">Click to browse</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}