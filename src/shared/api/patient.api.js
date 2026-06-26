import { apiClient } from './client'

export const patientApi = {
  list: () => apiClient.get('/patients').then((r) => r.data),

  getById: (id) => apiClient.get(`/patients/${id}`).then((r) => r.data),

  create: (data) => apiClient.post('/patients', data).then((r) => r.data),
}
