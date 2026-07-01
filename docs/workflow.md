# User Workflows

> End-to-end workflow documentation for all three active user roles.

---

## Patient Workflow

### 1. Registration

New patients register at `/auth/login` using the "Register" tab:

```
Input:  full_name, phone, password, (optional) email, (optional) referral_code
Call:   POST /auth/patient/register
Result: access_token → stored in localStorage
        GET /patients/me → hydrates AuthContext
        Redirect → /dashboard
```

Referral codes link the patient to a medical assistant's recruitment stats. The code is validated server-side.

### 2. Login

Returning patients authenticate via phone + password:

```
Input:  phone, password
Call:   POST /auth/patient/login
Result: access_token → stored
        GET /patients/me → hydrates AuthContext
        Redirect → /dashboard
```

### 3. Dashboard

The patient dashboard (`/dashboard`) shows:

- **Greeting** with the patient's first name and the current Tashkent date
- **Screening CTA** — prominent call-to-action to start a new screening
- **Stats row:**
  - Total screenings (count of all predictions)
  - Average risk % (mean diagnosis / 4 × 100)
  - Last screening date (human-relative: "Today", "Yesterday", "N days ago")
- **Recent analyses** — last predictions as clickable cards, each linking to the full result

Data source: `GET /predictions/me?limit=50` via TanStack Query (30s stale).

### 4. AI Screening Wizard

The 5-step wizard lives at `/analysis/new`:

#### Step 1 — Welcome
Briefing screen explaining the process. No data collected.

#### Step 2 — Photo Upload
Patient uploads a retinal fundus photograph:
- File selected via `<input type="file" accept="image/*">`
- Preview rendered immediately via `URL.createObjectURL()`
- URL revoked on cleanup to prevent memory leaks

#### Step 3 — Questionnaire
Adaptive health form:

| Field | Type | Adaptive Logic |
|---|---|---|
| Age | Number input | Always shown |
| Gender | Radio | Always shown |
| Height + Weight | Number inputs | Always shown; BMI auto-calculated |
| Symptoms × 6 | Toggle chips | Always shown |
| Family history | Yes/No | Always shown |
| Family member | Select | Shown only if family_history = true |
| Last vision check | Select | Shown only if vision_blur symptom = true |
| Weight-loss attempts | Select | Shown only if BMI ≥ 25 |
| Hypertension | Yes/No | Always shown |
| Activity level | Select | Always shown |
| Diet type | Select | Always shown |

#### Step 4 — Review
Summary of the uploaded image and questionnaire answers. Patient confirms before submission.

#### Step 5 — Processing

```
predictionApi.submit(imageFile)   → POST /predict (FormData)
```

While the API call runs, an animated 6-stage progress list cycles through:
stage1 → stage2 → stage3 → stage4 → stage5 → stage6

When both the animation and the API response complete, the page navigates to `/analysis/:id`.

On API error: an error screen is shown with the backend's `detail` message (or a localized fallback). The user can return to the dashboard.

### 5. AI Result Page

`/analysis/:id` fetches `GET /predictions/me/:id` via TanStack Query and renders:

- **Retinal image** (from `/uploads/<filename>`) with lazy loading and error fallback
- **Risk gauge** — animated arc from 0–100%, color-coded by grade
- **Confidence** displayed as percentage
- **Grade name pill** (backend-provided `grade_name` and `grade_uz`)
- **Probability bars** — animated per-class bars with i18n grade labels
- **Findings list** — `description` and `grade_uz` from backend
- **Recommendations** — 3 localized items per grade (5 grade sets × 3 items each)
- **Disclaimer** — results are not a medical diagnosis

### 6. AI Diagnostic Chat

`/chat` — a conversational AI interface for follow-up questions after screening:

```
Send:    POST /chat?message=<text>
History: GET /chat/history → restored on page mount
Finalize: POST /chat/finalize (session close)
```

Messages support multi-role rendering (user vs. AI assistant bubbles) with flexible field extraction (`content`, `message`, `reply`, `text` — whichever the backend returns).

### 7. Doctor-Patient Chat

`/doctor-chat` — a separate channel connecting the patient to their assigned doctor:

```
History: GET /dp-chat/history?doctor_id=<id>
```

Read-only from the patient side. The patient sees all images uploaded by the doctor.

### 8. Nearby Clinics

