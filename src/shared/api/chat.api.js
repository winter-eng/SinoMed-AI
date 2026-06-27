import { apiClient } from './client'

export const chatApi = {
  send: (message) => apiClient.post('/chat', null, { params: { message } }).then((r) => r.data),
  finalize: () => apiClient.post('/chat/finalize').then((r) => r.data),
  history: () => apiClient.get('/chat/history').then((r) => r.data),
}
