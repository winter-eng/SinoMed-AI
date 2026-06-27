import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Edit2, LogOut, Phone, Mail, BadgeCheck, Stethoscope, AtSign, Hash, Calendar } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Logo } from '@/shared/components/ui/Logo'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/constants/routes'

function initials(name) {
  if (!name) return 'DR'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function formatDate(iso) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return iso
  }
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-foreground">{value || '—'}</p>
      </div>
    </div>
  )
}

export function DoctorProfilePage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.full_name || '—'
  const specialization = user?.specialization

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex justify-center pt-1"
      >
        <Logo size="md" showText />
      </motion.div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.35 }}
      >
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
              {initials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
              {specialization && (
                <p className="truncate text-sm text-muted-foreground">{specialization}</p>
              )}
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <BadgeCheck className="h-3 w-3" />
                {t('doctor.role')}
              </span>
            </div>
            <button
              aria-label={t('doctor.profile.editProfile')}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Professional info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.35 }}
      >
        <Card variant="default" padding="lg">
          <h2 className="mb-1 text-sm font-semibold text-foreground">Professional</h2>
          <div className="mt-3">
            <InfoRow icon={Stethoscope} label={t('doctor.profile.specialization')} value={specialization} />
            <InfoRow icon={Hash} label={t('doctor.profile.clinicId')} value={user?.clinic_id} />
            <InfoRow icon={AtSign} label={t('doctor.profile.username')} value={user?.username} />
            <InfoRow icon={Calendar} label={t('doctor.profile.joinedDate')} value={formatDate(user?.created_at)} />
          </div>
        </Card>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <Card variant="default" padding="lg">
          <h2 className="mb-1 text-sm font-semibold text-foreground">Contact</h2>
          <div className="mt-3">
            <InfoRow icon={Phone} label={t('doctor.profile.phone')} value={user?.phone} />
            <InfoRow icon={Mail} label={t('doctor.profile.email')} value={user?.email} />
          </div>
        </Card>
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.35 }}
      >
        <Button
          variant="outline"
          size="md"
          onClick={handleLogout}
          leftIcon={<LogOut className="h-4 w-4" />}
          className="w-full border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/8"
        >
          {t('doctor.profile.logout')}
        </Button>
      </motion.div>
    </div>
  )
}
