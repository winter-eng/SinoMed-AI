import { motion } from 'framer-motion'
import { cn } from '@/shared/lib/utils'

const riskColors = {
  0: { ring: 'stroke-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  1: { ring: 'stroke-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  2: { ring: 'stroke-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  3: { ring: 'stroke-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
  4: { ring: 'stroke-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
}

const RADIUS = 54
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function RiskGauge({ score, riskLevel, confidence, riskLabel, confidenceLabel }) {
  const colors = riskColors[riskLevel] ?? riskColors[0]
  const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

  return (
    <div className={cn('rounded-2xl p-6 flex flex-col items-center gap-4', colors.bg)}>
      <div className="relative">
        <svg width="140" height="140" className="-rotate-90">
          <circle cx="70" cy="70" r={RADIUS} fill="none" strokeWidth="10" className="stroke-muted" />
          <motion.circle
            cx="70" cy="70" r={RADIUS} fill="none" strokeWidth="10" strokeLinecap="round"
            className={colors.ring}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            className={cn('text-4xl font-bold', colors.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground mt-0.5">/ 100</span>
        </div>
      </div>

      <div className="text-center">
        <span className={cn('text-lg font-semibold', colors.text)}>{riskLabel}</span>
        <p className="text-xs text-muted-foreground mt-1">
          {confidenceLabel}: <strong className="text-foreground">{confidence}%</strong>
        </p>
      </div>
    </div>
  )
}
