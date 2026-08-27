import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  status: 'idle' | 'loading' | 'authenticated' | 'guest'
  setUser: (user: User | null) => void
  setStatus: (status: AuthState['status']) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
  setStatus: (status) => set({ status }),
}))