`/clinics` — attempts `navigator.geolocation.getCurrentPosition`:
- **With location:** `GET /clinics/nearest?lat=&lon=` → sorted by proximity
- **Without location (denied/timeout):** `GET /clinics` → full list

Each clinic card shows name, address, distance (km, Haversine formula calculated client-side), phone number, and a Google Maps deep link.

### 9. Health Profile

`/health-profile` — persists medical data to the backend:

```
Load:   GET /patients/me/all
Save:   PATCH /patients/me  { full_name, blood_type, height, weight, allergies, chronic_diseases, ... }
```

---

## Doctor Workflow

### Login

Doctors authenticate via username + password at the same `/auth/login` page (role selector in the form):

```
Call:   POST /auth/doctor/login  { username, password }
Result: access_token → stored
        GET /doctors/me → profile cached
        Redirect → /doctor/cases
```

### Active Cases Queue

`/doctor/cases` — the doctor's primary workspace:

```
Load:   GET /anketa/doctor
Detail: GET /anketa/doctor/:id   (on card tap)
```

**Case card shows:**
- Patient name (from AI case metadata)
- Status badge (waiting / review / progress / completed) — handles both string and integer status values
- Risk grade badge (color-coded: green → yellow → orange → red → rose for grades 0–4)
- Confidence percentage
- Creation date
- Clinic name

**Case detail bottom sheet (on tap):**

| Section | Fields |
|---|---|
| AI Analysis | risk_grade, confidence, prediction, predicted_class, probabilities, diagnosis_description |
| Retinal Image | Rendered from `image_url` / `url` / `/uploads/<filename>` with error fallback |
| Patient | patient_name, full_name, patient_id |
| Questionnaire | age, gender, height, weight, bmi, symptoms, family_history, hypertension, activity_level, diet |
| Case Metadata | id, status, clinic_id, clinic, referral_source, doctor_id, created_at, updated_at |
| Additional | Any fields not matched by the above categories — rendered automatically |

Unknown future backend fields automatically appear in the "Additional" section without code changes.

### Patient History

`/doctor/history`:

```
Load:   GET /doctors/patients
Detail: GET /doctors/patients/:id   (on row tap)
```

**Patient row shows:** name, phone, email, date of birth, joined date.

**Patient detail bottom sheet:**

| Section | Fields |
|---|---|
| Personal | full_name, date_of_birth, age, gender |
| Contact | phone, email |
| Account | id, username, clinic_id, referral_code, created_at |
| Medical | blood_type, allergies, chronic_diseases, height, weight, bmi |
| Additional | Any unrecognized fields |

If `GET /doctors/patients/:id` fails, the list summary data is still shown with an amber "partial data" warning banner.

### Doctor-Patient Chat

`/doctor/chat`:

```
Patient list: GET /doctors/patients
Chat history: GET /dp-chat/history/:patientId  (on patient tap)
Upload image: POST /dp-chat/upload?token=<jwt>  (multipart/form-data)
```

The doctor selects a patient from the list to open the chat thread. Images can be sent via the upload button. History auto-scrolls to the latest message. Upload errors surface as inline banner messages.

---

## Medical Assistant Workflow

### Login

```
Call:   POST /auth/nurse/login  { username, password }
Result: access_token → stored
        GET /nurses/me → profile cached
        Redirect → /assistant/referral
```

### Referral Dashboard

`/assistant/referral`:

```
Load: GET /nurses/referrals  → array of referred patients
```

The assistant's unique `referral_code` (from `nurses/me` profile, stored in auth context) is displayed prominently. Copy and native Web Share API buttons are provided.

Stats grid shows:
- Invited count (length of referrals array)
- Registered count (same value — backend provides one list)
- Ranking (shown as `—` until a global leaderboard endpoint is available)

### Leaderboard

`/assistant/leaderboard`:

```
Load: GET /nurses/referrals  → own score only
```

The assistant's own score card is rendered with their name and referral count. A global leaderboard empty state is shown below it (cross-assistant leaderboard endpoint not yet available in the backend).

### Events

`/assistant/events`:

```
Load: GET /nurses/referrals  → used for referral count chip
```

The events section displays an empty state (no backend events endpoint currently exists). The referral count chip from `GET /nurses/referrals` is shown inside the empty state if the call succeeds.
