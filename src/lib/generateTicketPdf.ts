import { jsPDF } from 'jspdf';

export interface TicketData {
  ticketId: string;
  eventName: string;
  sectionName: string;
  seatType: string;
  rowNumber: number;
  seatNumber: number;
  price: number;
  qrCodeData: string;
  purchaseDate: string;
  bannerUrl: string;
}

/* ── helpers ─────────────────────────────────────────────── */

/** Build the public download-page URL for a ticket (used by QR codes).
 *  Uses short keys to keep URL small → QR code scannable.
 *  Keys: i=ticketId, e=eventName, s=seatType, r=rowNumber,
 *        n=seatNumber, p=price, d=purchaseDate
 */
export function getTicketDownloadUrl(ticket: TicketData): string {
  const payload = {
    i: ticket.ticketId,
    e: ticket.eventName,
    s: ticket.seatType,
    r: ticket.rowNumber,
    n: ticket.seatNumber,
    p: ticket.price,
    d: ticket.purchaseDate,
  };
  return `${window.location.origin}/ticket/download?d=${encodeURIComponent(JSON.stringify(payload))}`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(test).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function drawDetailCard(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  label: string, value: string, valueColor = '#ffffff',
) {
  // Card bg
  roundRect(ctx, x, y, w, h, 10);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  // Border
  roundRect(ctx, x, y, w, h, 10);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Label
  ctx.font = '600 13px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(label, x + 16, y + 28);
  // Value
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.fillStyle = valueColor;
  ctx.fillText(value, x + 16, y + 58);
}

/* ── main generator ──────────────────────────────────────── */

export async function generateTicketPdf(ticket: TicketData) {
  // Canvas dimensions (maps to 210×110 mm PDF)
  const W = 1260;
  const H = 660;
  const scale = 2;

  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // Wait for fonts
  await document.fonts.ready;

  /* ── Background ── */
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '#1e293b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Decorative dots pattern (subtle)
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  for (let dx = 0; dx < W; dx += 30) {
    for (let dy = 0; dy < H; dy += 30) {
      ctx.beginPath();
      ctx.arc(dx, dy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* ── Top accent stripe ── */
  const topG = ctx.createLinearGradient(0, 0, W, 0);
  topG.addColorStop(0, '#1d4ed8');
  topG.addColorStop(1, '#3b82f6');
  ctx.fillStyle = topG;
  ctx.fillRect(0, 0, W, 14);

  /* ── Bottom accent stripe ── */
  const botG = ctx.createLinearGradient(0, 0, W, 0);
  botG.addColorStop(0, '#3b82f6');
  botG.addColorStop(1, '#1d4ed8');
  ctx.fillStyle = botG;
  ctx.fillRect(0, H - 14, W, 14);

  /* ── Dashed separator ── */
  const sepX = 880;
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sepX, 30);
  ctx.lineTo(sepX, H - 30);
  ctx.stroke();
  ctx.setLineDash([]);

  // Perforation circles at top and bottom of separator
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(sepX, 0, 18, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(sepX, H, 18, 0, Math.PI * 2); ctx.fill();

  /* ── LEFT SECTION ── */

  // Brand
  ctx.font = 'bold 22px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#1d4ed8';
  ctx.fillText('TICKETRUSH', 48, 62);

  ctx.font = '600 12px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('ELECTRONIC TICKET', 200, 62);

  // Blue accent bar next to event name
  const accentBarY = 100;
  ctx.fillStyle = '#3b82f6';
  roundRect(ctx, 48, accentBarY, 5, 56, 2);
  ctx.fill();

  // Event name
  ctx.font = 'bold 36px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  const nameLines = wrapText(ctx, ticket.eventName, sepX - 120);
  let textY = accentBarY + 30;
  for (const line of nameLines) {
    ctx.fillText(line, 68, textY);
    textY += 44;
  }

  // Purchase date
  const dateStr = new Date(
    ticket.purchaseDate + (ticket.purchaseDate.endsWith('Z') ? '' : 'Z')
  ).toLocaleString('vi-VN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
  ctx.font = '500 15px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`📅  ${dateStr}`, 48, textY + 20);

  // Detail cards
  const cardY = Math.max(textY + 60, 340);
  const cardH = 76;
  drawDetailCard(ctx, 48, cardY, 200, cardH, 'LOẠI VÉ', ticket.seatType);
  drawDetailCard(ctx, 264, cardY, 130, cardH, 'HÀNG', String(ticket.rowNumber));
  drawDetailCard(ctx, 410, cardY, 130, cardH, 'GHẾ', String(ticket.seatNumber));
  drawDetailCard(ctx, 556, cardY, 170, cardH, 'GIÁ VÉ', `$${ticket.price.toFixed(2)}`, '#3b82f6');

  // Ticket ID
  ctx.font = '500 12px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(`ID: ${ticket.ticketId}`, 48, H - 34);

  /* ── RIGHT SECTION (QR Code) ── */
  const rightCenterX = sepX + (W - sepX) / 2;

  // Label above QR
  ctx.font = 'bold 14px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('QUÉT ĐỂ VÀO CỬA', rightCenterX, 70);

  // QR Code
  const downloadUrl = getTicketDownloadUrl(ticket);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(downloadUrl)}`;

  try {
    const qrImg = await loadImage(qrApiUrl);
    const qrSize = 280;
    const qrX = rightCenterX - qrSize / 2;
    const qrY = 100;

    // White background
    roundRect(ctx, qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
  } catch {
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#ef4444';
    ctx.fillText('QR không khả dụng', rightCenterX, 250);
  }

  // Section/Seat shorthand
  ctx.font = 'bold 15px Inter, system-ui, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  ctx.fillText(
    `${ticket.seatType}  ·  Hàng ${ticket.rowNumber}  ·  Ghế ${ticket.seatNumber}`,
    rightCenterX, H - 50,
  );

  ctx.textAlign = 'start'; // reset

  /* ── Export to PDF ── */
  const imgData = canvas.toDataURL('image/png');
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [210, 110] });
  doc.addImage(imgData, 'PNG', 0, 0, 210, 110);

  const safeName = ticket.eventName.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
  doc.save(`TicketRush_${safeName}_G${ticket.seatNumber}.pdf`);
}
