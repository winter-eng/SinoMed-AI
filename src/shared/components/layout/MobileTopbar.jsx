import { Link } from 'react-router-dom'
import { Logo } from '@/shared/components/ui/Logo'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { LanguageToggle } from '@/shared/components/ui/LanguageToggle'
import { ROUTES } from '@/shared/constants/routes'

export function MobileTopbar() {
  return (
    <header className="lg:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/80 backdrop-blur-xl px-4">
      <Link to={ROUTES.DASHBOARD} className="flex items-center">
        <Logo size="sm" />
      </Link>
      <div className="flex items-center gap-1">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  )
}
