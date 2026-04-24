const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

/**
 * Decode JWT payload (client-side only, không verify signature).
 * Trả về payload object hoặc null nếu token không hợp lệ.
 */
function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64url → Base64 → JSON
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * Kiểm tra token JWT đã hết hạn chưa dựa trên claim `exp`.
 * Trả về true nếu token hết hạn hoặc không thể đọc được.
 */
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  // exp là Unix timestamp (giây), cộng thêm 10s buffer để tránh race condition
  return Date.now() >= (payload.exp - 10) * 1000;
}

type LoginResponse = {
  token?: string;
  [key: string]: any;
};

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const text = await res.text();
  try {
    const data: LoginResponse = JSON.parse(text);
    if (data.token) setToken(data.token);

    const idToStore = data.userId || data.id;
    if (idToStore && typeof window !== 'undefined') {
      localStorage.setItem('userId', idToStore);
    }

    return data;
  } catch {
    // Backend returned plain JWT token
    setToken(text);
    return { token: text };
  }
}

export async function signup(payload: Record<string, any>) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    if (data.token) setToken(data.token);

    const idToStore = data.userId || data.id;
    if (idToStore && typeof window !== 'undefined') {
      localStorage.setItem('userId', idToStore);
    }

    return data;
  } catch {
    // Backend returned plain JWT token
    setToken(text);
    return { token: text };
  }
}

export function setToken(token: string) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
    }
  } catch (e) {
    // ignore
  }

  // set a non-httpOnly cookie for client usage (not secure for sensitive tokens)
  if (typeof document !== 'undefined') {
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

export function getToken(): string | null {
  let token: string | null = null;

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token');
    }
  } catch (e) { }

  if (!token && typeof document !== 'undefined') {
    const m = document.cookie.match(/(^|;)\s*token=([^;]+)/);
    if (m) token = decodeURIComponent(m[2]);
  }

  // Tự động xóa và trả về null nếu token đã hết hạn
  if (token && isTokenExpired(token)) {
    clearToken();
    return null;
  }

  return token;
}

export function clearToken() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  } catch (e) { }
  if (typeof document !== 'undefined') {
    document.cookie = `token=; path=/; max-age=0; SameSite=Lax`;
  }
}

export async function authedFetch(input: RequestInfo, init?: RequestInit) {
  const token = getToken();

  // Nếu token đã expire trước khi gọi API, redirect ngay
  if (!token && typeof window !== 'undefined') {
    const loginUrl = new URL('/login', window.location.href);
    loginUrl.searchParams.set('redirect', window.location.pathname);
    window.location.replace(loginUrl.toString());
    // Trả về Response rỗng để tránh lỗi runtime
    return new Response(null, { status: 401 });
  }

  const headers = new Headers(init?.headers as HeadersInit);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });

  // Backend trả 401 → token hết hạn phía server → clear và redirect
  if (res.status === 401 && typeof window !== 'undefined') {
    clearToken();
    const loginUrl = new URL('/login', window.location.href);
    loginUrl.searchParams.set('redirect', window.location.pathname);
    window.location.replace(loginUrl.toString());
  }

  return res;
}
