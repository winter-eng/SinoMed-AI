const STORAGE_KEY = 'sinomed-mock-predictions'

const GRADES = [
  {
    grade_name: 'No DR',
    grade_uz: "Diabetik retinopatiya yo'q",
    description: 'No signs of diabetic retinopathy were detected in the retinal image.',
  },
  {
    grade_name: 'Mild NPDR',
    grade_uz: 'Engil nonproliferativ diabetik retinopatiya',
    description: 'Mild non-proliferative diabetic retinopathy. Routine follow-up in 12 months recommended.',
  },
  {
    grade_name: 'Moderate NPDR',
    grade_uz: "O'rtacha nonproliferativ diabetik retinopatiya",
    description: 'Moderate non-proliferative diabetic retinopathy. Ophthalmologist consultation recommended.',
  },
  {
    grade_name: 'Severe NPDR',
    grade_uz: "Og'ir nonproliferativ diabetik retinopatiya",
    description: 'Severe non-proliferative diabetic retinopathy. Urgent specialist evaluation required.',
  },
  {
    grade_name: 'Proliferative DR',
    grade_uz: 'Proliferativ diabetik retinopatiya',
    description: 'Proliferative diabetic retinopathy detected. Immediate medical attention is necessary.',
  },
]

// Weighted distribution: grade 0 most common
const WEIGHTS = [0.45, 0.25, 0.15, 0.10, 0.05]

function weightedRandom(weights) {
  const r = Math.random()
  let cumulative = 0
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i]
    if (r < cumulative) return i
  }
  return weights.length - 1
}

export function generateMockPrediction() {
  const diagnosis = weightedRandom(WEIGHTS)
  const grade = GRADES[diagnosis]
  const confidence = 0.72 + Math.random() * 0.25

  const probabilities = {}
  for (let i = 0; i < 5; i++) {
    probabilities[String(i)] = i === diagnosis ? confidence : (1 - confidence) / 4
  }

  return {
    id: `mock-${Date.now()}`,
    filename: 'retinal_scan.jpg',
    diagnosis,
    grade_name: grade.grade_name,
    grade_uz: grade.grade_uz,
    description: grade.description,
    confidence,
    probabilities,
    created_at: new Date().toISOString(),
  }
}

export function saveMockPrediction(prediction) {
  try {
    const list = getMockPredictions()
    list.unshift(prediction)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)))
  } catch {}
}

export function getMockPredictions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getMockPredictionById(id) {
  try {
    return getMockPredictions().find((p) => p.id === id) ?? null
  } catch {
    return null
  }
}

export function isMockId(id) {
  return typeof id === 'string' && id.startsWith('mock-')
}
