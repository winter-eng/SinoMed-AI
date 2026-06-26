import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { Button } from './Button'

export function PageHeader({ title, subtitle, back, actions, className }) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (typeof back === 'string') {
      navigate(back)
    } else {
      navigate(-1)
    }
  }

  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex items-start gap-3">
        {back !== undefined && back !== false && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleBack}
            className="mt-0.5 shrink-0 text-muted-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-xl font-semibold text-foreground leading-tight">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
