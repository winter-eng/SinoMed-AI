import axios from 'axios'
import { STORAGE_KEYS } from '@/shared/constants/storage'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
