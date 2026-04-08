const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

type LoginResponse = {
  token?: string;
  [key: string]: any;
};

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const data: LoginResponse = await res.json();
  if (data.token) setToken(data.token);
  return data;
}

export async function signup(payload: Record<string, any>) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const data = await res.json();
  if (data.token) setToken(data.token);
  return data;
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

export function getToken() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const t = localStorage.getItem('token');
      if (t) return t;
    }
  } catch (e) {}

  if (typeof document !== 'undefined') {
    const m = document.cookie.match(/(^|;)\s*token=([^;]+)/);
    if (m) return decodeURIComponent(m[2]);
  }
  return null;
}

export function clearToken() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) localStorage.removeItem('token');
  } catch (e) {}
  if (typeof document !== 'undefined') {
    document.cookie = `token=; path=/; max-age=0; SameSite=Lax`;
  }
}

export async function authedFetch(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init?.headers as HeadersInit);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  return res;
}
