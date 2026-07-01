import { apiClient } from './client'

export const nurseApi = {
  me: () => apiClient.get('/nurses/me').then((r) => r.data),
  referrals: () => apiClient.get('/nurses/referrals').then((r) => r.data),
}
