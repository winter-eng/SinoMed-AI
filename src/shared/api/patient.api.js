import { apiClient } from './client'

export const patientApi = {
  me: (config) => apiClient.get('/patients/me', config).then((r) => r.data),
}
