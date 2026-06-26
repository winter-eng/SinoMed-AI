import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/constants/routes'

export function CtaSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className="py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
          {t('landing.cta.badge')}
        </span>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-3">
          {t('landing.cta.title')}
        </h2>
        <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
          {t('landing.cta.subtitle')}
        </p>
        <Button
          size="lg"
          onClick={() => navigate(ROUTES.SCREENING.NEW)}
          rightIcon={<ArrowRight className="h-4 w-4" />}
          className="shadow-md shadow-primary/20"
        >
          {t('landing.cta.button')}
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">{t('landing.cta.disclaimer')}</p>
      </motion.div>
    </section>
  )
}
