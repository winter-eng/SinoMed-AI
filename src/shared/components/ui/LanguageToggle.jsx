import { useLanguage } from '@/shared/hooks/useLanguage'
import { cn } from '@/shared/lib/utils'

export function LanguageToggle({ className }) {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'flex h-9 items-center rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground',
        className,
      )}
      aria-label="Toggle language"
    >
      {language === 'uz' ? 'UZ' : 'RU'}
    </button>
  )
}
