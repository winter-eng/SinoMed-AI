import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ImageIcon, FileText, BarChart3 } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'

const features = [
  { icon: ImageIcon, titleKey: 'item1Title', descKey: 'item1Desc' },
  { icon: FileText, titleKey: 'item2Title', descKey: 'item2Desc' },
  { icon: BarChart3, titleKey: 'item3Title', descKey: 'item3Desc' },
]

export function FeaturesSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-medium text-primary">{t('landing.features.label')}</p>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t('landing.features.title')}
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, titleKey, descKey }, i) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card variant="default" padding="lg" className="h-full">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  {t(`landing.features.${titleKey}`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`landing.features.${descKey}`)}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
