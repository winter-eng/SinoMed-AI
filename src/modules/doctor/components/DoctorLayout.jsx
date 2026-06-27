import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/app/providers/ThemeProvider'
import { THEMES } from '@/shared/constants/theme'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'
import { DoctorBottomNav } from './DoctorBottomNav'

const desktopNavKeys = ['chat', 'history', 'cases', 'settings', 'profile']
const desktopNavHrefs = {
  chat: ROUTES.DOCTOR.CHAT,
  history: ROUTES.DOCTOR.HISTORY,
  cases: ROUTES.DOCTOR.CASES,
  settings: ROUTES.DOCTOR.SETTINGS,
  profile: ROUTES.DOCTOR.PROFILE,
}

export function DoctorLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language.startsWith('uz') ? 'ru' : 'uz')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card/90 px-4 backdrop-blur-xl lg:px-8">
        {/* Brand + desktop nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <span className="font-bold text-primary text-lg tracking-tight">SinoMed AI</span>
            <span className="hidden sm:inline text-[11px] font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5 leading-none">
              {t('doctor.role')}
            </span>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {desktopNavKeys.map((key) => (
              <NavLink
                key={key}
                to={desktopNavHrefs[key]}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                  )
                }
              >
                {t(`doctor.nav.${key}`)}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleLang}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {i18n.language.startsWith('uz') ? 'RU' : 'UZ'}
          </button>
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {theme === THEMES.DARK ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={handleLogout}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pb-20 lg:pb-8">
        <div className="mx-auto w-full max-w-6xl px-4 py-5 lg:px-8 lg:py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <DoctorBottomNav />
    </div>
  )
}
