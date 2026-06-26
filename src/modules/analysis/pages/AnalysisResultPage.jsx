import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCcw, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Logo } from '@/shared/components/ui/Logo'
import { ROUTES } from '@/shared/constants/routes'
import { RiskGauge } from '../components/RiskGauge'
import { FindingsList } from '../components/FindingsList'

const MOCK_RESULT = {
  riskScore: 42,
  riskLevel: 2,
  confidence: 87,
  findings: [
    "Mikroanevrizmalar aniqlandi (2 ta)",
    "Glyukoza ko'rsatkichi me'yordan yuqori",
    'BMI: 27.4 — ortiqcha vazn',
  ],
  recommendations: [
    "Endokrinolog ko'rigiga murojaat qiling",
    'Qon shakarini tekshiring (HbA1c)',
    'Jismoniy faollikni oshiring: haftada 150+ daqiqa',
    "Oddiy uglevodlar iste'molini kamaytiring",
  ],
}

export function AnalysisResultPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const riskLevelLabels = t('results.riskLevels', { returnObjects: true })
  const riskLabel = riskLevelLabels[String(MOCK_RESULT.riskLevel)] ?? '—'

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/90 backdrop-blur-xl px-4">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <span className="text-sm font-semibold text-foreground">{t('results.title')}</span>
          </div>
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-xl font-semibold text-foreground">{t('results.title')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t('results.subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <RiskGauge
            score={MOCK_RESULT.riskScore}
            riskLevel={MOCK_RESULT.riskLevel}
            confidence={MOCK_RESULT.confidence}
            riskLabel={riskLabel}
            confidenceLabel={t('results.confidence')}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
          <FindingsList title={t('results.findings')} items={MOCK_RESULT.findings} emptyMessage={t('results.noFindings')} type="finding" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }}>
          <FindingsList title={t('results.recommendations')} items={MOCK_RESULT.recommendations} emptyMessage={t('results.noRecommendations')} type="recommendation" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-muted/60 px-4 py-3 text-xs text-muted-foreground text-center"
        >
          {t('results.disclaimer')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex gap-3 pb-8"
        >
          <Button variant="outline" size="md" onClick={() => navigate(ROUTES.DASHBOARD)} leftIcon={<ArrowLeft className="h-4 w-4" />} className="flex-1">
            {t('results.backDashboard')}
          </Button>
          <Button size="md" onClick={() => navigate(ROUTES.SCREENING.NEW)} leftIcon={<RefreshCcw className="h-4 w-4" />} className="flex-1">
            {t('results.newScreening')}
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
