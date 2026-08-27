import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Article, Fee, Service, TimeSlot } from '@/types'

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => (await api.get<{ data: Service[] }>('/services')).data.data,
    staleTime: 5 * 60_000,
  })
}

export function useArticles() {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => (await api.get<{ data: Article[] }>('/articles')).data.data,
    staleTime: 5 * 60_000,
  })
}

export function useFees() {
  return useQuery({
    queryKey: ['fees'],
    queryFn: async () => (await api.get<{ data: Fee[] }>('/fees')).data.data,
    staleTime: 5 * 60_000,
  })
}

export function useTimeSlots(date?: string) {
  return useQuery({
    queryKey: ['time-slots', date],
    queryFn: async () =>
      (await api.get<{ data: TimeSlot[] }>('/time-slots', { params: date ? { date } : {} })).data.data,
    enabled: !!date,
  })
}
