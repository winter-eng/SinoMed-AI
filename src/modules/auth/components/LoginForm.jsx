import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/lib/utils'
import { useLogin } from '../hooks/useLogin'

export function LoginForm() {
  const { t } = useTranslation()
  const { submit, loading, error } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    void submit({ email, password, remember })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">{t('auth.email')}</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="doctor@clinic.uz"
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60',
              'transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            )}
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
            className={cn(
              'flex h-10 w-full rounded-lg border border-input bg-card pl-9 pr-10 text-sm text-foreground',
              'transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
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
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5 rounded accent-primary"
          />
          {t('auth.remember')}
        </label>
        <button type="button" className="text-sm text-primary hover:underline">
          {t('auth.forgot')}
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>
      )}

      <Button type="submit" size="lg" loading={loading} className="w-full">
        {t('auth.submit')}
      </Button>
    </form>
  )
}
