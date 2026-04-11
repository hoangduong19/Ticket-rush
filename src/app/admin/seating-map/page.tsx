'use client';

import Link from 'next/link';
import { useState } from 'react';

const PRICE_TIERS = [
  { label: 'PLATINUM - $499.00', color: 'bg-indigo-600', hex: '#4f46e5' },
  { label: 'VIP - $249.00', color: 'bg-blue-500', hex: '#3b82f6' },
  { label: 'GENERAL - $89.00', color: 'bg-slate-500', hex: '#6b7280' },
];

export default function SeatingMapConfigurator() {
  const [rows, setRows] = useState(12);
  const [seatsPerRow, setSeatsPerRow] = useState(24);
  const [sectionLabel, setSectionLabel] = useState('VIP NORTH');
  const [selectedRow, setSelectedRow] = useState(0);
  const [rowPriceTiers, setRowPriceTiers] = useState<{[key: number]: string}>({
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

  // Generate seat matrix with status
  const generateSeatMatrix = () => {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < seatsPerRow; j++) {
        // Varied seat statuses for visualization
        let status = 'available'; // tertiary color
        if (Math.random() > 0.7) status = 'reserved'; // secondary color
        if (Math.random() > 0.85) status = 'disabled'; // surface-dim color
        
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

  const getSeatBgHex = (status: string, rowIndex: number) => {
    // if (status === 'reserved') return '#ef4444'; // red-500
    // if (status === 'disabled') return '#9ca3af'; // gray-400

    // Available seat color based on row price tier
    const tier = rowPriceTiers[rowIndex] || 'GENERAL - $89.00';
    const tierConfig = PRICE_TIERS.find(t => t.label === tier);
    return tierConfig?.hex || '#6b7280';
  };

  const getSeatStyle = (status: string, rowIndex: number) => ({
    backgroundColor: getSeatBgHex(status, rowIndex),
  });

  const updateRowPriceTier = (row: number, tier: string) => {
    setRowPriceTiers({
      ...rowPriceTiers,
      [row]: tier,
    });
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      {/* TopNavBar */}
      <header className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 z-50">
        <div className="flex justify-between items-center px-8 py-6 w-full max-w-none">
          <div className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500">TicketRush</div>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/admin" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase">Dashboard</Link>
            <Link href="/admin/monitor" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] tracking-tight uppercase">Live Monitor</Link>
            <Link href="/admin/analytics" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase">Analytics</Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <input
                className="bg-surface-container-high border-none px-4 py-2 text-sm w-64 focus:ring-0 focus:outline-none focus:border-b-2 border-transparent focus:border-primary transition-colors"
                placeholder="Search venues..."
                type="text"
              />
            </div>
            <button className="material-symbols-outlined text-slate-900 dark:text-slate-100">account_circle</button>
          </div>
        </div>
        <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      </header>

      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-full md:w-80 bg-surface-container-low flex flex-col shrink-0">
          {/* Tool Header */}
          <div className="p-6 bg-surface-container-highest">
            <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant mb-2">MAP CONFIGURATOR</p>
            <h1 className="text-xl font-bold tracking-tight">ARENA_SEATING_V4</h1>
          </div>
          <div className="p-6 space-y-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Tool Palette */}
            <section>
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant mb-4">Placement Tools</p>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-primary text-on-primary p-4 flex flex-col items-center gap-2 hover:bg-primary-dim transition-colors">
                  <span className="material-symbols-outlined">add_box</span>
                  <span className="font-bold text-[0.75rem] uppercase">Add Section</span>
                </button>
                <button className="bg-surface-container-lowest text-on-surface p-4 flex flex-col items-center gap-2 hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined">grid_view</span>
                  <span className="font-bold text-[0.75rem] uppercase">Mass Edit</span>
                </button>
              </div>
            </section>

            {/* Section Properties */}
            <section className="space-y-4">
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant">Section Detail</p>
              <div className="bg-surface-container-lowest p-4 space-y-4">
                <div>
                  <label className="block font-bold text-[0.65rem] uppercase mb-1">Section Label</label>
                  <input
                    className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
                    type="text"
                    value={sectionLabel}
                    onChange={(e) => setSectionLabel(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[0.65rem] uppercase mb-1">Rows</label>
                    <input
                      className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
                      type="number"
                      value={rows}
                      onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[0.65rem] uppercase mb-1">Seats/Row</label>
                    <input
                      className="w-full bg-surface-container-high border-none p-2 text-sm focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-primary transition-colors"
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
              <p className="font-bold text-[0.75rem] uppercase tracking-widest text-on-surface-variant">Configure Row Pricing</p>
              <div className="bg-surface-container-lowest p-3 space-y-2">
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div
                      key={rowIndex}
                      onClick={() => setSelectedRow(rowIndex)}
                      className={`p-2 cursor-pointer rounded-sm transition-colors border-l-4 ${
                        selectedRow === rowIndex
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
                <div className="mt-3 pt-3 border-t border-outline-variant space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span className="text-[0.75rem] font-bold uppercase">Reserved/Sold</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gray-400"></div>
                    <span className="text-[0.75rem] font-bold uppercase">Disabled</span>
                  </div>
                </div>
              </div>
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
              <button className="bg-surface-container-lowest px-4 py-2 font-bold text-[0.75rem] uppercase border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors">Save Draft</button>
            </div>
          </div>

          {/* The Grid Interface */}
          <div className="flex-grow overflow-auto p-12 bg-surface cursor-crosshair">
            {/* Mockup Seating Layout */}
            <div className="mx-auto w-fit space-y-12">
              {/* Stage Graphic */}
              <div className="w-[600px] h-20 bg-on-surface flex items-center justify-center mx-auto">
                <span className="text-surface font-black tracking-[0.5em] text-xl">STAGE</span>
              </div>

              {/* Seating Grid - Dynamic Rendering */}
              <div className="flex flex-col items-center gap-4">
                {/* Section Label */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[0.65rem] font-bold text-primary uppercase">
                  Section {sectionLabel}
                </div>
                
                {/* Dynamic Seat Matrix */}
                <div className="flex flex-col gap-2">
                  {seatMatrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-1 items-center">
                      <span className="text-[0.6rem] font-bold text-on-surface-variant w-8 text-right">{rowIndex + 1}</span>
                      <div className="flex gap-1">
                        {row.map((seat) => (
                          <div
                            key={seat.id}
                            className="w-4 h-4 cursor-pointer hover:brightness-110 transition-all rounded-sm"
                            style={getSeatStyle(seat.status, rowIndex)}
                            title={`Row ${seat.row + 1}, Seat ${seat.seat + 1} - ${seat.status} - ${rowPriceTiers[rowIndex] || 'GENERAL - $89.00'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Seat Count Info */}
                <div className="text-[0.7rem] font-bold text-on-surface-variant uppercase mt-4 space-y-2">
                  <div>Total Seats: {rows} rows × {seatsPerRow} seats = {rows * seatsPerRow}</div>
                  <div className="bg-surface-container-lowest p-3 rounded space-y-1">
                    {PRICE_TIERS.map((tier) => {
                      const tierRows = Object.entries(rowPriceTiers)
                        .filter(([_, tierName]) => tierName === tier.label)
                        .length;
                      return tierRows > 0 ? (
                        <div key={tier.label} className="flex justify-between items-center text-[0.65rem]">
                          <span>{tier.label}</span>
                          <span className={`px-2 py-1 rounded text-white ${tier.color}`}>
                            {tierRows} rows × {seatsPerRow} = {tierRows * seatsPerRow}
                          </span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Zoom / Position Metadata */}
          <div className="absolute bottom-6 right-6 bg-surface-container-highest p-4 font-['Inter'] text-[0.7rem] font-bold uppercase tracking-widest flex gap-8">
            <div>X: 1,422px</div>
            <div>Y: 980px</div>
            <div className="text-primary">ZOOM: 125%</div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-black w-full shrink-0 mt-auto">
        <div className="bg-blue-600 h-2 w-full"></div>
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-12 w-full gap-8">
          <div className="text-lg font-black text-white">TICKETRUSH</div>
          <div className="flex gap-8">
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Support</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Terms</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Privacy</Link>
            <Link href="#" className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">Careers</Link>
          </div>
          <p className="font-['Inter'] font-bold text-xs uppercase tracking-widest text-slate-400">© 2024 TICKETRUSH. ARCHITECTURAL PRECISION IN TICKETING.</p>
        </div>
      </footer>
    </div>
  );
}
