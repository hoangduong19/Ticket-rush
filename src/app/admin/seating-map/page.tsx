'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = 'http://localhost:8080';

const PRICE_TIERS = [
  { label: 'PLATINUM - $499.00', value: 499.00, color: 'bg-indigo-600', hex: '#4f46e5' },
  { label: 'VIP - $249.00', value: 249.00, color: 'bg-blue-500', hex: '#3b82f6' },
  { label: 'GENERAL - $89.00', value: 89.00, color: 'bg-slate-500', hex: '#6b7280' },
];

export default function SeatingMapConfigurator() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(12);
  const [seatsPerRow, setSeatsPerRow] = useState(24);
  const [sectionLabel, setSectionLabel] = useState('VIP NORTH');
  const [selectedRow, setSelectedRow] = useState(0);
  const [rowPriceTiers, setRowPriceTiers] = useState<{ [key: number]: string }>({
    // Khởi tạo mặc định
    ...Object.fromEntries(Array.from({ length: 12 }).map((_, i) => [i, i < 2 ? 'PLATINUM - $499.00' : i < 6 ? 'VIP - $249.00' : 'GENERAL - $89.00']))
  });

  // THUẬT TOÁN ĐẨY TOÀN BỘ DỮ LIỆU
  const handleFinalPublish = async () => {
    const rawData = localStorage.getItem('pendingEvent');
    if (!rawData) {
      alert("Missing event data. Go back to Create Event page.");
      return;
    }
    const eventData = JSON.parse(rawData);

    setLoading(true);
    try {
      // BƯỚC 1: TẠO EVENT
      const eventRes = await fetch(`${API_BASE}/admin/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!eventRes.ok) throw new Error("Failed to create event");
      const createdEvent = await eventRes.json();
      const eventId = createdEvent.eventId;

      // BƯỚC 2: CHUẨN BỊ PAYLOAD GHẾ
      const rowConfigs = Array.from({ length: rows }).map((_, i) => {
        const tierLabel = rowPriceTiers[i] || 'GENERAL - $89.00';
        const tierObj = PRICE_TIERS.find(t => t.label === tierLabel);
        return {
          rowNumber: i + 1,
          price: tierObj?.value || 89.00
        };
      });

      const seatingPayload = {
        sectionLabel,
        seatsPerRow,
        rowConfigs
      };

      // BƯỚC 3: ĐẨY MA TRẬN GHẾ
      const seatRes = await fetch(`${API_BASE}/events/${eventId}/seats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seatingPayload),
      });

      if (seatRes.ok) {
        alert("PUBLISH SUCCESSFUL! Event and " + (rows * seatsPerRow) + " seats created.");
        localStorage.removeItem('pendingEvent');
        window.location.href = '/events'; // Điều hướng về trang người dùng
      }

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Giữ nguyên logic render UI của bạn
  const generateSeatMatrix = () => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < seatsPerRow; j++) {
        row.push({ id: `${i}-${j}`, row: i, seat: j, status: 'available' });
      }
      matrix.push(row);
    }
    return matrix;
  };

  const seatMatrix = generateSeatMatrix();

  const getSeatBgHex = (rowIndex: number) => {
    const tier = rowPriceTiers[rowIndex] || 'GENERAL - $89.00';
    return PRICE_TIERS.find(t => t.label === tier)?.hex || '#6b7280';
  };

  const updateRowPriceTier = (row: number, tier: string) => {
    setRowPriceTiers({ ...rowPriceTiers, [row]: tier });
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TicketRush</div>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/admin" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase">Dashboard</Link>
            <Link href="#" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase">Map Config</Link>
          </nav>
          <button className="material-symbols-outlined text-slate-900 dark:text-slate-100">account_circle</button>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <aside className="w-full md:w-80 bg-surface-container-low flex flex-col shrink-0 overflow-y-auto">
          <div className="p-6 bg-surface-container-highest">
            <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant mb-2">MAP CONFIGURATOR</p>
            <h1 className="text-xl font-bold tracking-tight uppercase">{sectionLabel}</h1>
          </div>

          <div className="p-6 space-y-8">
            <section className="bg-surface-container-lowest p-4 space-y-4">
              <div>
                <label className="block font-bold text-[0.65rem] uppercase mb-1">Section Label</label>
                <input className="w-full bg-surface-container-high p-2 text-sm uppercase" value={sectionLabel} onChange={(e) => setSectionLabel(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="bg-surface-container-high p-2 text-sm" value={rows} onChange={(e) => setRows(parseInt(e.target.value) || 1)} />
                <input type="number" className="bg-surface-container-high p-2 text-sm" value={seatsPerRow} onChange={(e) => setSeatsPerRow(parseInt(e.target.value) || 1)} />
              </div>
            </section>

            <section className="space-y-4">
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant">Configure Row Pricing</p>
              <div className="bg-surface-container-lowest p-3 space-y-2 max-h-48 overflow-y-auto">
                {Array.from({ length: rows }).map((_, i) => (
                  <div key={i} onClick={() => setSelectedRow(i)} className={`p-2 cursor-pointer border-l-4 ${selectedRow === i ? 'bg-primary/10 border-primary' : 'bg-surface-container border-transparent'}`}>
                    <p className="text-[0.65rem] font-bold">Row {i + 1}</p>
                    <p className="text-[0.6rem] opacity-60">{rowPriceTiers[i] || 'GENERAL - $89.00'}</p>
                  </div>
                ))}
              </div>
              <select className="w-full bg-surface-container-high p-2 text-sm uppercase font-bold"
                value={rowPriceTiers[selectedRow] || 'GENERAL - $89.00'}
                onChange={(e) => updateRowPriceTier(selectedRow, e.target.value)}>
                {PRICE_TIERS.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
              </select>
            </section>
          </div>
        </aside>

        <section className="flex-grow bg-surface flex flex-col relative">
          <div className="bg-surface-container px-6 py-4 flex justify-between items-center">
            <span className="bg-secondary px-3 py-1 text-on-secondary font-bold text-[0.65rem] uppercase tracking-widest">Live Editor</span>

            {/* NÚT LƯU TOÀN BỘ DỮ LIỆU */}
            <button
              onClick={handleFinalPublish}
              disabled={loading}
              className="bg-blue-700 text-white px-8 py-2 font-bold text-[0.75rem] uppercase shadow-lg hover:bg-blue-600 disabled:opacity-50 transition-all"
            >
              {loading ? 'Processing...' : 'Save Draft & Publish'}
            </button>
          </div>

          <div className="flex-grow overflow-auto p-12 bg-surface cursor-crosshair flex flex-col items-center">
            <div className="w-[600px] h-20 bg-on-surface flex items-center justify-center mb-12 shadow-2xl">
              <span className="text-surface font-black tracking-[1em] text-xl">STAGE</span>
            </div>

            <div className="flex flex-col gap-2">
              {seatMatrix.map((row, rIdx) => (
                <div key={rIdx} className="flex gap-1 items-center">
                  <span className="text-[0.6rem] font-bold w-8 text-right opacity-30">{rIdx + 1}</span>
                  <div className="flex gap-1">
                    {row.map((seat) => (
                      <div key={seat.id} className="w-4 h-4 rounded-sm" style={{ backgroundColor: getSeatBgHex(rIdx) }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-[0.7rem] font-bold uppercase text-on-surface-variant flex gap-12 border-t border-outline-variant pt-8 w-full max-w-xl">
              <div>Total Seats: {rows * seatsPerRow}</div>
              <div className="text-blue-600">Active Section: {sectionLabel}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}