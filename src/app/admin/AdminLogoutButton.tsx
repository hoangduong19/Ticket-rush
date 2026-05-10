'use client';

import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';

export default function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    clearToken('admin');
    router.replace('/admin/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold uppercase tracking-widest text-xs ml-auto hover:bg-red-50 p-2 rounded transition-colors"
      title="Đăng xuất"
    >
      <span className="material-symbols-outlined text-[18px]">logout</span>
      <span className="hidden md:inline">Sign Out</span>
    </button>
  );
}
