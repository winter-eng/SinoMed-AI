import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Calendar, Users, X, Phone, Mail, User } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { doctorApi } from '@/shared/api/doctor.api'

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

function DetailRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 border-b border-border/40 py-3 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-all text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export function PatientHistoryPage() {
  const { t } = useTranslation()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    doctorApi
      .patients()
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false))
  }, [t])

  const openDetail = async (patient) => {
    setSelected(patient)
    setDetailLoading(true)
    try {
      const detail = await doctorApi.patientDetail(patient.id)
      setSelected(detail)
    } catch {
      // keep summary data
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="relative space-y-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-xl font-semibold text-foreground">{t('doctor.history.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('doctor.history.subtitle')}</p>
      </motion.div>

      {!loading && !error && patients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className="flex items-center gap-2 rounded-xl bg-primary/8 px-4 py-2.5"
        >
          <Users className="h-4 w-4 shrink-0 text-primary" />
          <span className="text-sm font-medium text-primary">
            {patients.length} {t('doctor.history.totalPatients')}
          </span>
        </motion.div>
      )}

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

      {!loading && !error && patients.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-2 py-16 text-center"
        >
          <Users className="h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm font-medium text-foreground">{t('doctor.history.noPatients')}</p>
          <p className="text-xs text-muted-foreground">{t('doctor.history.noPatientsDesc')}</p>
        </motion.div>
      )}

      <div className="space-y-3">
        {patients.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i + 0.1, duration: 0.3 }}
          >
            <Card
              variant="default"
              padding="md"
              className="cursor-pointer transition-colors hover:border-primary/20 active:scale-[0.99]"
              onClick={() => openDetail(p)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground text-sm font-bold">
                  {initials(p.full_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{p.full_name || '—'}</p>
                  {p.phone && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.phone}</p>
                  )}
                  {p.created_at && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{formatDate(p.created_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
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
                <p className="text-base font-semibold text-foreground">{t('doctor.history.patientDetail')}</p>
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
                    <div key={i} className="h-12 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                <div>
                  <DetailRow icon={User} label={t('common.name') ?? 'Name'} value={selected.full_name} />
                  <DetailRow icon={Phone} label={t('doctor.history.phone')} value={selected.phone} />
                  <DetailRow icon={Mail} label={t('doctor.history.email')} value={selected.email} />
                  <DetailRow icon={Calendar} label={t('doctor.history.dob')} value={formatDate(selected.date_of_birth)} />
                  <DetailRow icon={Calendar} label={t('doctor.history.joinedDate')} value={formatDate(selected.created_at)} />
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
