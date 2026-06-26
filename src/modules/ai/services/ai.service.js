import { aiApi } from '@/shared/api/ai.api'

export const aiService = {
  async analyze(payload) {
    const response = await aiApi.analyze({
      imageBase64: payload.imageBase64,
      questionnaire: payload.questionnaire,
    })

    return {
      riskScore: response.riskScore,
      riskLevel: response.riskLevel,
      confidence: response.confidence,
      findings: response.findings,
      recommendations: response.recommendations,
      heatmapUrl: response.heatmapUrl,
    }
  },
}
