import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AdminDashboardStats, Livreur, Order, OrderStatus, PaginatedResponse, User } from '@/types'

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => (await api.get<AdminDashboardStats>('/admin/dashboard')).data,
    refetchInterval: 60_000,
  })
}

export function useAdminOrders(filters?: { status?: string; payment_status?: string; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: async () =>
      (await api.get<PaginatedResponse<Order>>('/admin/orders', { params: filters })).data.data,
  })
}

export function useAdminOrder(id: number | string | undefined) {
  return useQuery({
    queryKey: ['admin', 'orders', id],
    queryFn: async () => (await api.get<{ data: Order }>(`/admin/orders/${id}`)).data.data,
    enabled: !!id,
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: OrderStatus }) =>
      (await api.patch<{ data: Order }>(`/admin/orders/${id}/status`, { status })).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  })
}

export function useAssignLivreur() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      orderId,
      deliveryPersonId,
      missionType,
    }: {
      orderId: number
      deliveryPersonId: number
      missionType: 'pickup' | 'delivery'
    }) =>
      (
        await api.post<{ data: Order }>(`/admin/orders/${orderId}/assign`, {
          delivery_person_id: deliveryPersonId,
          mission_type: missionType,
        })
      ).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  })
}

export function useAdminClients(search?: string) {
  return useQuery({
    queryKey: ['admin', 'clients', search],
    queryFn: async () =>
      (await api.get<PaginatedResponse<User & { orders_count: number }>>('/admin/clients', { params: { search } })).data
        .data,
  })
}

export function useAdminClient(id: number | string | undefined) {
  return useQuery({
    queryKey: ['admin', 'clients', 'detail', id],
    queryFn: async () =>
      (await api.get<{ client: User; orders: { data: Order[] } }>(`/admin/clients/${id}`)).data,
    enabled: !!id,
  })
}

export function useToggleClientActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => (await api.patch<{ data: User }>(`/admin/clients/${id}/toggle-active`)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] }),
  })
}

export function useAdminLivreurs() {
  return useQuery({
    queryKey: ['admin', 'livreurs'],
    queryFn: async () => (await api.get<{ data: Livreur[] }>('/admin/livreurs')).data.data,
  })
}

export function useCreateLivreur() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { first_name: string; last_name: string; phone: string; email: string }) =>
      (
        await api.post<{ livreur: Livreur; temporary_password: string }>('/admin/livreurs', payload)
      ).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'livreurs'] }),
  })
}

export function useUpdateLivreur() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: number; first_name?: string; last_name?: string; phone?: string; email?: string; status?: string }) =>
      (await api.put<{ data: Livreur }>(`/admin/livreurs/${id}`, payload)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'livreurs'] }),
  })
}

export function useToggleLivreurActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) =>
      (await api.patch<{ data: Livreur }>(`/admin/livreurs/${id}/toggle-active`)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'livreurs'] }),
  })
}
