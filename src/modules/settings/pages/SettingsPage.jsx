import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Bell, Shield, Info } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { AppearanceSection } from '../components/AppearanceSection'

function SettingRow({ icon: Icon, title, description }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('settings.title')}</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="text-sm font-semibold text-foreground mb-4">{t('settings.appearance')}</h2>
          <AppearanceSection />
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <SettingRow icon={Bell} title={t('settings.notifications')} description={t('settings.notifDesc')} />
          <SettingRow icon={Shield} title={t('settings.privacy')} description={t('settings.privacyDesc')} />
          <SettingRow icon={Info} title={t('settings.about')} description={`${t('settings.version')} ${t('settings.versionValue')}`} />
        </Card>
      </motion.div>
    </div>
  )
}
