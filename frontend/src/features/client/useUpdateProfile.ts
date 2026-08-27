import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types'

export interface ProfilePayload {
  first_name: string
  last_name: string
  phone: string
  email: string
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProfilePayload) =>
      (await api.patch<{ user: User }>('/auth/profile', payload)).data.user,
    onSuccess: (user) => {
      setUser(user)
      queryClient.setQueryData(['auth', 'me'], user)
    },
  })
}
