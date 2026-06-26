import { apiClient } from './client'

export const authApi = {
  login: (payload) =>
    apiClient.post('/auth/login', payload).then((r) => r.data),

  logout: () => apiClient.post('/auth/logout'),

  me: () => apiClient.get('/auth/me').then((r) => r.data),
}
