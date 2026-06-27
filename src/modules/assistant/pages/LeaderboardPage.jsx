import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/providers/AuthProvider'
import { cn } from '@/shared/lib/utils'

const LEADERBOARD = [
  { rank: 1, name: 'Aziz Karimov', referrals: 462 },
  { rank: 2, name: 'Jasur Axmedov', referrals: 438 },
  { rank: 3, name: 'Diyorbek Sodiqov', referrals: 391 },
  { rank: 4, name: 'Malika Rahimova', referrals: 285 },
  { rank: 5, name: 'Firdavs Umarov', referrals: 241 },
  { rank: 6, name: 'Sarvinoz Qodirova', referrals: 198 },
  { rank: 7, name: 'Demo Assistant', referrals: 147, isMe: true },
  { rank: 8, name: 'Bobur Hasanov', referrals: 134 },
  { rank: 9, name: 'Nilufar Yusupova', referrals: 98 },
  { rank: 10, name: 'Ulugbek Nazarov', referrals: 67 },
]

function initials(name) {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

const MEDAL = {
  1: { icon: '👑', bg: 'from-amber-400 to-yellow-500', text: 'text-amber-700 dark:text-amber-300' },
  2: { icon: '🥈', bg: 'from-slate-300 to-slate-400', text: 'text-slate-600 dark:text-slate-300' },
  3: { icon: '🥉', bg: 'from-orange-400 to-amber-600', text: 'text-orange-700 dark:text-orange-300' },
}

export function LeaderboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const myName = user?.full_name || 'Demo Assistant'

  const board = LEADERBOARD.map((entry) => ({
    ...entry,
    isMe: entry.name === myName || entry.isMe,
  }))

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('assistant.leaderboard.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('assistant.leaderboard.subtitle')}</p>
      </motion.div>

      {/* Top 3 podium */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="grid grid-cols-3 gap-3"
      >
        {[board[1], board[0], board[2]].map((entry, col) => {
          const medal = MEDAL[entry.rank]
          const isCenter = col === 1
          return (
            <div
              key={entry.rank}
              className={cn(
                'flex flex-col items-center rounded-2xl p-3 text-center',
                `bg-gradient-to-b ${medal.bg}`,
                isCenter ? 'py-5 shadow-lg scale-105' : 'py-3 opacity-90',
              )}
            >
              <span className="text-2xl">{medal.icon}</span>
              <div className="mt-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/30 text-sm font-bold text-white">
                {initials(entry.name)}
              </div>
              <p className="mt-1.5 text-xs font-semibold text-white leading-tight line-clamp-2">
                {entry.name}
              </p>
              <p className="mt-0.5 text-[11px] text-white/80 font-medium">
                {entry.referrals}
              </p>
            </div>
          )
        })}
      </motion.div>

      {/* Full list */}
      <div className="space-y-2">
        {board.map((entry, i) => {
          const medal = MEDAL[entry.rank]
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i + 0.1, duration: 0.3 }}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors',
                entry.isMe
                  ? 'border-primary bg-primary/8'
                  : 'border-border bg-card',
              )}
            >
              <span className="w-8 shrink-0 text-center">
                {medal ? (
                  <span className="text-lg">{medal.icon}</span>
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                )}
              </span>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {initials(entry.name)}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold truncate', entry.isMe && 'text-primary')}>
                  {entry.name}
                  {entry.isMe && (
                    <span className="ml-2 text-[10px] font-medium bg-primary/15 text-primary rounded-full px-1.5 py-0.5">
                      {t('assistant.leaderboard.you')}
                    </span>
                  )}
                </p>
              </div>

              <span className={cn('shrink-0 text-sm font-bold', medal ? medal.text : 'text-foreground')}>
                {entry.referrals}
                <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                  {t('assistant.leaderboard.referrals')}
                </span>
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
