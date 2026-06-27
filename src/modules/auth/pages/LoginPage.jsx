import { useState, useRef } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { LanguageToggle } from '@/shared/components/ui/LanguageToggle'
import { Logo } from '@/shared/components/ui/Logo'
import { ROUTES } from '@/shared/constants/routes'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '@/app/providers/AuthProvider'
// DEV-only — remove this import and the <DevPreviewModal> usage before production
import { DevPreviewModal } from '../components/DevPreviewModal'

export function LoginPage() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, role } = useAuth()
  const [mode, setMode] = useState('login')
  const [showDevModal, setShowDevModal] = useState(false)
  const tapTimesRef = useRef([])

  if (!isLoading && isAuthenticated) {
    if (role === 'doctor') return <Navigate to={ROUTES.DOCTOR.CASES} replace />
    if (role === 'assistant') return <Navigate to={ROUTES.ASSISTANT.REFERRAL} replace />
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  const isRegister = mode === 'register'

  // Hidden dev trigger: 5 taps within 2 seconds reveals the developer preview modal
  const handleHiddenTap = () => {
    if (!import.meta.env.DEV) return
    const now = Date.now()
    tapTimesRef.current = [...tapTimesRef.current, now].filter((t) => now - t < 2000)
    if (tapTimesRef.current.length >= 5) {
      tapTimesRef.current = []
      setShowDevModal(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">SinoMed AI</span>
        </Link>
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-sm"
        >
          {/* Title */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <Logo size="xl" showText={false} />
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.div
                  key="login-title"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <h1 className="text-xl font-semibold text-foreground">{t('auth.title')}</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t('auth.subtitle')}</p>
                </motion.div>
              )}
              {mode === 'register' && (
                <motion.div
                  key="register-title"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <h1 className="text-xl font-semibold text-foreground">{t('auth.registerTitle')}</h1>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t('auth.registerSubtitle')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form card — key={mode} remounts LoginForm on switch, preventing blank-form bug */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <LoginForm key={mode} mode={mode} />
          </div>

          {/* Mode toggle */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
            <button
              onClick={() => setMode(isRegister ? 'login' : 'register')}
              className="font-medium text-primary hover:underline"
            >
              {isRegister ? t('auth.backToLogin') : t('auth.register')}
            </button>
          </p>

          {import.meta.env.DEV && (
            <button
              onClick={() => setShowDevModal(true)}
              className="mt-5 w-full rounded-xl border border-dashed border-border bg-muted/30 py-2 text-xs font-mono text-muted-foreground hover:bg-muted transition-colors"
            >
              DEV PREVIEW
            </button>
          )}
        </motion.div>
      </main>

      {/* DEV only — remove before production */}
      {import.meta.env.DEV && (
        <DevPreviewModal isOpen={showDevModal} onClose={() => setShowDevModal(false)} />
      )}
    </div>
  )
}
