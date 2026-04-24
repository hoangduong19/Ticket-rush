"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

    useEffect(() => {
        // Gọi API lấy danh sách sự kiện
        fetch('http://localhost:8080/events')
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch events", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-primary flex items-center justify-center font-black animate-pulse uppercase tracking-[0.5em]">
                Initializing Monitor Hub...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-on-background font-body">
            {/* TopNavBar */}
            <header className="bg-slate-50 dark:bg-slate-950 w-full px-8 py-6 border-b-2 border-surface-container-high sticky top-0 z-50">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <span className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500 uppercase">TicketRush</span>
                        <nav className="flex gap-6 uppercase text-[10px] font-black tracking-widest opacity-60">
                            <Link href="/admin">Dashboard</Link>
                            <span className="text-blue-600">Live Monitor Selector</span>
                        </nav>
                    </div>
                    <button className="material-symbols-outlined text-3xl">account_circle</button>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-8 md:p-16">
                <header className="mb-16">
                    <span className="bg-secondary text-on-secondary px-3 py-1 font-bold text-[10px] uppercase tracking-widest mb-4 inline-block">System Control</span>
                    <h1 className="text-[4rem] font-extrabold leading-[0.9] tracking-tighter uppercase mb-4">
                        Select Event<br />To Monitor.
                    </h1>
                    <p className="text-on-surface-variant font-medium uppercase text-xs tracking-widest opacity-60">
                        Choose an active event stream to view real-time seating and revenue analytics.
                    </p>
                </header>

                {/* Danh sách sự kiện */}
                <div className="grid grid-cols-1 gap-4">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div
                                key={event.eventId}
                                className="group bg-surface-container-lowest border border-surface-container-high p-8 flex flex-col md:flex-row justify-between items-center hover:bg-on-background hover:text-surface transition-all duration-300 cursor-pointer shadow-sm"
                                onClick={() => router.push(`/admin/monitor?eventId=${event.eventId}`)}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-widest group-hover:text-secondary transition-colors">
                                            {event.category}
                                        </span>
                                        <span className="h-[1px] w-8 bg-outline-variant/30"></span>
                                        <span className="text-[10px] font-bold opacity-40 italic">{event.eventId.substring(0, 8)}...</span>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase leading-none mt-2">
                                        {event.title}
                                    </h2>
                                    <div className="flex gap-4 mt-4 text-[10px] font-bold uppercase opacity-60 tracking-widest">
                                        <span>📍 {event.location}</span>
                                        <span>📅 {new Date(event.date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>

                                <div className="mt-8 md:mt-0 flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-[9px] font-black opacity-40 uppercase">Status</p>
                                        <p className="text-sm font-black text-green-500">{event.status}</p>
                                    </div>
                                    <button className="bg-primary text-white p-4 rounded-none group-hover:bg-secondary group-hover:text-on-secondary transition-all">
                                        <span className="material-symbols-outlined">analytics</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center border-2 border-dashed border-surface-container-high">
                            <p className="font-black text-outline-variant uppercase tracking-widest opacity-30 text-xl">No Events Found in Database</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="p-12 text-center opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">TicketRush Intelligence Platform Hub</p>
            </footer>
        </div>
    );
}