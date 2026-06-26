import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { ROUTES } from '@/shared/constants/routes'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { LanguageToggle } from '@/shared/components/ui/LanguageToggle'
import { Logo } from '@/shared/components/ui/Logo'
import { cn } from '@/shared/lib/utils'
import { useAuth } from '@/app/providers/AuthProvider'

const navLinks = [
  { key: 'dashboard', href: ROUTES.DASHBOARD },
  { key: 'support', href: ROUTES.SUPPORT },
  { key: 'clinics', href: ROUTES.CLINICS },
  { key: 'settings', href: ROUTES.SETTINGS },
]

export function DesktopTopbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <header className="hidden lg:flex sticky top-0 z-40 h-14 w-full items-center border-b border-border bg-card/80 backdrop-blur-xl px-6">
      <Link to={ROUTES.DASHBOARD} className="mr-8">
        <Logo size="md" />
      </Link>

      <nav aria-label="Main navigation" className="flex items-center gap-1">
        {navLinks.map(({ key, href }) => {
          const isActive = location.pathname === href
          return (
            <Link
              key={key}
              to={href}
              className={cn(
                'relative flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="desktop-nav-indicator"
                  className="absolute inset-0 rounded-md bg-accent"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative">{t(`nav.${key}`)}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />

        {user && (
          <div className="ml-2 flex items-center gap-2 border-l border-border pl-3">
            <Link
              to={ROUTES.PROFILE}
              className="flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-accent"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                <User className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                {user.full_name}
              </span>
            </Link>
            <button
              onClick={logout}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="Logout"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
