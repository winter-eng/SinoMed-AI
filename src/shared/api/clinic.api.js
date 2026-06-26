import { apiClient } from './client'

export const clinicApi = {
  list: () => apiClient.get('/clinics').then((r) => r.data),

  nearest: (lat, lon) =>
    apiClient.get('/clinics/nearest', { params: { lat, lon } }).then((r) => r.data),
}
