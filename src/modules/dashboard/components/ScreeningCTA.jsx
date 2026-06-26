import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ScanLine, ArrowRight } from 'lucide-react'
import { ROUTES } from '@/shared/constants/routes'
import { Button } from '@/shared/components/ui/Button'

export function ScreeningCTA() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-lg shadow-primary/20"
    >
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 -translate-y-8 translate-x-8 rounded-full bg-white/8" />
      <div className="pointer-events-none absolute right-8 bottom-0 h-24 w-24 translate-y-6 rounded-full bg-white/5" />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <ScanLine className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-base leading-tight">{t('dashboard.ctaTitle')}</h2>
            <p className="mt-0.5 text-sm text-primary-foreground/75">{t('dashboard.ctaSubtitle')}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => navigate(ROUTES.SCREENING.NEW)}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="bg-white/15 text-primary-foreground hover:bg-white/25 border-0 shrink-0"
        >
          {t('dashboard.ctaButton')}
        </Button>
      </div>
    </motion.div>
  )
}
