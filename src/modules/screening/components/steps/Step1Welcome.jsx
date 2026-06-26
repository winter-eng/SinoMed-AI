import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Clock, Shield, Info, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

const chips = [
  { icon: Clock, key: 'chip1' },
  { icon: Shield, key: 'chip2' },
  { icon: Info, key: 'chip3' },
]

export function Step1Welcome({ onNext }) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center text-center gap-6 py-8"
    >
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 border-2 border-primary/20">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-primary/30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('screening.step1.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">{t('screening.step1.subtitle')}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {chips.map(({ icon: Icon, key }) => (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Icon className="h-3 w-3 text-primary" />
            {t(`screening.step1.${key}`)}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        {t('screening.step1.desc')}
      </p>

      <Button
        size="lg"
        onClick={onNext}
        rightIcon={<ArrowRight className="h-4 w-4" />}
        className="w-full max-w-xs shadow-lg shadow-primary/20"
      >
        {t('screening.step1.start')}
      </Button>
    </motion.div>
  )
}
