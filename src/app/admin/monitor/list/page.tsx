"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

interface Event {
    eventId: string;
    title: string;
    date: string;
    location: string;
    category: string;
    status: string;
}

export default function MonitorSelector() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 1. CẬP NHẬT STATE TOAST: Thêm onConfirm
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning';
        onConfirm?: () => void; // Hàm sẽ chạy khi nhấn Confirm
    } | null>(null);

    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = () => {
        fetch(`${API_BASE}/events`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch events", err);
                setLoading(false);
            });
    };

    // --- HÀM THỰC THI XÓA THẬT SỰ ---
    // --- HÀM THỰC THI XÓA THẬT SỰ ---
    const executeDelete = async (eventId: string) => {
        try {
            const res = await fetch(`${API_BASE}/admin/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (res.ok) {
                // 1. Cập nhật danh sách hiển thị (Xóa sự kiện khỏi mảng)
                setEvents(prev => prev.filter(ev => ev.eventId !== eventId));

                // 2. HIỆN THÔNG BÁO THÀNH CÔNG
                // Gọi hàm showToast để hiện thông báo xanh lá trong 3.5 giây
                showToast("EVENT DELETED SUCCESSFULLY", 'success');

            } else {
                // Nếu server trả lỗi (ví dụ lỗi 500 do ràng buộc dữ liệu)
                showToast("Termination failed: Data integrity violation.", 'error');
            }
        } catch (err) {
            showToast("Network error: Could not reach server.", 'error');
        }
        // Lưu ý: Không cần setToast(null) ở đây vì showToast đã lo việc tự đóng
    };

    // --- 2. SỬA HÀM HANDLE DELETE: Gọi Toast thay vì confirm() ---
    const handleDelete = (e: React.MouseEvent, eventId: string, title: string) => {
        e.stopPropagation();

        setToast({
            message: `Are you sure you want to remove: "${title.toUpperCase()}"?`,
            type: 'warning',
            onConfirm: () => executeDelete(eventId) // Truyền hàm xóa vào đây
        });
    };

    const handleEdit = (e: React.MouseEvent, eventId: string) => {
        e.stopPropagation();
        router.push(`/admin/events/edit/${eventId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-primary flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]">
                Initializing Monitor Hub...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-on-background font-body">
            {/* TopNavBar - Giữ nguyên */}
            <header className="bg-slate-50 dark:bg-slate-950 w-full px-8 py-6 border-b-2 border-surface-container-high sticky top-0 z-40">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <span className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500 uppercase">TicketRush</span>
                        <nav className="flex gap-6 uppercase text-[10px] font-black tracking-widest opacity-60">
                            <Link href="/admin">Dashboard</Link>
                            <span className="text-blue-600">Event Manager</span>
                        </nav>
                    </div>
                    <button className="material-symbols-outlined text-3xl">account_circle</button>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-8 md:p-16">
                <header className="mb-16">
                    <span className="bg-secondary text-on-secondary px-3 py-1 font-bold text-[10px] uppercase tracking-widest mb-4 inline-block">Control Registry</span>
                    <h1 className="text-[4rem] font-extrabold leading-[0.9] tracking-tighter uppercase mb-4">
                        Manage<br />Live Events.
                    </h1>
                </header>

                <div className="grid grid-cols-1 gap-2 bg-surface-container">
                    {events.map((event) => (
                        <div
                            key={event.eventId}
                            className="group bg-surface-container-lowest p-8 flex flex-col md:flex-row justify-between items-center hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer border-b border-surface-container"
                            onClick={() => router.push(`/admin/monitor?eventId=${event.eventId}`)}
                        >
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{event.category}</span>
                                    <span className="text-[10px] font-bold opacity-30 italic">{event.eventId.substring(0, 8)}</span>
                                </div>
                                <h2 className="text-2xl font-black tracking-tighter uppercase mt-1 group-hover:text-blue-600 transition-colors">
                                    {event.title}
                                </h2>
                                <p className="text-[10px] font-bold uppercase opacity-50 tracking-widest mt-2">
                                    📍 {event.location} • 📅 {new Date(event.date).toLocaleDateString('vi-VN')}
                                </p>
                            </div>

                            <div className="mt-8 md:mt-0 flex items-center gap-2">
                                <div className="text-right mr-6 hidden xl:block">
                                    <p className="text-[8px] font-black opacity-30 uppercase mb-1">Current Status</p>
                                    <p className="text-xs font-black text-green-500 uppercase">{event.status}</p>
                                </div>

                                <button className="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-on-surface hover:bg-primary hover:text-white transition-all">
                                    <span className="material-symbols-outlined text-xl">analytics</span>
                                </button>

                                <button
                                    onClick={(e) => handleEdit(e, event.eventId)}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-on-surface hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    <span className="material-symbols-outlined text-xl">edit</span>
                                </button>

                                <button
                                    onClick={(e) => handleDelete(e, event.eventId, event.title)}
                                    className="w-12 h-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-red-500 hover:bg-red-600 hover:text-white transition-all"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* 3. CẬP NHẬT GIAO DIỆN TOAST (Thêm nút bấm cho phần xác nhận) */}
            {toast && (
                <div
                    className={`fixed bottom-8 right-8 z-[9999] flex flex-col gap-4 px-6 py-5 shadow-2xl border-l-4 bg-white dark:bg-slate-900 ${toast.type === 'success' ? 'border-green-500' :
                        toast.type === 'warning' ? 'border-amber-500' :
                            'border-red-500'
                        }`}
                    style={{ minWidth: 320, maxWidth: 450 }}
                >
                    <div className="flex items-center gap-4">
                        <span className={`material-symbols-outlined text-2xl ${toast.type === 'success' ? 'text-green-500' :
                            toast.type === 'warning' ? 'text-amber-500' :
                                'text-red-500'
                            }`}>
                            {toast.type === 'success' ? 'check_circle' : toast.type === 'warning' ? 'report_problem' : 'error'}
                        </span>
                        <span className="text-slate-800 dark:text-slate-100 text-sm font-black tracking-tight uppercase flex-1">
                            {toast.message}
                        </span>
                    </div>

                    {/* NẾU LÀ TOAST XÁC NHẬN (CÓ ONCONFIRM) THÌ HIỆN NÚT BẤM */}
                    {toast.onConfirm ? (
                        <div className="flex gap-2 justify-end mt-2">
                            <button
                                onClick={() => setToast(null)}
                                className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={toast.onConfirm}
                                className="px-6 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-red-700 transition-colors"
                            >
                                Confirm Delete
                            </button>
                        </div>
                    ) : (
                        // Nếu là toast thông báo thường thì hiện nút đóng
                        <button onClick={() => setToast(null)} className="absolute top-2 right-2 text-slate-400">
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}