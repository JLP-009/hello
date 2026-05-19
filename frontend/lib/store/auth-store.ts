import { create } from 'zustand';

type AuthState = { token: string | null; setToken: (t: string | null) => void; };

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('access_token', token);
      else localStorage.removeItem('access_token');
    }
    set({ token });
  },
}));
