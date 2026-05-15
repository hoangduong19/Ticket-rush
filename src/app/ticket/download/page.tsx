"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { generateTicketPdf, type TicketData } from '@/lib/generateTicketPdf';

function DownloadContent() {
  const searchParams = useSearchParams();
  const [ticket, setTicket] = useState<TicketData | null>(null);
  const [error, setError] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    try {
      // Support both short-key format (?d=) and old long-key format (?data=)
      const raw = searchParams.get('d') || searchParams.get('data');
      if (!raw) { setError(true); return; }
      const parsed = JSON.parse(raw);

      // Map short keys to full TicketData
      const mapped: TicketData = parsed.ticketId ? parsed : {
        ticketId: parsed.i || '',
        eventName: parsed.e || '',
        sectionName: '',
        seatType: parsed.s || '',
        rowNumber: parsed.r || 0,
        seatNumber: parsed.n || 0,
        price: parsed.p || 0,
        qrCodeData: '',
        purchaseDate: parsed.d || '',
        bannerUrl: parsed.b || '',
      };
      if (!mapped.ticketId) { setError(true); return; }
      setTicket(mapped);
    } catch {
      setError(true);
    }
  }, [searchParams]);

  const handleDownload = async () => {
    if (!ticket) return;
    setDownloading(true);
    try {
      await generateTicketPdf(ticket);
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setDownloading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-[64px] text-red-400 mb-4 block">error</span>
          <h1 className="text-2xl font-bold text-white mb-2">Vé không hợp lệ</h1>
          <p className="text-slate-400 mb-8">Mã QR không chứa thông tin vé hợp lệ. Vui lòng thử lại.</p>
          <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold text-sm uppercase tracking-widest transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Đang tải thông tin vé...</p>
        </div>
      </div>
    );
  }

  const dateStr = new Date(
    ticket.purchaseDate + (ticket.purchaseDate.endsWith('Z') ? '' : 'Z')
  ).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter text-blue-500 uppercase">
            TicketRush
          </Link>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Electronic Ticket</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Ticket Card */}
          <div className="bg-slate-900 border border-slate-800 overflow-hidden">
            {/* Banner */}
            {ticket.bannerUrl && (
              <div className="h-48 overflow-hidden">
                <img
                  src={ticket.bannerUrl}
                  alt={ticket.eventName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Event Name */}
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                {ticket.eventName}
              </h1>
              <p className="text-sm text-slate-400 font-medium mb-8">
                📅 {dateStr}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                <div className="bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Loại vé</p>
                  <p className="text-base font-bold text-white">{ticket.seatType}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Hàng</p>
                  <p className="text-base font-bold text-white">{ticket.rowNumber}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Ghế</p>
                  <p className="text-base font-bold text-white">{ticket.seatNumber}</p>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 p-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Giá vé</p>
                  <p className="text-base font-bold text-blue-400">${ticket.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Ticket ID */}
              <p className="text-xs text-slate-600 font-mono mb-8 break-all">
                ID: {ticket.ticketId}
              </p>

              {/* Download Button */}
              <button
                id="download-pdf-btn"
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-4 text-sm font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-wait"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {downloading ? 'hourglass_top' : 'download'}
                </span>
                {downloading ? 'Đang tạo PDF...' : 'Tải vé PDF'}
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-600 mt-6">
            Xuất trình vé này (bản in hoặc trên điện thoại) tại cổng vào sự kiện.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function TicketDownloadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DownloadContent />
    </Suspense>
  );
}
