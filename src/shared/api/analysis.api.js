import { apiClient } from './client'

export const analysisApi = {
  create: (formData) =>
    apiClient
      .post('/analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  getById: (id) => apiClient.get(`/analysis/${id}`).then((r) => r.data),

  list: () => apiClient.get('/analysis').then((r) => r.data),
}
