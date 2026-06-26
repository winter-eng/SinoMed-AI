import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/utils'
import { useLogin } from '../hooks/useLogin'

export function LoginForm({ mode = 'login' }) {
  const { t } = useTranslation()
  const { submitLogin, submitRegister, loading, error } = useLogin()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isRegister = mode === 'register'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isRegister) {
      void submitRegister({ full_name: fullName, email, password })
    } else {
      void submitLogin({ email, password })
    }
  }

  const inputBase = cn(
    'flex h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60',
    'transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{t('auth.email')}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className={inputBase}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{t('auth.password')}</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full">
        {isRegister ? t('auth.registerSubmit') : t('auth.submit')}
      </Button>
    </form>
  )
}
