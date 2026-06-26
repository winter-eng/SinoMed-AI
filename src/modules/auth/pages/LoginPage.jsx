import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { LanguageToggle } from '@/shared/components/ui/LanguageToggle'
import { Logo } from '@/shared/components/ui/Logo'
import { ROUTES } from '@/shared/constants/routes'
import { LoginForm } from '../components/LoginForm'
import { useAuth } from '@/app/providers/AuthProvider'

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const devSkip = () => {
    login(
      { id: '1', name: 'Ahmad Karimov', email: 'dev@sinomed.ai', role: 'doctor', clinicId: 'c1' },
      'dev-token',
    )
    navigate(ROUTES.DASHBOARD)
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
          <div className="mb-8 flex flex-col items-center gap-4">
            <Logo size="xl" showText={false} />
            <div className="text-center">
              <h1 className="text-xl font-semibold text-foreground">{t('auth.title')}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{t('auth.subtitle')}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <LoginForm />

            <div className="relative my-5 flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="mx-3 text-xs text-muted-foreground">{t('auth.or')}</span>
              <div className="flex-1 border-t border-border" />
            </div>

            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t('auth.google')}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <button className="text-primary hover:underline font-medium">{t('auth.register')}</button>
          </p>

          <button
            onClick={devSkip}
            className="mt-4 block w-full text-center text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            {t('auth.devLink')}
          </button>
        </motion.div>
      </main>
    </div>
  )
}
