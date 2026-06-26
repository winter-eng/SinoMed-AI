import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/providers/AuthProvider'
import { ROUTES } from '@/shared/constants/routes'

export function useLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (form) => {
    setLoading(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 800))
      login(
        { id: '1', name: 'Ahmad Karimov', email: form.email, role: 'doctor', clinicId: 'clinic-1' },
        'mock-token',
      )
      navigate(ROUTES.DASHBOARD)
    } catch {
      setError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
