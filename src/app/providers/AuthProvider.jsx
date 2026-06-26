import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
  })

  const login = (user, token) => {
    setAuth({ user, token, isAuthenticated: true })
  }

  const logout = () => {
    setAuth({ user: null, token: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
