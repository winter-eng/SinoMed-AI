import { useTranslation } from 'react-i18next'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import { useLanguage } from '@/shared/hooks/useLanguage'
import { THEMES } from '@/shared/constants/theme'
import { LANGUAGES, LANGUAGE_LABELS } from '@/shared/constants/languages'
import { cn } from '@/shared/lib/utils'

export function AppearanceSection() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground mb-3">{t('settings.theme')}</p>
        <div className="grid grid-cols-2 gap-2">
          {[THEMES.LIGHT, THEMES.DARK].map((th) => {
            const isSelected = theme === th
            const Icon = th === THEMES.LIGHT ? Sun : Moon
            return (
              <button
                key={th}
                onClick={() => setTheme(th)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border p-3.5 text-sm font-medium transition-all',
                  isSelected
                    ? 'border-primary bg-primary/8 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/40',
                )}
              >
                <Icon className={cn('h-4 w-4', isSelected && 'text-primary')} />
                {th === THEMES.LIGHT ? t('settings.themeLight') : t('settings.themeDark')}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-1">{t('settings.language')}</p>
        <p className="text-xs text-muted-foreground mb-3">{t('settings.languageDesc')}</p>
        <div className="grid grid-cols-2 gap-2">
          {[LANGUAGES.UZ, LANGUAGES.RU].map((lang) => {
            const isSelected = language === lang
            return (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all',
                  isSelected
                    ? 'border-primary bg-primary/8 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:bg-muted/40',
                )}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
