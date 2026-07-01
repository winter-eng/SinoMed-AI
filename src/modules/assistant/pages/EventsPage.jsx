import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AlertCircle, CalendarX, Loader2, Users } from 'lucide-react'
import { nurseApi } from '@/shared/api/nurse.api'

export function EventsPage() {
  const { t } = useTranslation()
  const [myReferrals, setMyReferrals] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    nurseApi
      .referrals()
      .then((data) => setMyReferrals(Array.isArray(data) ? data.length : 0))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false))
  }, [t])

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl font-semibold text-foreground">{t('assistant.events.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('assistant.events.subtitle')}</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
          className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card py-14 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <CalendarX className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{t('assistant.events.empty')}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t('assistant.events.emptyHint')}</p>
          </div>
          {myReferrals !== null && (
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              {myReferrals} {t('assistant.leaderboard.referrals')}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
