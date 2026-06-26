import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { User, Edit2, LogOut, Shield, Mail, ChevronRight, FileHeart } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/constants/routes'

function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  const displayName = user?.name || t('profile.title')
  const displayEmail = user?.email || '—'

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('profile.title')}</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      >
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
              {user ? initials(displayName) : <User className="h-7 w-7" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{displayEmail}</p>
            </div>
            <button
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label={t('profile.editProfile')}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
      >
        <Link
          to={ROUTES.HEALTH_PROFILE}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50 active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileHeart className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{t('profile.healthProfile')}</p>
            <p className="text-xs text-muted-foreground">{t('profile.viewHealthProfile')}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.13, duration: 0.35 }}
      >
        <Card variant="default" padding="lg">
          <h2 className="text-sm font-semibold text-foreground mb-1">{t('profile.accountInfo')}</h2>
          <div className="mt-3">
            <ProfileRow icon={User} label={t('profile.name')} value={displayName} />
            <ProfileRow icon={Mail} label={t('profile.email')} value={displayEmail} />
            <ProfileRow icon={Shield} label={t('profile.accountType')} value={t('profile.accountTypeValue')} />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <Button
          variant="outline"
          size="md"
          onClick={handleLogout}
          leftIcon={<LogOut className="h-4 w-4" />}
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/8 hover:border-destructive/50"
        >
          {t('profile.logout')}
        </Button>
      </motion.div>
    </div>
  )
}
