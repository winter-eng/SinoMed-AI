import { apiClient } from './client'

const LOGIN_ENDPOINTS = {
  patient: '/auth/patient/login',
  assistant: '/auth/nurse/login',
  doctor: '/auth/doctor/login',
}

export const authApi = {
  login: ({ email, password, role = 'patient' }) =>
    apiClient
      .post(LOGIN_ENDPOINTS[role] ?? LOGIN_ENDPOINTS.patient, { email, password })
      .then((r) => r.data),

  register: (data) => {
    const payload = {
      full_name: data.full_name,
      phone: data.phone,
      password: data.password,
    }
    if (data.email) payload.email = data.email
    if (data.referral_code) payload.referral_code = data.referral_code
    return apiClient.post('/auth/patient/register', payload).then((r) => r.data)
  },
}
