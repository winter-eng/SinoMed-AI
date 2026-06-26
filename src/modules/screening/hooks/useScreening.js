import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

const TOTAL_STEPS = 5

export const INITIAL_FORM = {
  imageFile: null,
  imagePreviewUrl: null,
  age: '',
  gender: null,
  height: '',
  weight: '',
  symptoms: {
    thirst: false,
    urination: false,
    fatigue: false,
    vision: false,
    healing: false,
    tingling: false,
  },
  familyHistory: null,
  hypertension: null,
  activityLevel: null,
  dietType: null,
  familyMember: null,
  lastVisionCheck: null,
  weightAttempts: null,
}

export function useScreening() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(INITIAL_FORM)

  const updateForm = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateSymptom = useCallback((symptom, value) => {
    setForm((prev) => ({
      ...prev,
      symptoms: { ...prev.symptoms, [symptom]: value },
    }))
  }, [])

  const goNext = useCallback(() => {
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }, [step])

  const goBack = useCallback(() => {
    if (step > 1) setStep((s) => s - 1)
    else navigate(ROUTES.DASHBOARD)
  }, [step, navigate])

  const bmi =
    form.height && form.weight
      ? +(parseFloat(form.weight) / Math.pow(parseFloat(form.height) / 100, 2)).toFixed(1)
      : null

  const getBmiCategory = () => {
    if (!bmi) return null
    if (bmi < 18.5) return 'underweight'
    if (bmi < 25) return 'normal'
    if (bmi < 30) return 'overweight'
    return 'obese'
  }

  const showFamilyMemberQuestion = form.familyHistory === true
  const showVisionQuestion = form.symptoms.vision
  const showWeightQuestion = bmi !== null && bmi >= 25

  return {
    step,
    totalSteps: TOTAL_STEPS,
    form,
    bmi,
    bmiCategory: getBmiCategory(),
    showFamilyMemberQuestion,
    showVisionQuestion,
    showWeightQuestion,
    updateForm,
    updateSymptom,
    goNext,
    goBack,
  }
}
