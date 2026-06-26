import { requireAuth } from '@/lib/auth'
import { ok, unauthorized } from '@/lib/response'

export async function GET(request) {
  const payload = requireAuth(request)
  if (!payload) return unauthorized()

  // TODO: fetch user from DB using payload.userId
  const mockUser = {
    id: payload.userId,
    name: 'Ahmad Karimov',
    email: 'doctor@clinic.uz',
    role: payload.role,
    clinicId: 'clinic-1',
  }

  return ok({ user: mockUser })
}
