'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SeatingMapConfigurator() {
  const router = useRouter();

  // --- 1. STATE CHO CÁC HẠNG GHẾ (Có thể sửa giá) ---
  const [tiers, setTiers] = useState([
    { id: 'PLATINUM', label: 'PLATINUM', value: 499.00, color: 'bg-indigo-600', hex: '#4f46e5' },
    { id: 'VIP', label: 'VIP', value: 249.00, color: 'bg-blue-500', hex: '#3b82f6' },
    { id: 'GENERAL', label: 'GENERAL', value: 89.00, color: 'bg-slate-500', hex: '#6b7280' },
  ]);

  // --- 2. STATE CHO CẤU HÌNH MA TRẬN ---
  const [rows, setRows] = useState(12);
  const [seatsPerRow, setSeatsPerRow] = useState(24);
  const [sectionLabel, setSectionLabel] = useState('VIP NORTH');
  const [selectedRow, setSelectedRow] = useState(0);

  // Lưu trữ việc gán hàng nào vào hạng ghế nào (Lưu ID của tier)
  const [rowAssignments, setRowAssignments] = useState<{ [key: number]: string }>({});

  // --- 3. KHÔI PHỤC DỮ LIỆU TỪ BẢN NHÁP (LÀM TRƯỚC ĐÓ) ---
  useEffect(() => {
    const draft = localStorage.getItem('seatingMapDraft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.rows) setRows(parsed.rows);
        if (parsed.seatsPerRow) setSeatsPerRow(parsed.seatsPerRow);
        if (parsed.sectionLabel) setSectionLabel(parsed.sectionLabel);
        if (parsed.tiers) setTiers(parsed.tiers);
        if (parsed.rowAssignments) setRowAssignments(parsed.rowAssignments);
      } catch (e) {
        console.error('Failed to parse draft', e);
      }
    } else {
      // Khởi tạo mặc định nếu chưa có bản nháp
      const initialAssignments: any = {};
      for (let i = 0; i < rows; i++) {
        initialAssignments[i] = i < 2 ? 'PLATINUM' : i < 6 ? 'VIP' : 'GENERAL';
      }
      setRowAssignments(initialAssignments);
    }
  }, []);

  // Cập nhật giá tiền cho một hạng ghế
  const handleTierPriceChange = (id: string, newValue: number) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, value: newValue } : t));
  };

  // Lấy màu sắc dựa trên hạng ghế đã gán cho hàng đó
  const getSeatBgHex = (rowIndex: number) => {
    const tierId = rowAssignments[rowIndex] || 'GENERAL';
    const tierConfig = tiers.find(t => t.id === tierId);
    return tierConfig?.hex || '#6b7280';
  };

  // --- 4. LƯU BẢN NHÁP VÀ QUAY LẠI ---
  const handleSaveDraft = () => {
    const mapConfig = {
      sectionLabel,
      rows,
      seatsPerRow,
      tiers,           // Lưu bảng giá mới nhất
      rowAssignments,  // Lưu cấu hình gán hàng
    };
    localStorage.setItem('seatingMapDraft', JSON.stringify(mapConfig));
    router.push('/admin/events/create');
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-['Inter']">
      {/* TopNavBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 z-50 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TICKETRUSH</div>
          <nav className="hidden md:flex gap-8 items-center uppercase text-[10px] font-black tracking-[0.2em]">
            <Link href="/admin" className="opacity-40 hover:opacity-100 transition-opacity">Dashboard</Link>
            <span className="text-blue-600">Map Configurator</span>
          </nav>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-slate-900 dark:text-slate-100">account_circle</button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-full md:w-80 bg-surface-container-low flex flex-col shrink-0 overflow-y-auto border-r border-slate-200 dark:border-slate-800">
          <div className="p-6 bg-surface-container-highest">
            <p className="font-bold text-[0.65rem] uppercase tracking-[0.2em] text-on-surface-variant mb-1">Toolbox</p>
            <h1 className="text-xl font-black tracking-tighter">MAP_ENGINE_V4</h1>
          </div>

          <div className="p-6 space-y-8">
            {/* PHẦN MỚI: CHỈNH SỬA GIÁ TIỀN HẠNG VÉ */}
            <section className="space-y-4">
              <p className="font-black text-[0.7rem] uppercase tracking-widest text-primary">01. Tier Pricing</p>
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div key={tier.id} className="bg-surface-container-lowest p-3 border border-outline-variant/30 rounded-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${tier.color}`}></div>
                      <span className="text-[10px] font-bold uppercase">{tier.label}</span>
                    </div>
                    <div className="flex items-center bg-surface-container-high px-3 py-2">
                      <span className="font-bold text-xs opacity-40">$</span>
                      <input
                        type="number"
                        className="bg-transparent w-full outline-none font-black text-sm ml-2"
                        value={tier.value}
                        onChange={(e) => handleTierPriceChange(tier.id, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section Details */}
            <section className="space-y-4">
              <p className="font-black text-[0.7rem] uppercase tracking-widest text-primary">02. Grid Properties</p>
              <div className="bg-surface-container-lowest p-4 space-y-4">
                <div>
                  <label className="block font-bold text-[0.65rem] uppercase mb-1 opacity-50">Section Label</label>
                  <input
                    className="w-full bg-surface-container-high border-none p-2 text-sm font-bold uppercase outline-none focus:ring-1 ring-primary"
                    type="text"
                    value={sectionLabel}
                    onChange={(e) => setSectionLabel(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[0.65rem] uppercase mb-1 opacity-50">Rows</label>
                    <input
                      className="w-full bg-surface-container-high border-none p-2 text-sm font-bold"
                      type="number"
                      value={rows}
                      onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[0.65rem] uppercase mb-1 opacity-50">Seats/Row</label>
                    <input
                      className="w-full bg-surface-container-high border-none p-2 text-sm font-bold"
                      type="number"
                      value={seatsPerRow}
                      onChange={(e) => setSeatsPerRow(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Row-based Price Tier Configuration */}
            <section className="space-y-4">
              <p className="font-black text-[0.7rem] uppercase tracking-widest text-primary">03. Row Assignments</p>
              <div className="bg-surface-container-lowest p-2">
                <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {Array.from({ length: rows }).map((_, rowIndex) => {
                    const assignedTier = tiers.find(t => t.id === rowAssignments[rowIndex]);
                    return (
                      <div
                        key={rowIndex}
                        onClick={() => setSelectedRow(rowIndex)}
                        className={`p-3 cursor-pointer rounded-sm transition-all border-l-4 ${selectedRow === rowIndex ? 'bg-primary/10 border-primary' : 'bg-surface-container/50 border-transparent'
                          }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase">Row {rowIndex + 1}</span>
                          <span className="text-[9px] font-black" style={{ color: assignedTier?.hex }}>
                            {assignedTier?.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <label className="block font-bold text-[0.65rem] uppercase mb-2 opacity-50 text-center">Set Tier for Row {selectedRow + 1}</label>
                <select
                  className="w-full bg-on-background text-surface border-none p-3 text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
                  value={rowAssignments[selectedRow] || 'GENERAL'}
                  onChange={(e) => setRowAssignments({ ...rowAssignments, [selectedRow]: e.target.value })}
                >
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.id}>{tier.label} - ${tier.value}</option>
                  ))}
                </select>
              </div>
            </section>
          </div>
        </aside>

        {/* Canvas Area */}
        <section className="flex-grow bg-surface relative overflow-hidden flex flex-col">
          {/* Canvas Toolbar */}
          <div className="bg-surface-container px-8 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-6 items-center">
              <span className="material-symbols-outlined opacity-30 cursor-pointer hover:opacity-100">zoom_in</span>
              <span className="material-symbols-outlined opacity-30 cursor-pointer hover:opacity-100">zoom_out</span>
              <div className="h-4 w-px bg-outline-variant/20"></div>
              <span className="material-symbols-outlined opacity-30 cursor-not-allowed">undo</span>
              <span className="material-symbols-outlined opacity-30 cursor-not-allowed">redo</span>
            </div>
            <div className="flex gap-4">
              <span className="bg-secondary/10 text-secondary px-3 py-1 font-black text-[0.6rem] tracking-widest uppercase self-center border border-secondary/20">
                Live Preview
              </span>
              <button
                onClick={handleSaveDraft}
                className="bg-blue-700 text-white px-10 py-2 font-black text-[0.7rem] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all"
              >
                Confirm & Save Draft
              </button>
            </div>
          </div>

          {/* The Grid Interface */}
          <div className="flex-grow overflow-auto p-16 bg-slate-50 dark:bg-[#ffffff] flex flex-col items-center">
            <div className="mx-auto w-fit space-y-16">
              {/* Stage Graphic */}
              <div className="w-[600px] h-12 bg-on-surface flex items-center justify-center mx-auto shadow-2xl relative">
                <div className="absolute -inset-1 bg-white opacity-5 blur-sm"></div>
                <span className="text-surface font-black tracking-[1.5em] text-xs relative">STAGE FRONTAL</span>
              </div>

              {/* Seating Grid - Dynamic Rendering */}
              <div className="flex flex-col items-center gap-6">
                <div className="flex flex-col gap-2 scale-110">
                  {Array.from({ length: rows }).map((_, rIdx) => (
                    <div key={rIdx} className="flex gap-2 items-center">
                      <span className="text-[0.6rem] font-black text-on-surface-variant w-8 text-right opacity-20">{rIdx + 1}</span>
                      <div className="flex gap-1.5">
                        {Array.from({ length: seatsPerRow }).map((_, sIdx) => (
                          <div
                            key={`${rIdx}-${sIdx}`}
                            className="w-3.5 h-3.5 cursor-pointer hover:scale-125 transition-all rounded-sm shadow-sm"
                            style={{ backgroundColor: getSeatBgHex(rIdx) }}
                            title={`Row ${rIdx + 1}, Seat ${sIdx + 1}`}
                          />
                        ))}
                      </div>
                      <span className="text-[0.6rem] font-black text-on-surface-variant w-8 text-left opacity-20">{rIdx + 1}</span>
                    </div>
                  ))}
                </div>

                {/* Footer Info Map */}
                <div className="mt-12 flex justify-between items-end w-full border-t border-outline-variant/20 pt-8">
                  <div className="space-y-1">
                    <p className="text-[0.6rem] font-black text-outline uppercase tracking-widest">Total Capacity</p>
                    <p className="text-4xl font-black tracking-tighter uppercase text-blue-700">{rows * seatsPerRow} Seats</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[0.6rem] font-black text-outline uppercase tracking-widest">Active Section</p>
                    <p className="text-xl font-black uppercase">{sectionLabel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}