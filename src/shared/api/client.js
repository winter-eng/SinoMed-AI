import axios from 'axios'
import { STORAGE_KEYS } from '@/shared/constants/storage'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://aidiagnostikapi.sangilov.uz'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Inject Bearer token on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Global response error handler ───────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const cfg = error?.config ?? {}
    const res = error?.response

    // Development-only API error logging
    if (import.meta.env.DEV) {
      const method = cfg.method?.toUpperCase() ?? '?'
      const url = `${cfg.baseURL ?? ''}${cfg.url ?? '?'}`
      console.group(`%c[API ERROR] ${method} ${url}`, 'color:#e11d48;font-weight:bold')
      if (cfg.data != null) {
        if (cfg.data instanceof FormData) {
          console.log('Request Body: [FormData]')
        } else {
          try { console.log('Request Body:', JSON.parse(cfg.data)) }
          catch { console.log('Request Body (raw):', cfg.data) }
        }
      }
      if (res) {
        console.log('Status:', res.status, '— Body:', res.data)
      } else {
        console.log('No response:', error.message)
      }
      console.groupEnd()
    }

    // Auto-logout on 401, except for:
    //  • auth endpoints (wrong credentials — don't log the user out)
    //  • requests that opted out via _skipLogout (bootstrap token validation)
    const isAuthEndpoint = cfg.url?.includes('/auth/')
    const skipLogout = cfg._skipLogout

    if (res?.status === 401 && !isAuthEndpoint && !skipLogout) {
      window.dispatchEvent(new Event('auth:logout'))
    }

    return Promise.reject(error)
  },
)
