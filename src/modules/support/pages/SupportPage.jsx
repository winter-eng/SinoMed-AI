import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Mail, Phone, MessageCircle, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.35 },
})

const FAQ_KEYS = [
  { q: 'faq1q', a: 'faq1a' },
  { q: 'faq2q', a: 'faq2a' },
  { q: 'faq3q', a: 'faq3a' },
  { q: 'faq4q', a: 'faq4a' },
]

function ContactCard({ icon: Icon, title, value, href }) {
  return (
    <a
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30 active:scale-[0.98]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
      </div>
    </a>
  )
}

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left transition-colors"
      >
        <span className="text-sm font-medium text-foreground">{question}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <p className="pb-3.5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      )}
    </div>
  )
}

export function SupportPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <motion.div {...fadeUp(0)}>
        <h1 className="text-xl font-semibold text-foreground">{t('support.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('support.subtitle')}</p>
      </motion.div>

      <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ContactCard
          icon={Mail}
          title={t('support.email')}
          value={t('support.emailDesc')}
          href={`mailto:${t('support.emailDesc')}`}
        />
        <ContactCard
          icon={Phone}
          title={t('support.phone')}
          value={t('support.phoneDesc')}
          href={`tel:${t('support.phoneDesc').replace(/\s/g, '')}`}
        />
        <ContactCard
          icon={MessageCircle}
          title={t('support.chat')}
          value={t('support.chatDesc')}
          href="mailto:support@sinomed.ai"
        />
      </motion.div>

      <motion.div {...fadeUp(0.1)}>
        <Card variant="default" padding="lg">
          <h2 className="text-sm font-semibold text-foreground mb-1">{t('support.faq')}</h2>
          <div className="mt-3">
            {FAQ_KEYS.map(({ q, a }) => (
              <FaqItem
                key={q}
                question={t(`support.${q}`)}
                answer={t(`support.${a}`)}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
