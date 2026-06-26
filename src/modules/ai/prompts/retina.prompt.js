export function buildRiskAssessmentPrompt(data) {
  return `You are a medical AI assistant specializing in diabetes risk assessment.

Analyze the following patient data and provide a structured risk assessment:

Patient Data:
- Age: ${data.age} years
- Gender: ${data.gender}
- BMI: ${data.bmi}
- Symptoms: ${data.symptoms.length > 0 ? data.symptoms.join(', ') : 'none reported'}
- Family history of diabetes: ${data.familyHistory ? 'yes' : 'no'}
- Hypertension: ${data.hypertension ? 'yes' : 'no'}
- Physical activity level: ${data.activityLevel}
- Diet quality: ${data.dietType}

Provide your response as a JSON object with:
{
  "riskScore": <0-100>,
  "riskLevel": <0-4>,
  "confidence": <0-100>,
  "findings": ["<finding1>", "<finding2>", ...],
  "recommendations": ["<rec1>", "<rec2>", ...]
}

Where riskLevel:
0 = No risk, 1 = Mild, 2 = Moderate, 3 = High, 4 = Critical

IMPORTANT: This is for informational purposes only, not a medical diagnosis.`
}
