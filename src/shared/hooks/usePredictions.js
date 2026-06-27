import { useQuery } from '@tanstack/react-query'
import { predictionApi } from '@/shared/api/prediction.api'
import { useAuth } from '@/app/providers/AuthProvider'
import { getMockPredictions, getMockPredictionById, isMockId } from '@/shared/lib/mockPredictions'

export function usePredictions({ limit = 20 } = {}) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['predictions', limit],
    queryFn: async () => {
      try {
        const apiList = await predictionApi.list({ limit })
        const mockList = getMockPredictions()
        // Merge: API results first, then local mocks not already in API list
        const apiIds = new Set(apiList.map((p) => String(p.id)))
        const uniqueMocks = mockList.filter((m) => !apiIds.has(m.id))
        return [...apiList, ...uniqueMocks].slice(0, limit)
      } catch {
        return getMockPredictions().slice(0, limit)
      }
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  })
}

export function usePredictionDetail(id) {
  const { isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['prediction', id],
    queryFn: async () => {
      if (isMockId(id)) {
        const mock = getMockPredictionById(id)
        if (mock) return mock
        throw new Error('Local result not found')
      }
      return predictionApi.detail(id)
    },
    enabled: isAuthenticated && !!id,
    staleTime: 5 * 60 * 1000,
  })
}
