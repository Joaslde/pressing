import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Address } from '@/types'

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => (await api.get<{ data: Address[] }>('/addresses')).data.data,
  })
}

export interface AddressPayload {
  label: string
  full_address: string
  latitude?: number | null
  longitude?: number | null
  city?: string | null
  district?: string | null
  instructions?: string | null
  is_default?: boolean
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AddressPayload) =>
      (await api.post<{ data: Address }>('/addresses', payload)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: AddressPayload & { id: number }) =>
      (await api.put<{ data: Address }>(`/addresses/${id}`, payload)).data.data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => api.delete(`/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useReverseGeocode() {
  return useMutation({
    mutationFn: async ({ latitude, longitude }: { latitude: number; longitude: number }) =>
      (
        await api.get<{ full_address: string; city: string | null; district: string | null }>(
          '/geocode/reverse',
          { params: { latitude, longitude } }
        )
      ).data,
  })
}
