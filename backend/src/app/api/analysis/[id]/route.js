import { requireAuth } from '@/lib/auth'
import { ok, notFound, unauthorized } from '@/lib/response'

export async function GET(request, { params }) {
  const payload = requireAuth(request)
  if (!payload) return unauthorized()

  const { id } = params

  // TODO: fetch from DB
  const mockResult = {
    id,
    userId: payload.userId,
    riskScore: 42,
    riskLevel: 2,
    confidence: 87,
    findings: ['Microaneurysms detected (2)', 'Elevated glucose indicators', 'BMI: 27.4 — overweight'],
    recommendations: [
      'Consult an endocrinologist',
      'Check blood sugar (HbA1c)',
      'Increase physical activity: 150+ min/week',
      'Reduce simple carbohydrate intake',
    ],
    createdAt: new Date().toISOString(),
    status: 'ready',
  }

  if (!mockResult) return notFound('Analysis')

  return ok({ analysis: mockResult })
}
