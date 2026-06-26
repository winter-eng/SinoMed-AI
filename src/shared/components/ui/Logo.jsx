import { cn } from '@/shared/lib/utils'

export function Logo({ size = 'md', showText = true, className }) {
  const sizes = {
    xs: { img: 'h-8 w-8', text: 'text-xs' },
    sm: { img: 'h-9 w-9', text: 'text-sm' },
    md: { img: 'h-10 w-10', text: 'text-sm font-semibold' },
    lg: { img: 'h-16 w-16', text: 'text-base' },
    xl: { img: 'h-[72px] w-[72px]', text: 'text-lg' },
  }

  const s = sizes[size] ?? sizes.md

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src="/sinomed-logo.png"
        alt="SinoMed AI"
        className={cn(s.img, 'object-contain')}
        draggable={false}
      />
      {showText && (
        <span className={cn('font-semibold text-foreground tracking-tight', s.text)}>
          SinoMed AI
        </span>
      )}
    </div>
  )
}
