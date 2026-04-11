'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

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

  // --- BƯỚC 1: TẢI DỮ LIỆU CŨ KHI QUAY LẠI TRANG ---
  useEffect(() => {
    const savedEvent = localStorage.getItem('eventDataDraft');
    const savedMap = localStorage.getItem('seatingMapDraft');

    if (savedEvent) {
      const parsedEvent = JSON.parse(savedEvent);
      setEventData(parsedEvent);
      console.log("Đã khôi phục thông tin sự kiện:", parsedEvent);
    }
    if (savedMap) {
      setSeatingMap(JSON.parse(savedMap));
    }
  }, []); // Cần mảng rỗng để không bị chạy lại nhiều lần

  // 3. Hàm xử lý thay đổi Input (Cập nhật cả state và localStorage cùng lúc)
  const handleChange = (field: string, value: string) => {
    const newData = { ...eventData, [field]: value };
    setEventData(newData);
    // Lưu ngay lập tức để không bao giờ mất
    localStorage.setItem('eventDataDraft', JSON.stringify(newData));
  };

  const handleConfigureSeating = () => {
    // Lưu một lần nữa cho chắc chắn trước khi chuyển trang
    localStorage.setItem('eventDataDraft', JSON.stringify(eventData));
    router.push('/admin/seating-map');
  };

  const handlePublish = async () => {
    if (!seatingMap) {
      alert("Please configure the seating map before publishing.");
      return;
    }

    setLoading(true);
    try {
      // Chuẩn bị Payload theo cấu hình Backend đã thống nhất
      const rowConfigs = Object.entries(seatingMap.rowPriceTiers).map(([index, tierLabel]: any) => {
        // Trích xuất giá tiền từ label (Ví dụ: "VIP - $249.00" -> 249.00)
        const price = parseFloat(tierLabel.split('$')[1]) || 0;
        return {
          rowNumber: parseInt(index) + 1,
          price: price
        };
      });

      const eventPayload = { ...eventData };

      // BƯỚC 1: TẠO EVENT
      const response = await fetch(`${API_BASE}/admin/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload),
      });

      if (response.ok) {
        const result = await response.json();
        const eventId = result.eventId;

        // BƯỚC 2: ĐẨY MA TRẬN GHẾ
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
          localStorage.removeItem('seatingMapDraft');
          localStorage.removeItem('eventDataDraft');
          router.push('/events');
        }
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


  const [previewUrl, setPreviewUrl] = useState<string>('');
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
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
              <button
                onClick={() => {
                  localStorage.removeItem('eventDataDraft');
                  localStorage.removeItem('seatingMapDraft');
                  window.location.reload();
                }}
                className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-surface-dim transition-colors"
              >
                Discard Draft
              </button>

              <button
                onClick={handleConfigureSeating}
                className="bg-surface-container-highest text-on-surface px-8 py-4 font-bold uppercase tracking-widest hover:bg-surface-dim transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">chair</span>
                {seatingMap ? "Edit Seating Map" : "Configure Map Seating"}
              </button>

              <button
                onClick={handlePublish}
                disabled={loading}
                className={`px-12 py-4 font-bold uppercase tracking-widest transition-all ${seatingMap ? 'bg-primary text-on-primary' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
              >
                {loading ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-1 gap-y-1 bg-surface-container">
          <section className="md:col-span-8 bg-surface-container-lowest p-12 space-y-12">
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Identity</label>
              <input
                className="w-full text-2xl font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4 placeholder:text-surface-dim uppercase"
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
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Category</label>
                <select
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4"
                  value={eventData.category}
                  onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                >
                  <option value="MUSIC">MUSIC</option>
                  <option value="SPORT">SPORT</option>
                  <option value="THEATER">THEATER</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Venue Location</label>
                <input
                  className="w-full font-bold bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 px-4 py-4"
                  placeholder="VENUE NAME OR ADDRESS"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest">Event Narrative</label>
              <textarea
                className="w-full font-body bg-surface-container-high border-0 border-b-2 border-transparent focus:outline-none focus:border-primary focus:ring-0 transition-colors px-4 py-4 resize-none"
                placeholder="DESCRIBE THE EXPERIENCE..."
                rows={6}
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              ></textarea>
            </div>

            {/* Hiển thị tóm tắt Seating Map nếu đã config */}
            {seatingMap && (
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 animate-in fade-in slide-in-from-left-2">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Seating Configuration Attached</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg uppercase">{seatingMap.sectionLabel}</span>
                  <span className="font-black text-sm">{seatingMap.rows * seatingMap.seatsPerRow} SEATS GENERATED</span>
                </div>
              </div>
            )}
          </section>

          <aside className="md:col-span-4 flex flex-col gap-1">
            {/* Giữ nguyên phần Visual Asset của bạn */}
            <div className="bg-surface-container-lowest p-12 flex-grow">
              <label className="text-[0.75rem] font-bold text-outline uppercase tracking-widest block mb-4 cursor-pointer">
                Visual Asset
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="aspect-[4/5] bg-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 p-8 group hover:bg-surface-variant transition-colors relative overflow-hidden mt-4">
                  {previewUrl ? <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover" /> :
                    <span className="material-symbols-outlined text-6xl text-outline">add_a_photo</span>}
                </div>
              </label>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}