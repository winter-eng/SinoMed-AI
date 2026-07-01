import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ImagePlus, Loader2, Users, MessageCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { doctorApi } from '@/shared/api/doctor.api'
import { useAuth } from '@/app/providers/AuthProvider'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://aidiagnostikapi.sangilov.uz'

function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function formatTime(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

function HistoryItem({ item }) {
  const { t } = useTranslation()
  const [imgError, setImgError] = useState(false)

  // Try all known image URL field names; construct from filename as fallback
  const imageSrc =
    item.image_url ||
    item.url ||
    (item.filename ? `${BASE_URL}/uploads/${item.filename}` : null)

  // Detect sender: if no explicit field, default to doctor (only doctors upload via /dp-chat/upload)
  const fromDoctor =
    item.sender === 'doctor' ||
    item.role === 'doctor' ||
    item.is_doctor === true ||
    (item.sender !== 'patient' && item.role !== 'patient' && item.is_patient !== true)

  return (
    <div className={`flex ${fromDoctor ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${
          fromDoctor
            ? 'rounded-br-sm bg-primary text-primary-foreground'
            : 'rounded-bl-sm bg-muted text-foreground'
        }`}
      >
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={item.filename ?? 'image'}
            className="max-w-full rounded-lg"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : imageSrc && imgError ? (
          <p className={`text-sm italic ${fromDoctor ? 'text-primary-foreground/60' : 'opacity-60'}`}>
            {t('doctor.chat.imageLoadError')}
          </p>
        ) : (
          <p className={`text-sm leading-relaxed ${fromDoctor ? 'text-primary-foreground' : 'text-foreground'}`}>
            {item.message ?? item.text ?? item.filename ?? JSON.stringify(item)}
          </p>
        )}
        {item.created_at && (
          <p className={`mt-1 text-[10px] ${fromDoctor ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
            {formatTime(item.created_at)}
          </p>
        )}
      </div>
    </div>
  )
}

export function DoctorChatPage() {
  const { t } = useTranslation()
  const { token } = useAuth()

  const [patients, setPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(true)
  const [patientsError, setPatientsError] = useState(null)
  const [activePatient, setActivePatient] = useState(null)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [historyError, setHistoryError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const fileRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    doctorApi
      .patients()
      .then((data) => setPatients(Array.isArray(data) ? data : []))
      .catch(() => setPatientsError(t('common.error')))
      .finally(() => setLoadingPatients(false))
  }, [t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history.length])

  const loadHistory = useCallback(async (patientId) => {
    setLoadingHistory(true)
    setHistory([])
    setHistoryError(null)
    try {
      const data = await doctorApi.chatHistory(patientId)
      setHistory(Array.isArray(data) ? data : [])
    } catch {
      setHistoryError(t('common.error'))
    } finally {
      setLoadingHistory(false)
    }
  }, [t])

  const openPatient = (patient) => {
    setActivePatient(patient)
    loadHistory(patient.id)
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activePatient) return
    setUploading(true)
    setUploadError(null)
    try {
      await doctorApi.uploadChatImage(token, file)
      await loadHistory(activePatient.id)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setUploadError(typeof detail === 'string' ? detail : t('doctor.chat.uploadError'))
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!activePatient ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-xl font-semibold text-foreground">{t('doctor.chat.title')}</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">{t('doctor.chat.subtitle')}</p>
            </div>

            {loadingPatients && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            )}

            {patientsError && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {patientsError}
              </div>
            )}

            {!loadingPatients && !patientsError && patients.length === 0 && (
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

            <div className="space-y-2">
              {patients.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                >
                  <button
                    onClick={() => openPatient(p)}
                    className="w-full rounded-xl border border-border bg-card p-3.5 text-left transition-colors hover:bg-accent/50 active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                        {initials(p.full_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{p.full_name || '—'}</p>
                        {p.phone && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.phone}</p>
                        )}
                      </div>
                      <MessageCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`chat-${activePatient.id}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <button
                onClick={() => setActivePatient(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-accent"
                aria-label={t('doctor.chat.backToList')}
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                {initials(activePatient.full_name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{activePatient.full_name || '—'}</p>
                {activePatient.phone && (
                  <p className="text-xs text-muted-foreground">{activePatient.phone}</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[55vh] min-h-[30vh] overflow-y-auto space-y-3 pb-2 pr-1">
              {loadingHistory && (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {historyError && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {historyError}
                </div>
              )}

              {!loadingHistory && !historyError && history.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <MessageCircle className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">{t('doctor.chat.noMessages')}</p>
                </div>
              )}

              {!loadingHistory &&
                history.map((item, i) => (
                  <motion.div
                    key={item.id ?? i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                  >
                    <HistoryItem item={item} />
                  </motion.div>
                ))}

              <div ref={bottomRef} />
            </div>

            {/* Upload error */}
            {uploadError && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/8 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {uploadError}
              </div>
            )}

            {/* Upload image action */}
            <div className="flex items-center gap-2 border-t border-border pt-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className={cn(
                  'flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent disabled:opacity-50',
                  uploading && 'cursor-not-allowed',
                )}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                ) : (
                  <ImagePlus className="h-4 w-4 text-primary" />
                )}
                {uploading ? t('doctor.chat.uploading') : t('doctor.chat.uploadImage')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
