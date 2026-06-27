import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { authApi } from '@/shared/api/auth.api'
import { patientApi } from '@/shared/api/patient.api'
import { doctorApi } from '@/shared/api/doctor.api'
import { nurseApi } from '@/shared/api/nurse.api'
import { STORAGE_KEYS } from '@/shared/constants/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    role: null,
  })

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE)
    setAuth({ user: null, token: null, isAuthenticated: false, isLoading: false, role: null })
  }, [])

  // Bootstrap: restore session from localStorage.
  // Non-patient roles restore from cache — their pages refresh data on mount.
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const savedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE) ?? 'patient'

    if (!token) {
      setAuth((prev) => ({ ...prev, isLoading: false }))
      return
    }

    if (savedRole !== 'patient') {
      const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
      const user = savedUser ? JSON.parse(savedUser) : null
      setAuth({ user, token, isAuthenticated: true, isLoading: false, role: savedRole })
      return
    }

    // DEV: skip API validation for preview tokens so session survives page refresh
    if (import.meta.env.DEV && token.startsWith('dev-token')) {
      const savedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
      const user = savedUser ? JSON.parse(savedUser) : null
      setAuth({ user, token, isAuthenticated: true, isLoading: false, role: 'patient' })
      return
    }

    patientApi
      .me({ _skipLogout: true })
      .then((user) => {
        setAuth({ user, token, isAuthenticated: true, isLoading: false, role: savedRole })
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
        localStorage.removeItem(STORAGE_KEYS.USER_ROLE)
        setAuth({ user: null, token: null, isAuthenticated: false, isLoading: false, role: null })
      })
  }, [])

  // Listen for 401 events dispatched by the axios interceptor
  const logoutRef = useRef(logout)
  logoutRef.current = logout
  useEffect(() => {
    const handler = () => logoutRef.current()
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [])

  // identifier = phone (patient) | username (doctor/nurse)
  const login = useCallback(async (identifier, password, role = 'patient') => {
    const { access_token } = await authApi.login({ identifier, password, role })
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token)
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role)

    if (role === 'doctor') {
      let user = null
      try {
        user = await doctorApi.me()
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
      } catch {
        // proceed authenticated even if profile fetch fails; pages will retry
      }
      setAuth({ user, token: access_token, isAuthenticated: true, isLoading: false, role })
      return
    }

    if (role === 'assistant') {
      let user = null
      try {
        user = await nurseApi.me()
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
      } catch {
        // proceed authenticated even if profile fetch fails
      }
      setAuth({ user, token: access_token, isAuthenticated: true, isLoading: false, role })
      return
    }

    // patient
    const user = await patientApi.me()
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
    setAuth({ user, token: access_token, isAuthenticated: true, isLoading: false, role })
  }, [])

  const register = useCallback(async ({ full_name, phone, password, email, referral_code }) => {
    const { access_token } = await authApi.register({ full_name, phone, password, email, referral_code })
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token)
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'patient')
    const user = await patientApi.me()
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
    setAuth({ user, token: access_token, isAuthenticated: true, isLoading: false, role: 'patient' })
  }, [])

  // Development-only previews — tree-shaken in production by Vite
  const devPreviewDoctor = useCallback(() => {
    if (!import.meta.env.DEV) return
    const devUser = { id: 'dev-doctor', full_name: 'Demo Doctor', specialization: 'Cardiologist' }
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dev-token')
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'doctor')
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(devUser))
    setAuth({ user: devUser, token: 'dev-token', isAuthenticated: true, isLoading: false, role: 'doctor' })
  }, [])

  const devPreviewAssistant = useCallback(() => {
    if (!import.meta.env.DEV) return
    const devUser = { id: 'dev-assistant', full_name: 'Demo Assistant', referral_code: 'SINOMED-X82K91' }
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dev-token-assistant')
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'assistant')
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(devUser))
    setAuth({ user: devUser, token: 'dev-token-assistant', isAuthenticated: true, isLoading: false, role: 'assistant' })
  }, [])

  const devPreviewPatient = useCallback(() => {
    if (!import.meta.env.DEV) return
    const devUser = { id: 'dev-patient', full_name: 'Demo Patient', email: 'demo@sinomed.ai' }
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'dev-token-patient')
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'patient')
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(devUser))
    setAuth({ user: devUser, token: 'dev-token-patient', isAuthenticated: true, isLoading: false, role: 'patient' })
  }, [])

  return (
    <AuthContext.Provider
      value={{ ...auth, login, register, logout, devPreviewDoctor, devPreviewAssistant, devPreviewPatient }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
