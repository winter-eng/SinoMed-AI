import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function DoctorPlaceholder({ icon: Icon, titleKey, subtitleKey }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-foreground">{t(titleKey)}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xs leading-relaxed">
          {t(subtitleKey)}
        </p>
      </div>
    </motion.div>
  )
}
