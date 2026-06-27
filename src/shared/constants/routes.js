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
  DOCTOR: {
    ROOT: '/doctor',
    CHAT: '/doctor/chat',
    HISTORY: '/doctor/history',
    CASES: '/doctor/cases',
    SETTINGS: '/doctor/settings',
    PROFILE: '/doctor/profile',
  },
  ASSISTANT: {
    ROOT: '/assistant',
    EVENTS: '/assistant/events',
    LEADERBOARD: '/assistant/leaderboard',
    REFERRAL: '/assistant/referral',
    SETTINGS: '/assistant/settings',
    PROFILE: '/assistant/profile',
  },
}
