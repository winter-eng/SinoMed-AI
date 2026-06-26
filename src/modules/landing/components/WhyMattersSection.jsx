import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

function AnimatedStat({ value, suffix, label, delay }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayed, setDisplayed] = useState('0')

  const isNumeric = !isNaN(Number(value.replace(/[MK%]/g, '')))

  useEffect(() => {
    if (!isInView || !isNumeric) {
      setDisplayed(value)
      return
    }
    const num = parseFloat(value)
    const suffix2 = value.replace(/[0-9.]/g, '')
    const duration = 1500
    const startTime = performance.now()
    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = eased * num
      setDisplayed(Math.round(current).toString() + suffix2)
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, value, isNumeric])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col items-center text-center gap-1"
    >
      <p className="text-4xl font-bold text-foreground">
        {displayed}{suffix}
      </p>
      <p className="text-sm text-muted-foreground max-w-[180px] leading-snug">{label}</p>
    </motion.div>
  )
}

export function WhyMattersSection() {
  const { t } = useTranslation()

  const stats = [
    { value: t('landing.whyMatters.stat1Value'), label: t('landing.whyMatters.stat1Label') },
    { value: t('landing.whyMatters.stat2Value'), label: t('landing.whyMatters.stat2Label') },
    {
      value: t('landing.whyMatters.stat3Value'),
      suffix: t('landing.whyMatters.stat3Suffix'),
      label: t('landing.whyMatters.stat3Label'),
    },
    { value: t('landing.whyMatters.stat4Value'), label: t('landing.whyMatters.stat4Label') },
  ]

  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="mb-2 text-sm font-medium text-primary">{t('landing.whyMatters.label')}</p>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-3">
            {t('landing.whyMatters.title')}
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground">
            {t('landing.whyMatters.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <AnimatedStat key={i} {...s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
