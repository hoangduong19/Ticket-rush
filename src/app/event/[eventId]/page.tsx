"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false); // Trạng thái khi đang gọi API

    // HÀM XỬ LÝ CHÍNH: XẾP HÀNG VÀ CHUYỂN TRANG
    const handleProceedToBooking = async () => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            router.push('/login');
            return;
        }
        localStorage.setItem('queueUserId', userId);

        try {
            const res = await fetch('http://localhost:8080/queue/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Phải gửi token để xác thực
                },
                body: JSON.stringify({
                    eventId: params.eventId,
                    userId: userId
                })
            });

            if (res.ok) {
                const data = await res.json();
                // data.status có thể là ACTIVE hoặc WAITING tùy vào logic của VirtualQueueService
                if (data.status === 'ACTIVE') {
                    router.push(`/seats?eventId=${params.eventId}`);
                } else {
                    // Nếu phải đợi, chuyển sang trang queue (nếu bạn có trang đó)
                    alert("Hàng đợi đang đầy, bạn đang được xếp hàng...");
                    router.push(`/queue?eventId=${params.eventId}`);
                }
            } else {
                const err = await res.json();
                alert("Lỗi hàng đợi: " + (err.message || "Không thể tham gia"));
            }
        } catch (error) {
            console.error('Queue error:', error);
            alert("Lỗi kết nối Server!");
        } finally {
            setIsProcessing(false);
        }
    };

    // Fetch thông tin sự kiện - Giữ nguyên
    useEffect(() => {
        if (params.eventId) {
            fetch(`http://localhost:8080/events/${params.eventId}`)
                .then((res) => res.json())
                .then((data) => {
                    setEvent(data);
                    setLoading(false);
                });
        }
    }, [params.eventId]);

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-black animate-pulse">LOADING...</div>;
    if (!event) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center uppercase font-bold">Event not found</div>;

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col">
            <header className="p-8 border-b-2 border-surface-variant flex justify-between items-center bg-surface">
                <Link href="/events" className="font-black text-xs uppercase text-primary hover:opacity-70 tracking-widest">← Back to Events</Link>
                <span className="font-black text-xs uppercase opacity-40">TicketRush Detail View</span>
            </header>

            <main className="max-w-[1440px] mx-auto w-full p-8 md:p-16 flex flex-col lg:flex-row gap-16">
                <div className="flex-grow">
                    <img src={event.bannerUrl || "https://via.placeholder.com/1200x800"} alt={event.title} className="w-full h-[500px] object-cover rounded-3xl" />
                    <div className="mt-12 space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">About this event</h2>
                        <p className="text-lg leading-relaxed text-on-surface-variant font-medium">{event.description}</p>
                    </div>
                </div>

                <aside className="w-full lg:w-[400px] flex flex-col gap-10">
                    <div>
                        <span className="bg-secondary text-on-secondary px-3 py-1 font-bold text-[10px] uppercase tracking-tighter mb-4 inline-block">{event.status}</span>
                        <h1 className="text-[3.5rem] font-black tracking-tighter leading-[0.95] uppercase mb-4">{event.title}</h1>
                        <div className="text-primary font-bold uppercase text-xs tracking-widest">{event.category} • Live Experience</div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-surface-container-high p-6 border-l-8 border-primary">
                            <span className="text-[10px] font-black text-outline uppercase">Date & Time</span>
                            <p className="text-xl font-bold uppercase">{new Date(event.date).toLocaleString('vi-VN')}</p>
                        </div>
                        <div className="bg-surface-container-high p-6 border-l-8 border-secondary">
                            <span className="text-[10px] font-black text-outline uppercase">Venue Location</span>
                            <p className="text-xl font-bold uppercase">{event.location}</p>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-[10px] font-black text-outline block uppercase">Price</span>
                                <span className="text-4xl font-black tracking-tighter">${event.price ? event.price.toFixed(2) : "0.00"}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleProceedToBooking}
                            disabled={isProcessing}
                            className="w-full bg-on-background text-surface py-6 font-black text-sm uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-2xl disabled:opacity-50">
                            {isProcessing ? "Validating Queue..." : "Proceed to Booking"}
                        </button>
                    </div>
                </aside>
            </main>
        </div>
    );
}