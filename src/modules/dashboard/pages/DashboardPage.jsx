import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Calendar } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { StatCard } from '@/shared/components/ui/StatCard'
import { ScreeningCTA } from '../components/ScreeningCTA'
import { RecentAnalyses } from '../components/RecentAnalyses'
import { useTashkentDate } from '@/shared/hooks/useTashkentDate'
import { usePredictions } from '@/shared/hooks/usePredictions'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] } },
}

function formatLastDate(dateStr, t) {
  if (!dateStr) return t('dashboard.statNever')
  const date = new Date(dateStr)
  const today = new Date()
  const diff = Math.floor((today.getTime() - date.getTime()) / 86400000)
  if (diff === 0) return t('dashboard.today')
  if (diff === 1) return t('dashboard.yesterday')
  return `${diff} ${t('dashboard.daysAgo')}`
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const dateStr = useTashkentDate()
  const { data: predictions } = usePredictions({ limit: 50 })

  const firstName = user?.full_name?.split(' ')[0] ?? ''
  const greeting = user
    ? `${t('dashboard.greeting')}, ${firstName}!`
    : t('dashboard.greeting')

  const list = predictions ?? []
  const totalCount = list.length
  const avgRisk = totalCount
    ? Math.round((list.reduce((sum, p) => sum + p.diagnosis, 0) / totalCount / 4) * 100)
    : 0
  const lastDate = list[0]?.created_at

  return (
    <motion.div
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <p className="text-muted-foreground text-sm capitalize">{dateStr}</p>
        <h1 className="mt-0.5 text-xl font-semibold text-foreground">{greeting}</h1>
      </motion.div>

      <motion.div variants={itemVariants}>
        <ScreeningCTA />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
        <StatCard
          value={String(totalCount)}
          label={t('dashboard.statScreenings')}
          icon={<Activity className="h-4 w-4" />}
          compact
        />
        <StatCard
          value={totalCount ? `${avgRisk}%` : '—'}
          label={t('dashboard.statRisk')}
          icon={<TrendingUp className="h-4 w-4" />}
          compact
        />
        <StatCard
          value={formatLastDate(lastDate, t)}
          label={t('dashboard.statLast')}
          icon={<Calendar className="h-4 w-4" />}
          compact
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <RecentAnalyses />
      </motion.div>
    </motion.div>
  )
}
