# Security

> Authentication flow, authorization model, and secure coding practices for SinoMed AI.

---

## Authentication Model

SinoMed AI uses **JWT Bearer tokens** issued by the FastAPI backend. The frontend is stateless — it stores only the token and a cached user profile object.

### Token Storage

| Key | Value | Cleared on |
|---|---|---|
| `sinomed-token` | JWT access token | Logout, expired-token 401 |
| `sinomed-user-role` | `patient` \| `doctor` \| `assistant` | Logout |
| `sinomed-user` | JSON-serialized profile cache | Logout |

### Token Injection

The Axios request interceptor reads the token on every outgoing request:

```js
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sinomed-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

No component or hook needs to pass a token manually — it is always present on protected requests.

---

## Automatic Session Termination on 401

The response error interceptor handles expired or revoked tokens globally:

```js
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error?.config?.url?.includes('/auth/')
    const skipLogout = error?.config?._skipLogout

    if (error?.response?.status === 401 && !isAuthEndpoint && !skipLogout) {
      window.dispatchEvent(new Event('auth:logout'))
    }

    return Promise.reject(error)
  }
)
```

`AuthProvider` listens for `auth:logout` and clears all stored credentials:

```js
const handler = () => logout()
window.addEventListener('auth:logout', handler)
```

**Two safety exclusions prevent false logouts:**

1. **`/auth/*` endpoints** — A wrong password returns `401`. Without the exclusion, a failed login attempt would destroy an existing valid session.
2. **`_skipLogout` flag** — Used during app bootstrap (`GET /patients/me` with `_skipLogout: true`). The bootstrap handler clears storage directly when the token is expired, rather than firing the global event, to avoid a race condition during initialization.

---

## Role-Based Access Control

### Frontend Route Guards

Three `*GuardLayout` components in `src/shared/components/common/AuthGuard.jsx` enforce role isolation before any route renders or any API call fires:

```
/dashboard, /analysis/*, /chat, /clinics, ...
  → PatientGuardLayout
  → allows role=patient only
  → redirects doctor → /doctor/cases
  → redirects assistant → /assistant/referral
  → redirects unauthenticated → /auth/login

/doctor/*
  → DoctorGuardLayout
  → allows role=doctor only
  → all others → /dashboard

/assistant/*
  → AssistantGuardLayout
  → allows role=assistant only
  → all others → /dashboard
```

### Backend Enforcement

Frontend route guards are a UX layer only. Real authorization is enforced server-side on every endpoint. The frontend never assumes that passing a guard means the backend will fulfill the request — it always handles `403` and `401` errors from any endpoint.

---

## Secure Coding Practices

### Centralized HTTP Layer

All network calls go through `src/shared/api/client.js` and the six domain API files. There are no ad-hoc `fetch()` calls or secondary Axios instances anywhere in the codebase. This ensures:
- Token injection is universal
- 401 auto-logout fires for every protected endpoint
- Error handling is consistent

### No Secrets in Source

The only environment variable is `VITE_API_URL` — a public base URL, not a secret. No API keys, signing secrets, database credentials, or service account tokens exist in the frontend.

### Development-Only Logging

API error details (request body, status, response) are logged to the console only in development mode:

```js
if (import.meta.env.DEV) {
  console.group(`[API ERROR] ${method} ${url}`)
  // ... detailed logging
  console.groupEnd()
}
```

Production builds produce zero console output for network activity.

### XSS Prevention

React escapes all values rendered via JSX. No `dangerouslySetInnerHTML` is used anywhere. User-supplied strings from the backend (patient names, clinic addresses, chat messages) are always rendered as text nodes.

### CSRF

Not applicable. SPA with JWT Bearer token authentication is not vulnerable to CSRF — browsers cannot forge the `Authorization: Bearer` header from a third-party origin.

### Input Handling

- File uploads are restricted to `image/*` via the `accept` attribute (with server-side re-validation)
- All numeric inputs (age, height, weight) use `type="number"` with positive-value constraints
- Backend `detail` error messages are surfaced as-is only when the value is confirmed to be a `string`; otherwise a localized generic message is shown

---

## Known Limitations

| Item | Current State |
|---|---|
| Token refresh | No silent refresh. Session ends when the token expires; user must log in again. |
| Change password | No backend endpoint exists. The UI element has been removed. |
| 2FA | Toggle is localStorage-only. No backend integration yet. |
| Notification preferences | localStorage-only. No backend sync. |
| Token expiry duration | Set by the backend; not configurable from the frontend. |
