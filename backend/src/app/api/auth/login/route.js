import { NextResponse } from 'next/server'
import { signToken } from '@/lib/auth'
import { ok, error } from '@/lib/response'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return error('Email and password are required')
    }

    // TODO: replace with real DB lookup + bcrypt.compare
    // Example mock user for development
    const mockUser = {
      id: '1',
      name: 'Ahmad Karimov',
      email: 'doctor@clinic.uz',
      role: 'doctor',
      clinicId: 'clinic-1',
    }

    if (email !== mockUser.email || password !== 'password') {
      return error('Invalid credentials', 401)
    }

    const token = signToken({ userId: mockUser.id, role: mockUser.role })

    return ok({ user: mockUser, token })
  } catch (err) {
    console.error('[/api/auth/login]', err)
    return error('Internal server error', 500)
  }
}
