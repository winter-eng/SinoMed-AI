import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Edit2, LogOut, Copy, Trophy, Users, Calendar, BadgeCheck, Star, Zap, Award, Phone, Mail, AtSign } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Logo } from '@/shared/components/ui/Logo'
import { useAuth } from '@/app/providers/AuthProvider'
import { nurseApi } from '@/shared/api/nurse.api'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'

function initials(name) {
  if (!name) return 'MA'
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

function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={cn('mt-0.5 text-sm font-medium text-foreground truncate', mono && 'font-mono tracking-wider')}>
          {value || '—'}
        </p>
      </div>
    </div>
  )
}

const BADGES = [
  { icon: Star, label: 'Early Bird', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: Zap, label: 'Top 10', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { icon: Award, label: '50 Referrals', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
]

export function AssistantProfilePage() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [codeCopied, setCodeCopied] = useState(false)
  const [referrals, setReferrals] = useState([])

  const displayName = user?.full_name || '—'
  const referralCode = user?.referral_code || '—'

  useEffect(() => {
    nurseApi
      .referrals()
      .then((data) => setReferrals(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const totalReferrals = referrals.length

  const handleCopy = () => {
    if (referralCode === '—') return
    navigator.clipboard.writeText(referralCode).catch(() => {})
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex justify-center pt-1">
        <Logo size="md" showText />
      </motion.div>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
              {initials(displayName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-foreground">{displayName}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <BadgeCheck className="h-3 w-3" />
                {t('assistant.role')}
              </span>
            </div>
            <button
              aria-label={t('assistant.profile.editProfile')}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>
      </motion.div>

      {/* Referral code */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <p className="text-xs text-muted-foreground mb-2">{t('assistant.profile.referralCode')}</p>
          <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
            <span className="font-mono font-bold tracking-widest text-foreground text-sm">{referralCode}</span>
            <button
              onClick={handleCopy}
              className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ml-2',
                codeCopied ? 'bg-green-500/10 text-green-600' : 'bg-background text-muted-foreground hover:text-foreground')}
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
          {codeCopied && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-xs text-center text-green-600 font-medium">
              Copied!
            </motion.p>
          )}
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="mb-1 text-sm font-semibold text-foreground">Stats</h2>
          <div className="mt-3">
            <InfoRow icon={Calendar} label={t('assistant.profile.joinedDate')} value={formatDate(user?.created_at)} />
            <InfoRow icon={Users} label={t('assistant.profile.totalReferrals')} value={String(totalReferrals)} />
            <InfoRow icon={AtSign} label={t('auth.username')} value={user?.username} />
            <InfoRow icon={Phone} label="Phone" value={user?.phone} />
            <InfoRow icon={Mail} label="Email" value={user?.email} />
          </div>
        </Card>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="mb-3 text-sm font-semibold text-foreground">{t('assistant.profile.badges')}</h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-border py-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', bg)}>
                  <Icon className={cn('h-5 w-5', color)} />
                </div>
                <p className="text-[10px] font-medium text-foreground text-center leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="mb-3 text-sm font-semibold text-foreground">{t('assistant.profile.achievements')}</h2>
          <div className="space-y-3">
            {[
              { label: 'First Referral', desc: 'Sent your first invite', done: totalReferrals >= 1, pct: Math.min(100, totalReferrals * 100) },
              { label: '10 Registrations', desc: 'Reached 10 successful sign-ups', done: totalReferrals >= 10, pct: Math.min(100, totalReferrals * 10) },
              { label: '100 Referrals', desc: 'Reach 100 total referrals', done: totalReferrals >= 100, pct: Math.min(100, totalReferrals) },
            ].map(({ label, desc, done, pct }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                  {done ? '✓' : <span className="text-xs font-semibold">{pct}%</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', done ? 'text-foreground' : 'text-muted-foreground')}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                  {!done && (
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary/50" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, duration: 0.35 }}>
        <Button variant="outline" size="md" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}
          className="w-full border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/8">
          {t('assistant.profile.logout')}
        </Button>
      </motion.div>
    </div>
  )
}
