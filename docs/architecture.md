# Architecture

> Frontend architecture reference for SinoMed AI.

---

## Provider Tree

The application wraps the entire React tree in three providers, composed in `src/app/App.jsx`:

```
<QueryProvider>          ← TanStack Query client (server state)
  <ThemeProvider>        ← Light/dark theme; reads sinomed-theme from localStorage
    <AuthProvider>       ← JWT auth state; reads sinomed-token / sinomed-user-role
      <RouterProvider>   ← React Router v7; all routes in src/app/router.jsx
    </AuthProvider>
  </ThemeProvider>
</QueryProvider>
```

**Dependency order matters:** `AuthProvider` lives inside `QueryProvider` so that pages can trigger Query invalidation from within the auth context (e.g., `queryClient.invalidateQueries` after login). `ThemeProvider` is outermost UI concern.

---

## Router Layout

Routes are organized into three isolated workspaces, each protected by its own guard:

```
/                           → LandingPage         (public)
/auth/login                 → LoginPage            (public)

PatientGuardLayout
  /analysis/new             → ScreeningPage
  /analysis/:id             → AnalysisResultPage
  WebAppShell
    /dashboard              → DashboardPage
    /chat                   → PatientChatPage       (AI chat)
    /doctor-chat            → PatientDoctorChatPage (doctor-patient channel)
    /clinics                → NearbyClinicsPage
    /support                → SupportPage
    /settings               → SettingsPage
    /profile                → ProfilePage
    /health-profile         → HealthProfilePage

DoctorGuardLayout
  DoctorLayout
    /doctor                 → redirect → /doctor/cases
    /doctor/cases           → ActiveCasesPage
    /doctor/history         → PatientHistoryPage
    /doctor/chat            → DoctorChatPage
    /doctor/settings        → DoctorSettingsPage
    /doctor/profile         → DoctorProfilePage

AssistantGuardLayout
  AssistantLayout
    /assistant              → redirect → /assistant/referral
    /assistant/referral     → ReferralPage
    /assistant/leaderboard  → LeaderboardPage
    /assistant/events       → EventsPage
    /assistant/settings     → AssistantSettingsPage
    /assistant/profile      → AssistantProfilePage

*                           → NotFoundPage         (public)
```

---

## Module Structure

Each feature is a vertical slice under `src/modules/<feature>/`. A module owns:

```
modules/<feature>/
├── pages/         Route-level components (one per route)
├── components/    Feature-specific UI components
└── hooks/         Feature-specific custom hooks
```

Cross-cutting concerns live in `src/shared/`:

```
shared/
├── api/           All HTTP calls (one file per domain)
├── components/
│   ├── common/    AuthGuard, etc.
│   ├── layout/    Shell, navigation bars
│   └── ui/        Design system primitives
├── constants/     Route strings, storage keys, theme values
└── hooks/         TanStack Query wrappers, theme, language, date
```

**Rule:** a module may import from `shared/`. Modules do not import from other modules.

---

## State Management

### Server State — TanStack Query

Used for data that lives on the backend. Two hooks wrap the prediction API:

```js
// 30-second stale time; re-fetches on window focus
usePredictions({ limit })         → GET /predictions/me

// 5-minute stale time; cached per prediction ID
usePredictionDetail(id)           → GET /predictions/me/:id
```

Cache is invalidated explicitly after a new prediction is submitted (`queryClient.invalidateQueries({ queryKey: ['predictions'] })`).

Doctor and assistant pages use direct `useState` + `useEffect` patterns (no TanStack Query) because their data does not benefit from cross-page caching.

### Auth State — React Context

`AuthProvider` exposes:

```ts
{
  user: PatientProfile | DoctorProfile | NurseProfile | null
  token: string | null
  role: 'patient' | 'doctor' | 'assistant' | null
  isAuthenticated: boolean
  isLoading: boolean
  login(identifier, password, role): Promise<void>
  register({ full_name, phone, password, email?, referral_code? }): Promise<void>
  logout(): void
  updateUser(userData): void
}
```

On app bootstrap, the provider reads `localStorage` and re-validates the patient token via `GET /patients/me`. For doctor/assistant sessions, the cached profile object is restored directly (pages re-fetch fresh data on mount).

### UI State — localStorage

Theme and language are stored in `localStorage` and managed by `useTheme()` / `useLanguage()` hooks. They do not go through React Context — any component can read or write them independently.

Settings toggles (notifications, 2FA, privacy) have no backend counterpart and are stored in `localStorage` under role-prefixed keys (`dr.*`, `as.*`).

---

## API Layer

All HTTP calls are centralized in `src/shared/api/`:

```
client.js             Axios instance + two interceptors
auth.api.js           /auth/patient/*, /auth/doctor/*, /auth/nurse/*
patient.api.js        /patients/*
prediction.api.js     /predict, /predictions/me/*
chat.api.js           /chat/*, /dp-chat/*
doctor.api.js         /doctors/*, /anketa/doctor/*
clinic.api.js         /clinics/*
nurse.api.js          /nurses/*
```

### Axios Interceptors

**Request interceptor:** injects `Authorization: Bearer <token>` from `localStorage` on every outgoing request.

**Response error interceptor:**
1. Logs the failed request (method, URL, body, status) to the browser console — **only in development mode** (`import.meta.env.DEV`).
2. On `401`: dispatches the global `auth:logout` event, which `AuthProvider` listens to and calls `logout()` — unless the request was to an `/auth/` endpoint or opted out via `_skipLogout` config flag.

---

## Localization

i18next is initialized in `src/i18n/config.js`:

- **Default locale:** `uz` (Uzbek)
- **Secondary locale:** `ru` (Russian)
- **Detection:** browser language → `localStorage` (`sinomed-lang`) → fallback `uz`
- **~620 translation keys** per locale covering all UI text, error messages, medical grade names, and per-grade recommendations

All user-facing strings use the `t()` hook. Hardcoded English strings are a bug.

---

## Responsive Layout

The patient workspace uses `WebAppShell`, which renders:
- `MobileTopbar` + `MobileBottomNav` on narrow viewports
- `DesktopTopbar` on wide viewports

Doctor and assistant workspaces have their own `DoctorLayout` / `AssistantLayout` with equivalent navigation.

The screening wizard and analysis result page are full-screen layouts (no shell) to maximize focus.

---

## Animation

All page transitions, card entrances, and micro-interactions use Framer Motion. Common patterns:

```jsx
// Page entrance
<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

// Staggered list
variants={containerVariants} // staggerChildren: 0.09
variants={itemVariants}       // opacity 0→1, y 14→0

// Bottom sheet
initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
transition={{ type: 'spring', stiffness: 340, damping: 32 }}
```
