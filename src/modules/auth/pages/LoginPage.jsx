import { useState } from 'react'
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

export function LoginPage() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, role, devPreviewDoctor } = useAuth()
  const [mode, setMode] = useState('login')

  // Redirect authenticated users to their role-specific workspace
  if (!isLoading && isAuthenticated) {
    return <Navigate to={role === 'doctor' ? ROUTES.DOCTOR.CASES : ROUTES.DASHBOARD} replace />
  }

  const isRegister = mode === 'register'

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
          {/* Title — each mode gets its own stable key so props never bleed into the exiting element */}
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

          {/* Form card — same fix: hardcoded mode per child prevents prop leakage during exit */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <AnimatePresence mode="wait">
              {mode === 'login' && (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <LoginForm mode="login" />
                </motion.div>
              )}
              {mode === 'register' && (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <LoginForm mode="register" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode toggle */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
            <button
              onClick={() => setMode(isRegister ? 'login' : 'register')}
              className="text-primary hover:underline font-medium"
            >
              {isRegister ? t('auth.backToLogin') : t('auth.register')}
            </button>
          </p>

          {/* Dev preview — stripped from production builds by Vite tree-shaking */}
          {import.meta.env.DEV && (
            <div className="mt-4 text-center">
              <button
                onClick={devPreviewDoctor}
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground border border-dashed border-border/50 hover:border-border rounded-lg px-3 py-1.5 transition-colors"
              >
                Developer Preview — Doctor
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
