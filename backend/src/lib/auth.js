import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

export function getTokenFromRequest(request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  return auth.slice(7)
}

export function requireAuth(request) {
  const token = getTokenFromRequest(request)
  if (!token) return null
  try {
    return verifyToken(token)
  } catch {
    return null
  }
}
