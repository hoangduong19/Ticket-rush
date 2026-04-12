'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [seatingMap, setSeatingMap] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // 1. STATE DỮ LIỆU SỰ KIỆN
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    bannerUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000',
    category: 'MUSIC'
  });

  // 2. TẢI DỮ LIỆU BẢN NHÁP KHI TRANG LOAD
  useEffect(() => {
    const savedEvent = localStorage.getItem('eventDataDraft');
    const savedMap = localStorage.getItem('seatingMapDraft');

    if (savedEvent) {
      setEventData(JSON.parse(savedEvent));
    }
    if (savedMap) {
      try {
        setSeatingMap(JSON.parse(savedMap));
      } catch (e) {
        console.error('Failed to parse seating map draft', e);
      }
    }
  }, []);

  // 3. HÀM CẬP NHẬT INPUT & LƯU TỰ ĐỘNG VÀO LOCALSTORAGE
  const handleInputChange = (field: string, value: string) => {
    const updatedData = { ...eventData, [field]: value };
    setEventData(updatedData);
    localStorage.setItem('eventDataDraft', JSON.stringify(updatedData));
  };

  const handleConfigureSeating = () => {
    // Đảm bảo dữ liệu event hiện tại được lưu trước khi rời trang
    localStorage.setItem('eventDataDraft', JSON.stringify(eventData));
    router.push('/admin/seating-map');
  };

  // 4. XỬ LÝ ĐẨY DỮ LIỆU LÊN BACKEND (2 BƯỚC)
  const handlePublish = async () => {
    if (!eventData.title || !eventData.date) {
      alert("Please fill in basic event details first.");
      return;
    }
    if (!seatingMap) {
      alert("Please configure the seating map before publishing.");
      return;
    }

    setLoading(true);
    try {
      // --- BƯỚC A: CHUẨN BỊ PAYLOAD GHẾ TỪ CẤU HÌNH DRAFT ---
      // seatingMap.rowAssignments lưu { 0: "PLATINUM", 1: "VIP"... }
      // seatingMap.tiers lưu [ {id: "PLATINUM", value: 499...}, ... ]
      const rowConfigs = Array.from({ length: seatingMap.rows }).map((_, index) => {
        const tierId = seatingMap.rowAssignments[index];
        const tierObj = seatingMap.tiers.find((t: any) => t.id === tierId);

        return {
          rowNumber: index + 1,
          price: tierObj ? tierObj.value : 89.00, // Lấy giá số từ bảng giá động
          seatType: tierObj ? tierObj.label : 'Standard'
        };
      });

      // --- BƯỚC 1: TẠO SỰ KIỆN ---
      const eventResponse = await fetch(`${API_BASE}/admin/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!eventResponse.ok) {
        const err = await eventResponse.json();
        throw new Error(err.message || 'Failed to create event');
      }

      const result = await eventResponse.json();
      const eventId = result.eventId;

      // --- BƯỚC 2: TẠO MA TRẬN GHẾ DỰA TRÊN EVENT ID VỪA CÓ ---
      const seatPayload = {
        sectionLabel: seatingMap.sectionLabel,
        seatsPerRow: seatingMap.seatsPerRow,
        rowConfigs: rowConfigs
      };

      const seatRes = await fetch(`${API_BASE}/events/${eventId}/seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seatPayload),
      });

      if (seatRes.ok) {
        alert('Event & Seating Map Published Successfully!');
        // Xóa sạch bản nháp sau khi thành công
        localStorage.removeItem('seatingMapDraft');
        localStorage.removeItem('eventDataDraft');
        router.push('/events');
      } else {
        alert('Event created, but failed to generate seats. Please check backend.');
      }

    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      // Giữ nguyên link ảnh mẫu như code cũ của bạn
      handleInputChange('bannerUrl', "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000");
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 sticky z-50 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500 uppercase">TicketRush</span>
            <div className="hidden md:flex gap-8">
              <Link href="/admin" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase hover:text-blue-700 transition-colors">Dashboard</Link>
              <span className="text-blue-700 dark:text-blue-400 font-bold font-['Inter'] tracking-tight uppercase border-b-2 border-blue-700">Create Event</span>
            </div>
          </div>
          <button className="material-symbols-outlined text-3xl">account_circle</button>
        </div>
      </nav>

      <main className="max-w-[1440px] mx-auto px-8 py-12">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="bg-secondary text-on-secondary px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Admin Console</span>
            <h1 className="text-[3.5rem] font-extrabold leading-none tracking-tighter text-on-surface uppercase">Create Event</h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                if (confirm("Discard all progress?")) {
                  localStorage.removeItem('eventDataDraft');
                  localStorage.removeItem('seatingMapDraft');
                  window.location.reload();
                }
              }}
              className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Discard Draft
            </button>

            <button
              onClick={handleConfigureSeating}
              className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-blue-700 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">chair</span>
              {seatingMap ? "Edit Seating Map" : "Configure Map Seating"}
            </button>

            <button
              onClick={handlePublish}
              disabled={loading}
              className={`px-12 py-4 font-bold uppercase tracking-widest transition-all shadow-xl ${seatingMap && eventData.title ? 'bg-primary text-on-primary hover:scale-105' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
            >
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 bg-surface-container border border-slate-200 dark:border-slate-800">
          <section className="md:col-span-8 bg-surface-container-lowest p-12 space-y-12">
            {/* TÊN SỰ KIỆN */}
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Identity</label>
              <input
                className="w-full text-2xl font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4 uppercase"
                placeholder="ENTER EVENT NAME"
                type="text"
                value={eventData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* NGÀY GIỜ */}
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Date & Time</label>
                <input
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4"
                  type="datetime-local"
                  value={eventData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              {/* THỂ LOẠI */}
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Category</label>
                <select
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4 appearance-none"
                  value={eventData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="MUSIC">MUSIC</option>
                  <option value="SPORT">SPORT</option>
                  <option value="THEATER">THEATER</option>
                </select>
              </div>

              {/* ĐỊA ĐIỂM */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Venue Location</label>
                <input
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4"
                  placeholder="VENUE NAME OR ADDRESS"
                  value={eventData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>

            {/* MÔ TẢ */}
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Narrative</label>
              <textarea
                className="w-full font-body bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4 resize-none"
                placeholder="DESCRIBE THE EXPERIENCE..."
                rows={5}
                value={eventData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              ></textarea>
            </div>

            {/* TÓM TẮT SƠ ĐỒ GHẾ (CHỈ HIỆN KHI ĐÃ CONFIG) */}
            {seatingMap && (
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 animate-in fade-in slide-in-from-left-2">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Seating Configuration Attached</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg uppercase tracking-tighter">{seatingMap.sectionLabel}</span>
                  <div className="text-right">
                    <span className="font-black text-xl text-blue-700 dark:text-blue-400">{seatingMap.rows * seatingMap.seatsPerRow}</span>
                    <span className="text-[10px] font-bold uppercase opacity-60 ml-2">Total Seats Generated</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* CỘT PHẢI: BANNER ASSET */}
          <aside className="md:col-span-4 flex flex-col gap-1 bg-surface-container-lowest border-l border-slate-200 dark:border-slate-800">
            <div className="p-12 flex-grow">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest block mb-4 cursor-pointer">
                Visual Asset
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="aspect-[4/5] bg-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 p-8 group hover:bg-surface-variant transition-all relative overflow-hidden mt-4">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-6xl text-outline mb-4">add_a_photo</span>
                      <p className="font-bold text-[10px] uppercase tracking-[0.2em] text-center">Click to upload banner</p>
                    </>
                  )}
                  {previewUrl && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-bold uppercase text-[10px] tracking-widest">Change Media</span>
                    </div>
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