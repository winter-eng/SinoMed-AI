import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Stethoscope,
  MessageCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
  LockKeyhole,
  Info,
} from 'lucide-react'
import { chatApi } from '@/shared/api/chat.api'
import { patientApi } from '@/shared/api/patient.api'
import { useAuth } from '@/app/providers/AuthProvider'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://aidiagnostikapi.sangilov.uz'

function formatTime(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return ''
  }
}

function extractImageSrc(item) {
  if (item.image_url) return item.image_url
  if (item.url && /\.(jpg|jpeg|png|gif|webp)/i.test(item.url)) return item.url
  if (item.filename) return `${BASE_URL}/uploads/${item.filename}`
  return null
}

function extractText(item) {
  return item.message ?? item.text ?? item.content ?? null
}

function isFromDoctor(item) {
  if (item.sender === 'doctor') return true
  if (item.role === 'doctor') return true
  if (item.is_doctor === true) return true
  if (item.sender === 'patient' || item.role === 'patient' || item.is_patient === true) return false
  return true
}

function MessageBubble({ item }) {
  const { t } = useTranslation()
  const doctor = isFromDoctor(item)
  const imageSrc = extractImageSrc(item)
  const text = extractText(item)
  const [imgError, setImgError] = useState(false)

  return (
    <div className={`flex ${doctor ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
          doctor
            ? 'rounded-bl-sm bg-muted text-foreground'
            : 'rounded-br-sm bg-primary text-primary-foreground'
        }`}
      >
        {doctor && (
          <p className="mb-1 text-[10px] font-semibold text-primary">
            {t('patientDoctorChat.doctorLabel')}
          </p>
        )}

        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={item.filename ?? 'image'}
            className="max-w-full rounded-lg"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : imageSrc && imgError ? (
          <p className="text-sm italic opacity-60">{t('patientDoctorChat.imageError')}</p>
        ) : text ? (
          <p className="text-sm leading-relaxed">{text}</p>
        ) : (
          <p className="text-sm italic opacity-60">[{item.filename ?? '…'}]</p>
        )}

        {item.created_at && (
          <p
            className={`mt-1 text-[10px] ${
              doctor ? 'text-muted-foreground' : 'text-primary-foreground/70'
            }`}
          >
            {formatDate(item.created_at)} {formatTime(item.created_at)}
          </p>
        )}
      </div>
    </div>
  )
}

// Try every real data source to find the doctor_id the patient is assigned to.
// Returns the ID (number/string) or null if the backend doesn't expose it.
async function resolveDoctorId(user) {
  // 1. Patient profile may already contain doctor_id
  const fromProfile =
    user?.doctor_id ?? user?.assigned_doctor_id ?? user?.doctor?.id ?? null
  if (fromProfile) return fromProfile

  // 2. Try GET /patients/me/all — broader dataset that may include assignment
  try {
    const all = await patientApi.allData()
    const fromAll =
      all?.doctor_id ??
      all?.assigned_doctor_id ??
      all?.doctor?.id ??
      all?.assigned_doctor?.id ??
      null
    if (fromAll) return fromAll
  } catch {
    // endpoint may not exist or may fail — continue
  }

  return null
}

export function PatientDoctorChatPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // noDoctorId = backend does not expose doctor_id; cannot call the endpoint
  const [noDoctorId, setNoDoctorId] = useState(false)
  const bottomRef = useRef(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    setNoDoctorId(false)

    const doctorId = await resolveDoctorId(user)

    if (!doctorId) {
      // The backend does not expose doctor_id for this patient via any known endpoint.
      // GET /dp-chat/history?doctor_id= cannot be called without it.
      setNoDoctorId(true)
      setLoading(false)
      return
    }

    try {
      const data = await chatApi.dpHistory(doctorId)
      setMessages(Array.isArray(data) ? data : [])
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(typeof detail === 'string' ? detail : t('patientDoctorChat.loadError'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t('patientDoctorChat.title')}</h1>
          <p className="text-xs text-muted-foreground">{t('patientDoctorChat.subtitle')}</p>
        </div>
      </motion.div>

      {/* Messages / status area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="min-h-[50vh] rounded-2xl border border-border bg-card p-4"
      >
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Backend does not expose doctor_id — feature cannot work */}
        {!loading && noDoctorId && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <Info className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">
              {t('patientDoctorChat.noDoctorId')}
            </p>
            <p className="max-w-xs text-xs text-muted-foreground">
              {t('patientDoctorChat.noDoctorIdDesc')}
            </p>
          </div>
        )}

        {!loading && !noDoctorId && error && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-destructive/60" />
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={load}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t('patientDoctorChat.retry')}
            </button>
          </div>
        )}

        {!loading && !noDoctorId && !error && messages.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <MessageCircle className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">{t('patientDoctorChat.empty')}</p>
            <p className="text-xs text-muted-foreground">{t('patientDoctorChat.emptyHint')}</p>
          </div>
        )}

        {!loading && !noDoctorId && !error && messages.length > 0 && (
          <div className="space-y-3">
            {messages.map((item, i) => (
              <motion.div
                key={item.id ?? i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
              >
                <MessageBubble item={item} />
              </motion.div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </motion.div>

      {/* Read-only notice — only shown when chat loaded successfully */}
      {!loading && !noDoctorId && !error && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <LockKeyhole className="h-3 w-3" />
          {t('patientDoctorChat.readOnly')}
        </div>
      )}
    </div>
  )
}
