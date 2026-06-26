export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
  },
  DASHBOARD: '/dashboard',
  SCREENING: {
    NEW: '/analysis/new',
  },
  ANALYSIS: {
    RESULT: (id) => `/analysis/${id}`,
  },
  SUPPORT: '/support',
  CLINICS: '/clinics',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  HEALTH_PROFILE: '/health-profile',
}
