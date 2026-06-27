import { apiClient } from './client'

export const doctorApi = {
  me: () => apiClient.get('/doctors/me').then((r) => r.data),
  patients: (params) => apiClient.get('/doctors/patients', { params }).then((r) => r.data),
  patientDetail: (patientId) => apiClient.get(`/doctors/patients/${patientId}`).then((r) => r.data),
  anketas: (params) => apiClient.get('/anketa/doctor', { params }).then((r) => r.data),
  anketaDetail: (anketaId) => apiClient.get(`/anketa/doctor/${anketaId}`).then((r) => r.data),
  chatHistory: (patientId) => apiClient.get(`/dp-chat/history/${patientId}`).then((r) => r.data),
  uploadChatImage: (token, file) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post('/dp-chat/upload', form, { params: { token } }).then((r) => r.data)
  },
}
