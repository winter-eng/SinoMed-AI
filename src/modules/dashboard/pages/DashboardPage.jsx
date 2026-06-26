import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Calendar } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { StatCard } from '@/shared/components/ui/StatCard'
import { ScreeningCTA } from '../components/ScreeningCTA'
import { RecentAnalyses } from '../components/RecentAnalyses'
import { HealthScore } from '../components/HealthScore'
import { useTashkentDate } from '@/shared/hooks/useTashkentDate'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.23, 1, 0.32, 1] } },
}

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const dateStr = useTashkentDate()

  const firstName = user?.name?.split(' ')[0] ?? ''
  const greeting = user
    ? `${t('dashboard.greeting')}, ${firstName}!`
    : t('dashboard.greeting')

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
        <StatCard value="3" label={t('dashboard.statScreenings')} icon={<Activity className="h-4 w-4" />} compact />
        <StatCard value="42" label={t('dashboard.statRisk')} icon={<TrendingUp className="h-4 w-4" />} compact />
        <StatCard value={t('dashboard.today')} label={t('dashboard.statLast')} icon={<Calendar className="h-4 w-4" />} compact />
      </motion.div>

      <motion.div variants={itemVariants}>
        <HealthScore />
      </motion.div>

      <motion.div variants={itemVariants}>
        <RecentAnalyses />
      </motion.div>
    </motion.div>
  )
}
