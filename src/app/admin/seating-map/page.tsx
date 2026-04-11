'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PRICE_TIERS = [
  { label: 'PLATINUM - $499.00', value: 499.00, color: 'bg-indigo-600', hex: '#4f46e5' },
  { label: 'VIP - $249.00', value: 249.00, color: 'bg-blue-500', hex: '#3b82f6' },
  { label: 'GENERAL - $89.00', value: 89.00, color: 'bg-slate-500', hex: '#6b7280' },
];

export default function SeatingMapConfigurator() {
  const router = useRouter();
  const [rows, setRows] = useState(12);
  const [seatsPerRow, setSeatsPerRow] = useState(24);
  const [sectionLabel, setSectionLabel] = useState('VIP NORTH');
  const [selectedRow, setSelectedRow] = useState(0);
  const [rowPriceTiers, setRowPriceTiers] = useState<{ [key: number]: string }>({
    0: 'PLATINUM - $499.00',
    1: 'PLATINUM - $499.00',
    2: 'VIP - $249.00',
    3: 'VIP - $249.00',
    4: 'VIP - $249.00',
    5: 'VIP - $249.00',
    6: 'GENERAL - $89.00',
    7: 'GENERAL - $89.00',
    8: 'GENERAL - $89.00',
    9: 'GENERAL - $89.00',
    10: 'GENERAL - $89.00',
    11: 'GENERAL - $89.00',
  });

  useEffect(() => {
    const draft = localStorage.getItem('seatingMapDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.rows) setRows(parsed.rows);
        if (parsed.seatsPerRow) setSeatsPerRow(parsed.seatsPerRow);
        if (parsed.sectionLabel) setSectionLabel(parsed.sectionLabel);
        if (parsed.rowPriceTiers) setRowPriceTiers(parsed.rowPriceTiers);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    }
  }, []);

  // Generate seat matrix with status
  const generateSeatMatrix = () => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < seatsPerRow; j++) {
        // Varied seat statuses for visualization
        let status = 'available'; // tertiary color
        // if (Math.random() > 0.7) status = 'reserved'; // secondary color
        // if (Math.random() > 0.85) status = 'disabled'; // surface-dim color

        row.push({
          id: `${i}-${j}`,
          row: i,
          seat: j,
          status: status
        });
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
    setRowPriceTiers({
      ...rowPriceTiers,
      [row]: tier,
    });
  };

  const handleSaveDraft = () => {
    const mapConfig = {
      sectionLabel,
      rows,
      seatsPerRow,
      rowPriceTiers,
    };
    // Lưu ma trận ghế
    localStorage.setItem('seatingMapDraft', JSON.stringify(mapConfig));

    // Điều hướng quay lại trang tạo sự kiện
    // Dữ liệu eventData vẫn nằm an toàn trong key 'eventDataDraft' ở trang kia
    router.push('/admin/events/create');
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
              <div className="bg-surface-container-lowest p-3 space-y-2">
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      onClick={() => setSelectedRow(rowIndex)}
                      className={`p-2 cursor-pointer rounded-sm transition-colors border-l-4 ${selectedRow === rowIndex
                        ? 'bg-primary bg-opacity-20 border-primary'
                        : 'bg-surface-container border-surface-dim'
                        }`}
                    >
                      <div className={`text-[0.65rem] font-bold ${selectedRow === rowIndex ? 'text-on-primary' : 'text-on-surface'}`}>
                        Row {rowIndex + 1}
                      </div>
                      <div className={`text-[0.6rem] ${selectedRow === rowIndex ? 'font-bold text-on-primary' : 'text-on-surface-variant'}`}>
                        {rowPriceTiers[rowIndex] || 'GENERAL - $89.00'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {rows > 0 && (
                <div>
                  <label className="block font-bold text-[0.65rem] uppercase mb-2">Tier for Row {selectedRow + 1}</label>
                  <select
                    className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
                    value={rowPriceTiers[selectedRow] || 'GENERAL - $89.00'}
                    onChange={(e) => updateRowPriceTier(selectedRow, e.target.value)}
                  >
                    {PRICE_TIERS.map((tier) => (
                      <option key={tier.label} value={tier.label}>
                        {tier.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </section>

            {/* Legend */}
            <section>
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant mb-4">Price Tier Colors</p>
              <div className="space-y-2">
                {PRICE_TIERS.map((tier) => (
                  <div key={tier.label} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: tier.hex }}></div>
                    <span className="text-[0.75rem] font-bold">{tier.label}</span>
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

        {/* Canvas Area */}
        <section className="flex-grow bg-surface relative overflow-hidden flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-surface-container border-b-0 px-6 py-4 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">zoom_in</button>
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">zoom_out</button>
              <div className="h-8 w-[1px] bg-outline-variant opacity-20"></div>
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">undo</button>
              <button className="material-symbols-outlined bg-surface-container-lowest p-2 hover:bg-white transition-colors">redo</button>
            </div>
            <div className="flex gap-2">
              <span className="bg-secondary px-3 py-1 text-on-secondary font-bold text-[0.65rem] tracking-tighter uppercase self-center">LIVE SYNC ACTIVE</span>
              <button onClick={handleSaveDraft} className="bg-surface-container-lowest px-4 py-2 font-bold text-[0.75rem] uppercase border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors">Save Draft</button>
            </div>
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