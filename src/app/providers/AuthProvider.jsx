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

  const updateUser = useCallback((userData) => {
    setAuth((prev) => ({ ...prev, user: userData }))
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData))
  }, [])

  return (
    <AuthContext.Provider
      value={{ ...auth, login, register, logout, updateUser }}
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
