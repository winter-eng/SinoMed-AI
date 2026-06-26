import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Cpu, Brain } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

const badges = [
  { icon: Shield, key: 'badge1' },
  { icon: Cpu, key: 'badge2' },
  { icon: Brain, key: 'badge3' },
]

export function HeroSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center px-4 py-24 text-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 h-[300px] w-[300px] rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="mx-auto max-w-3xl">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {t('landing.hero.badge')}
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {t('landing.hero.title1')}
          <br />
          <span className="text-primary">{t('landing.hero.title2')}</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg leading-relaxed"
        >
          {t('landing.hero.subtitle')}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-wrap items-center justify-center gap-2"
        >
          {badges.map(({ icon: Icon, key }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              <Icon className="h-3 w-3 text-primary" />
              {t(`landing.hero.${key}`)}
            </span>
          ))}
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center gap-3"
        >
          <Button
            size="xl"
            onClick={() => navigate(ROUTES.SCREENING.NEW)}
            rightIcon={<ArrowRight className="h-4 w-4" />}
            className="shadow-lg shadow-primary/20 px-10"
          >
            {t('landing.hero.cta')}
          </Button>
          <p className="text-xs text-muted-foreground">{t('landing.hero.ctaSub')}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mx-auto mt-16 w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xl text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-muted-foreground">{t('landing.hero.cardDone')}</span>
            <span className="inline-flex h-5 items-center rounded-full bg-primary/12 px-2 text-[10px] font-semibold text-primary">
              AI
            </span>
          </div>
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-1">{t('landing.hero.cardRisk')}</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-foreground">42</span>
              <span className="mb-1 text-sm font-medium text-amber-500">{t('landing.hero.cardModerate')}</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-amber-500"
                initial={{ width: 0 }}
                animate={{ width: '42%' }}
                transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">{t('landing.hero.cardMarkers')}</p>
            {['finding1', 'finding2', 'finding3'].map((key) => (
              <div key={key} className={cn(
                'flex items-center gap-2 py-1',
                key !== 'finding3' && 'border-b border-border/50'
              )}>
                <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span className="text-xs text-foreground">{t(`landing.hero.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
