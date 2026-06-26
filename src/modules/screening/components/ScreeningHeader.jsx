import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'
import { Logo } from '@/shared/components/ui/Logo'

const STEP_NAME_KEYS = ['welcome', 'photo', 'quiz', 'review', 'analysis']

export function ScreeningHeader({ step, totalSteps }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const progress = ((step - 1) / (totalSteps - 1)) * 100
  const stepNameKey = STEP_NAME_KEYS[step - 1] ?? STEP_NAME_KEYS[0]

  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="mx-auto flex h-[60px] max-w-2xl items-center gap-3 px-4">
        <div className="shrink-0">
          <Logo size="md" showText={true} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-foreground truncate">
              {t(`screening.steps.${stepNameKey}`)}
            </span>
            <span className="text-xs text-muted-foreground ml-2 shrink-0">
              {t('screening.stepOf', { current: step, total: totalSteps })}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground hover:border-border"
          aria-label={t('screening.cancel')}
          title={t('screening.cancel')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
