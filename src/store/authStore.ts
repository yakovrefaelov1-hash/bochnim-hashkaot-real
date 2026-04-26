import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiPost } from '@/lib/api';

export type UserRole = 'investor' | 'provider' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  city?: string;
  verified_email: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  setAuth: (user: AuthUser, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
  updateUser: (partial: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      setAuth: (user, tokens) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', tokens.access);
          localStorage.setItem('refresh_token', tokens.refresh);
        }
        set({ user, accessToken: tokens.access, refreshToken: tokens.refresh });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: 'bochnim-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
