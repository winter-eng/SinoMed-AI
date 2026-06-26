import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ThemeToggle } from '@/shared/components/ui/ThemeToggle'
import { LanguageToggle } from '@/shared/components/ui/LanguageToggle'
import { Button } from '@/shared/components/ui/Button'
import { Logo } from '@/shared/components/ui/Logo'
import { ROUTES } from '@/shared/constants/routes'
import { HeroSection } from '../components/HeroSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { WhyMattersSection } from '../components/WhyMattersSection'
import { CtaSection } from '../components/CtaSection'
import { LandingFooter } from '../components/LandingFooter'

export function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-xl px-4 sm:px-6">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
          <Logo size="md" />

          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <Link to={ROUTES.AUTH.LOGIN}>
              <Button variant="outline" size="sm" className="ml-1">
                {t('landing.nav.login')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhyMattersSection />
      <CtaSection />
      <LandingFooter />
    </div>
  )
}
