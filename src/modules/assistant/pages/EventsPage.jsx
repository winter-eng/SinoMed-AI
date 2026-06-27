import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const MY_REFERRALS = 31

const EVENTS = [
  {
    id: 1,
    emoji: '🏆',
    title: 'iPhone 17 Yutib oling',
    titleRu: 'Выиграйте iPhone 17',
    goal: 300,
    reward: 'iPhone 17 Pro',
    days: 12,
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    accent: 'bg-white/20',
  },
  {
    id: 2,
    emoji: '💰',
    title: 'Naqd Pul Mukofoti',
    titleRu: 'Денежный Бонус',
    goal: 100,
    reward: '5,000,000 UZS',
    days: 6,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    accent: 'bg-white/20',
  },
  {
    id: 3,
    emoji: '🎁',
    title: 'Planshet Sovg\'a',
    titleRu: 'Розыгрыш планшета',
    goal: 200,
    reward: 'Samsung Galaxy Tab S9',
    days: 18,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    accent: 'bg-white/20',
  },
]

export function EventsPage() {
  const { t, i18n } = useTranslation()
  const isRu = i18n.language.startsWith('ru')

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('assistant.events.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('assistant.events.subtitle')}</p>
      </motion.div>

      <div className="space-y-4">
        {EVENTS.map((ev, i) => {
          const pct = Math.min(100, Math.round((MY_REFERRALS / ev.goal) * 100))
          return (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i + 0.05, duration: 0.35 }}
            >
              <div className={`bg-gradient-to-br ${ev.gradient} rounded-2xl p-5 shadow-lg shadow-black/10 overflow-hidden relative`}>
                {/* Background glow */}
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-white/10 blur-xl" />

                {/* Header */}
                <div className="flex items-start justify-between relative">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ev.emoji}</span>
                    <div>
                      <p className="font-bold text-white text-base leading-tight">
                        {isRu ? ev.titleRu : ev.title}
                      </p>
                      <p className="text-white/75 text-sm mt-0.5">{ev.goal} {t('assistant.events.inviteNeeded')}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white/25 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {ev.days} {t('assistant.events.daysLeft')}
                  </span>
                </div>

                {/* Reward */}
                <div className="mt-4 rounded-xl bg-white/15 backdrop-blur-sm px-4 py-3">
                  <p className="text-white/70 text-[11px] uppercase tracking-wide font-medium">{t('assistant.events.reward')}</p>
                  <p className="text-white font-bold text-lg mt-0.5">{ev.reward}</p>
                </div>

                {/* Progress */}
                <div className="mt-4 space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-white/75 text-xs">{t('assistant.events.yourProgress')}</span>
                    <span className="text-white font-semibold text-xs">{MY_REFERRALS}/{ev.goal}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20">
                    <motion.div
                      className="h-2 rounded-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.06 * i + 0.3, duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-white/60 text-[10px]">{pct}% completed</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
