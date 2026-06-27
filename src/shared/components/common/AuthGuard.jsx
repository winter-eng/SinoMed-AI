import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/constants/routes'
import { LoadingScreen } from '@/shared/components/ui/LoadingScreen'

export function AuthGuardLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  return <Outlet />
}

export function PatientGuardLayout() {
  const { isAuthenticated, isLoading, role } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  if (role === 'doctor') return <Navigate to={ROUTES.DOCTOR.CASES} replace />
  if (role === 'assistant') return <Navigate to={ROUTES.ASSISTANT.REFERRAL} replace />
  return <Outlet />
}

export function DoctorGuardLayout() {
  const { isAuthenticated, isLoading, role } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  if (role !== 'doctor') return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}

export function AssistantGuardLayout() {
  const { isAuthenticated, isLoading, role } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  if (role !== 'assistant') return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}
