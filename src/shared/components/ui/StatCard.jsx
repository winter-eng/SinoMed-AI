import { cn } from '@/shared/lib/utils'
import { Card } from './Card'

export function StatCard({ value, label, icon, trend, className, highlight, compact }) {
  return (
    <Card
      variant="default"
      padding={compact ? 'sm' : 'md'}
      className={cn(
        'flex min-w-0 flex-col gap-2 overflow-hidden',
        highlight && 'border-primary/30 bg-primary/5',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        {icon && (
          <span className={cn(
            'flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
            compact ? 'h-7 w-7' : 'h-8 w-8',
          )}>
            {icon}
          </span>
        )}
        {trend && (
          <span
            className={cn(
              'text-xs font-medium',
              trend.positive !== false ? 'text-green-600 dark:text-green-400' : 'text-destructive',
            )}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className={cn(
          'font-bold text-foreground leading-none truncate',
          compact ? 'text-lg' : 'text-2xl',
        )}>
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground leading-tight line-clamp-2">{label}</p>
      </div>
    </Card>
  )
}
