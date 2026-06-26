import { useState, useCallback } from 'react'

const STORAGE_KEY = 'sinomed-health-profile'

const DEFAULT = {
  fullName: '',
  age: '',
  gender: null,
  height: '',
  weight: '',
  bloodType: null,
  allergies: '',
  chronicDiseases: '',
}

function calcBmi(height, weight) {
  const h = parseFloat(height)
  const w = parseFloat(weight)
  if (!h || !w || h < 50 || h > 280 || w < 10 || w > 500) return null
  return (w / (h / 100) ** 2).toFixed(1)
}

function getBmiCategory(bmi) {
  if (!bmi) return null
  const n = parseFloat(bmi)
  if (n < 18.5) return 'underweight'
  if (n < 25) return 'normal'
  if (n < 30) return 'overweight'
  return 'obese'
}

export function useHealthProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT }
    } catch {
      return { ...DEFAULT }
    }
  })

  const updateField = useCallback((key, value) => {
    setProfile((prev) => {
      const next = { ...prev, [key]: value }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }, [])

  const bmi = calcBmi(profile.height, profile.weight)
  const bmiCategory = getBmiCategory(bmi)

  return { profile, updateField, bmi, bmiCategory }
}
