import { useTranslation } from 'react-i18next'
import { Logo } from '@/shared/components/ui/Logo'

export function LandingFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto max-w-5xl flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between">
        <Logo size="sm" />
        <p className="text-xs text-muted-foreground max-w-sm">
          {t('landing.footer.disclaimer')}
        </p>
        <p className="text-xs text-muted-foreground">{t('landing.footer.rights')}</p>
      </div>
    </footer>
  )
}
