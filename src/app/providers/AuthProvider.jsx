import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { authApi } from '@/shared/api/auth.api'
import { patientApi } from '@/shared/api/patient.api'
import { STORAGE_KEYS } from '@/shared/constants/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
    setAuth({ user: null, token: null, isAuthenticated: false, isLoading: false })
  }, [])

  // Bootstrap: check stored token and validate with server
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (!token) {
      setAuth((prev) => ({ ...prev, isLoading: false }))
      return
    }
    patientApi
      .me()
      .then((user) => {
        setAuth({ user, token, isAuthenticated: true, isLoading: false })
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
        setAuth({ user: null, token: null, isAuthenticated: false, isLoading: false })
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

  const login = useCallback(async (email, password) => {
    const { access_token } = await authApi.login({ email, password })
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, access_token)
    const user = await patientApi.me()
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
    setAuth({ user, token: access_token, isAuthenticated: true, isLoading: false })
  }, [])

  const register = useCallback(
    async ({ full_name, email, password }) => {
      await authApi.register({ full_name, email, password })
      await login(email, password)
    },
    [login],
  )

  return (
    <AuthContext.Provider value={{ ...auth, login, register, logout }}>
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
