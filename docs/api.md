# API Reference

> Complete endpoint reference for SinoMed AI frontend integrations.
>
> Base URL: `https://aidiagnostikapi.sangilov.uz`  
> Full interactive docs: `https://aidiagnostikapi.sangilov.uz/docs`

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

---

## Authentication

### Register Patient

```
POST /auth/patient/register
Content-Type: application/json
```

**Request body:**
```json
{
  "full_name": "Ahmad Karimov",
  "phone": "+998901234567",
  "password": "secret",
  "email": "ahmad@example.com",      // optional
  "referral_code": "NURSE123"        // optional
}
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

---

### Login — Patient

```
POST /auth/patient/login
Content-Type: application/json
```

**Request body:**
```json
{
  "phone": "+998901234567",
  "password": "secret"
}
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

---

### Login — Doctor

```
POST /auth/doctor/login
Content-Type: application/json
```

**Request body:**
```json
{
  "username": "dr_rashidov",
  "password": "secret"
}
```

**Response `200`:** same shape as patient login.

---

### Login — Medical Assistant

```
POST /auth/nurse/login
Content-Type: application/json
```

**Request body:**
```json
{
  "username": "nurse_fatima",
  "password": "secret"
}
```

**Response `200`:** same shape as patient login.

---

## Patient

### Get Patient Profile

```
GET /patients/me
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "id": 42,
  "full_name": "Ahmad Karimov",
  "phone": "+998901234567",
  "email": "ahmad@example.com",
  "date_of_birth": "1990-05-15",
  "blood_type": "A+",
  "height": 175,
  "weight": 72,
  "allergies": null,
  "chronic_diseases": null,
  "created_at": "2025-01-10T08:00:00Z"
}
```

---

### Update Patient Profile

```
PATCH /patients/me
Authorization: Bearer <token>
Content-Type: application/json
```

**Request body** (all fields optional):
```json
{
  "full_name": "Ahmad Karimov",
  "email": "newemail@example.com",
  "blood_type": "A+",
  "height": 175,
  "weight": 73,
  "allergies": "Penicillin",
  "chronic_diseases": "Type 2 Diabetes"
}
```

---

### Get Full Patient Data

```
GET /patients/me/all
Authorization: Bearer <token>
```

Returns the patient's complete dataset including health profile fields.

---

## AI Predictions

### Submit Retinal Image

