import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, RefreshCcw, X, Loader2, AlertCircle, ImageOff, Calendar } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Logo } from '@/shared/components/ui/Logo'
import { ROUTES } from '@/shared/constants/routes'
import { RiskGauge } from '../components/RiskGauge'
import { FindingsList } from '../components/FindingsList'
import { usePredictionDetail } from '@/shared/hooks/usePredictions'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://aidiagnostikapi.sangilov.uz'

const RECS_BY_GRADE = {
  0: ['results.rec0a', 'results.rec0b', 'results.rec0c'],
  1: ['results.rec1a', 'results.rec1b', 'results.rec1c'],
  2: ['results.rec2a', 'results.rec2b', 'results.rec2c'],
  3: ['results.rec3a', 'results.rec3b', 'results.rec3c'],
  4: ['results.rec4a', 'results.rec4b', 'results.rec4c'],
}

function ProbabilityBars({ probabilities }) {
  const { t } = useTranslation()
  if (!probabilities || typeof probabilities !== 'object') return null
  const entries = Object.entries(probabilities).sort(([a], [b]) => Number(a) - Number(b))
  if (entries.length === 0) return null
  const riskLevelLabels = t('results.riskLevels', { returnObjects: true })

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{t('results.probabilities')}</h3>
      <div className="space-y-2.5">
        {entries.map(([grade, prob]) => {
          const pct = Math.round(Number(prob) * 100)
          const name = (riskLevelLabels && riskLevelLabels[String(grade)]) ?? `Grade ${grade}`
          return (
            <div key={grade} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{name}</span>
                <span className="text-xs font-semibold text-foreground">{pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-1.5 rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function UploadedImage({ filename }) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)

  if (!filename || imgError) return null

  const src = `${BASE_URL}/uploads/${filename}`

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-foreground">{t('results.photo')}</h3>
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[180px]">{filename}</span>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
        <img
          src={src}
          alt={filename}
          className="w-full max-h-64 object-contain"
          onError={() => setImgError(true)}
        />
        <div className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-1 text-[10px] font-mono text-muted-foreground backdrop-blur-sm">
          {filename}
        </div>
      </div>
    </div>
  )
}

function ImagePlaceholder({ filename }) {
  const { t } = useTranslation()
  if (!filename) return null
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <ImageOff className="h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{t('results.photo')}</p>
        <p className="text-sm font-mono text-foreground truncate">{filename}</p>
      </div>
    </div>
  )
}

function DateRow({ createdAt }) {
  const { t } = useTranslation()
  if (!createdAt) return null
  const date = new Date(createdAt)
  const formatted = date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Calendar className="h-3.5 w-3.5 shrink-0" />
      <span>{t('results.date')}: {formatted}</span>
    </div>
  )
}

export function AnalysisResultPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: result, isLoading, error } = usePredictionDetail(id)
  const [imgLoaded, setImgLoaded] = useState(false)

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

  const riskLevel = result.diagnosis // 0–4 integer
  const riskScore = Math.round((riskLevel / 4) * 100)
  const confidencePct = Math.round(result.confidence * 100)
  const riskLabel = riskLevelLabels[String(riskLevel)] ?? '—'

  const findings = []
  if (result.description) findings.push(result.description)
  if (result.grade_uz) findings.push(result.grade_uz)

  const recKeys = RECS_BY_GRADE[riskLevel] ?? RECS_BY_GRADE[0]
  const recommendations = recKeys.map((k) => t(k))

  const hasImage = !!result.filename
  const imgSrc = hasImage ? `${BASE_URL}/uploads/${result.filename}` : null

  return (
    <div className="min-h-screen bg-background">
      {header}

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-xl font-semibold text-foreground">{t('results.title')}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t('results.subtitle')}</p>
          <div className="mt-2">
            <DateRow createdAt={result.created_at} />
          </div>
        </motion.div>

        {/* Uploaded image */}
        {hasImage && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }}>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground">{t('results.photo')}</h3>
                <span className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">{result.filename}</span>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
                <img
                  src={imgSrc}
                  alt={result.filename}
                  className={`w-full max-h-72 object-contain transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgLoaded(false)}
                />
                {!imgLoaded && (
                  <div className="flex h-32 items-center justify-center gap-2 text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                    <span className="text-xs font-mono">{result.filename}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <RiskGauge
            score={riskScore}
            riskLevel={riskLevel}
            confidence={confidencePct}
            riskLabel={riskLabel}
            confidenceLabel={t('results.confidence')}
          />
        </motion.div>

        {/* Grade name pill */}
        {result.grade_name && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.3 }}>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground">
                {result.grade_name}
              </span>
              {result.grade_uz && (
                <span className="text-xs text-muted-foreground">{result.grade_uz}</span>
              )}
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
          <FindingsList
            title={t('results.findings')}
            items={findings}
            emptyMessage={t('results.noFindings')}
            type="finding"
          />
        </motion.div>

        {/* Probabilities */}
        {result.probabilities && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }}>
            <ProbabilityBars probabilities={result.probabilities} />
          </motion.div>
        )}

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
