import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Copy, Share2, UserPlus, Check, Users, UserCheck, Trophy } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'

const STATS = { invited: 47, registered: 31, ranking: 7 }
const NEXT_REWARD = { label: '5,000,000 UZS', goal: 100, current: 31 }

// Deterministic QR-like SVG
const FINDER = [
  [1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1],
]

function buildMatrix() {
  const S = 21
  const m = Array.from({ length: S }, () => Array(S).fill(-1))
  const place = (row, col) => {
    for (let r = 0; r < 7; r++)
      for (let c = 0; c < 7; c++)
        m[row + r][col + c] = FINDER[r][c]
  }
  place(0, 0)
  place(0, S - 7)
  place(S - 7, 0)
  // Timing
  for (let i = 8; i < S - 8; i++) {
    m[6][i] = i % 2 === 0 ? 1 : 0
    m[i][6] = i % 2 === 0 ? 1 : 0
  }
  // Data
  for (let r = 0; r < S; r++)
    for (let c = 0; c < S; c++)
      if (m[r][c] === -1)
        m[r][c] = Math.abs(Math.sin((r * 31 + c * 17) * 9301 + 49297)) > 0.5 ? 1 : 0
  return m
}

const QR_MATRIX = buildMatrix()

function QRCode({ size = 176 }) {
  const cell = size / 21
  return (
    <div className="rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {QR_MATRIX.flatMap((row, r) =>
          row.map((v, c) =>
            v === 1 ? (
              <rect
                key={`${r}-${c}`}
                x={c * cell}
                y={r * cell}
                width={cell - 0.5}
                height={cell - 0.5}
                fill="#111827"
                rx={cell * 0.12}
              />
            ) : null,
          ),
        )}
      </svg>
    </div>
  )
}

export function ReferralPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const code = user?.referral_code || 'SINOMED-X82K91'
  const pct = Math.min(100, Math.round((NEXT_REWARD.current / NEXT_REWARD.goal) * 100))

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'SinoMed AI', text: `Join SinoMed AI with my referral code: ${code}`, url: 'https://sinomed.ai' }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('assistant.referral.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('assistant.referral.subtitle')}</p>
      </motion.div>

      {/* QR + code */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6"
      >
        <QRCode size={176} />

        <div className="w-full space-y-1">
          <p className="text-center text-xs text-muted-foreground">{t('assistant.referral.yourCode')}</p>
          <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
            <span className="font-mono text-base font-bold tracking-widest text-foreground">{code}</span>
            <button
              onClick={handleCopy}
              className={cn(
                'ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                copied ? 'bg-green-500/10 text-green-600' : 'bg-background text-muted-foreground hover:text-foreground',
              )}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          {copied && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs text-green-600 font-medium"
            >
              {t('assistant.referral.copied')}
            </motion.p>
          )}
        </div>

        <div className="grid w-full grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={<Copy className="h-3.5 w-3.5" />} className="text-xs">
            {t('assistant.referral.copyCode')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} leftIcon={<Share2 className="h-3.5 w-3.5" />} className="text-xs">
            {t('assistant.referral.share')}
          </Button>
          <Button size="sm" leftIcon={<UserPlus className="h-3.5 w-3.5" />} className="text-xs">
            {t('assistant.referral.inviteFriends')}
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
        <p className="mb-3 text-sm font-semibold text-foreground">{t('assistant.referral.stats')}</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Users, value: STATS.invited, label: t('assistant.referral.invited') },
            { icon: UserCheck, value: STATS.registered, label: t('assistant.referral.registered') },
            { icon: Trophy, value: `#${STATS.ranking}`, label: t('assistant.referral.ranking') },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-4">
              <Icon className="h-4 w-4 text-primary mb-0.5" />
              <span className="text-lg font-bold text-foreground">{value}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Next reward progress */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
        <Card variant="default" padding="md" className="overflow-hidden">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground">{t('assistant.referral.nextReward')}</p>
              <p className="font-bold text-foreground text-base mt-0.5">{NEXT_REWARD.label}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              💰
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{NEXT_REWARD.current} {t('assistant.referral.progressOf')} {NEXT_REWARD.goal}</span>
              <span className="font-semibold text-primary">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/70"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">{NEXT_REWARD.goal - NEXT_REWARD.current} more referrals to unlock</p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
