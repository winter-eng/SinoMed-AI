import { createBrowserRouter } from 'react-router-dom'
import { WebAppShell } from '@/shared/components/layout/WebAppShell'
import { LandingPage } from '@/modules/landing/pages/LandingPage'
import { LoginPage } from '@/modules/auth/pages/LoginPage'
import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage'
import { ScreeningPage } from '@/modules/screening/pages/ScreeningPage'
import { AnalysisResultPage } from '@/modules/analysis/pages/AnalysisResultPage'
import { SettingsPage } from '@/modules/settings/pages/SettingsPage'
import { SupportPage } from '@/modules/support/pages/SupportPage'
import { NearbyClinicsPage } from '@/modules/clinics/pages/NearbyClinicsPage'
import { ProfilePage } from '@/modules/profile/pages/ProfilePage'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth/login', element: <LoginPage /> },
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
    ],
  },
])
