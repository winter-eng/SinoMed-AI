import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Activity, Clock, Eye, CheckCircle, ClipboardList, X,
  RefreshCw, Brain, User, FileText, ImageIcon, Info, ChevronRight,
} from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/utils'
import { doctorApi } from '@/shared/api/doctor.api'

const BASE_URL = 'https://aidiagnostikapi.sangilov.uz'

function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function formatDate(iso) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

function formatValue(val, t) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? t('common.yes') : t('common.no')
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function pctLabel(val) {
  if (val === null || val === undefined) return null
  const n = Number(val)
  if (isNaN(n)) return null
  return `${Math.round(n >= 1 ? n : n * 100)}%`
}

const RISK_COLORS = [
  { bg: 'bg-green-500/10', text: 'text-green-600' },
  { bg: 'bg-yellow-500/10', text: 'text-yellow-600' },
  { bg: 'bg-orange-500/10', text: 'text-orange-600' },
  { bg: 'bg-red-500/10', text: 'text-red-600' },
  { bg: 'bg-rose-600/10', text: 'text-rose-700' },
]

function RiskBadge({ grade, t }) {
  const g = parseInt(grade, 10)
  const cfg = RISK_COLORS[g] ?? RISK_COLORS[2]
  const label = t(`results.riskLevels.${isNaN(g) ? 2 : g}`, { defaultValue: `Grade ${grade}` })
  return (
    <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold', cfg.bg, cfg.text)}>
      {label}
    </span>
  )
}

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="mb-2.5 flex items-center gap-2">
      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
        <Icon className="h-3 w-3 text-primary" />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
    </div>
  )
}

function DataRow({ label, value }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/30 py-2.5 last:border-0">
      <p className="shrink-0 text-[11px] leading-5 text-muted-foreground">{label}</p>
      <p className="max-w-[62%] break-words text-right text-sm font-medium text-foreground">{String(value)}</p>
    </div>
  )
}

