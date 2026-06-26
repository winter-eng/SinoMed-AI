import { useState, useCallback } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { router } from './router'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './providers/AuthProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { SplashScreen } from '@/shared/components/ui/SplashScreen'

function AppShell() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('sinomed-splash-shown')
  })

  const handleSplashDone = useCallback(() => {
    sessionStorage.setItem('sinomed-splash-shown', '1')
    setShowSplash(false)
  }, [])

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" onDone={handleSplashDone} />}
      </AnimatePresence>
      <RouterProvider router={router} />
    </>
  )
}

export function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
