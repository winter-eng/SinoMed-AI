import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Edit2, LogOut, Shield, Mail, Phone, Calendar, ChevronRight, FileHeart, Check, X, AtSign } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { useAuth } from '@/app/providers/AuthProvider'
import { patientApi } from '@/shared/api/patient.api'
import { ROUTES } from '@/shared/constants/routes'

function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

function FormField({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
    />
  )
}

export function ProfilePage() {
  const { t } = useTranslation()
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null) // { type: 'success'|'error', msg: string }

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    date_of_birth: '',
  })
  const [errors, setErrors] = useState({})

  const openEdit = () => {
    setForm({
      full_name: user?.full_name ?? '',
      email: user?.email ?? '',
      date_of_birth: user?.date_of_birth ?? '',
    })
    setErrors({})
    setFeedback(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setErrors({})
    setFeedback(null)
  }

  const validate = () => {
    const errs = {}
    if (!form.full_name.trim()) errs.full_name = t('profile.fieldRequired')
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t('profile.emailInvalid')
    }
    return errs
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setSaving(true)
    setFeedback(null)
    try {
      // Build payload with only the fields PatientUpdate accepts
      const payload = {}
      if (form.full_name.trim()) payload.full_name = form.full_name.trim()
      if (form.email.trim()) payload.email = form.email.trim()
      if (form.date_of_birth) payload.date_of_birth = form.date_of_birth

      // PATCH — backend may return the updated object, null, or a message
      await patientApi.update(payload)

      // Always refetch the authoritative data from the server
      const freshUser = await patientApi.me()
      updateUser(freshUser)

      setFeedback({ type: 'success', msg: t('profile.saved') })
      setEditing(false)
    } catch (err) {
      // Surface the real server error — never hide it
      const detail = err?.response?.data?.detail
      const msg =
        Array.isArray(detail)
          ? detail.map((d) => d?.msg ?? String(d)).join('; ')
          : typeof detail === 'string'
            ? detail
            : t('profile.saveError')
      setFeedback({ type: 'error', msg })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate(ROUTES.HOME)
  }

  const displayName = user?.full_name || t('profile.title')
  const displayEmail = user?.email || '—'

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('profile.title')}</h1>
      </motion.div>

      {/* Avatar card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35 }}
      >
        <Card variant="default" padding="lg">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
              {user ? initials(displayName) : <User className="h-7 w-7" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground truncate">{displayName}</p>
              <p className="text-sm text-muted-foreground truncate">{displayEmail}</p>
            </div>
            {!editing && (
              <button
                onClick={openEdit}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label={t('profile.editProfile')}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Inline feedback banner */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-destructive/10 text-destructive'
            }`}
          >
            {feedback.type === 'success' ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <X className="h-4 w-4 shrink-0" />
            )}
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit form */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <Card variant="default" padding="lg">
              <h2 className="text-sm font-semibold text-foreground mb-4">{t('profile.editTitle')}</h2>
              <div className="space-y-4">
                <FormField label={t('profile.fullName')} error={errors.full_name}>
                  <TextInput
                    value={form.full_name}
                    onChange={(v) => { setForm((f) => ({ ...f, full_name: v })); setErrors((e) => ({ ...e, full_name: undefined })) }}
                    placeholder="Ahmad Karimov"
                  />
                </FormField>

                <FormField label={t('profile.email')} error={errors.email}>
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(v) => { setForm((f) => ({ ...f, email: v })); setErrors((e) => ({ ...e, email: undefined })) }}
                    placeholder="ahmad@example.com"
                  />
                </FormField>

                <FormField label={t('profile.dob')} error={errors.date_of_birth}>
                  <TextInput
                    type="date"
                    value={form.date_of_birth}
                    onChange={(v) => setForm((f) => ({ ...f, date_of_birth: v }))}
                  />
                </FormField>
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  variant="outline"
                  size="md"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="flex-1"
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  size="md"
                  onClick={handleSave}
                  loading={saving}
                  leftIcon={<Check className="h-4 w-4" />}
                  className="flex-1"
                >
                  {t('common.save')}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health profile link */}
      {!editing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <Link
            to={ROUTES.HEALTH_PROFILE}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/50 active:scale-[0.99]"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileHeart className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{t('profile.healthProfile')}</p>
              <p className="text-xs text-muted-foreground">{t('profile.viewHealthProfile')}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Link>
        </motion.div>
      )}

      {/* Account info */}
      {!editing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.13, duration: 0.35 }}
        >
          <Card variant="default" padding="lg">
            <h2 className="text-sm font-semibold text-foreground mb-1">{t('profile.accountInfo')}</h2>
            <div className="mt-3">
              <ProfileRow icon={User} label={t('profile.name')} value={displayName} />
              {user?.username && (
                <ProfileRow icon={AtSign} label={t('profile.username')} value={user.username} />
              )}
              <ProfileRow icon={Mail} label={t('profile.email')} value={displayEmail} />
              {user?.phone && (
                <ProfileRow icon={Phone} label={t('profile.phone')} value={user.phone} />
              )}
              {user?.date_of_birth && (
                <ProfileRow icon={Calendar} label={t('profile.dob')} value={user.date_of_birth} />
              )}
              <ProfileRow icon={Shield} label={t('profile.accountType')} value={t('profile.accountTypeValue')} />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Logout */}
      {!editing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          <Button
            variant="outline"
            size="md"
            onClick={handleLogout}
            leftIcon={<LogOut className="h-4 w-4" />}
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/8 hover:border-destructive/50"
          >
            {t('profile.logout')}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
