import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Article, Fee, Service, TimeSlot } from '@/types'

function makeCrud<T extends { id: number }>(resource: string, invalidateAlso: string[] = []) {
  const listKey = ['admin', resource]

  function useList() {
    return useQuery({
      queryKey: listKey,
      queryFn: async () => (await api.get<{ data: T[] }>(`/admin/${resource}`)).data.data,
    })
  }

  function useCreate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (payload: Partial<T>) => (await api.post<{ data: T }>(`/admin/${resource}`, payload)).data.data,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: listKey })
        invalidateAlso.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
      },
    })
  }

  function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, ...payload }: Partial<T> & { id: number }) =>
        (await api.put<{ data: T }>(`/admin/${resource}/${id}`, payload)).data.data,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: listKey })
        invalidateAlso.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
      },
    })
  }

  function useRemove() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: number) => api.delete(`/admin/${resource}/${id}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: listKey })
        invalidateAlso.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
      },
    })
  }

  return { useList, useCreate, useUpdate, useRemove }
}

export const servicesAdmin = makeCrud<Service>('services', ['services'])
export const articlesAdmin = makeCrud<Article>('articles', ['articles'])
export const feesAdmin = makeCrud<Fee>('fees', ['fees'])
export const timeSlotsAdmin = makeCrud<TimeSlot>('time-slots', ['time-slots'])
