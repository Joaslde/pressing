import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Order, PaginatedResponse } from '@/types'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => (await api.get<PaginatedResponse<Order>>('/orders')).data.data,
  })
}

export function useOrder(id: number | string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await api.get<{ data: Order }>(`/orders/${id}`)).data.data,
    enabled: !!id,
  })
}

export interface CreateOrderPayload {
  service_id: number
  pickup_address_id: number
  delivery_address_id: number
  pickup_date: string
  time_slot_id: number
  notes?: string
  items: Array<{ article_id: number; quantity: number }>
}

export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) =>
      (await api.post<{ data: Order }>('/orders', payload)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })
}
