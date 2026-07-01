import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Calendar, Users, X, Phone, Mail, User, Hash,
  RefreshCw, Heart, ChevronRight, AlertTriangle,
} from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/utils'
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

function formatValue(val, t) {
  if (val === null || val === undefined) return '—'
  if (typeof val === 'boolean') return val ? t('common.yes') : t('common.no')
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
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

// ── Field categorisation ──────────────────────────────────────────────────────
const PERSONAL_KEYS = new Set(['full_name', 'date_of_birth', 'age', 'gender'])
const CONTACT_KEYS = new Set(['phone', 'email'])
const ACCOUNT_KEYS = new Set(['id', 'username', 'clinic_id', 'referral_code', 'created_at'])
const MEDICAL_KEYS = new Set(['blood_type', 'allergies', 'chronic_diseases', 'height', 'weight', 'bmi'])
const ALL_KNOWN = new Set([...PERSONAL_KEYS, ...CONTACT_KEYS, ...ACCOUNT_KEYS, ...MEDICAL_KEYS])

function fieldLabel(key, t) {
  const map = {
    full_name: t('profile.name'),
    date_of_birth: t('profile.dob'),
    age: t('screening.step4.rowAge'),
    gender: t('screening.step4.rowGender'),
    phone: t('profile.phone'),
    email: t('profile.email'),
    username: t('auth.username'),
    clinic_id: t('doctor.profile.clinicId'),
    referral_code: t('auth.referralCode'),
    created_at: t('doctor.history.joinedDate'),
    blood_type: t('healthProfile.bloodType'),
    allergies: t('healthProfile.allergies'),
    chronic_diseases: t('healthProfile.chronicDiseases'),
    height: t('screening.step4.rowHeight'),
    weight: t('screening.step4.rowWeight'),
    bmi: t('screening.step4.rowBmi'),
  }
  return map[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Patient detail sections ───────────────────────────────────────────────────
function PatientDetailContent({ item, t, partialOnly }) {
  const personalEntries = Object.entries(item).filter(([k, v]) => PERSONAL_KEYS.has(k) && v !== null && v !== undefined)
  const contactEntries = Object.entries(item).filter(([k, v]) => CONTACT_KEYS.has(k) && v !== null && v !== undefined)
  const accountEntries = Object.entries(item).filter(([k, v]) => ACCOUNT_KEYS.has(k) && v !== null && v !== undefined)
  const medicalEntries = Object.entries(item).filter(([k, v]) => MEDICAL_KEYS.has(k) && v !== null && v !== undefined)
  const extraEntries = Object.entries(item).filter(([k, v]) => !ALL_KNOWN.has(k) && v !== null && v !== undefined)

  return (
    <div className="space-y-5">
      {partialOnly && (
        <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 px-3 py-2.5 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {t('doctor.history.partialData')}
        </div>
      )}

      {personalEntries.length > 0 && (
        <div>
          <SectionHeader icon={User} title={t('doctor.history.sectionPersonal')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {personalEntries.map(([k, v]) => (
              <DataRow
                key={k}
                label={fieldLabel(k, t)}
                value={k === 'date_of_birth' ? (formatDate(v) ?? formatValue(v, t)) : formatValue(v, t)}
              />
            ))}
          </div>
        </div>
      )}

      {contactEntries.length > 0 && (
        <div>
          <SectionHeader icon={Phone} title={t('doctor.history.sectionContact')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {contactEntries.map(([k, v]) => (
              <DataRow key={k} label={fieldLabel(k, t)} value={formatValue(v, t)} />
            ))}
          </div>
        </div>
      )}

      {accountEntries.length > 0 && (
        <div>
          <SectionHeader icon={Hash} title={t('doctor.history.sectionAccount')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {accountEntries.map(([k, v]) => (
              <DataRow
                key={k}
                label={fieldLabel(k, t)}
                value={k === 'created_at' ? (formatDate(v) ?? formatValue(v, t)) : formatValue(v, t)}
              />
            ))}
          </div>
        </div>
      )}

      {medicalEntries.length > 0 && (
        <div>
          <SectionHeader icon={Heart} title={t('doctor.history.sectionMedical')} />
          <div className="rounded-xl border border-border bg-muted/30 px-3 pb-1 pt-1">
            {medicalEntries.map(([k, v]) => (
              <DataRow key={k} label={fieldLabel(k, t)} value={formatValue(v, t)} />
            ))}
          </div>
        </div>
      )}

      {extraEntries.length > 0 && (
        <div>
          <SectionHeader icon={ChevronRight} title={t('doctor.history.sectionAdditional')} />
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
export function PatientHistoryPage() {
  const { t } = useTranslation()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)
  const [selected, setSelected] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailPartial, setDetailPartial] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    doctorApi
      .patients()
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .catch(() => setError(t('common.error')))
      .finally(() => setLoading(false))
  }, [t, retryKey])

  const openDetail = async (patient) => {
    setSelected(patient)
    setDetailPartial(false)
    setDetailLoading(true)
    try {
      const detail = await doctorApi.patientDetail(patient.id)
      setSelected(detail)
    } catch {
      setDetailPartial(true)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('doctor.history.title')}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{t('doctor.history.subtitle')}</p>
      </motion.div>

      {/* Patient count chip */}
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

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}
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

      {/* Patient list */}
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
                  {/* Phone / email row */}
                  {(p.phone || p.email) && (
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0">
                      {p.phone && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" />
                          {p.phone}
                        </span>
                      )}
                      {p.email && (
                        <span className="flex max-w-[140px] items-center gap-1 truncate text-[11px] text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" />
                          {p.email}
                        </span>
                      )}
                    </div>
                  )}
                  {/* DOB / joined row */}
                  {(p.date_of_birth || p.created_at) && (
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0">
                      {p.date_of_birth && (
                        <span className="text-[11px] text-muted-foreground">
                          {t('profile.dob')}: {formatDate(p.date_of_birth)}
                        </span>
                      )}
                      {p.created_at && (
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Calendar className="h-3 w-3 shrink-0" />
                          {formatDate(p.created_at)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
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
                  <p className="text-base font-semibold text-foreground">{t('doctor.history.patientDetail')}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{selected.full_name || '—'}</p>
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
                <PatientDetailContent item={selected} t={t} partialOnly={detailPartial} />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
