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

    // ── Detailed API error logging (always on — helps diagnose backend issues) ──
    const method = cfg.method?.toUpperCase() ?? '?'
    const url = `${cfg.baseURL ?? ''}${cfg.url ?? '?'}`

    console.group(`%c[API ERROR] ${method} ${url}`, 'color:#e11d48;font-weight:bold')

    // Request body
    if (cfg.data != null) {
      if (cfg.data instanceof FormData) {
        console.log('Request Body: [FormData — binary/multipart]')
      } else {
        try {
          console.log('Request Body:', JSON.parse(cfg.data))
        } catch {
          console.log('Request Body (raw):', cfg.data)
        }
      }
    }

    // Request headers (token redacted)
    const authHeader = cfg.headers?.Authorization
    if (authHeader) {
      console.log('Authorization:', authHeader.replace(/Bearer .+/, 'Bearer [REDACTED]'))
    }

    // Response
    if (res) {
      console.log('Response Status:', res.status)
      console.log('Response Body:', res.data)
    } else {
      console.log('No response received (network error / CORS / timeout)')
      console.log('Error message:', error.message)
    }

    console.groupEnd()
    // ─────────────────────────────────────────────────────────────────────────

    // Auto-logout on 401, except for:
    //  • auth endpoints (wrong credentials — don't log the user out)
    //  • requests that opted out via _skipLogout (bootstrap token validation)
    //  • DEV preview tokens (dev-token* never exist on the real backend)
    const isAuthEndpoint = cfg.url?.includes('/auth/')
    const skipLogout = cfg._skipLogout
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const isDevToken = import.meta.env.DEV && token?.startsWith('dev-token')

    if (res?.status === 401 && !isAuthEndpoint && !skipLogout && !isDevToken) {
      window.dispatchEvent(new Event('auth:logout'))
    }

    return Promise.reject(error)
  },
)
