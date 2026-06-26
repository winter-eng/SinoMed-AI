import { apiClient } from './client'

export const gradesApi = {
  list: () => apiClient.get('/grades').then((r) => r.data),
}
