import { requireAuth } from '@/lib/auth'
import { ok, unauthorized } from '@/lib/response'

export async function GET(request) {
  const payload = requireAuth(request)
  if (!payload) return unauthorized()

  // TODO: fetch patients from DB
  return ok({ patients: [] })
}

export async function POST(request) {
  const payload = requireAuth(request)
  if (!payload) return unauthorized()

  const body = await request.json()
  // TODO: create patient in DB
  return ok({ patient: { id: Date.now().toString(), ...body } }, 201)
}
