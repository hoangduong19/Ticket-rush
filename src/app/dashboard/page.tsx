'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function Dashboard() {
  const [user, setUser] = useState({
    displayName: '',
    email: '',
    age: 0,
    gender: 'OTHER',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    username: ''
  });

  const [formData, setFormData] = useState({
    displayName: '',
    age: 0,
    gender: 'OTHER'
  });

  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_BASE}/users/me`);
        if (res.ok) {
          const data = await res.json();
          console.log("Dữ liệu từ Backend:", data);
          setUser(data);
          setFormData({
            displayName: data.displayName || '',
            age: data.age || 0,
            gender: data.gender || 'OTHER'
          });
        }
      } catch (err) {
        console.error("Lỗi kết nối Backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), 
      });

      if (res.ok) {
        setUser((prev) => ({ ...prev, ...formData }));
        alert('Thông tin cá nhân đã được lưu!');
      } else {
        const error = await res.json();
        alert('Lỗi: ' + (error.message || 'Không thể cập nhật'));
      }
    } catch (err) {
      alert('Lỗi kết nối server.');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Show ảnh lên ngay lập tức (Optimistic UI)
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl); 
    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
        const res = await fetch(`${API_BASE}/users/me/avatar`, {
            method: 'POST',
            body: uploadData,
        });
        if (!res.ok) {
            setAvatarPreview(null);
            alert("Upload thất bại!");
        }
    } catch (err) {
        setAvatarPreview(null);
        alert("Lỗi kết nối khi upload!");
    } finally {
        setIsUploading(false);
    }
};


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-black italic animate-pulse text-blue-700 uppercase">TicketRush is Loading...</h2>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body antialiased min-h-screen flex flex-col">
      {/* TopNavBar */}
       <nav className="bg-slate-50 dark:bg-slate-950 w-full top-0 left-0 flex justify-between items-center px-8 py-6 max-w-none">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-black italic tracking-tighter text-blue-700 dark:text-blue-500 font-headline">TicketRush</Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/events" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1 active:translate-y-0.5">Events</Link>
            <Link href="/tickets" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1 active:translate-y-0.5">My Tickets</Link>
            <Link href="/dashboard" className="text-blue-700 dark:text-blue-400 border-b-4 border-blue-700 dark:border-blue-400 pb-1 font-['Inter'] font-bold tracking-tight uppercase active:translate-y-0.5">Dashboard</Link>
            <Link href="/orders" className="text-slate-900 dark:text-slate-100 font-bold opacity-60 font-['Inter'] uppercase tracking-tight hover:bg-blue-700 hover:text-white transition-colors duration-100 px-2 py-1 active:translate-y-0.5">Orders</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-high px-4 py-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-outline">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs font-bold uppercase tracking-widest w-48" placeholder="SEARCH EVENTS" type="text" />
          </div>
          <button className="text-slate-900 dark:text-slate-100 hover:bg-blue-700 hover:text-white p-2 transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </nav>
      <div className="bg-slate-200 dark:bg-slate-800 h-[2px] w-full"></div>
      <main className="max-w-[1440px] mx-auto px-8 py-12 flex-grow w-full">
        {/* Bento Header - HIỂN THỊ (Không bị nhảy khi gõ) */}
        <div className="mb-12 bg-surface-container">
          <div className="lg:col-span-8 bg-surface-container-lowest p-12 flex flex-col md:flex-row gap-12 items-start border-2 border-black">
            <div className="w-48 h-48 bg-primary relative shrink-0 border-2 border-black">
              <img className="w-full h-full object-cover contrast-125" alt="Profile" src={avatarPreview || user.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} />
              
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl animate-spin mb-2">sync</span>
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest animate-pulse">Uploading</span>
                </div>
              )}

              {/* Nút Update Avatar */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -left-2 bg-black text-white w-10 h-10 flex items-center justify-center hover:bg-blue-700 border-2 border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-20"
              >
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
              
              <div className="absolute -bottom-4 -right-4 bg-secondary px-4 py-2 text-on-secondary font-bold text-xs uppercase tracking-widest z-20">Verified</div>
            </div>

            <div className="flex-1">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4 block">Personal Overview</span>
              <h1 className="text-6xl font-extrabold tracking-tighter text-on-surface mb-8 leading-none uppercase break-words">
                {user.displayName || "Alexander Von Ticketing"}
              </h1>
              <div className="grid grid-cols-2 gap-y-8">
                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Email Address</p>
                  <p className="font-bold text-lg">{user.username}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-outline tracking-widest mb-1">Age / Gender</p>
                  <p className="font-bold text-lg uppercase">{user.age || '--'} / {user.gender || 'OTHER'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Profile Update Form - NHẬP LIỆU (Màu sắc giữ nguyên) */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-on-surface flex items-center justify-center">
                <span className="material-symbols-outlined text-surface">edit</span>
              </div>
              <h3 className="text-4xl font-extrabold tracking-tighter uppercase">Update Profile</h3>
            </div>
            <div className="bg-surface-container-lowest border-2 border-black p-1">
              <form onSubmit={handleUpdateProfile} className="flex flex-col gap-8 p-8">
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Full Name</label>
                  <input 
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 font-bold uppercase tracking-tight outline-none" 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Age</label>
                    <input 
                      className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 font-bold uppercase tracking-tight outline-none" 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Gender</label>
                    <select 
                      className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-primary focus:ring-0 p-4 font-bold uppercase tracking-tight h-[58px] outline-none"
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
                <button className="bg-primary text-on-primary py-6 px-12 font-black uppercase tracking-[0.2em] self-start hover:bg-black transition-all active:translate-y-1" type="submit">
                  Save Changes
                </button>
              </form>
            </div>
          </section>

          {/* Security - GIỮ LẠI PHẦN NHẬP MẬT KHẨU */}
          <section>
            <div className="flex items-center gap-4 mb-8 ">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary">lock</span>
              </div>
              <h3 className="text-4xl font-extrabold tracking-tighter uppercase">Security</h3>
            </div>
            <div className="bg-surface-container-lowest p-1 h-full flex flex-col border-2 border-black">
              <form className="flex flex-col gap-8 p-8 flex-grow">
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Current Password</label>
                  <input
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 p-4 font-bold tracking-tight outline-none"
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">New Password</label>
                  <input
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 p-4 font-bold tracking-tight outline-none"
                    placeholder="MIN. 12 CHARACTERS"
                    type="password"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline mb-2">Confirm New Password</label>
                  <input
                    className="bg-surface-container-high border-none border-b-2 border-transparent focus:border-secondary focus:ring-0 p-4 font-bold tracking-tight outline-none"
                    placeholder="REPEAT PASSWORD"
                    type="password"
                  />
                </div>
                <div className="bg-secondary-container p-6">
                  <p className="text-on-secondary-container text-xs font-bold uppercase tracking-widest mb-2">Security Advice</p>
                  <p className="text-on-secondary-container text-sm leading-relaxed">Passwords must contain at least one special character and a number.</p>
                </div>
                <button className="bg-secondary text-on-secondary py-6 px-12 font-black uppercase tracking-[0.2em] self-start hover:bg-secondary-dim transition-all mt-auto" type="submit">
                  Update Password
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-slate-900 text-white p-12 mt-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="text-2xl font-black italic uppercase">TicketRush</span>
          <p className="text-xs opacity-50 uppercase font-bold tracking-widest">© 2026 Architectural Precision in Ticketing.</p>
        </div>
      </footer>
    </div>
  );
}