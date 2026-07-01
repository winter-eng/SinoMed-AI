import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Copy, Share2, UserPlus, Check, Users, UserCheck, Trophy, AlertCircle } from 'lucide-react'
import { useAuth } from '@/app/providers/AuthProvider'
import { nurseApi } from '@/shared/api/nurse.api'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'

export function ReferralPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const code = user?.referral_code || null

  useEffect(() => {
    nurseApi
      .referrals()
      .then((data) => setReferrals(Array.isArray(data) ? data : []))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false))
  }, [])

  const totalRegistered = referrals.length

  const handleCopy = () => {
    if (!code) return
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share && code) {
      navigator.share({ title: 'SinoMed AI', text: `${t('assistant.referral.yourCode')}: ${code}` }).catch(() => {})
    } else {
      handleCopy()
    }
  }

  return (
    <div className="max-w-sm mx-auto space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl font-semibold text-foreground">{t('assistant.referral.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('assistant.referral.subtitle')}</p>
      </motion.div>

      {/* Referral code card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05, duration: 0.35 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6"
      >
        {/* Large code display */}
        <div className="w-full space-y-1">
          <p className="text-center text-xs text-muted-foreground">{t('assistant.referral.yourCode')}</p>
          <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-4">
            <span className="font-mono text-xl font-bold tracking-[0.2em] text-foreground">
              {code ?? '—'}
            </span>
            <button
              onClick={handleCopy}
              disabled={!code}
              className={cn(
                'ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors disabled:opacity-40',
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

        <div className="grid w-full grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!code}
            leftIcon={<Copy className="h-3.5 w-3.5" />}
            className="text-xs"
          >
            {t('assistant.referral.copyCode')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={!code}
            leftIcon={<Share2 className="h-3.5 w-3.5" />}
            className="text-xs"
          >
            {t('assistant.referral.share')}
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
      >
        <p className="mb-3 text-sm font-semibold text-foreground">{t('assistant.referral.stats')}</p>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-destructive/8 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Users, value: loading ? '…' : String(totalRegistered), label: t('assistant.referral.invited') },
              { icon: UserCheck, value: loading ? '…' : String(totalRegistered), label: t('assistant.referral.registered') },
              { icon: Trophy, value: '—', label: t('assistant.referral.ranking') },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card py-4">
                <Icon className="h-4 w-4 text-primary mb-0.5" />
                <span className="text-lg font-bold text-foreground">{value}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
