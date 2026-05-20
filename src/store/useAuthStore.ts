import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = { username: string }

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
      login: async (username, password) => {
        set({ loading: true, error: null })
        await new Promise((r) => setTimeout(r, 450))
        if (username === '1234' && password === '1234') {
          set({ isAuthenticated: true, user: { username }, loading: false, error: null })
          return true
        }
        set({ error: 'Invalid username or password', loading: false, isAuthenticated: false, user: null })
        return false
      },
      logout: () => set({ isAuthenticated: false, user: null, error: null, loading: false }),
    }),
    { name: 'qe-auth' },
  ),
)
