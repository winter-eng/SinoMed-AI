import { apiClient } from './client'

export const chatApi = {
  // AI diagnostic chat (patient ↔ AI)
  send: (message) => apiClient.post('/chat', null, { params: { message } }).then((r) => r.data),
  finalize: () => apiClient.post('/chat/finalize').then((r) => r.data),
  history: () => apiClient.get('/chat/history').then((r) => r.data),

  // Doctor-patient chat (patient view). doctor_id is required by the backend.
  dpHistory: (doctorId) =>
    apiClient.get('/dp-chat/history', { params: { doctor_id: doctorId } }).then((r) => r.data),
}
