import { useQuery } from '@tanstack/react-query'
import { predictionApi } from '@/shared/api/prediction.api'
import { useAuth } from '@/app/providers/AuthProvider'

export function usePredictions({ limit = 20 } = {}) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['predictions', limit],
    queryFn: () => predictionApi.list({ limit }),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  })
}

export function usePredictionDetail(id) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['prediction', id],
    queryFn: () => predictionApi.detail(id),
    enabled: isAuthenticated && !!id && !Number.isNaN(Number(id)),
    staleTime: 5 * 60 * 1000,
  })
}
