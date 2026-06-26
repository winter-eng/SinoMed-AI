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
  const { isAuthenticated, isLoading } = useAuth()
  const [mode, setMode] = useState('login')

  if (!isLoading && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
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
          <div className="mb-8 flex flex-col items-center gap-4">
            <Logo size="xl" showText={false} />
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <h1 className="text-xl font-semibold text-foreground">
                  {isRegister ? t('auth.registerTitle') : t('auth.title')}
                </h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {isRegister ? t('auth.registerSubtitle') : t('auth.subtitle')}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <LoginForm mode={mode} />
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {isRegister ? t('auth.haveAccount') : t('auth.noAccount')}{' '}
            <button
              onClick={() => setMode(isRegister ? 'login' : 'register')}
              className="text-primary hover:underline font-medium"
            >
              {isRegister ? t('auth.backToLogin') : t('auth.register')}
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
