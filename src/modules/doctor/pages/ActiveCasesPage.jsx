import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Activity, Clock, Eye, CheckCircle } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'

const CASES = [
  { id: 1, name: 'Aziz Karimov', age: 54, risk: 82, prediction: 'Type 2 Diabetes', status: 'waiting' },
  { id: 2, name: 'Malika Toshmatova', age: 41, risk: 65, prediction: 'Diabetic Retinopathy', status: 'review' },
  { id: 3, name: 'Jahon Nazarov', age: 67, risk: 91, prediction: 'Type 2 Diabetes', status: 'waiting' },
  { id: 4, name: 'Dilnoza Umarova', age: 38, risk: 28, prediction: 'Pre-diabetes', status: 'completed' },
  { id: 5, name: 'Rustam Qodirov', age: 59, risk: 74, prediction: 'Diabetic Neuropathy', status: 'progress' },
  { id: 6, name: 'Nargiza Yusupova', age: 45, risk: 55, prediction: 'Type 2 Diabetes', status: 'waiting' },
]

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function riskVariant(risk) {
  if (risk >= 75) return { text: 'text-destructive', bg: 'bg-destructive/10' }
  if (risk >= 40) return { text: 'text-amber-500', bg: 'bg-amber-500/10' }
  return { text: 'text-green-500', bg: 'bg-green-500/10' }
}

export function ActiveCasesPage() {
  const { t } = useTranslation()

  const STATUS_CONFIG = {
    waiting: {
      label: t('doctor.cases.statusWaiting'),
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      icon: Clock,
    },
    review: {
      label: t('doctor.cases.statusReview'),
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      icon: Eye,
    },
    progress: {
      label: t('doctor.cases.statusProgress'),
      color: 'text-indigo-600',
      bg: 'bg-indigo-500/10',
      icon: Activity,
    },
    completed: {
      label: t('doctor.cases.statusCompleted'),
      color: 'text-green-600',
      bg: 'bg-green-500/10',
      icon: CheckCircle,
    },
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl font-semibold text-foreground">{t('doctor.cases.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('doctor.cases.subtitle')}</p>
      </motion.div>

      <div className="space-y-3">
        {CASES.map((c, i) => {
          const status = STATUS_CONFIG[c.status]
          const StatusIcon = status.icon
          const risk = riskVariant(c.risk)

          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.05, duration: 0.3 }}
            >
              <Card
                variant="default"
                padding="md"
                className="cursor-pointer transition-colors hover:border-primary/20 active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {initials(c.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{c.name}</p>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                          status.bg,
                          status.color,
                        )}
                      >
                        <StatusIcon className="h-2.5 w-2.5" />
                        {status.label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {t('doctor.cases.ageLabel')}: {c.age}
                      </span>
                      <span className="text-xs text-muted-foreground">{c.prediction}</span>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl',
                      risk.bg,
                    )}
                  >
                    <span className={cn('text-base font-bold leading-none', risk.text)}>
                      {c.risk}%
                    </span>
                    <span className="mt-0.5 text-[9px] text-muted-foreground">AI</span>
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
