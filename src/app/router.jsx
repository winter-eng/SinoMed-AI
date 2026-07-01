import { createBrowserRouter, Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { WebAppShell } from '@/shared/components/layout/WebAppShell'
import { PatientGuardLayout, DoctorGuardLayout, AssistantGuardLayout } from '@/shared/components/common/AuthGuard'
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
import { PatientChatPage } from '@/modules/chat/pages/PatientChatPage'
import { PatientDoctorChatPage } from '@/modules/chat/pages/PatientDoctorChatPage'
import { DoctorLayout } from '@/modules/doctor/components/DoctorLayout'
import { DoctorChatPage } from '@/modules/doctor/pages/DoctorChatPage'
import { PatientHistoryPage } from '@/modules/doctor/pages/PatientHistoryPage'
import { ActiveCasesPage } from '@/modules/doctor/pages/ActiveCasesPage'
import { DoctorSettingsPage } from '@/modules/doctor/pages/DoctorSettingsPage'
import { DoctorProfilePage } from '@/modules/doctor/pages/DoctorProfilePage'
import { AssistantLayout } from '@/modules/assistant/components/AssistantLayout'
import { EventsPage } from '@/modules/assistant/pages/EventsPage'
import { LeaderboardPage } from '@/modules/assistant/pages/LeaderboardPage'
import { ReferralPage } from '@/modules/assistant/pages/ReferralPage'
import { AssistantSettingsPage } from '@/modules/assistant/pages/AssistantSettingsPage'
import { AssistantProfilePage } from '@/modules/assistant/pages/AssistantProfilePage'
import { ROUTES } from '@/shared/constants/routes'

function NotFoundPage() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <div>
        <p className="text-lg font-semibold text-foreground">{t('notFound.title')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('notFound.desc')}</p>
      </div>
      <Link
        to={ROUTES.HOME}
        className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
      >
        {t('notFound.back')}
      </Link>
    </div>
  )
}

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth/login', element: <LoginPage /> },

  // Patient workspace
  {
    element: <PatientGuardLayout />,
    children: [
      { path: '/analysis/new', element: <ScreeningPage /> },
      { path: '/analysis/:id', element: <AnalysisResultPage /> },
      {
        element: <WebAppShell />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/chat', element: <PatientChatPage /> },
          { path: '/doctor-chat', element: <PatientDoctorChatPage /> },
          { path: '/support', element: <SupportPage /> },
          { path: '/clinics', element: <NearbyClinicsPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/health-profile', element: <HealthProfilePage /> },
        ],
      },
    ],
  },

  // Doctor workspace
  {
    element: <DoctorGuardLayout />,
    children: [
      {
        element: <DoctorLayout />,
        children: [
          { path: '/doctor', element: <Navigate to={ROUTES.DOCTOR.CASES} replace /> },
          { path: '/doctor/chat', element: <DoctorChatPage /> },
          { path: '/doctor/history', element: <PatientHistoryPage /> },
          { path: '/doctor/cases', element: <ActiveCasesPage /> },
          { path: '/doctor/settings', element: <DoctorSettingsPage /> },
          { path: '/doctor/profile', element: <DoctorProfilePage /> },
        ],
      },
    ],
  },

  // Assistant workspace
  {
    element: <AssistantGuardLayout />,
    children: [
      {
        element: <AssistantLayout />,
        children: [
          { path: '/assistant', element: <Navigate to={ROUTES.ASSISTANT.REFERRAL} replace /> },
          { path: '/assistant/events', element: <EventsPage /> },
          { path: '/assistant/leaderboard', element: <LeaderboardPage /> },
          { path: '/assistant/referral', element: <ReferralPage /> },
          { path: '/assistant/settings', element: <AssistantSettingsPage /> },
          { path: '/assistant/profile', element: <AssistantProfilePage /> },
        ],
      },
    ],
  },

  { path: '*', element: <NotFoundPage /> },
])
