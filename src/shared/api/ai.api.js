import { apiClient } from './client'

export const aiApi = {
  analyze: (payload) =>
    apiClient.post('/ai/analyze', payload).then((r) => r.data),
}
