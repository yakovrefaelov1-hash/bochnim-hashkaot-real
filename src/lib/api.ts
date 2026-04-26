import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('no refresh token');
        const { data } = await axios.post(`${API_BASE}/api/auth/refresh`, {
          refresh_token: refreshToken,
        });
        localStorage.setItem('access_token', data.data.tokens.access);
        localStorage.setItem('refresh_token', data.data.tokens.refresh);
        original.headers.Authorization = `Bearer ${data.data.tokens.access}`;
        return api(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err as Error);
  }
);

// Typed helpers
export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res: AxiosResponse<{ success: boolean; data: T }> = await api.get(url, { params });
  return res.data.data;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const res: AxiosResponse<{ success: boolean; data: T }> = await api.post(url, body);
  return res.data.data;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const res: AxiosResponse<{ success: boolean; data: T }> = await api.patch(url, body);
  return res.data.data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const res: AxiosResponse<{ success: boolean; data: T }> = await api.delete(url);
  return res.data.data;
}
