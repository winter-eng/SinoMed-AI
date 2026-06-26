import { requireAuth } from '@/lib/auth'
import { ok, error, unauthorized } from '@/lib/response'

// GET /api/analysis — list analyses for authenticated user
export async function GET(request) {
  const payload = requireAuth(request)
  if (!payload) return unauthorized()

  // TODO: fetch from DB
  const mockAnalyses = [
    { id: 'a1', userId: payload.userId, riskScore: 42, riskLevel: 1, createdAt: '2025-06-25T10:00:00Z', status: 'ready' },
    { id: 'a2', userId: payload.userId, riskScore: 67, riskLevel: 2, createdAt: '2025-06-20T10:00:00Z', status: 'ready' },
  ]

  return ok({ analyses: mockAnalyses })
}

// POST /api/analysis — create new analysis
export async function POST(request) {
  const payload = requireAuth(request)
  if (!payload) return unauthorized()

  try {
    const body = await request.json()
    const { questionnaire, imageBase64 } = body

    if (!questionnaire) {
      return error('Questionnaire data is required')
    }

    // TODO: call AI service, save to DB
    // const result = await aiService.analyze({ questionnaire, imageBase64 })

    const mockResult = {
      id: `analysis-${Date.now()}`,
      userId: payload.userId,
      riskScore: 42,
      riskLevel: 2,
      confidence: 87,
      findings: ['Microaneurysms detected', 'Elevated glucose indicators'],
      recommendations: ['Consult endocrinologist', 'Check HbA1c levels'],
      createdAt: new Date().toISOString(),
      status: 'ready',
    }

    return ok({ analysis: mockResult }, 201)
  } catch (err) {
    console.error('[POST /api/analysis]', err)
    return error('Internal server error', 500)
  }
}
