import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Assignment } from '@/types'

interface LivreurDashboardStats {
  pickups_today: number
  deliveries_today: number
  total_assigned: number
}

export function useLivreurDashboard() {
  return useQuery({
    queryKey: ['livreur', 'dashboard'],
    queryFn: async () => (await api.get<LivreurDashboardStats>('/livreur/dashboard')).data,
  })
}

export function useMissions(filters?: { mission_type?: 'pickup' | 'delivery'; status?: string }) {
  return useQuery({
    queryKey: ['livreur', 'missions', filters],
    queryFn: async () =>
      (await api.get<{ data: Assignment[] }>('/livreur/missions', { params: filters })).data.data,
  })
}

export function useConfirmMission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (assignmentId: number) =>
      (await api.post<{ data: Assignment }>(`/livreur/missions/${assignmentId}/confirm`)).data.data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['livreur'] })
    },
  })
}
