import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCcw, X, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Logo } from '@/shared/components/ui/Logo'
import { ROUTES } from '@/shared/constants/routes'
import { RiskGauge } from '../components/RiskGauge'
import { FindingsList } from '../components/FindingsList'
import { usePredictionDetail } from '@/shared/hooks/usePredictions'

// Grade-level recommendations — TODO: replace with per-grade API endpoint if available
const RECS_BY_GRADE = {
  0: [
    'results.rec0a',
    'results.rec0b',
    'results.rec0c',
  ],
  1: [
    'results.rec1a',
    'results.rec1b',
    'results.rec1c',
  ],
  2: [
    'results.rec2a',
    'results.rec2b',
    'results.rec2c',
  ],
  3: [
    'results.rec3a',
    'results.rec3b',
    'results.rec3c',
  ],
  4: [
    'results.rec4a',
    'results.rec4b',
    'results.rec4c',
  ],
}

export function AnalysisResultPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: result, isLoading, error } = usePredictionDetail(id)

  const riskLevelLabels = t('results.riskLevels', { returnObjects: true })

  const header = (
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
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {header}
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background">
        {header}
        <div className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-base font-semibold text-foreground">{t('common.error')}</p>
          <p className="text-sm text-muted-foreground">
            {error?.response?.data?.detail ?? t('results.notFound')}
          </p>
          <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
            {t('results.backDashboard')}
          </Button>
        </div>
      </div>
    )
  }

  // Map API response to display values
  const riskLevel = result.diagnosis // 0–4 integer
  const riskScore = Math.round((riskLevel / 4) * 100)
  const confidencePct = Math.round(result.confidence * 100)
  const riskLabel = riskLevelLabels[String(riskLevel)] ?? '—'

  // Findings: description from API + grade name
  const findings = []
  if (result.description) findings.push(result.description)
  if (result.grade_uz) findings.push(result.grade_uz)

  // Recommendations: hardcoded by grade, no API endpoint available
  const recKeys = RECS_BY_GRADE[riskLevel] ?? RECS_BY_GRADE[0]
  const recommendations = recKeys.map((k) => t(k))

  return (
    <div className="min-h-screen bg-background">
      {header}

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-xl font-semibold text-foreground">{t('results.title')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t('results.subtitle')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <RiskGauge
            score={riskScore}
            riskLevel={riskLevel}
            confidence={confidencePct}
            riskLabel={riskLabel}
            confidenceLabel={t('results.confidence')}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
          <FindingsList
            title={t('results.findings')}
            items={findings}
            emptyMessage={t('results.noFindings')}
            type="finding"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35 }}>
          <FindingsList
            title={t('results.recommendations')}
            items={recommendations}
            emptyMessage={t('results.noRecommendations')}
            type="recommendation"
          />
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
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            className="flex-1"
          >
            {t('results.backDashboard')}
          </Button>
          <Button
            size="md"
            onClick={() => navigate(ROUTES.SCREENING.NEW)}
            leftIcon={<RefreshCcw className="h-4 w-4" />}
            className="flex-1"
          >
            {t('results.newScreening')}
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
