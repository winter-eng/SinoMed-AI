/**
 * AI Service — swap-ready provider abstraction.
 * Change AI_PROVIDER env var to switch between OpenAI / Anthropic / Google.
 */

const PROVIDER = process.env.AI_PROVIDER || 'openai'
const MODEL = process.env.AI_MODEL || 'gpt-4o'

export async function analyzeRisk({ questionnaire, imageBase64, prompt }) {
  switch (PROVIDER) {
    case 'openai':
      return analyzeWithOpenAI({ questionnaire, imageBase64, prompt })
    case 'anthropic':
      return analyzeWithAnthropic({ questionnaire, imageBase64, prompt })
    default:
      throw new Error(`Unknown AI provider: ${PROVIDER}`)
  }
}

async function analyzeWithOpenAI({ questionnaire, imageBase64, prompt }) {
  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const messages = [
    { role: 'user', content: prompt },
  ]

  if (imageBase64) {
    messages[0].content = [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
    ]
  }

  const response = await client.chat.completions.create({
    model: MODEL,
    messages,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0].message.content)
}

async function analyzeWithAnthropic({ questionnaire, imageBase64, prompt }) {
  const Anthropic = await import('@anthropic-ai/sdk')
  const client = new Anthropic.default({ apiKey: process.env.ANTHROPIC_API_KEY })

  const content = imageBase64
    ? [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
        { type: 'text', text: prompt },
      ]
    : prompt

  const response = await client.messages.create({
    model: process.env.AI_MODEL || 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content }],
  })

  return JSON.parse(response.content[0].text)
}
