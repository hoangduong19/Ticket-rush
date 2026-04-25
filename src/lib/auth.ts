const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

type AuthType = 'user' | 'admin';

const STORAGE_KEYS = {
  user: {
    token: 'token',
    userId: 'userId',
    cookie: 'token',
  },
  admin: {
    token: 'adminToken',
    userId: 'adminId',
    cookie: 'adminToken',
  },
} as const;

function getStorage(type: AuthType) {
  return STORAGE_KEYS[type];
}

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);

  if (!payload || typeof payload.exp !== 'number') {
    return true;
  }

  return Date.now() >= (payload.exp - 10) * 1000;
}

type LoginResponse = {
  token?: string;
  userId?: string;
  id?: string;
  [key: string]: any;
};

async function parseAuthResponse(
  res: Response,
  type: AuthType
): Promise<LoginResponse> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  const text = await res.text();

  try {
    const data: LoginResponse = JSON.parse(text);

    if (data.token) {
      setToken(data.token, type);
    }

    const id = data.userId || data.id;
    if (id && typeof window !== 'undefined') {
      localStorage.setItem(getStorage(type).userId, id);
    }

    return data;
  } catch {
    setToken(text, type);
    return { token: text };
  }
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,
      password,
    }),
  });

  return parseAuthResponse(res, 'user');
}

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/adminLogin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,
      password,
    }),
  });

  return parseAuthResponse(res, 'admin');
}

export async function signup(payload: Record<string, any>) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return parseAuthResponse(res, 'user');
}

export function setToken(
  token: string,
  type: AuthType = 'user'
) {
  const storage = getStorage(type);

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storage.token, token);
    }
  } catch {}

  if (typeof document !== 'undefined') {
    const maxAge = 60 * 60 * 24 * 7;

    document.cookie =
      `${storage.cookie}=${encodeURIComponent(token)}; ` +
      `path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

export function getToken(
  type: AuthType = 'user'
): string | null {
  const storage = getStorage(type);
  let token: string | null = null;

  try {
    if (typeof window !== 'undefined') {
      token = localStorage.getItem(storage.token);
    }
  } catch {}

  if (!token && typeof document !== 'undefined') {
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${storage.cookie}=([^;]*)`)
    );

    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  if (token && isTokenExpired(token)) {
    clearToken(type);
    return null;
  }

  return token;
}

export function clearToken(
  type: AuthType = 'user'
) {
  const storage = getStorage(type);

  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storage.token);
      localStorage.removeItem(storage.userId);
    }
  } catch {}

  if (typeof document !== 'undefined') {
    document.cookie =
      `${storage.cookie}=; path=/; max-age=0; SameSite=Lax`;
  }
}

export async function authedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
  type: AuthType = 'user'
) {
  const token = getToken(type);

  if (!token && typeof window !== 'undefined') {
    const loginPath =
      type === 'admin' ? '/admin/login' : '/login';

    const loginUrl = new URL(
      loginPath,
      window.location.origin
    );

    loginUrl.searchParams.set(
      'redirect',
      window.location.pathname
    );

    window.location.replace(loginUrl.toString());

    return new Response(null, {
      status: 401,
      statusText: 'Unauthorized',
    });
  }

  const headers = new Headers(init?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(input, {
    ...init,
    headers,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    clearToken(type);

    const loginPath =
      type === 'admin' ? '/admin/login' : '/login';

    const loginUrl = new URL(
      loginPath,
      window.location.origin
    );

    loginUrl.searchParams.set(
      'redirect',
      window.location.pathname
    );

    window.location.replace(loginUrl.toString());
  }

  return res;
}