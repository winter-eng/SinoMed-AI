import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Bell, Shield, Key, Eye, LogOut, Sun, Moon } from 'lucide-react'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { useAuth } from '@/app/providers/AuthProvider'
import { useTheme } from '@/shared/hooks/useTheme'
import { useLanguage } from '@/shared/hooks/useLanguage'
import { THEMES } from '@/shared/constants/theme'
import { LANGUAGES, LANGUAGE_LABELS } from '@/shared/constants/languages'
import { ROUTES } from '@/shared/constants/routes'
import { cn } from '@/shared/lib/utils'

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none',
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
      )}
    >
      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200', checked ? 'translate-x-6' : 'translate-x-1')} />
    </button>
  )
}

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="flex items-center gap-3 border-b border-border/50 py-3 last:border-0">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  )
}

export function AssistantSettingsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  const [notifReg, setNotifReg] = useState(true)
  const [notifLeader, setNotifLeader] = useState(true)
  const [notifEvents, setNotifEvents] = useState(true)
  const [twoFactor, setTwoFactor] = useState(false)
  const [dataUsage, setDataUsage] = useState(true)

  const handleLogout = () => {
    logout()
    navigate(ROUTES.AUTH.LOGIN)
  }

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="text-xl font-semibold text-foreground">{t('assistant.settings.title')}</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="mb-4 text-sm font-semibold text-foreground">{t('settings.appearance')}</h2>
          <div className="mb-5">
            <p className="mb-3 text-sm font-medium text-foreground">{t('settings.theme')}</p>
            <div className="grid grid-cols-2 gap-2">
              {[THEMES.LIGHT, THEMES.DARK].map((th) => {
                const isSelected = theme === th
                const Icon = th === THEMES.LIGHT ? Sun : Moon
                return (
                  <button key={th} onClick={() => setTheme(th)}
                    className={cn('flex items-center gap-2.5 rounded-xl border p-3.5 text-sm font-medium transition-all',
                      isSelected ? 'border-primary bg-primary/8 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/40')}
                  >
                    <Icon className={cn('h-4 w-4', isSelected && 'text-primary')} />
                    {th === THEMES.LIGHT ? t('settings.themeLight') : t('settings.themeDark')}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-foreground">{t('settings.language')}</p>
            <p className="mb-3 text-xs text-muted-foreground">{t('settings.languageDesc')}</p>
            <div className="grid grid-cols-2 gap-2">
              {[LANGUAGES.UZ, LANGUAGES.RU].map((lang) => {
                const isSelected = language === lang
                return (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className={cn('flex items-center justify-center rounded-xl border p-3 text-sm font-medium transition-all',
                      isSelected ? 'border-primary bg-primary/8 text-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/40')}
                  >
                    {LANGUAGE_LABELS[lang]}
                  </button>
                )
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="mb-1 text-sm font-semibold text-foreground">{t('assistant.settings.notifications')}</h2>
          <div className="mt-3">
            <SettingRow icon={Bell} title={t('assistant.settings.notifNewReg')}>
              <Toggle checked={notifReg} onChange={setNotifReg} />
            </SettingRow>
            <SettingRow icon={Bell} title={t('assistant.settings.notifLeader')}>
              <Toggle checked={notifLeader} onChange={setNotifLeader} />
            </SettingRow>
            <SettingRow icon={Bell} title={t('assistant.settings.notifEvents')}>
              <Toggle checked={notifEvents} onChange={setNotifEvents} />
            </SettingRow>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="mb-1 text-sm font-semibold text-foreground">{t('assistant.settings.security')}</h2>
          <div className="mt-3">
            <SettingRow icon={Key} title={t('assistant.settings.changePassword')}>
              <button className="text-xs font-medium text-primary hover:underline">{t('common.edit')}</button>
            </SettingRow>
            <SettingRow icon={Shield} title={t('assistant.settings.twoFactor')} description={twoFactor ? t('assistant.settings.twoFactorEnabled') : t('assistant.settings.twoFactorDisabled')}>
              <Toggle checked={twoFactor} onChange={setTwoFactor} />
            </SettingRow>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }}>
        <Card variant="default" padding="lg">
          <h2 className="mb-1 text-sm font-semibold text-foreground">{t('assistant.settings.privacy')}</h2>
          <div className="mt-3">
            <SettingRow icon={Eye} title={t('assistant.settings.dataUsage')}>
              <Toggle checked={dataUsage} onChange={setDataUsage} />
            </SettingRow>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }}>
        <Button variant="outline" size="md" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}
          className="w-full border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/8">
          {t('assistant.settings.logout')}
        </Button>
      </motion.div>
    </div>
  )
}
