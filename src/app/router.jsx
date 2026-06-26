import { createBrowserRouter, Link } from 'react-router-dom'
import { WebAppShell } from '@/shared/components/layout/WebAppShell'
import { AuthGuardLayout } from '@/shared/components/common/AuthGuard'
import { LandingPage } from '@/modules/landing/pages/LandingPage'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { ScreeningPage } from '@/modules/screening/pages/ScreeningPage'
import { AnalysisResultPage } from '@/modules/analysis/pages/AnalysisResultPage'
import { SettingsPage } from '@/modules/settings/pages/SettingsPage'
import { SupportPage } from '@/modules/support/pages/SupportPage'
import { NearbyClinicsPage } from '@/modules/clinics/pages/NearbyClinicsPage'
import { ProfilePage } from '@/modules/profile/pages/ProfilePage'
import { HealthProfilePage } from '@/modules/health-profile/pages/HealthProfilePage'
import { ROUTES } from '@/shared/constants/routes'

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <div>
        <p className="text-lg font-semibold text-foreground">Sahifa topilmadi</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Bu sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
        </p>
      </div>
      <Link
        to={ROUTES.HOME}
        className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth/login', element: <LoginPage /> },
  {
    element: <AuthGuardLayout />,
    children: [
      { path: '/analysis/new', element: <ScreeningPage /> },
      { path: '/analysis/:id', element: <AnalysisResultPage /> },
      {
        element: <WebAppShell />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/support', element: <SupportPage /> },
          { path: '/clinics', element: <NearbyClinicsPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/health-profile', element: <HealthProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
