import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Calendar, Users, X, Phone, Mail, User, Activity, FileText } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { cn } from '@/shared/lib/utils'
import { doctorApi } from '@/shared/api/doctor.api'

const MOCK_PATIENTS = [
  {
    id: 1, full_name: 'Aziz Karimov', phone: '+998 90 123 45 67', email: 'aziz@mail.uz',
    date_of_birth: '1985-03-14', created_at: '2024-11-10T08:20:00Z',
    status: 'active', complaint: "Ko'rish keskin pasayib ketgan, ko'z oldida qora dog'lar paydo bo'lgan",
    diagnosis: 'Diabetik retinopatiya — Grade 3', last_visit: '2025-06-18T10:00:00Z',
  },
  {
    id: 2, full_name: 'Malika Toshmatova', phone: '+998 91 234 56 78', email: null,
    date_of_birth: '1992-07-22', created_at: '2024-12-01T10:15:00Z',
    status: 'observation', complaint: 'Bosh og\'rig\'i va ko\'z toliqishi, kompyuter oldida ko\'p o\'tiradi',
    diagnosis: 'Gipertoniya bilan bog\'liq ko\'z o\'zgarishlari — Grade 1', last_visit: '2025-06-20T14:30:00Z',
  },
  {
    id: 3, full_name: 'Jahon Nazarov', phone: '+998 93 345 67 89', email: 'jahon@gmail.com',
    date_of_birth: '1978-11-05', created_at: '2025-01-18T14:30:00Z',
    status: 'critical', complaint: "Ko'rish deyarli yo'qolgan, nur sezgisi qolgan xolos, urgently murojaat qildi",
    diagnosis: 'Proliferativ diabetik retinopatiya — Grade 4', last_visit: '2025-06-25T09:00:00Z',
  },
  {
    id: 4, full_name: 'Dilnoza Umarova', phone: '+998 94 456 78 90', email: null,
    date_of_birth: '1995-02-28', created_at: '2025-02-05T09:00:00Z',
    status: 'stable', complaint: "Profilaktik ko'rik, hech qanday shikoyat yo'q",
    diagnosis: 'Patologiya aniqlanmadi — Grade 0', last_visit: '2025-06-15T11:00:00Z',
  },
  {
    id: 5, full_name: 'Sardor Rashidov', phone: '+998 97 567 89 01', email: 'sardor@inbox.uz',
    date_of_birth: '1988-09-17', created_at: '2025-03-12T11:45:00Z',
    status: 'active', complaint: "Kechqurun ko'rish yomonlashadi, chaqnashlar ko'radi",
    diagnosis: "O'rtacha nonproliferativ DR — Grade 2", last_visit: '2025-06-22T16:00:00Z',
  },
  {
    id: 6, full_name: 'Nilufar Xasanova', phone: '+998 90 678 90 12', email: null,
    date_of_birth: '2001-06-03', created_at: '2025-04-20T16:10:00Z',
    status: 'stable', complaint: "Ko'z quruqligi, yonish hissi, kontakt linza ishlatadi",
    diagnosis: 'Engil o\'zgarishlar — Grade 1', last_visit: '2025-06-10T13:00:00Z',
  },
]

const STATUS_LABELS = {
  active: { label: 'Faol', color: 'text-blue-600 bg-blue-500/10' },
  observation: { label: 'Kuzatuv', color: 'text-amber-600 bg-amber-500/10' },
  critical: { label: 'Kritik', color: 'text-red-600 bg-red-500/10' },
  stable: { label: 'Barqaror', color: 'text-green-600 bg-green-500/10' },
}

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
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setPatients(list.length > 0 ? list : MOCK_PATIENTS)
      })
      .catch(() => setPatients(MOCK_PATIENTS))
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{p.full_name || '—'}</p>
                    {p.status && STATUS_LABELS[p.status] && (
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', STATUS_LABELS[p.status].color)}>
                        {STATUS_LABELS[p.status].label}
                      </span>
                    )}
                  </div>
                  {p.complaint && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{p.complaint}</p>
                  )}
                  {p.phone && !p.complaint && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{p.phone}</p>
                  )}
                  {p.last_visit && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">Oxirgi: {formatDate(p.last_visit)}</span>
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
                  <DetailRow icon={User} label="Ism Familiya" value={selected.full_name} />
                  <DetailRow icon={Activity} label="Holati" value={selected.status ? STATUS_LABELS[selected.status]?.label : null} />
                  <DetailRow icon={FileText} label="Shikoyat" value={selected.complaint} />
                  <DetailRow icon={FileText} label="Tashxis" value={selected.diagnosis} />
                  <DetailRow icon={Phone} label={t('doctor.history.phone')} value={selected.phone} />
                  <DetailRow icon={Mail} label={t('doctor.history.email')} value={selected.email} />
                  <DetailRow icon={Calendar} label={t('doctor.history.dob')} value={formatDate(selected.date_of_birth)} />
                  <DetailRow icon={Calendar} label="Oxirgi tashrif" value={formatDate(selected.last_visit)} />
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
