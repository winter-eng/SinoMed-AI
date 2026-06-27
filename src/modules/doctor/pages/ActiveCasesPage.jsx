import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Activity, Clock, Eye, CheckCircle, ClipboardList, X } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'
import { doctorApi } from '@/shared/api/doctor.api'

const MOCK_ANKETAS = [
  { id: 1, patient_name: 'Aziz Karimov', status: 'waiting', diagnosis: 'Diabetik retinopatiya shubhasi', grade: 'Grade 2', created_at: '2025-06-20T09:10:00Z' },
  { id: 2, patient_name: 'Malika Toshmatova', status: 'review', diagnosis: 'Gipertoniya bilan bog\'liq ko\'z o\'zgarishlari', grade: 'Grade 1', created_at: '2025-06-22T14:30:00Z' },
  { id: 3, patient_name: 'Jahon Nazarov', status: 'progress', diagnosis: 'Proliferativ DR', grade: 'Grade 4', created_at: '2025-06-23T08:00:00Z' },
  { id: 4, patient_name: 'Dilnoza Umarova', status: 'completed', diagnosis: 'Patologiya aniqlanmadi', grade: 'Grade 0', created_at: '2025-06-18T11:20:00Z' },
  { id: 5, patient_name: 'Sardor Rashidov', status: 'waiting', diagnosis: 'Ko\'rish pasayishi, tekshiruv kerak', grade: 'Grade 3', created_at: '2025-06-25T16:45:00Z' },
  { id: 6, patient_name: 'Nilufar Xasanova', status: 'completed', diagnosis: 'Engil o\'zgarishlar kuzatildi', grade: 'Grade 1', created_at: '2025-06-15T10:00:00Z' },
]

function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function formatValue(val) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

function formatDate(iso) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export function ActiveCasesPage() {
  const { t } = useTranslation()
  const [anketas, setAnketas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const STATUS_CONFIG = {
    waiting: { label: t('doctor.cases.statusWaiting'), color: 'text-amber-600', bg: 'bg-amber-500/10', icon: Clock },
    review: { label: t('doctor.cases.statusReview'), color: 'text-blue-600', bg: 'bg-blue-500/10', icon: Eye },
    progress: { label: t('doctor.cases.statusProgress'), color: 'text-indigo-600', bg: 'bg-indigo-500/10', icon: Activity },
    completed: { label: t('doctor.cases.statusCompleted'), color: 'text-green-600', bg: 'bg-green-500/10', icon: CheckCircle },
  }

  useEffect(() => {
    doctorApi
      .anketas()
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setAnketas(list.length > 0 ? list : MOCK_ANKETAS)
      })
      .catch(() => setAnketas(MOCK_ANKETAS))
      .finally(() => setLoading(false))
  }, [t])

  const openDetail = async (anketa) => {
    setSelected(anketa)
    setDetailLoading(true)
    try {
      const detail = await doctorApi.anketaDetail(anketa.id)
      setSelected(detail)
    } catch {
      // keep summary data
    } finally {
      setDetailLoading(false)
    }
  }

  const getStatus = (item) => {
    const key = String(item.status ?? '').toLowerCase()
    return STATUS_CONFIG[key] ?? STATUS_CONFIG.waiting
  }

  return (
    <div className="relative space-y-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl font-semibold text-foreground">{t('doctor.cases.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('doctor.cases.subtitle')}</p>
      </motion.div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

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

      <div className="space-y-3">
        {anketas.map((item, i) => {
          const status = getStatus(item)
          const StatusIcon = status.icon
          const name = item.patient_name ?? item.full_name ?? `Case #${item.id}`

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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{name}</p>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                          status.bg,
                          status.color,
                        )}
                      >
                        <StatusIcon className="h-2.5 w-2.5" />
                        {status.label}
                      </span>
                    </div>
                    {item.created_at && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t('doctor.cases.createdAt')}: {formatDate(item.created_at)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Detail panel */}
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
              className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border-t border-border bg-background p-5 shadow-2xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-base font-semibold text-foreground">{t('doctor.cases.caseDetail')}</p>
                <button
                  onClick={() => setSelected(null)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {detailLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="space-y-0">
                  {Object.entries(selected).map(([key, val]) => (
                    <div key={key} className="flex items-start gap-3 border-b border-border/40 py-2.5 last:border-0">
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="mt-0.5 break-all text-sm text-foreground">{formatValue(val)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
