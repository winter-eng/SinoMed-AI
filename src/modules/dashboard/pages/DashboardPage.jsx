import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Calendar } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { StatCard } from '@/shared/components/ui/StatCard'
import { ScreeningCTA } from '../components/ScreeningCTA'
import { RecentAnalyses } from '../components/RecentAnalyses'
import { useTashkentDate } from '@/shared/hooks/useTashkentDate'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const dateStr = useTashkentDate()

  const firstName = user?.name?.split(' ')[0] ?? ''
  const greeting = user
    ? `${t('dashboard.greeting')}, ${firstName}!`
    : t('dashboard.greeting')

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-muted-foreground text-sm capitalize">{dateStr}</p>
        <h1 className="mt-0.5 text-xl font-semibold text-foreground">{greeting}</h1>
      </motion.div>

      <ScreeningCTA />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="grid grid-cols-3 gap-2"
      >
        <StatCard value="3" label={t('dashboard.statScreenings')} icon={<Activity className="h-4 w-4" />} compact />
        <StatCard value="42" label={t('dashboard.statRisk')} icon={<TrendingUp className="h-4 w-4" />} compact />
        <StatCard value={t('dashboard.today')} label={t('dashboard.statLast')} icon={<Calendar className="h-4 w-4" />} compact />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        <RecentAnalyses />
      </motion.div>
    </div>
  )
}
