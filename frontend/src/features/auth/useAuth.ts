import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getStoredToken, setStoredToken } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types'

interface AuthResponse {
  user: User
  token: string
  redirect_to: string
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser)
  const setStatus = useAuthStore((s) => s.setStatus)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      if (!getStoredToken()) {
        setUser(null)
        return null
      }

      setStatus('loading')
      try {
        const { data } = await api.get<{ user: User }>('/auth/me')
        setUser(data.user)
        return data.user
      } catch {
        setStoredToken(null)
        setUser(null)
        return null
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  })
}

interface RegisterPayload {
  first_name: string
  last_name: string
  phone: string
  email: string
  password: string
  password_confirmation: string
}

export function useRegister() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/register', payload)
      return data
    },
    onSuccess: (data) => {
      setStoredToken(data.token)
      setUser(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
    },
  })
}

interface LoginPayload {
  email: string
  password: string
}

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<AuthResponse>('/auth/login', payload)
      return data
    },
    onSuccess: (data) => {
      setStoredToken(data.token)
      setUser(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
    },
  })
}

export function useGoogleLogin() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credential: string) => {
      const { data } = await api.post<AuthResponse>('/auth/google', { credential })
      return data
    },
    onSuccess: (data) => {
      setStoredToken(data.token)
      setUser(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
    },
  })
}

export function useLogout() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post('/auth/logout')
      } finally {
        setStoredToken(null)
      }
    },
    onSuccess: () => {
      setUser(null)
      queryClient.clear()
    },
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email })
      return data
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: {
      token: string
      email: string
      password: string
      password_confirmation: string
    }) => {
      const { data } = await api.post<{ message: string }>('/auth/reset-password', payload)
      return data
    },
  })
}
