'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const DEFAULT_TIERS = [
    { id: 'PLATINUM', label: 'PLATINUM', value: 499.00, hex: '#4f46e5', color: 'bg-indigo-600' },
    { id: 'VIP', label: 'VIP', value: 249.00, hex: '#3b82f6', color: 'bg-blue-500' },
    { id: 'GENERAL', label: 'GENERAL', value: 89.00, hex: '#6b7280', color: 'bg-slate-500' },
];

export default function EditEvent() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId;

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // --- 1. STATE THÔNG TIN SỰ KIỆN ---
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        category: 'MUSIC',
        bannerUrl: ''
    });

    // --- 2. STATE SƠ ĐỒ GHẾ ---
    const [rows, setRows] = useState(12);
    const [seatsPerRow, setSeatsPerRow] = useState(24);
    const [sectionLabel, setSectionLabel] = useState('MAIN SECTION');
    const [selectedRow, setSelectedRow] = useState(0);
    const [tiers, setTiers] = useState(DEFAULT_TIERS);
    const [rowAssignments, setRowAssignments] = useState<{ [key: number]: string }>({});

    // --- 3. LOAD DỮ LIỆU CŨ TỪ DATABASE ---
    useEffect(() => {
        if (!eventId) return;

        const fetchData = async () => {
            try {
                // Fetch thông tin Event
                const eventRes = await fetch(`${API_BASE}/events/${eventId}`);
                const event = await eventRes.json();

                // Fetch thông tin Ghế để tái tạo sơ đồ
                const seatRes = await fetch(`${API_BASE}/events/${eventId}/seats`);
                const seats = await seatRes.json();

                if (eventRes.ok) {
                    const formattedDate = event.date ? event.date.substring(0, 16) : '';
                    setEventData({
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        date: formattedDate,
                        category: event.category,
                        bannerUrl: event.bannerUrl
                    });
                    setPreviewUrl(event.bannerUrl);
                }

                if (seatRes.ok && Array.isArray(seats) && seats.length > 0) {
                    // Tự động nhận diện số hàng và số cột lớn nhất
                    const maxR = Math.max(...seats.map((s: any) => s.rowNumber));
                    const maxS = Math.max(...seats.map((s: any) => s.seatNumber));
                    setRows(maxR);
                    setSeatsPerRow(maxS);
                    setSectionLabel(seats[0].sectionName || 'MAIN SECTION');

                    // Tái tạo lại bảng gán giá tiền cho từng hàng
                    const assignments: any = {};
                    for (let i = 0; i < maxR; i++) {
                        const sampleSeatInRow = seats.find((s: any) => s.rowNumber === i + 1);
                        assignments[i] = sampleSeatInRow?.seatType || 'GENERAL';
                    }
                    setRowAssignments(assignments);

                    // Tạo lại danh sách tiers từ các loại ghế thực tế
                    const uniqueTypes = Array.from(new Set(Object.values(assignments)));
                    const updatedTiers = uniqueTypes.map((type: any, index) => {
                        const sample = seats.find((s: any) => s.seatType === type);
                        const baseConfig = DEFAULT_TIERS[index % DEFAULT_TIERS.length];
                        return {
                            id: type,
                            label: type,
                            value: (sample?.price != null && !isNaN(Number(sample.price)))
                                ? Number(sample.price)
                                : baseConfig.value,
                            hex: baseConfig.hex,
                            color: baseConfig.color
                        };
                    });

                    // Nếu thiếu tier so với mặc định, thêm vào cho đủ 3 (tùy chọn)
                    if (updatedTiers.length < DEFAULT_TIERS.length) {
                        for (let i = updatedTiers.length; i < DEFAULT_TIERS.length; i++) {
                            updatedTiers.push({ ...DEFAULT_TIERS[i], id: DEFAULT_TIERS[i].id + '_' + i });
                        }
                    }

                    setTiers(updatedTiers);
                }
            } catch (err) {
                console.error("Error loading data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [eventId]);

    const handleInputChange = (field: string, value: string) => {
        setEventData({ ...eventData, [field]: value });
    };

    const handleTierPriceChange = (id: string, newValue: number) => {
        setTiers(tiers.map(t => t.id === id ? { ...t, value: newValue } : t));
    };

    const handleTierLabelChange = (id: string, newLabel: string) => {
        setTiers(tiers.map(t => t.id === id ? { ...t, label: newLabel } : t));
    };

    const getSeatBgHex = (rIdx: number) => {
        const tierId = rowAssignments[rIdx] || 'GENERAL';
        return tiers.find(t => t.id === tierId)?.hex || '#6b7280';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 1. Lưu file thật để gửi lên server khi nhấn Save
            setSelectedFile(file);

            // 2. Tạo đường dẫn tạm thời để hiển thị ảnh ngay trên màn hình (Preview)
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);

            // Lưu ý: Giải phóng bộ nhớ khi component bị unmount (optional nhưng nên có)
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    // --- 4. XỬ LÝ CẬP NHẬT TỔNG THỂ ---
    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const formData = new FormData();

            // 1. Dữ liệu sự kiện
            formData.append('event', new Blob([JSON.stringify(eventData)], { type: 'application/json' }));

            // 2. Dữ liệu ma trận ghế (từ các state rows, seatsPerRow, rowAssignments ở trang edit)
            const rowConfigs = Array.from({ length: rows }).map((_, index) => {
                const tierId = rowAssignments[index];
                const tierObj = tiers.find(t => t.id === tierId);
                return {
                    rowNumber: index + 1,
                    price: tierObj ? (isNaN(tierObj.value) ? 0 : tierObj.value) : 89.00,
                    seatType: tierObj ? tierObj.id : 'GENERAL'
                };
            });
            const seatingPayload = {
                sectionLabel,
                seatsPerRow,
                rowConfigs
            };
            formData.append('seating', new Blob([JSON.stringify(seatingPayload)], { type: 'application/json' }));

            // 3. File ảnh (nếu có)
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const res = await fetch(`${API_BASE}/admin/events/${eventId}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
                body: formData,
            });

            if (res.ok) {
                alert("Cập nhật thành công cả thông tin và sơ đồ ghế!");
                router.push('/admin/monitor/list');
            } else {
                const errorData = await res.json().catch(() => null);
                alert(`Cập nhật thất bại: ${errorData?.message ?? res.status}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-primary flex items-center justify-center font-black animate-pulse uppercase">Syncing Data Node...</div>;

    return (
        <div className="bg-background text-on-background min-h-screen font-['Inter']">
            {/* Nav Bar */}
            <nav className="bg-slate-50 w-full p-6 border-b-2 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <span className="text-2xl font-black italic text-blue-700">TicketRush</span>
                    <Link href="/admin/monitor/list" className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">← Back to List</Link>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto px-8 py-12">
                <header className="mb-16 flex justify-between items-end">
                    <div>
                        <span className="bg-blue-600 text-white px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Editor Mode</span>
                        <h1 className="text-[3.5rem] font-extrabold leading-none tracking-tighter uppercase">Edit Event</h1>
                    </div>
                    <button
                        onClick={handleUpdate}
                        disabled={updating}
                        className="bg-primary text-on-primary px-16 py-5 font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 shadow-2xl"
                    >
                        {updating ? "Processing..." : "Confirm & Save Changes"}
                    </button>
                </header>

                {/* --- GRID CHÍNH --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-surface-container border">

                    {/* PHẦN 1: THÔNG TIN CƠ BẢN (TRÁI) */}
                    <section className="lg:col-span-4 bg-surface-container-lowest p-10 space-y-10 border-r">
                        <h2 className="text-xs font-black text-primary uppercase tracking-widest">01. Identity & Details</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-[0.75rem] font-bold uppercase tracking-widest pt-0">Event Identity</p>
                                <input className="w-full bg-slate-100 p-4 text-xl font-bold uppercase outline-none focus:ring-1 ring-primary"
                                    value={eventData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Title" />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[0.75rem] font-bold uppercase tracking-widest pt-0">Event Date & Time</p>
                                <input type="datetime-local" className="w-full bg-slate-100 p-4 font-bold outline-none"
                                    value={eventData.date} onChange={e => handleInputChange('date', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[0.75rem] font-bold uppercase tracking-widest pt-0">Event Location</p>
                                <input className="w-full bg-slate-100 p-4 font-bold outline-none"
                                    value={eventData.location} onChange={e => handleInputChange('location', e.target.value)} placeholder="Location" />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[0.75rem] font-bold uppercase tracking-widest pt-0">Event Description</p>
                                <textarea className="w-full bg-slate-100 p-4 h-40 resize-none outline-none"
                                    value={eventData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Description" />
                            </div>
                        </div>
                    </section>

                    {/* PHẦN 2: CẤU HÌNH GHẾ & GIÁ (GIỮA) */}
                    <section className="lg:col-span-3 bg-surface-container-low p-8 border-r">
                        <h2 className="text-xs font-black text-secondary uppercase tracking-widest mb-8">02. Tier & Matrix</h2>

                        {/* Sửa giá */}
                        <div className="space-y-3 mb-8">
                            <p className="text-[0.75rem] font-bold uppercase tracking-widest pt-0">Price Settings</p>
                            {tiers.map(tier => (
                                <div key={tier.id} className="bg-white p-3 border border-outline-variant/20" style={{ borderColor: "#000000", border: "1px solid black" }}>
                                    <input type="text" className="w-full bg-transparent text-[9px] font-bold uppercase opacity-50 outline-none mb-1"
                                        value={tier.label} onChange={e => handleTierLabelChange(tier.id, e.target.value)} placeholder="Tier Name" />
                                    <input type="number" className="w-full bg-transparent font-black text-lg outline-none"
                                        value={tier.value}
                                        onChange={e => {
                                            const val = parseFloat(e.target.value);
                                            if (!isNaN(val) && val >= 0) handleTierPriceChange(tier.id, val);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Sửa kích thước */}
                        <p className="text-[0.75rem] font-bold uppercase tracking-widest pt-0 pb-3">Seat Matrix Settings</p>
                        <div className="grid grid-cols-2 gap-2 mb-8">
                            <div className="flex flex-col gap-1">
                                <p className="text-[9px] font-bold uppercase opacity-50">Rows</p>
                                <input
                                    type="number"
                                    className="w-full bg-white p-3 font-bold text-sm"
                                    value={rows}
                                    onChange={e => {
                                        const newRows = Number(e.target.value);
                                        setRows(newRows);
                                        // Gán GENERAL mặc định cho các hàng mới chưa có assignment
                                        const newAssignments = { ...rowAssignments };
                                        for (let i = 0; i < newRows; i++) {
                                            if (!newAssignments[i]) newAssignments[i] = 'GENERAL';
                                        }
                                        setRowAssignments(newAssignments);
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-[9px] font-bold uppercase opacity-50">Seats per row</p>
                                <input type="number" className="w-full bg-white p-3 font-bold text-sm" value={seatsPerRow} onChange={e => setSeatsPerRow(Number(e.target.value))} />
                            </div>
                        </div>

                        {/* Gán hàng */}
                        <p className="text-[0.75rem] font-bold uppercase tracking-widest pt-0 pb-3">Seat Tiers Settings</p>
                        <div className="max-h-40 overflow-y-auto space-y-1 mb-4" style={{ backgroundColor: "white", borderColor: "#000000", border: "1px solid black" }}>
                            {Array.from({ length: rows }).map((_, i) => (
                                <div key={i} onClick={() => setSelectedRow(i)} className={`p-2 cursor-pointer flex justify-between items-center text-[9px] font-bold border-l-4 ${selectedRow === i ? 'bg-primary/10 border-primary' : 'border-transparent'}`}>
                                    <span>ROW {i + 1}</span>
                                    <span style={{ color: tiers.find(t => t.id === rowAssignments[i])?.hex }}>{rowAssignments[i]}</span>
                                </div>
                            ))}
                        </div>
                        <select className="w-full bg-slate-900 text-white p-3 font-bold text-xs uppercase"
                            value={rowAssignments[selectedRow]} onChange={e => setRowAssignments({ ...rowAssignments, [selectedRow]: e.target.value })}>
                            {tiers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </section>

                    {/* PHẦN 3: VISUAL PREVIEW (PHẢI) */}
                    <section className="lg:col-span-5 bg-white p-10 flex flex-col items-center overflow-auto min-h-[500px]">
                        <h2 className="text-xs font-black text-outline uppercase tracking-widest mb-12 self-start">03. Seating Preview</h2>

                        <div className="w-full h-8 bg-on-surface flex items-center justify-center mb-12 shadow-md">
                            <span className="text-surface font-black tracking-[1em] text-[10px]">STAGE</span>
                        </div>

                        <div className="flex flex-col gap-1.5 scale-90 origin-top">
                            {Array.from({ length: rows }).map((_, r) => (
                                <div key={r} className="flex gap-1 items-center">
                                    <span className="w-4 text-[7px] font-bold opacity-20">{r + 1}</span>
                                    <div className="flex gap-1">
                                        {Array.from({ length: seatsPerRow }).map((_, s) => (
                                            <div key={s} className="w-3 h-3 rounded-sm transition-colors"
                                                style={{ backgroundColor: getSeatBgHex(r) }} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Banner Upload Mini */}
                        <div className="mt-auto w-full pt-10 border-t border-slate-100">
                            <label className="cursor-pointer group flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg border-2 border-dashed overflow-hidden relative">
                                    {previewUrl ? <img src={previewUrl} className="object-cover w-full h-full" /> : <span className="material-symbols-outlined text-xs">add_a_photo</span>}
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase">Update Banner Asset</p>
                                    <p className="text-[8px] opacity-40 uppercase">Click to browse file</p>
                                </div>
                            </label>
                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}