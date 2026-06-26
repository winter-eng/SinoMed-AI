import { createContext, useContext, useEffect, useState } from 'react'
import { STORAGE_KEYS } from '@/shared/constants/storage'
import { THEMES } from '@/shared/constants/theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME)
    return stored === THEMES.DARK ? THEMES.DARK : THEMES.LIGHT
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(THEMES.LIGHT, THEMES.DARK)
    root.classList.add(theme)
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  const setTheme = setThemeState

  const toggleTheme = () =>
    setThemeState((t) => (t === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
