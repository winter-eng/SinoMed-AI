<div align="center">

# SinoMed AI

**AI-Powered Digital Healthcare Ecosystem**

*Connecting patients, doctors, AI, and clinics into one intelligent diagnostic platform*

---

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![i18n](https://img.shields.io/badge/i18n-Uzbek%20%7C%20Russian-green)](#localization)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](#getting-started)

</div>

---

## What is SinoMed AI?

SinoMed AI is **not just an AI model**. It is a complete, production-grade digital healthcare ecosystem built for the Central Asian medical market.

The platform bridges the gap between patients who have never had access to specialist diagnostics and the doctors who can help them — by putting an AI diagnostician in every patient's pocket.

**Seven actors. One platform.**

| Actor | Role in the Ecosystem |
|---|---|
| **Patient** | Submits retinal images and health questionnaires; receives AI risk assessments |
| **Artificial Intelligence** | Analyzes retinal fundus images; classifies diabetic retinopathy at 5 severity grades |
| **Doctor** | Reviews AI-generated cases, communicates with patients, tracks medical history |
| **Medical Assistant** | Recruits patients via referral codes; tracked on a performance leaderboard |
| **Call Center Operator** | Routes new AI-flagged cases to available doctors *(backend role)* |
| **Clinic Administrator** | Manages clinic staff and patient assignments *(backend role)* |
| **System Administrator** | Platform-wide configuration and monitoring *(backend role)* |

---

## The Problem

Healthcare access in Central Asia faces systemic challenges affecting millions of people:

- **Geographic barriers** — Specialist ophthalmologists and endocrinologists are concentrated in urban centers, leaving rural populations without access to early screening.
- **Late-stage diagnosis** — Diabetic retinopathy, one of the leading causes of preventable blindness, is almost entirely treatable when caught early. Most patients present at advanced stages.
- **No continuity of care** — Patients with chronic conditions lack a digital record connecting their screening history, doctor visits, and treatment outcomes.
- **Doctor overload** — Physicians spend disproportionate time on routine triage that AI can handle, leaving less capacity for complex cases.
- **No referral infrastructure** — Community health workers have no standardized digital tool to connect their communities to formal healthcare.

---

## The Solution

SinoMed AI addresses each problem with a purpose-built feature:

| Problem | Solution |
|---|---|
| Geographic barriers | Mobile-first web app — works on any smartphone, no installation required |
| Late diagnosis | AI retinal analysis in under 60 seconds, available 24/7 |
| No continuity | Persistent patient history; every screening archived and linked to doctor reviews |
| Doctor overload | AI pre-triages cases by risk grade; doctors see a prioritized queue, not raw intake |
| No referral infrastructure | Medical assistants get unique referral codes, a recruitment dashboard, and a live leaderboard |

---

## Complete Patient Journey

```
┌─────────────────────────────────────────────────────────────┐
│                        PATIENT                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ Registration│  Phone number + password
                    │  / Login    │  Optional referral code
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  5-Step AI  │  Step 1 – Welcome briefing
                    │  Screening  │  Step 2 – Retinal photo upload
                    │   Wizard    │  Step 3 – Health questionnaire
                    │             │  Step 4 – Review & confirm
                    │             │  Step 5 – AI processing
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │     AI      │  POST /predict (image)
                    │  Analysis   │  Diabetic retinopathy 0–4
                    │   Engine    │  Confidence score
                    │             │  Per-class probabilities
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Risk     │  Grade 0 – No DR
                    │ Assessment  │  Grade 1 – Mild NPDR
                    │   Result    │  Grade 2 – Moderate NPDR
                    │             │  Grade 3 – Severe NPDR
                    │             │  Grade 4 – Proliferative DR
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Automatic  │  Case (anketa) created
                    │   Medical   │  and queued for review
                    │    Case     │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │    Call     │  Operator reviews risk grade
                    │   Center    │  Routes to appropriate doctor
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Doctor    │  Reviews AI analysis + image
                    │   Review    │  Chats directly with patient
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Diagnosis  │  Updates case status
                    │ & Treatment │  Records in patient history
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Lifetime  │  All screenings preserved
                    │   Medical   │  Doctor-accessible history
                    │   History   │  Patient-viewable dashboard
                    └─────────────┘
```

---

## User Roles

### Patient

The primary end-user of the platform. Authenticate via **phone number + password**.

**Capabilities:**
- Register with an optional referral code (linked to the recruiting medical assistant)
- Run the 5-step AI screening wizard — upload a retinal fundus photo, complete a health questionnaire, and receive a full AI risk report
- View all past screening results with animated risk gauges and probability breakdowns
- Chat with the AI diagnostic assistant for follow-up questions
- Chat directly with the assigned doctor *(separate channel from AI chat)*
- Manage health profile (blood type, height, weight, allergies, chronic conditions)
- Find nearby partner clinics using device geolocation
- Switch between Uzbek and Russian interfaces; toggle light/dark theme

---

### Doctor

Medical professionals. Authenticate via **username + password**.

**Capabilities:**
- View a live queue of AI-generated cases (anketas) with risk grade, confidence score, patient name, and clinic
- Open any case to inspect the full AI analysis, retinal image, questionnaire responses, and metadata
- Browse the full list of assigned patients with personal, contact, and medical detail sheets
- Communicate with patients via an image-capable doctor-patient chat channel
- View and manage account settings and preferences

---

### Medical Assistant (Nurse)

Community healthcare workers who drive patient acquisition. Authenticate via **username + password**.

**Capabilities:**
- View and share a unique **referral code** that links recruited patients to the assistant
- Track total patients recruited
- View personal score on the referral **leaderboard**
- Manage account settings and preferences

---

### Administrative Roles *(Backend-managed)*

These roles exist in the backend system and are served by separate administrative interfaces — not this frontend:

| Role | Responsibility |
|---|---|
| **Call Center Operator** | Reviews new AI cases; routes patients to doctors |
| **Clinic Administrator** | Manages clinic-level staff, schedules, and assignments |
| **System Administrator** | Platform configuration and role management |
| **Super Administrator** | Full platform access; system-wide oversight |

---

## AI Engine

### Retinal Image Analysis

The AI model ingests retinal fundus photographs and returns a **5-class diabetic retinopathy classification**:

| Grade | Classification | Clinical Meaning |
|---|---|---|
| **0** | No DR | No detectable signs of diabetic retinopathy |
| **1** | Mild NPDR | Microaneurysms only |
| **2** | Moderate NPDR | More than microaneurysms; less than severe NPDR |
| **3** | Severe NPDR | Hemorrhages, venous beading, intraretinal microvascular abnormalities |
| **4** | Proliferative DR | Neovascularization; vitreous or pre-retinal hemorrhage |

Each prediction includes:
- **Risk grade** (0–4 integer)
- **Confidence score** (0.0–1.0 float, displayed as percentage)
- **Per-class probability distribution** (animated bars in the result UI)
- **Grade name** and **localized description** from the backend
- **Uploaded retinal image** served from `/uploads/`
- **Timestamped record** permanently stored and linked to the patient

### Questionnaire Analysis

Before image submission, the patient completes a structured health questionnaire:

- **Demographics:** age, gender
- **Physical metrics:** height, weight → real-time BMI calculation with category classification
- **Symptoms:** thirst, frequent urination, fatigue, vision blur, wound healing difficulty, tingling
- **Medical history:** family history of diabetes, hypertension, activity level, diet type

Responses are stored alongside the AI prediction and are visible to the reviewing doctor.

### AI Prediction Flow

```
Patient uploads retinal image
          │
          ▼
POST /predict  (multipart/form-data, Bearer token)
          │
          ▼
Backend AI Model
  ├── Image preprocessing
  ├── CNN inference
  └── Softmax probability output
          │
          ▼
{ id, diagnosis, confidence, probabilities, filename, grade_name, grade_uz, ... }
          │
          ▼
Frontend renders:
  ├── RiskGauge      — animated score arc (0–100)
  ├── ProbabilityBars — per-class animated bars with i18n grade labels
  ├── FindingsList   — description + localized grade name
  └── Recommendations — per-grade localized advice (5 sets × 3 items)
```

### AI Diagnostic Chat

A separate conversational AI interface (`/chat`) allows patients to ask follow-up questions after reviewing their results. This is **distinct** from the doctor-patient chat:

| | AI Chat | Doctor-Patient Chat |
|---|---|---|
| Route | `/chat` | `/doctor-chat` (patient) / `/doctor/chat` (doctor) |
| Endpoint | `POST /chat`, `GET /chat/history` | `GET /dp-chat/history`, `POST /dp-chat/upload` |
| Participants | Patient ↔ AI | Patient ↔ Assigned Doctor |
| Image upload | No | Yes (doctor-side) |

---

## Features

| Feature | Patient | Doctor | Assistant |
|---|:---:|:---:|:---:|
| AI retinal image screening | ✅ | | |
| 5-step guided screening wizard | ✅ | | |
| Real-time BMI calculator | ✅ | | |
| Risk gauge with animated arc | ✅ | ✅ | |
| Per-class probability bars | ✅ | ✅ | |
| Screening history & archive | ✅ | | |
| AI diagnostic chat | ✅ | | |
| Doctor-patient chat (image upload) | ✅ | ✅ | |
| Active cases queue (AI anketas) | | ✅ | |
| Patient history panel | | ✅ | |
| Case detail (AI + questionnaire + image) | | ✅ | |
| Referral code generation & sharing | | | ✅ |
| Referral leaderboard | | | ✅ |
| Nearby clinics with geolocation | ✅ | | |
| Health profile management | ✅ | | |
| User profile management | ✅ | ✅ | ✅ |
| Dark / light theme | ✅ | ✅ | ✅ |
| Uzbek / Russian UI | ✅ | ✅ | ✅ |
| Role-based route protection | ✅ | ✅ | ✅ |
| JWT auto-logout on 401 | ✅ | ✅ | ✅ |
| Fully responsive (mobile-first) | ✅ | ✅ | ✅ |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19 | UI framework |
| [Vite](https://vitejs.dev) | 6 | Build tool & dev server |
| [React Router](https://reactrouter.com) | 7 | Client-side routing |
| [TanStack Query](https://tanstack.com/query) | 5 | Server state & caching |
| [Framer Motion](https://www.framer.com/motion) | 11 | Animations & transitions |
| [Tailwind CSS](https://tailwindcss.com) | 3 | Utility-first styling |
| [Lucide React](https://lucide.dev) | 0.468 | Icon system |
| [Axios](https://axios-http.com) | 1.7 | HTTP client with interceptors |
| [i18next](https://www.i18next.com) | 26 | Internationalization |
| [Inter](https://rsms.me/inter/) via `@fontsource` | 5 | Typography |

### Backend

| Technology | Purpose |
|---|---|
| FastAPI (Python) | REST API server |
| PostgreSQL | Primary data store |
| OpenAPI / Swagger | API documentation at `/docs` |
| JWT OAuth2 Bearer | Authentication tokens |

Backend base URL: `https://aidiagnostikapi.sangilov.uz`

### AI

| Component | Detail |
|---|---|
| Task | Diabetic retinopathy severity classification |
| Input | Retinal fundus photograph (JPEG/PNG) |
| Output | Grade 0–4 classification + per-class softmax probabilities |
| Architecture | Convolutional Neural Network |
| Training data | Kaggle EyePACS / APTOS 2019 competition datasets |

### Localization

| Locale | Code | Status |
|---|---|---|
| Uzbek | `uz` | ✅ Default |
| Russian | `ru` | ✅ Complete |

Language is auto-detected from the browser (`i18next-browser-languagedetector`) and persisted in `localStorage` under `sinomed-lang`. All UI strings, error messages, medical grade names, and recommendations are fully localized.

---

## Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────┐
│                     Browser / Mobile                       │
│                                                            │
│  React 19 + Vite                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Auth Layer  │  │ Route Guards │  │  i18n (uz/ru)   │  │
│  │ AuthProvider │  │ PatientGuard │  │  i18next        │  │
│  │ JWT + roles  │  │ DoctorGuard  │  │  BrowserDetect  │  │
│  └──────┬───────┘  │ AssistantGrd │  └─────────────────┘  │
│         │          └──────────────┘                        │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │              Feature Modules                          │  │
│  │  auth  screening  analysis  chat  dashboard           │  │
│  │  doctor  assistant  clinics  health-profile  ...     │  │
│  └──────┬───────────────────────────────────────────────┘  │
│         │                                                   │
│  ┌──────▼───────────────────────────────────────────────┐  │
│  │              Shared API Layer                         │  │
│  │  client.js  (Axios + Bearer interceptor + 401 guard)  │  │
│  │  auth.api  patient.api  prediction.api  chat.api      │  │
│  │  doctor.api  nurse.api  clinic.api                    │  │
│  └──────┬───────────────────────────────────────────────┘  │
└─────────┼──────────────────────────────────────────────────┘
          │  HTTPS  Authorization: Bearer <token>
          ▼
┌─────────────────────────────────────────────────────────────┐
│              FastAPI Backend                                 │
│         https://aidiagnostikapi.sangilov.uz                  │
└─────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
Login
  │  POST /auth/{role}/login  { phone | username, password }
  ▼
Backend returns { access_token }
  │
  ├── localStorage: sinomed-token = access_token
  ├── localStorage: sinomed-user-role = role
  │
  ├── role=patient   → GET /patients/me   → hydrate user
  ├── role=doctor    → GET /doctors/me    → cache profile
  └── role=assistant → GET /nurses/me     → cache profile
  │
  ▼
AuthContext: { isAuthenticated: true, role, user, token }
  │
  ▼
Router redirects:
  patient   → /dashboard
  doctor    → /doctor/cases
  assistant → /assistant/referral
```

### State Management Strategy

| State Type | Solution |
|---|---|
| Server data (predictions list/detail) | TanStack Query — 30s stale for list, 5m for detail |
| Auth state | React Context (`AuthProvider`) |
| UI preferences (theme, language) | `localStorage` + custom hooks |
| Screening wizard form | `useState` inside `useScreening` hook |
| Settings toggles | `localStorage` (no backend endpoint exists) |

---

## Folder Structure

```
sinomed-ai/
├── public/
├── src/
│   ├── app/
│   │   ├── App.jsx                      # Root — provider composition
│   │   ├── router.jsx                   # All routes + role-gated layouts
│   │   └── providers/
│   │       ├── AuthProvider.jsx         # JWT auth context
│   │       ├── QueryProvider.jsx        # TanStack Query client
│   │       └── ThemeProvider.jsx        # Light/dark theme
│   │
│   ├── modules/
│   │   ├── analysis/                    # AI result viewer
│   │   │   ├── components/
│   │   │   │   ├── FindingsList.jsx
│   │   │   │   └── RiskGauge.jsx
│   │   │   └── pages/
│   │   │       └── AnalysisResultPage.jsx
│   │   │
│   │   ├── assistant/                   # Medical assistant workspace
│   │   │   ├── components/
│   │   │   │   ├── AssistantBottomNav.jsx
│   │   │   │   └── AssistantLayout.jsx
│   │   │   └── pages/
│   │   │       ├── EventsPage.jsx
│   │   │       ├── LeaderboardPage.jsx
│   │   │       ├── ReferralPage.jsx
│   │   │       ├── AssistantProfilePage.jsx
│   │   │       └── AssistantSettingsPage.jsx
│   │   │
│   │   ├── auth/                        # Login & registration
│   │   │   ├── components/LoginForm.jsx
│   │   │   ├── hooks/useLogin.js
│   │   │   └── pages/LoginPage.jsx
│   │   │
│   │   ├── chat/                        # Patient-facing chat pages
│   │   │   └── pages/
│   │   │       ├── PatientChatPage.jsx          # AI diagnostic chat
│   │   │       └── PatientDoctorChatPage.jsx    # Doctor-patient channel
│   │   │
│   │   ├── clinics/                     # Nearby clinics (geolocation)
│   │   │   └── pages/NearbyClinicsPage.jsx
│   │   │
│   │   ├── dashboard/                   # Patient home screen
│   │   │   ├── components/
│   │   │   │   ├── RecentAnalyses.jsx
│   │   │   │   └── ScreeningCTA.jsx
│   │   │   └── pages/DashboardPage.jsx
│   │   │
│   │   ├── doctor/                      # Doctor workspace
│   │   │   ├── components/
│   │   │   │   ├── DoctorBottomNav.jsx
│   │   │   │   ├── DoctorLayout.jsx
│   │   │   │   └── DoctorPlaceholder.jsx
│   │   │   └── pages/
│   │   │       ├── ActiveCasesPage.jsx      # AI case queue
│   │   │       ├── DoctorChatPage.jsx       # Doctor ↔ patient chat
│   │   │       ├── DoctorProfilePage.jsx
│   │   │       ├── DoctorSettingsPage.jsx
│   │   │       └── PatientHistoryPage.jsx
│   │   │
│   │   ├── health-profile/              # Patient health data
│   │   │   ├── hooks/useHealthProfile.js
│   │   │   └── pages/HealthProfilePage.jsx
│   │   │
│   │   ├── landing/                     # Public marketing page
│   │   │   ├── components/
│   │   │   │   ├── CtaSection.jsx
│   │   │   │   ├── FeaturesSection.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── HowItWorksSection.jsx
│   │   │   │   ├── LandingFooter.jsx
│   │   │   │   └── WhyMattersSection.jsx
│   │   │   └── pages/LandingPage.jsx
│   │   │
│   │   ├── profile/                     # Patient profile edit
│   │   │   └── pages/ProfilePage.jsx
│   │   │
│   │   ├── screening/                   # 5-step AI screening wizard
│   │   │   ├── components/steps/
│   │   │   │   ├── Step1Welcome.jsx
│   │   │   │   ├── Step2PhotoUpload.jsx
│   │   │   │   ├── Step3Questionnaire.jsx
│   │   │   │   ├── Step4Review.jsx
│   │   │   │   └── Step5Processing.jsx  # Calls POST /predict
│   │   │   ├── hooks/useScreening.js    # Wizard state machine
│   │   │   └── pages/ScreeningPage.jsx
│   │   │
│   │   ├── settings/                    # Patient settings
│   │   │   └── pages/SettingsPage.jsx
│   │   │
│   │   └── support/                     # Support & contact page
│   │       └── pages/SupportPage.jsx
│   │
│   ├── shared/
│   │   ├── api/                         # All HTTP calls in one place
│   │   │   ├── client.js                # Axios + Bearer interceptor + 401 guard
│   │   │   ├── auth.api.js
│   │   │   ├── chat.api.js
│   │   │   ├── clinic.api.js
│   │   │   ├── doctor.api.js
│   │   │   ├── nurse.api.js
│   │   │   ├── patient.api.js
│   │   │   └── prediction.api.js
│   │   │
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   └── AuthGuard.jsx        # Route guards per role
│   │   │   ├── layout/
│   │   │   │   ├── WebAppShell.jsx
│   │   │   │   ├── MobileBottomNav.jsx
│   │   │   │   ├── MobileTopbar.jsx
│   │   │   │   └── DesktopTopbar.jsx
│   │   │   └── ui/                      # Design system primitives
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── EmptyState.jsx
│   │   │       ├── Logo.jsx
│   │   │       ├── StatCard.jsx
│   │   │       └── ...
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.js                # All route path strings
│   │   │   ├── storage.js               # localStorage key names
│   │   │   ├── theme.js
│   │   │   └── languages.js
│   │   │
│   │   └── hooks/
│   │       ├── usePredictions.js        # TanStack Query wrappers
│   │       ├── useTheme.js
│   │       ├── useLanguage.js
│   │       ├── useCountUp.js
│   │       └── useTashkentDate.js
│   │
│   └── i18n/
│       ├── config.js                    # i18next setup
│       └── locales/
│           ├── uz/translation.json      # Uzbek (default, ~620 keys)
│           └── ru/translation.json      # Russian (~620 keys)
│
├── docs/
│   ├── architecture.md
│   ├── workflow.md
│   ├── api.md
│   ├── security.md
│   ├── roles.md
│   └── deployment.md
│
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9+ or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/sinomed-ai.git
cd sinomed-ai

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### Environment Variables

```env
# .env
VITE_API_URL=https://aidiagnostikapi.sangilov.uz
```

If `VITE_API_URL` is not set, the Axios client falls back to the production URL at runtime.

### Development

```bash
npm run dev
# → http://localhost:5173
```

### Production Build

```bash
npm run build
# → dist/   (static files ready for any CDN or web server)
```

### Preview Production Build Locally

```bash
npm run preview
```

### Code Quality

```bash
npm run lint      # ESLint
npm run format    # Prettier
```

---

## API Reference

Full endpoint reference: [`docs/api.md`](docs/api.md)

### Authentication

| Method | Endpoint | Body |
|---|---|---|
| `POST` | `/auth/patient/register` | `{ full_name, phone, password, email?, referral_code? }` |
| `POST` | `/auth/patient/login` | `{ phone, password }` |
| `POST` | `/auth/doctor/login` | `{ username, password }` |
| `POST` | `/auth/nurse/login` | `{ username, password }` |

### Patient

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/patients/me` | Authenticated patient profile |
| `PATCH` | `/patients/me` | Update patient profile |
| `GET` | `/patients/me/all` | Full patient data export |

### AI Predictions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Submit retinal image → AI result |
| `GET` | `/predictions/me` | Patient prediction history |
| `GET` | `/predictions/me/{id}` | Single prediction detail |

### Doctor

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/doctors/me` | Doctor profile |
| `GET` | `/doctors/patients` | Assigned patient list |
| `GET` | `/doctors/patients/{id}` | Single patient detail |
| `GET` | `/anketa/doctor` | AI case (anketa) queue |
| `GET` | `/anketa/doctor/{id}` | Single case detail |

### Chat

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Send message to AI bot (query: `message`) |
| `GET` | `/chat/history` | AI chat history (current patient) |
| `POST` | `/chat/finalize` | Finalize AI chat session |
| `GET` | `/dp-chat/history` | Doctor-patient history (query: `doctor_id`) |
| `POST` | `/dp-chat/upload` | Doctor uploads image (query: `token`) |

### Clinics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/clinics` | All partner clinics |
| `GET` | `/clinics/nearest` | Nearest clinics (query: `lat`, `lon`) |

### Assistant

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/nurses/me` | Assistant profile |
| `GET` | `/nurses/referrals` | Patients referred by this assistant |

---

## Security

Full security documentation: [`docs/security.md`](docs/security.md)

### JWT Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header. The token is:
- Issued by the backend on successful login
- Stored in `localStorage` under `sinomed-token`
- Injected automatically on every request by the Axios request interceptor
- Cleared immediately on any `401` response *(except auth endpoints)*

### Role-Based Route Protection

Three guard components enforce role isolation at the router level:

```
PatientGuardLayout   → /dashboard, /chat, /clinics, /analysis/*, ...
DoctorGuardLayout    → /doctor/cases, /doctor/history, /doctor/chat, ...
AssistantGuardLayout → /assistant/referral, /assistant/leaderboard, ...
```

Attempting to access a route for the wrong role results in an immediate redirect — no unauthorized data is ever fetched.

### API Security Practices

- All HTTP calls go through a single `apiClient` — no ad-hoc fetch or axios calls elsewhere in the codebase
- Auth endpoints (`/auth/*`) are excluded from the auto-logout interceptor to avoid logging users out on wrong-credential attempts
- Patient bootstrap uses `_skipLogout` flag to distinguish an expired token from a wrong credential at startup
- No secrets, API keys, or credentials are committed to source control
- All development-only logging is guarded by `import.meta.env.DEV`

---

## Screenshots

> Visual documentation will be added as the product reaches public beta. Placeholder paths:

| Screen | Path |
|---|---|
| Public landing page | `docs/screenshots/01-landing.png` |
| Patient dashboard | `docs/screenshots/02-dashboard.png` |
| Screening wizard | `docs/screenshots/03-screening.png` |
| AI result page | `docs/screenshots/04-result.png` |
| Doctor cases queue | `docs/screenshots/05-doctor-cases.png` |
| Doctor-patient chat | `docs/screenshots/06-doctor-chat.png` |
| Medical assistant referral | `docs/screenshots/07-referral.png` |

---

## Roadmap

### Shipped (v0.1)

- [x] Patient registration & phone login
- [x] 5-step AI retinal screening wizard
- [x] AI risk result with probability bars and per-grade recommendations
- [x] AI diagnostic chat
- [x] Doctor-patient chat with image upload
- [x] Doctor active cases queue (AI anketas)
- [x] Doctor patient history with detail sheets
- [x] Medical assistant referral dashboard and leaderboard
- [x] Nearby clinics with device geolocation
- [x] Health profile management
- [x] Full Uzbek + Russian localization (~620 keys per locale)
- [x] Light / dark theme
- [x] Role-based route guards with auto-redirect

### Planned

- [ ] Push notifications for new AI results and case updates
- [ ] Expanded AI models — glaucoma, age-related macular degeneration
- [ ] Doctor video consultation channel
- [ ] Appointment booking system
- [ ] PDF report export for patients
- [ ] Offline mode for low-connectivity environments
- [ ] Cross-assistant leaderboard with global rankings
- [ ] Admin dashboard (separate web application)
- [ ] Kazakh (`kz`) locale

---

## Contributing

We welcome contributions from the community.

### Workflow

```bash
# Fork the repository, then:
git clone https://github.com/your-username/sinomed-ai.git
cd sinomed-ai

# Create a feature branch
git checkout -b feat/your-feature-name

# Install dependencies
npm install

# Start the dev server
npm run dev

# Make your changes
npm run lint     # must pass
npm run build    # must pass with zero errors
```

### Pull Request Requirements

1. **Build must pass** — `npm run build` must complete with zero errors and zero TypeScript/ESLint violations.
2. **No mock data** — never introduce hardcoded counts, fake names, or placeholder arrays. Empty states must reflect real API absence.
3. **i18n required** — every user-facing string uses `t()` with keys present in both `uz` and `ru` locale files.
4. **API contract** — only call endpoints documented in the Swagger spec. Do not invent endpoints.
5. **Roles scope** — this frontend serves `patient`, `doctor`, and `assistant` only. Do not add admin UI of any kind.
6. **One concern per PR** — do not bundle unrelated changes.

### Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feat/<name>` | `feat/appointment-booking` |
| Bug fix | `fix/<name>` | `fix/chat-error-state` |
| Localization | `i18n/<name>` | `i18n/add-kz-locale` |
| Documentation | `docs/<name>` | `docs/api-reference` |

---

## Documentation

| Document | Contents |
|---|---|
| [`docs/architecture.md`](docs/architecture.md) | Provider tree, module structure, state management |
| [`docs/workflow.md`](docs/workflow.md) | End-to-end workflows for all three user roles |
| [`docs/api.md`](docs/api.md) | Complete endpoint reference with request/response shapes |
| [`docs/security.md`](docs/security.md) | Auth, authorization, and security practices |
| [`docs/roles.md`](docs/roles.md) | Role system, permissions, and guard implementation |
| [`docs/deployment.md`](docs/deployment.md) | Build, environment, and deployment guide |

---

## License

```
MIT License

Copyright (c) 2025 SinoMed AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

Built for healthcare access in Central Asia.

**[API Docs](https://aidiagnostikapi.sangilov.uz/docs) · [Report a Bug](../../issues) · [Request a Feature](../../issues)**

</div>