```
POST /predict
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form data:**
```
file: <image file>   (JPEG or PNG retinal fundus photograph)
```

**Response `200`:**
```json
{
  "id": 17,
  "diagnosis": 2,
  "confidence": 0.8734,
  "probabilities": {
    "0": 0.0312,
    "1": 0.0701,
    "2": 0.8734,
    "3": 0.0198,
    "4": 0.0055
  },
  "filename": "retina_17.jpg",
  "grade_name": "Moderate NPDR",
  "grade_uz": "O'rtacha og'ir bo'lmagan proliferativ retinopatiya",
  "description": "...",
  "created_at": "2025-06-15T10:30:00Z"
}
```

`diagnosis` is the predicted class (0–4). `confidence` is the softmax probability for the winning class.

---

### List Patient Predictions

```
GET /predictions/me?limit=20
Authorization: Bearer <token>
```

**Query params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `limit` | integer | 20 | Max results to return |

**Response `200`:** array of prediction objects (same shape as above).

---

### Get Prediction Detail

```
GET /predictions/me/:id
Authorization: Bearer <token>
```

**Response `200`:** single prediction object.

---

## Doctor

### Get Doctor Profile

```
GET /doctors/me
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "id": 5,
  "full_name": "Dr. Rashidov Bobur",
  "username": "dr_rashidov",
  "specialization": "Ophthalmology",
  "clinic_id": 3,
  "phone": "+998901112233",
  "email": "dr@clinic.uz",
  "created_at": "2024-11-01T09:00:00Z"
}
```

---

### List Doctor's Patients

```
GET /doctors/patients
Authorization: Bearer <token>
```

**Response `200`:** array of patient summary objects:
```json
[
  {
    "id": 42,
    "full_name": "Ahmad Karimov",
    "phone": "+998901234567",
    "email": null,
    "date_of_birth": "1990-05-15",
    "created_at": "2025-01-10T08:00:00Z"
  }
]
```

---

### Get Patient Detail (Doctor View)

```
GET /doctors/patients/:id
Authorization: Bearer <token>
```

**Response `200`:** full patient object including medical fields (blood_type, allergies, chronic_diseases, height, weight, bmi, etc.).

---

### List Doctor's AI Cases (Anketas)

```
GET /anketa/doctor
Authorization: Bearer <token>
```

**Response `200`:** array of anketa objects:
```json
[
  {
    "id": 88,
    "patient_name": "Ahmad Karimov",
    "status": "waiting",
    "risk_grade": 2,
    "confidence": 0.87,
    "clinic": "Toshkent Klinikasi",
    "created_at": "2025-06-14T12:00:00Z",
    "image_url": "https://.../.../retina_88.jpg"
  }
]
```

`status` may be a string (`"waiting"`, `"review"`, `"progress"`, `"completed"`) or an integer (`0`–`3`). The frontend normalizes both.

---

### Get Anketa Detail

```
GET /anketa/doctor/:id
Authorization: Bearer <token>
```

**Response `200`:** full anketa object including AI analysis fields, questionnaire responses, and image reference.

---

## Chat

### Send Message to AI Bot

```
POST /chat?message=<text>
Authorization: Bearer <token>
```

**Query param:** `message` — the patient's text message.

**Response `200`:**
```json
{
  "reply": "Based on your results...",
  "role": "assistant"
}
```

---

### Get AI Chat History

```
GET /chat/history
Authorization: Bearer <token>
```

**Response `200`:** array of message objects with flexible field names (`content`, `message`, `reply`, `text` — the frontend handles all variants).

---

### Finalize AI Chat Session

```
POST /chat/finalize
Authorization: Bearer <token>
```

Signals the backend to close the current chat session.

---

### Get Doctor-Patient Chat History (Patient View)

```
GET /dp-chat/history?doctor_id=<id>
Authorization: Bearer <token>
```

**Query param:** `doctor_id` — the ID of the patient's assigned doctor.

**Response `200`:** array of chat message objects.

---

### Upload Image to Doctor-Patient Chat (Doctor View)

```
POST /dp-chat/upload?token=<jwt>
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Query param:** `token` — the doctor's JWT access token (required by this endpoint in addition to the header).  
**Form data:** `file` — the image file.

**Response `200`:** uploaded image metadata.

---

## Clinics

### List All Clinics

```
GET /clinics
Authorization: Bearer <token>
```

**Response `200`:**
```json
[
  {
    "id": 1,
    "name": "Toshkent Ko'z Klinikasi",
    "address": "Chilonzor tumani, 12-uy",
    "phone": "+998712345678",
    "latitude": 41.2995,
    "longitude": 69.2401
  }
]
```

---

### Get Nearest Clinics

```
GET /clinics/nearest?lat=41.2995&lon=69.2401
Authorization: Bearer <token>
```

**Query params:** `lat`, `lon` — patient's GPS coordinates.

**Response `200`:** same shape as `/clinics`, ordered by proximity.

Client-side distance calculation uses the Haversine formula to display distance in km.

---

## Medical Assistant (Nurse)

### Get Assistant Profile

```
GET /nurses/me
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "id": 8,
  "full_name": "Fatima Yusupova",
  "username": "nurse_fatima",
  "referral_code": "FATIMA42",
  "clinic_id": 2,
  "phone": "+998909876543",
  "created_at": "2024-09-01T07:00:00Z"
}
```

---

### Get Referred Patients

```
GET /nurses/referrals
Authorization: Bearer <token>
```

**Response `200`:** array of patient objects who registered using this assistant's referral code.

---

## Error Responses

All endpoints follow FastAPI's standard error format:

```json
{
  "detail": "Human-readable error message"
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request — invalid input |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — authenticated but insufficient permissions |
| `404` | Resource not found |
| `422` | Validation error — malformed request body |
| `500` | Internal server error |

The frontend extracts `err?.response?.data?.detail` for all user-facing error messages, falling back to a localized generic error string if the field is absent.
