import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Calendar, CheckCircle } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'

const HISTORY = [
  { id: 1, name: 'Bobur Xolmatov', diagnosis: 'Type 2 Diabetes', date: 'Jun 20, 2026', risk: 78 },
  { id: 2, name: 'Nasiba Rahimova', diagnosis: 'Pre-diabetes', date: 'Jun 18, 2026', risk: 42 },
  { id: 3, name: 'Zulfiya Abdullayeva', diagnosis: 'Diabetic Retinopathy', date: 'Jun 15, 2026', risk: 85 },
  { id: 4, name: 'Alisher Tursunov', diagnosis: 'Normal', date: 'Jun 12, 2026', risk: 18 },
  { id: 5, name: 'Feruza Xasanova', diagnosis: 'Type 2 Diabetes', date: 'Jun 8, 2026', risk: 71 },
  { id: 6, name: 'Sardor Mirzayev', diagnosis: 'Pre-diabetes', date: 'Jun 5, 2026', risk: 49 },
]

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function riskLabel(risk) {
  if (risk >= 75) return { label: 'Yuqori', color: 'text-destructive' }
  if (risk >= 40) return { label: "O'rtacha", color: 'text-amber-500' }
  return { label: 'Past', color: 'text-green-500' }
}

export function PatientHistoryPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl font-semibold text-foreground">{t('doctor.history.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('doctor.history.subtitle')}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2.5"
      >
        <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          {HISTORY.length} {t('doctor.history.totalLabel')}
        </span>
      </motion.div>

      <div className="space-y-3">
        {HISTORY.map((h, i) => {
          const { label, color } = riskLabel(h.risk)
          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.1, duration: 0.3 }}
            >
              <Card variant="default" padding="md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground text-sm font-bold">
                    {initials(h.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{h.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{h.diagnosis}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{h.date}</span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
                      <CheckCircle className="h-2.5 w-2.5" />
                      {t('doctor.history.completed')}
                    </span>
                    <span className={cn('text-xs font-medium', color)}>
                      {label} · {h.risk}%
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
