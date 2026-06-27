import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Lock, User, Phone, Tag, AtSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/utils'
import { useLogin } from '../hooks/useLogin'
import { STORAGE_KEYS } from '@/shared/constants/storage'

function formatUzPhone(raw) {
  const digits = raw.replace(/\D/g, '')
  let local = digits
  if (digits.startsWith('998')) local = digits.slice(3)
  else if (digits.startsWith('0')) local = digits.slice(1)
  local = local.slice(0, 9)
  if (local.length === 0) return ''
  let result = '+998'
  if (local.length > 0) result += ' ' + local.slice(0, 2)
  if (local.length > 2) result += ' ' + local.slice(2, 5)
  if (local.length > 5) result += ' ' + local.slice(5, 7)
  if (local.length > 7) result += ' ' + local.slice(7, 9)
  return result
}

function isValidUzPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 12 && digits.startsWith('998')
}

const VALID_ROLES = ['patient', 'assistant', 'doctor']

export function LoginForm({ mode = 'login' }) {
  const { t } = useTranslation()
  const { submitLogin, submitRegister, loading, error } = useLogin()

  const [activeRole, setActiveRole] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGIN_ROLE) ?? 'patient'
    return VALID_ROLES.includes(saved) ? saved : 'patient'
  })
  const [fullName, setFullName] = useState('')
  // phone is used both for patient login and registration
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [referralCode, setReferralCode] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const isRegister = mode === 'register'
  const isPatient = activeRole === 'patient'

  const roles = [
    { id: 'patient', label: t('auth.rolePatient') },
    { id: 'assistant', label: t('auth.roleAssistant') },
    { id: 'doctor', label: t('auth.roleDoctor') },
  ]

  const handleRoleChange = (roleId) => {
    setActiveRole(roleId)
    localStorage.setItem(STORAGE_KEYS.LOGIN_ROLE, roleId)
  }

  const handlePhoneChange = (e) => {
    setPhone(formatUzPhone(e.target.value))
    if (phoneError) setPhoneError('')
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (passwordError) setPasswordError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isRegister) {
      let valid = true
      if (!isValidUzPhone(phone)) {
        setPhoneError(t('auth.phoneError'))
        valid = false
      }
      if (password.length < 8) {
        setPasswordError(t('auth.passwordMinLength'))
        valid = false
      }
      if (!valid) return
      void submitRegister({
        full_name: fullName,
        phone: '+' + phone.replace(/\D/g, ''),
        password,
        email: email.trim() || undefined,
        referral_code: referralCode.trim() || undefined,
      })
    } else {
      // Login: identifier is phone (patient) or username (doctor/nurse)
      const identifier = isPatient ? '+' + phone.replace(/\D/g, '') : username.trim()
      void submitLogin({ identifier, password, role: activeRole })
    }
  }

  const inputBase = cn(
    'flex h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60',
    'transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role selector — login only */}
      {!isRegister && (
        <div className="flex rounded-xl bg-muted p-1">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => handleRoleChange(role.id)}
              className={cn(
                'relative flex-1 rounded-lg py-1.5 px-1 text-[11px] font-medium transition-colors duration-150 select-none',
                activeRole === role.id
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {activeRole === role.id && (
                <motion.div
                  layoutId="role-pill"
                  className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 block truncate leading-tight">{role.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Register: Full Name */}
      {isRegister && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('auth.fullName')}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('auth.fullNamePlaceholder')}
              className={inputBase}
              required
            />
          </div>
        </div>
      )}

      {/* Phone: used for patient login AND registration */}
      {(isRegister || (!isRegister && isPatient)) && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('auth.phone')}</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder={t('auth.phonePlaceholder')}
              className={cn(
                inputBase,
                phoneError && 'border-destructive focus:border-destructive focus:ring-destructive',
              )}
              required
            />
          </div>
          {phoneError && <p className="text-xs text-destructive">{phoneError}</p>}
        </div>
      )}

      {/* Username: doctor / nurse login only */}
      {!isRegister && !isPatient && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('auth.username')}</label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              autoComplete="username"
              className={inputBase}
              required
            />
          </div>
        </div>
      )}

      {/* Register: Password (with strength hint) */}
      {isRegister && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('auth.password')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              className={cn(
                inputBase,
                'pr-10',
                passwordError && 'border-destructive focus:border-destructive focus:ring-destructive',
              )}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && <p className="text-xs text-destructive">{passwordError}</p>}
        </div>
      )}

      {/* Register: Email (optional) */}
      {isRegister && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            Email
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              ({t('auth.optional')})
            </span>
          </label>
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className={inputBase}
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('auth.emailHint')}</p>
        </div>
      )}

      {/* Login: Password */}
      {!isRegister && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">{t('auth.password')}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={cn(inputBase, 'pr-10')}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Register: Referral Code */}
      {isRegister && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {t('auth.referralCode')}
            <span className="ml-1.5 text-xs font-normal text-muted-foreground">
              ({t('auth.optional')})
            </span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder={t('auth.referralCodePlaceholder')}
              className={inputBase}
            />
          </div>
          <p className="text-xs text-muted-foreground">{t('auth.referralCodeHint')}</p>
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full">
        {isRegister ? t('auth.registerSubmit') : t('auth.submit')}
      </Button>
    </form>
  )
}
