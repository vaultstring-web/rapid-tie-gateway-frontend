import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'

export const useEvents = (filters?: any) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/events', { params: filters })
      return data
    },
  })
}

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/events/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export const useInfiniteEvents = (filters?: any) => {
  return useInfiniteQuery({
    queryKey: ['infiniteEvents', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await apiClient.get('/events', {
        params: { ...filters, page: pageParam, limit: 20 },
      })
      return data
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })
}