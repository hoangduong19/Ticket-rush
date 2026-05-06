'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export default function EditEvent() {
    const router = useRouter();
    const params = useParams();
    const eventId = params.eventId;

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        category: 'MUSIC',
        bannerUrl: ''
    });

    // 1. LOAD DỮ LIỆU CŨ TỪ DATABASE
    useEffect(() => {
        if (!eventId) return;

        fetch(`${API_BASE}/events/${eventId}`)
            .then(res => res.json())
            .then(data => {
                // Format lại ngày tháng cho đúng định dạng input datetime-local
                const formattedDate = data.date ? data.date.substring(0, 16) : '';
                setEventData({
                    title: data.title,
                    description: data.description,
                    location: data.location,
                    date: formattedDate,
                    category: data.category,
                    bannerUrl: data.bannerUrl
                });
                setPreviewUrl(data.bannerUrl);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [eventId]);

    const handleInputChange = (field: string, value: string) => {
        setEventData({ ...eventData, [field]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // 2. XỬ LÝ CẬP NHẬT
    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const formData = new FormData();
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const eventBlob = new Blob([JSON.stringify(eventData)], { type: 'application/json' });
            formData.append('event', eventBlob);

            const res = await fetch(`${API_BASE}/admin/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: formData,
            });

            if (res.ok) {
                alert("Event updated successfully!");
                router.push('/admin/monitor/list');
            } else {
                alert("Update failed.");
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
            <nav className="bg-slate-50 dark:bg-slate-950 w-full p-6 border-b-2 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <span className="text-2xl font-black italic text-blue-700">TicketRush</span>
                    <Link href="/admin/monitor/list" className="text-[10px] font-black uppercase tracking-widest opacity-50 hover:opacity-100">← Back to List</Link>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-8 py-12">
                <header className="mb-16 flex justify-between items-end">
                    <div>
                        <span className="bg-blue-600 text-white px-3 py-1 font-bold text-xs uppercase tracking-widest mb-4 inline-block">Editor Mode</span>
                        <h1 className="text-[3.5rem] font-extrabold leading-none tracking-tighter uppercase">Edit Event</h1>
                        <p className="text-outline text-xs font-bold mt-2">UUID: {eventId}</p>
                    </div>
                    <button
                        onClick={handleUpdate}
                        disabled={updating}
                        className="bg-primary text-on-primary px-16 py-5 font-black uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-50 shadow-2xl"
                    >
                        {updating ? "Updating..." : "Save Changes"}
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 bg-surface-container border">
                    {/* Cột trái: Form nhập liệu */}
                    <section className="md:col-span-8 bg-surface-container-lowest p-12 space-y-12">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-outline uppercase tracking-widest">Event Identity</label>
                            <input
                                className="w-full text-2xl font-bold bg-surface-container-high p-4 outline-none border-b-2 border-transparent focus:border-primary uppercase"
                                value={eventData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-outline uppercase tracking-widest">Date & Time</label>
                                <input type="datetime-local" className="w-full font-bold bg-surface-container-high p-4 outline-none"
                                    value={eventData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-outline uppercase tracking-widest">Category</label>
                                <select className="w-full font-bold bg-surface-container-high p-4 outline-none"
                                    value={eventData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                >
                                    <option value="MUSIC">MUSIC</option>
                                    <option value="SPORT">SPORT</option>
                                    <option value="THEATER">THEATER</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-outline uppercase tracking-widest">Location</label>
                            <input className="w-full font-bold bg-surface-container-high p-4 outline-none"
                                value={eventData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-outline uppercase tracking-widest">Description</label>
                            <textarea className="w-full bg-surface-container-high p-4 h-48 resize-none outline-none border-b-2 border-transparent focus:border-primary"
                                value={eventData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>
                    </section>

                    {/* Cột phải: Ảnh Banner */}
                    <aside className="md:col-span-4 bg-surface-container-lowest p-12 border-l">
                        <label className="text-xs font-bold text-outline uppercase tracking-widest block mb-4 cursor-pointer">
                            Event Banner
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            <div className="aspect-[4/5] bg-surface-container-high flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/40 p-8 group hover:bg-surface-variant transition-all relative overflow-hidden mt-4">
                                {previewUrl && <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover" />}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white font-bold uppercase text-[10px] tracking-widest">Change Image</span>
                                </div>
                            </div>
                        </label>
                    </aside>
                </div>
            </main>
        </div>
    );
}