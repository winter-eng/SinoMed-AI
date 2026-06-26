import { apiClient } from './client'

export const predictionApi = {
  // POST /predict — multipart/form-data with retinal image file.
  // No manual Content-Type header: Axios + browser set it automatically with the correct boundary.
  submit: (file) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.post('/predict', form).then((r) => r.data)
  },

  list: (params) =>
    apiClient.get('/predictions/me', { params }).then((r) => r.data),

  detail: (id) =>
    apiClient.get(`/predictions/me/${id}`).then((r) => r.data),
}
