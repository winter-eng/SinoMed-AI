# Role System

> Complete role definitions, permissions, and route guard implementation for SinoMed AI.

---

## Overview

SinoMed AI has three active frontend roles and four backend-only administrative roles.

| Role | Auth Method | Home Route | Frontend |
|---|---|---|---|
| `patient` | Phone + password | `/dashboard` | ✅ Full workspace |
| `doctor` | Username + password | `/doctor/cases` | ✅ Full workspace |
| `assistant` | Username + password | `/assistant/referral` | ✅ Full workspace |
| `operator` | *(backend only)* | — | ❌ Not in this app |
| `clinic_admin` | *(backend only)* | — | ❌ Not in this app |
| `system_admin` | *(backend only)* | — | ❌ Not in this app |
| `super_admin` | *(backend only)* | — | ❌ Not in this app |

---

## Role Detection

The role is stored in `localStorage` under `sinomed-user-role` after login. The login form has a role selector (patient tab vs. staff tab). The `AuthProvider` reads this value on bootstrap and makes it available via `useAuth().role`.

```js
// AuthProvider bootstrap
const savedRole = localStorage.getItem('sinomed-user-role') ?? 'patient'
```

If no role is stored, `patient` is assumed. This is safe because the patient guard is the most restrictive for the doctor/assistant routes — a patient token cannot access `/doctors/*` or `/anketa/*` endpoints.

---

## Route Permission Matrix

| Route | Patient | Doctor | Assistant | Unauthenticated |
|---|:---:|:---:|:---:|:---:|
| `/` (landing) | ✅ | ✅ | ✅ | ✅ |
| `/auth/login` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/analysis/new` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/analysis/:id` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/chat` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/doctor-chat` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/clinics` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/profile` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/health-profile` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/settings` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/support` | ✅ | → /doctor/cases | → /assistant/referral | → /auth/login |
| `/doctor/*` | → /dashboard | ✅ | → /dashboard | → /auth/login |
| `/assistant/*` | → /dashboard | → /dashboard | ✅ | → /auth/login |

"→ X" means the user is immediately redirected to route X.

---

## Guard Implementation

### PatientGuardLayout

Protects all patient workspace routes. Redirects authenticated non-patients to their own home route.

```jsx
export function PatientGuardLayout() {
  const { isAuthenticated, isLoading, role } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  if (role === 'doctor') return <Navigate to={ROUTES.DOCTOR.CASES} replace />
  if (role === 'assistant') return <Navigate to={ROUTES.ASSISTANT.REFERRAL} replace />
  return <Outlet />
}
```

### DoctorGuardLayout

Protects all doctor workspace routes. Any authenticated non-doctor is sent to the patient dashboard (where they will be re-redirected to their own home route by `PatientGuardLayout`).

```jsx
export function DoctorGuardLayout() {
  const { isAuthenticated, isLoading, role } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  if (role !== 'doctor') return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}
```

### AssistantGuardLayout

Same pattern as DoctorGuardLayout for the assistant workspace.

```jsx
export function AssistantGuardLayout() {
  const { isAuthenticated, isLoading, role } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to={ROUTES.AUTH.LOGIN} replace />
  if (role !== 'assistant') return <Navigate to={ROUTES.DASHBOARD} replace />
  return <Outlet />
}
```

---

## Patient Role

### Identity

Identified by `role === 'patient'` in `AuthContext`. Profile loaded from `GET /patients/me`.

### Login Identifier

Phone number (`+998...` format). Submitted as `{ phone, password }` to `POST /auth/patient/login`.

### Profile Fields

```ts
{
  id: number
  full_name: string
  phone: string
  email?: string
  date_of_birth?: string      // ISO date
  blood_type?: string
  height?: number             // cm
  weight?: number             // kg
  allergies?: string
  chronic_diseases?: string
  created_at: string          // ISO datetime
}
```

### Capabilities

- Submit retinal images for AI analysis
- View all personal predictions
- Use AI diagnostic chat
- Read doctor-patient chat history
- Manage personal profile and health profile
- Browse nearby clinics
- Toggle theme and language

---

## Doctor Role

### Identity

Identified by `role === 'doctor'`. Profile loaded from `GET /doctors/me` and cached in `localStorage` as `sinomed-user`.

### Login Identifier

Username string. Submitted as `{ username, password }` to `POST /auth/doctor/login`.

### Profile Fields

```ts
{
  id: number
  full_name: string
  username: string
  specialization?: string
  clinic_id?: number
  phone?: string
  email?: string
  created_at: string
}
```

### Capabilities

- View and filter AI case queue (`GET /anketa/doctor`)
- Inspect individual case details (`GET /anketa/doctor/:id`)
- View assigned patient list (`GET /doctors/patients`)
- Inspect patient detail sheets (`GET /doctors/patients/:id`)
- Send images to patients via doctor-patient chat (`POST /dp-chat/upload`)
- View chat history per patient (`GET /dp-chat/history/:patientId`)
- Toggle theme and language

---

## Medical Assistant (Nurse) Role

### Identity

Identified by `role === 'assistant'`. The role string in the codebase is `'assistant'`, but the backend API path is `/nurses/*`.

### Login Identifier

Username string. Submitted as `{ username, password }` to `POST /auth/nurse/login`.

### Profile Fields

```ts
{
  id: number
  full_name: string
  username: string
  referral_code: string    // unique code for patient recruitment
  clinic_id?: number
  phone?: string
  created_at: string
}
```

### Capabilities

- View personal referral code
- Copy or share referral code via Web Share API
- View list of recruited patients (`GET /nurses/referrals`)
- View personal referral score on the leaderboard
- Toggle theme and language

---

## Role Lifecycle

```
User opens app
      │
      ├── No token in localStorage
      │       └── isAuthenticated = false → show login
      │
      └── Token exists
              │
              ├── role = 'patient'
              │       └── GET /patients/me (with _skipLogout)
              │           ├── 200 → authenticated, user hydrated
              │           └── 401 → token expired → clear storage → show login
              │
              ├── role = 'doctor'
              │       └── Restore cached profile from sinomed-user
              │           (pages re-fetch fresh data on mount)
              │
              └── role = 'assistant'
                      └── Restore cached profile from sinomed-user
```

```
User logs out (any role)
      │
      ├── localStorage.removeItem('sinomed-token')
      ├── localStorage.removeItem('sinomed-user')
      ├── localStorage.removeItem('sinomed-user-role')
      └── AuthContext reset → redirect to /auth/login
```

```
Any API returns 401 (token expired mid-session)
      │
      ├── Axios interceptor fires
      ├── window.dispatchEvent('auth:logout')
      ├── AuthProvider listener calls logout()
      └── User redirected to /auth/login
```
