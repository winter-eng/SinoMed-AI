import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronRight, Clock, Loader2, AlertCircle } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'
import { usePredictions } from '@/shared/hooks/usePredictions'

const riskConfig = {
  0: { label: 'riskLow', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
  1: { label: 'riskLow', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
  2: { label: 'riskModerate', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
  3: { label: 'riskHigh', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40' },
  4: { label: 'riskHigh', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40' },
}

function formatDate(dateStr, t) {
  const date = new Date(dateStr)
  const today = new Date()
  const diff = Math.floor((today.getTime() - date.getTime()) / 86400000)
  if (diff === 0) return t('dashboard.today')
  if (diff === 1) return t('dashboard.yesterday')
  return `${diff} ${t('dashboard.daysAgo')}`
}

export function RecentAnalyses() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: analyses, isLoading, error } = usePredictions({ limit: 5 })

  if (isLoading) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">{t('dashboard.recentTitle')}</h2>
        </div>
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">{t('dashboard.recentTitle')}</h2>
        </div>
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <p className="text-xs text-muted-foreground">{t('common.error')}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-primary hover:underline"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    )
  }

  const list = analyses ?? []

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{t('dashboard.recentTitle')}</h2>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title={t('dashboard.recentEmpty')}
          description={t('dashboard.recentEmptyDesc')}
          action={{ label: t('dashboard.ctaButton'), onClick: () => navigate(ROUTES.SCREENING.NEW) }}
        />
      ) : (
        <div className="space-y-2">
          {list.map((item, i) => {
            const riskLevel = item.diagnosis // 0–4 integer from API
            const riskScore = Math.round((riskLevel / 4) * 100)
            const risk = riskConfig[riskLevel] ?? riskConfig[0]
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              >
                <Card
                  variant="default"
                  padding="md"
                  className="flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors group"
                  onClick={() => navigate(ROUTES.ANALYSIS.RESULT(item.id))}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <span className="text-sm font-bold text-foreground">{riskScore}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', risk.color)}>
                        {t(`dashboard.${risk.label}`)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(item.created_at, t)}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {list.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full text-muted-foreground"
          onClick={() => navigate(ROUTES.SCREENING.NEW)}
        >
          {t('dashboard.ctaButton')}
        </Button>
      )}
    </div>
  )
}
