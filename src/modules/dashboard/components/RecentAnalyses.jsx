import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ChevronRight, Clock } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'

const MOCK_ANALYSES = [
  { id: 'a1', date: '2025-06-25', riskScore: 42, riskLevel: 1, status: 'ready' },
  { id: 'a2', date: '2025-06-20', riskScore: 67, riskLevel: 2, status: 'ready' },
  { id: 'a3', date: '2025-06-14', riskScore: 28, riskLevel: 0, status: 'ready' },
]

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

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{t('dashboard.recentTitle')}</h2>
      </div>

      {MOCK_ANALYSES.length === 0 ? (
        <EmptyState
          icon={<Clock className="h-6 w-6" />}
          title={t('dashboard.recentEmpty')}
          description={t('dashboard.recentEmptyDesc')}
          action={{ label: t('dashboard.ctaButton'), onClick: () => navigate(ROUTES.SCREENING.NEW) }}
        />
      ) : (
        <div className="space-y-2">
          {MOCK_ANALYSES.map((analysis, i) => {
            const risk = riskConfig[analysis.riskLevel] ?? riskConfig[0]
            return (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
              >
                <Card
                  variant="default"
                  padding="md"
                  className="flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors group"
                  onClick={() => navigate(ROUTES.ANALYSIS.RESULT(analysis.id))}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <span className="text-sm font-bold text-foreground">{analysis.riskScore}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', risk.color)}>
                        {t(`dashboard.${risk.label}`)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatDate(analysis.date, t)}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {MOCK_ANALYSES.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full text-muted-foreground"
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          {t('dashboard.recentTitle')}
        </Button>
      )}
    </div>
  )
}
