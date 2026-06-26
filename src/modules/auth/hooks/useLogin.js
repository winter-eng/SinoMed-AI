import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/constants/routes'

function parseApiError(err) {
  const detail = err?.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.map((e) => e.msg).join(', ')
  return null
}

export function useLogin() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitLogin = async ({ email, password }) => {
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(parseApiError(err) ?? t('auth.loginError'))
    } finally {
      setLoading(false)
    }
  }

  const submitRegister = async ({ full_name, email, password }) => {
    setLoading(true)
    setError(null)
    try {
      await register({ full_name, email, password })
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      setError(parseApiError(err) ?? t('auth.registerError'))
    } finally {
      setLoading(false)
    }
  }

  return { submitLogin, submitRegister, loading, error }
}
