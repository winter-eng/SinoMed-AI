import { apiClient } from './client'

export const patientApi = {
  me: () => apiClient.get('/patients/me').then((r) => r.data),
}
