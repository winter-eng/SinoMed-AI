import axios from 'axios'
import { STORAGE_KEYS } from '@/shared/constants/storage'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://aidiagnostikapi.sangilov.uz'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only dispatch logout for authenticated requests — skip auth endpoints
    // (a 401 on /auth/patient/login means wrong credentials, not an expired session)
    const isAuthEndpoint = error?.config?.url?.includes('/auth/')
    if (error?.response?.status === 401 && !isAuthEndpoint) {
      window.dispatchEvent(new Event('auth:logout'))
    }
    return Promise.reject(error)
  },
)
