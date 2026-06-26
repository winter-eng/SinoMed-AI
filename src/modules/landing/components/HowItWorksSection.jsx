import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Upload, ClipboardList, CheckCircle2 } from 'lucide-react'

const steps = [
  { icon: Upload, titleKey: 'step1Title', descKey: 'step1Desc', number: '01' },
  { icon: ClipboardList, titleKey: 'step2Title', descKey: 'step2Desc', number: '02' },
  { icon: CheckCircle2, titleKey: 'step3Title', descKey: 'step3Desc', number: '03' },
]

export function HowItWorksSection() {
  const { t } = useTranslation()

  return (
    <section className="py-20 px-4 bg-muted/40">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm font-medium text-primary">{t('landing.howItWorks.label')}</p>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t('landing.howItWorks.title')}
          </h2>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, titleKey, descKey, number }, i) => (
            <motion.div
              key={titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {number}
                </span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">
                  {t(`landing.howItWorks.${titleKey}`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`landing.howItWorks.${descKey}`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
