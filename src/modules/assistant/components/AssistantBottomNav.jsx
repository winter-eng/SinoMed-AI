import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Gift, Trophy, Users, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'

const NAV = [
  { key: 'events', href: ROUTES.ASSISTANT.EVENTS, icon: Gift },
  { key: 'leaderboard', href: ROUTES.ASSISTANT.LEADERBOARD, icon: Trophy },
  { key: 'referral', href: ROUTES.ASSISTANT.REFERRAL, icon: Users, primary: true },
  { key: 'settings', href: ROUTES.ASSISTANT.SETTINGS, icon: Settings },
  { key: 'profile', href: ROUTES.ASSISTANT.PROFILE, icon: User },
]

export function AssistantBottomNav() {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Assistant navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/90 backdrop-blur-xl pb-safe"
    >
      <div className="flex h-16 items-center justify-around px-1">
        {NAV.map(({ key, href, icon: Icon, primary }) => {
          const isActive = pathname === href
          return (
            <Link
              key={key}
              to={href}
              aria-label={t(`assistant.nav.${key}`)}
              className={cn(
                'relative flex flex-col items-center gap-0.5 px-2 py-1 transition-colors',
                primary ? 'text-primary-foreground' : isActive ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {primary ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <div className="relative flex h-8 w-8 items-center justify-center">
                    {isActive && (
                      <motion.span
                        layoutId="assistant-nav-pill"
                        className="absolute inset-0 rounded-xl bg-primary/12"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                      />
                    )}
                    <Icon className="relative h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-medium leading-none">{t(`assistant.nav.${key}`)}</span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
