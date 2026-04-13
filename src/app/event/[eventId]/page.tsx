"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function EventDetailPage() {
    const params = useParams(); // Lấy ID từ URL (ví dụ: eventId từ [eventId])
    const router = useRouter();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.eventId) {
            fetch(`http://localhost:8080/events/${params.eventId}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Event not found");
                    return res.json();
                })
                .then((data) => {
                    setEvent(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching event details:", err);
                    setLoading(false);
                });
        }
    }, [params.eventId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-blue-500 font-black text-2xl animate-pulse uppercase tracking-tighter">
                    Loading Event Data...
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-black mb-4">EVENT NOT FOUND</h1>
                <Link href="/events" className="text-blue-500 underline uppercase font-bold">Back to Directory</Link>
            </div>
        );
    }

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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ eventId: params.eventId, userId })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.status === 'ACTIVE') {
                    router.push(`/seats?eventId=${params.eventId}`);
                } else if (data.status === 'WAITING') {
                    router.push(`/queue?eventId=${params.eventId}`);
                }
            } else {
                router.push(`/seats?eventId=${params.eventId}`);
            }
        } catch (error) {
            console.error('Queue error:', error);
            router.push(`/seats?eventId=${params.eventId}`);
        }
    };

    return (
        <div className="bg-background text-on-background min-h-screen flex flex-col">
            {/* Header Điều hướng */}
            <header className="p-8 border-b-2 border-surface-variant flex justify-between items-center bg-surface">
                <Link href="/events" className="font-black text-xs uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">
                    ← Back to Events
                </Link>
                <span className="font-black text-xs uppercase tracking-widest opacity-40">TicketRush Detail View</span>
            </header>

            <main className="max-w-[1440px] mx-auto w-full p-8 md:p-16 flex flex-col lg:flex-row gap-16">
                {/* Cột trái: Banner Sự kiện */}
                <div className="flex-grow">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-none blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <img
                            src={event.bannerUrl || "https://via.placeholder.com/1200x800"}
                            alt={event.title}
                            className="relative w-full h-[500px] object-cover grayscale hover:grayscale-0 transition-all duration-700"
                        />
                    </div>

                    <div className="mt-12 space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary">About this event</h2>
                        <p className="text-lg leading-relaxed text-on-surface-variant font-medium">
                            {event.description || "No description provided for this event."}
                        </p>
                    </div>
                </div>

                {/* Cột phải: Thông tin chi tiết */}
                <aside className="w-full lg:w-[400px] flex flex-col gap-10">
                    <div>
                        <span className="bg-secondary text-on-secondary px-3 py-1 font-bold text-[10px] uppercase tracking-tighter mb-4 inline-block">
                            {event.status}
                        </span>
                        <h1 className="text-[3.5rem] font-black tracking-tighter leading-[0.95] uppercase mb-4">
                            {event.title}
                        </h1>
                        <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
                            <span>{event.category}</span>
                            <span>•</span>
                            <span>Live Experience</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="bg-surface-container-high p-6 flex flex-col gap-1 border-l-8 border-primary">
                            <span className="text-[10px] font-black text-outline uppercase">Scheduled Date</span>
                            <span className="text-xl font-bold uppercase">
                                {new Date(event.date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <span className="text-sm font-bold opacity-60">
                                {new Date(event.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        <div className="bg-surface-container-high p-6 flex flex-col gap-1 border-l-8 border-secondary">
                            <span className="text-[10px] font-black text-outline uppercase">Venue Location</span>
                            <span className="text-xl font-bold uppercase leading-tight">
                                {event.location}
                            </span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-[10px] font-black text-outline block uppercase">Price Admission</span>
                                <span className="text-4xl font-black tracking-tighter">${event.price ? event.price.toFixed(2) : "0.00"}</span>
                            </div>
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest animate-pulse">● Tickets Available</span>
                        </div>
                        <button 
                            onClick={handleProceedToBooking}
                            className="w-full bg-on-background text-surface py-6 font-black text-sm uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 shadow-2xl">
                            Proceed to Booking
                        </button>
                    </div>
                </aside>
            </main>

            {/* Footer nhỏ */}
            <footer className="mt-20 p-12 bg-slate-900 text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em]">TicketRush Precision Ticketing Engine © 2024</p>
            </footer>
        </div>
    );
}