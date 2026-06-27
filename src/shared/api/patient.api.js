import { apiClient } from './client'

export const patientApi = {
  me: (config) => apiClient.get('/patients/me', config).then((r) => r.data),
  update: (data) => apiClient.patch('/patients/me', data).then((r) => r.data),
  anketas: () => apiClient.get('/patients/me/anketas').then((r) => r.data),
  chat: () => apiClient.get('/patients/me/chat').then((r) => r.data),
  allData: () => apiClient.get('/patients/me/all').then((r) => r.data),
}
