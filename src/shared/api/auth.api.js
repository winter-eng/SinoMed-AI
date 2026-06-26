import { apiClient } from './client'

export const authApi = {
  login: ({ email, password }) =>
    apiClient.post('/auth/patient/login', { email, password }).then((r) => r.data),

  register: (data) => {
    const payload = {
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      // TODO: collect these from UI — using placeholders until registration form is extended
      phone: data.phone ?? '+998901234567',
      date_of_birth: data.date_of_birth ?? '2005-01-01',
      clinic_id: data.clinic_id ?? 1,
      latitude: data.latitude ?? 41.3111,
      longitude: data.longitude ?? 69.2797,
    }
    return apiClient.post('/auth/patient/register', payload).then((r) => r.data)
  },
}