function ProbabilityBars({ data, t }) {
  let entries = []
  if (Array.isArray(data)) {
    entries = data.map((v, i) => [String(i), v])
  } else if (typeof data === 'object' && data !== null) {
    entries = Object.entries(data)
  }
  if (!entries.length) return null
  return (
    <div className="space-y-2">
      {entries.map(([cls, val]) => {
        const pct = Math.round(Number(val) >= 1 ? Number(val) : Number(val) * 100)
        const label = t(`results.riskLevels.${cls}`, { defaultValue: `Grade ${cls}` })
        const g = parseInt(cls, 10)
        const cfg = RISK_COLORS[g] ?? RISK_COLORS[2]
        return (
          <div key={cls}>
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">{label}</p>
              <p className={cn('text-[11px] font-semibold', cfg.text)}>{pct}%</p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className={cn('h-full rounded-full transition-all', cfg.bg.replace('/10', '/60'))} style={{ width: `${pct}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Field categorisation ──────────────────────────────────────────────────────
const AI_KEYS = new Set(['risk_grade', 'grade', 'confidence', 'prediction', 'predicted_class', 'diagnosis_description', 'probabilities', 'class_probabilities'])
const PATIENT_KEYS = new Set(['patient_name', 'full_name', 'patient_id', 'patient'])
const QUESTIONNAIRE_KEYS = new Set(['age', 'gender', 'height', 'weight', 'bmi', 'symptoms', 'family_history', 'hypertension', 'activity_level', 'activity', 'diet_type', 'diet', 'thirst', 'urination', 'fatigue', 'vision_blur', 'wound_healing', 'tingling'])
const META_KEYS = new Set(['id', 'status', 'clinic_id', 'clinic', 'referral_source', 'doctor_id', 'created_at', 'updated_at'])
const IMAGE_KEYS = new Set(['image_url', 'url', 'filename'])
const ALL_KNOWN = new Set([...AI_KEYS, ...PATIENT_KEYS, ...QUESTIONNAIRE_KEYS, ...META_KEYS, ...IMAGE_KEYS])

function fieldLabel(key, t) {
  const map = {
    risk_grade: t('doctor.cases.riskGrade'),
    grade: t('doctor.cases.riskGrade'),
    confidence: t('doctor.cases.confidence'),
    prediction: t('doctor.cases.prediction'),
    predicted_class: t('doctor.cases.prediction'),
    diagnosis_description: t('doctor.cases.diagnosisDesc'),
    referral_source: t('doctor.cases.referralSource'),
    patient_name: t('profile.name'),
    full_name: t('profile.name'),
    clinic_id: t('doctor.profile.clinicId'),
    clinic: t('doctor.cases.clinic'),
    doctor_id: t('doctor.role'),
    created_at: t('doctor.cases.createdAt'),
    updated_at: t('doctor.cases.updatedAt'),
    age: t('screening.step4.rowAge'),
    gender: t('screening.step4.rowGender'),
    height: t('screening.step4.rowHeight'),
    weight: t('screening.step4.rowWeight'),
    bmi: t('screening.step4.rowBmi'),
    symptoms: t('screening.step3.symptoms.label'),
    family_history: t('screening.step4.rowFamily'),
    hypertension: t('screening.step4.rowHypertension'),
    activity_level: t('screening.step4.rowActivity'),
    activity: t('screening.step4.rowActivity'),
    diet_type: t('screening.step4.rowDiet'),
    diet: t('screening.step4.rowDiet'),
    thirst: t('screening.step3.symptoms.thirst'),
    urination: t('screening.step3.symptoms.urination'),
    fatigue: t('screening.step3.symptoms.fatigue'),
    vision_blur: t('screening.step3.symptoms.vision'),
    wound_healing: t('screening.step3.symptoms.healing'),
    tingling: t('screening.step3.symptoms.tingling'),
  }
  return map[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Case detail sections ──────────────────────────────────────────────────────
function CaseDetailContent({ item, t }) {
  const imgSrc =
    item.image_url ||
    item.url ||
    (item.filename ? `${BASE_URL}/uploads/${item.filename}` : null)

  const probabilities = item.probabilities || item.class_probabilities
  const patientNested = typeof item.patient === 'object' && item.patient !== null ? item.patient : null

  const aiEntries = Object.entries(item).filter(
    ([k, v]) => AI_KEYS.has(k) && k !== 'probabilities' && k !== 'class_probabilities' && v !== null && v !== undefined,
  )
  const patientEntries = Object.entries(item).filter(
    ([k, v]) => PATIENT_KEYS.has(k) && k !== 'patient' && v !== null && v !== undefined,
  )
  const qEntries = Object.entries(item).filter(
    ([k, v]) => QUESTIONNAIRE_KEYS.has(k) && v !== null && v !== undefined,
  )
  const metaEntries = Object.entries(item).filter(
    ([k, v]) => META_KEYS.has(k) && v !== null && v !== undefined,
  )
  const extraEntries = Object.entries(item).filter(
    ([k, v]) => !ALL_KNOWN.has(k) && v !== null && v !== undefined,
  )

  const hasAI = aiEntries.length > 0 || !!probabilities
  const hasPatient = patientEntries.length > 0 || !!patientNested

  return (
    <div className="space-y-5">
      {/* AI Analysis */}
      {hasAI && (
        <div>
          <SectionHeader icon={Brain} title={t('doctor.cases.sectionAI')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {aiEntries.map(([k, v]) => (
              <DataRow
                key={k}
                label={fieldLabel(k, t)}
                value={k === 'confidence' ? (pctLabel(v) ?? formatValue(v, t)) : formatValue(v, t)}
              />
            ))}
            {probabilities && (
              <div className="pb-2 pt-2">
                <p className="mb-2 text-[11px] text-muted-foreground">{t('results.probabilities')}</p>
                <ProbabilityBars data={probabilities} t={t} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Retinal image */}
      {imgSrc && (
        <div>
          <SectionHeader icon={ImageIcon} title={t('doctor.cases.sectionImage')} />
          <div className="overflow-hidden rounded-xl border border-border bg-black">
            <img
              src={imgSrc}
              alt={t('results.photo')}
              className="max-h-60 w-full object-contain"
              onError={(e) => {
                e.currentTarget.parentElement.style.display = 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Patient info */}
      {hasPatient && (
        <div>
          <SectionHeader icon={User} title={t('doctor.cases.sectionPatient')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {patientEntries.map(([k, v]) => (
              <DataRow key={k} label={fieldLabel(k, t)} value={formatValue(v, t)} />
            ))}
            {patientNested &&
              Object.entries(patientNested)
                .filter(([, v]) => v !== null && v !== undefined)
                .map(([k, v]) => (
                  <DataRow key={`pt_${k}`} label={fieldLabel(k, t)} value={formatValue(v, t)} />
                ))}
          </div>
        </div>
      )}

      {/* Questionnaire answers */}
      {qEntries.length > 0 && (
        <div>
          <SectionHeader icon={FileText} title={t('doctor.cases.sectionQuestionnaire')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {qEntries.map(([k, v]) => (
              <DataRow
                key={k}
                label={fieldLabel(k, t)}
                value={
                  typeof v === 'object' && v !== null
                    ? Array.isArray(v)
                      ? v.join(', ')
                      : JSON.stringify(v)
                    : formatValue(v, t)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Case meta */}
      {metaEntries.length > 0 && (
        <div>
          <SectionHeader icon={Info} title={t('doctor.cases.sectionMeta')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {metaEntries.map(([k, v]) => (
              <DataRow
                key={k}
                label={fieldLabel(k, t)}
                value={
                  k === 'created_at' || k === 'updated_at'
                    ? formatDate(v) ?? formatValue(v, t)
                    : formatValue(v, t)
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Unknown / additional fields */}
      {extraEntries.length > 0 && (
        <div>
          <SectionHeader icon={ChevronRight} title={t('doctor.cases.sectionAdditional')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {extraEntries.map(([k, v]) => (
              <DataRow
                key={k}
                label={k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                value={
                  typeof v === 'object' && v !== null
                    ? Array.isArray(v)
                      ? v.join(', ')
                      : JSON.stringify(v)
                    : formatValue(v, t)
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function ActiveCasesPage() {
  const { t } = useTranslation()
  const [anketas, setAnketas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const STATUS_CONFIG = {
    waiting: { label: t('doctor.cases.statusWaiting'), color: 'text-amber-600', bg: 'bg-amber-500/10', icon: Clock },
    review: { label: t('doctor.cases.statusReview'), color: 'text-blue-600', bg: 'bg-blue-500/10', icon: Eye },
    progress: { label: t('doctor.cases.statusProgress'), color: 'text-indigo-600', bg: 'bg-indigo-500/10', icon: Activity },
    completed: { label: t('doctor.cases.statusCompleted'), color: 'text-green-600', bg: 'bg-green-500/10', icon: CheckCircle },
  }
  const NUM_STATUS = { '0': 'waiting', '1': 'review', '2': 'progress', '3': 'completed' }

  useEffect(() => {
    setLoading(true)
    setError(null)
    doctorApi
      .anketas()
      .then((data) => setAnketas(Array.isArray(data) ? data : []))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false))
  }, [t, retryKey])

  const openDetail = async (anketa) => {
    setSelected(anketa)
    setDetailLoading(true)
    try {
      const detail = await doctorApi.anketaDetail(anketa.id)
      setSelected(detail)
    } catch {
      // keep summary data already shown
    } finally {
      setDetailLoading(false)
    }
  }

  const getStatus = (item) => {
    const raw = String(item.status ?? '').toLowerCase()
    const key = NUM_STATUS[raw] || raw
    return STATUS_CONFIG[key] ?? STATUS_CONFIG.waiting
  }

  return (
    <div className="relative max-w-2xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('doctor.cases.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('doctor.cases.subtitle')}</p>
      </motion.div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-[72px] animate-pulse rounded-xl bg-muted" />)}
        </div>
      )}

      {/* Error + retry */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            onClick={() => setRetryKey((k) => k + 1)}
          >
            {t('common.retry')}
          </Button>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && !error && anketas.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 py-16 text-center"
        >
          <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">{t('doctor.cases.noAnketas')}</p>
          <p className="text-xs text-muted-foreground">{t('doctor.cases.noAnketasDesc')}</p>
        </motion.div>
      )}

      {/* Case list */}
      <div className="space-y-3">
        {anketas.map((item, i) => {
          const status = getStatus(item)
          const StatusIcon = status.icon
          const name =
            item.patient_name ??
            item.full_name ??
            item.patient?.full_name ??
            t('doctor.cases.anketaFallback', { id: item.id })
          const riskGrade = item.risk_grade ?? item.grade ?? null
          const confidencePct = pctLabel(item.confidence)
          const clinicDisplay = item.clinic || (item.clinic_id ? `#${item.clinic_id}` : null)

          return (
            <motion.div
              key={item.id ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.05, duration: 0.3 }}
            >
              <Card
                variant="default"
                padding="md"
                className="cursor-pointer transition-colors hover:border-primary/20 active:scale-[0.99]"
                onClick={() => openDetail(item)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {initials(name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Name + badges */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      {item.status !== undefined && (
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', status.bg, status.color)}>
                          <StatusIcon className="h-2.5 w-2.5" />
                          {status.label}
                        </span>
                      )}
                      {riskGrade !== null && riskGrade !== undefined && (
                        <RiskBadge grade={riskGrade} t={t} />
                      )}
                    </div>
                    {/* Meta row */}
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      {confidencePct && (
                        <span className="text-[11px] text-muted-foreground">
                          {t('doctor.cases.confidence')}:{' '}
                          <span className="font-medium text-foreground">{confidencePct}</span>
                        </span>
                      )}
                      {item.created_at && (
                        <span className="text-[11px] text-muted-foreground">{formatDate(item.created_at)}</span>
                      )}
                      {clinicDisplay && (
                        <span className="max-w-[120px] truncate text-[11px] text-muted-foreground">{clinicDisplay}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Detail bottom sheet */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 max-h-[86vh] overflow-y-auto rounded-t-2xl border-t border-border bg-background p-5 shadow-2xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              {/* Sheet header */}
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">{t('doctor.cases.caseDetail')}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {selected.patient_name ??
                      selected.full_name ??
                      selected.patient?.full_name ??
                      t('doctor.cases.anketaFallback', { id: selected.id })}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {detailLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />)}
                </div>
              ) : (
                <CaseDetailContent item={selected} t={t} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
