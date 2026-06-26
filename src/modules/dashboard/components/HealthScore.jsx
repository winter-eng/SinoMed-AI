import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart, Droplets, Wind, Scale } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'
import { useCountUp } from '@/shared/hooks/useCountUp'

const OVERALL_SCORE = 84
const RADIUS = 40
const STROKE_WIDTH = 8
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const METRICS = [
  {
    icon: Heart,
    key: 'healthHeart',
    score: 88,
    iconClass: 'text-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40',
    barClass: 'bg-rose-500',
  },
  {
    icon: Droplets,
    key: 'healthDiabetes',
    score: 74,
    iconClass: 'text-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40',
    barClass: 'bg-amber-500',
  },
  {
    icon: Wind,
    key: 'healthLungs',
    score: 91,
    iconClass: 'text-sky-500',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40',
    barClass: 'bg-sky-500',
  },
  {
    icon: Scale,
    key: 'healthWeight',
    score: 68,
    iconClass: 'text-violet-500',
    iconBg: 'bg-violet-50 dark:bg-violet-950/40',
    barClass: 'bg-violet-500',
  },
]

function ScoreRing({ score }) {
  const animated = useCountUp(score, { duration: 1.4, delay: 0.2 })
  const offset = CIRCUMFERENCE * (1 - score / 100)

  return (
    <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full -rotate-90"
        aria-hidden
      >
        {/* Track */}
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          className="text-muted/80"
          stroke="currentColor"
        />
        {/* Arc */}
        <motion.circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          className="text-primary"
          stroke="currentColor"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-foreground leading-none">
          {animated}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">/100</span>
      </div>
    </div>
  )
}

function MetricCard({ metric, index }) {
  const { t } = useTranslation()
  const score = useCountUp(metric.score, { duration: 1.0, delay: 0.3 + index * 0.08 })
  const Icon = metric.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.25 + index * 0.07 }}
      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3"
    >
      <div className="flex items-center justify-between gap-2">
        <div className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg', metric.iconBg)}>
          <Icon className={cn('h-3.5 w-3.5', metric.iconClass)} />
        </div>
        <span className="text-sm font-semibold tabular-nums text-foreground">{score}</span>
      </div>

      <p className="text-xs text-muted-foreground leading-none">{t(`dashboard.${metric.key}`)}</p>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn('h-full rounded-full', metric.barClass)}
          initial={{ width: 0 }}
          animate={{ width: `${metric.score}%` }}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.35 + index * 0.08 }}
        />
      </div>
    </motion.div>
  )
}

export function HealthScore() {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: 0.2 }}
    >
      <Card variant="default" padding="md">
        <p className="mb-4 text-sm font-semibold text-foreground">{t('dashboard.healthScore')}</p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
          {/* Ring */}
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={OVERALL_SCORE} />
            <p className="text-xs text-muted-foreground">{t('dashboard.healthScoreDesc')}</p>
          </div>

          {/* 2×2 metric grid */}
          <div className="grid flex-1 grid-cols-2 gap-2">
            {METRICS.map((m, i) => (
              <MetricCard key={m.key} metric={m} index={i} />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
