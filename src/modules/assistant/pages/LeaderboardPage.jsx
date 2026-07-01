import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/providers/AuthProvider'
import { nurseApi } from '@/shared/api/nurse.api'
import { Trophy, Users, Loader2, AlertCircle, Info } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'

function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

export function LeaderboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [myReferrals, setMyReferrals] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    nurseApi
      .referrals()
      .then((data) => setMyReferrals(Array.isArray(data) ? data.length : 0))
      .catch(() => setError(t('assistant.leaderboard.loadError')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl font-semibold text-foreground">{t('assistant.leaderboard.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('assistant.leaderboard.subtitle')}</p>
      </motion.div>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-destructive/60" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Own score card — real data from GET /nurses/referrals */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.35 }}
          >
            <Card variant="default" padding="lg">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-lg font-bold">
                  {initials(user?.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-base font-semibold text-foreground">
                    {user?.full_name || '—'}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{t('assistant.leaderboard.yourScore')}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-foreground">{myReferrals}</p>
                  <p className="text-xs text-muted-foreground">{t('assistant.leaderboard.referrals')}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Leaderboard not yet available */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card py-14 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Trophy className="h-7 w-7 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-foreground">{t('assistant.leaderboard.notAvailable')}</p>
            <p className="max-w-xs text-xs text-muted-foreground">{t('assistant.leaderboard.notAvailableDesc')}</p>
          </motion.div>
        </>
      )}
    </div>
  )
}
