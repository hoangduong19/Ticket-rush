'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, clearToken } from './auth';

/**
 * Hook bảo vệ route client-side.
 * Gọi ở đầu bất kỳ page nào cần auth.
 * Tự động redirect về /login nếu token không có hoặc đã hết hạn.
 */
export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = getToken(); // getToken đã tự xóa token expired bên trong
    if (!token) {
      clearToken(); // Đảm bảo sạch cả cookie lẫn localStorage
      const loginUrl = new URL('/login', window.location.href);
      loginUrl.searchParams.set('redirect', window.location.pathname + window.location.search);
      router.replace(loginUrl.pathname + loginUrl.search);
    }
  }, [router]);
}
