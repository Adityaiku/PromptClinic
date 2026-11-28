import { getGeminiClient, getModelName, callWithRetry } from '../_lib/gemini.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { getClientIp, parseJsonBody, sendJson } from '../_lib/handlerUtils.js';

const VERIFY_CLAIMS_SYSTEM_PROMPT = `You are a Fact-Checking Specialist.
Given a question and its proposed answer, decompose the answer into distinct factual claims.
For each claim, assess its accuracy risk, assign a confidence level ("high", "medium", or "low"), and provide a concise risk analysis.
Then produce an improved, safety-hedged answer that corrects or nuances any dubious or hallucinated claims.

You MUST respond strictly with valid, parseable JSON conforming to this schema:
{
  "claims": [
    {
      "claim": "Specific factual assertion made in the answer.",
      "confidence": "high | medium | low",
      "risk_analysis": "One-sentence fact-checking assessment."
    }
  ],
  "hedged_answer": "A well-calibrated, accurate answer that corrects falsehoods and explicitly hedges uncertainties."
}

Rules:
1. Identify 2 to 6 distinct factual assertions.
2. The confidence value MUST be strictly: "high", "medium", or "low".
3. Return pure JSON without markdown backticks or commentary outside the JSON object.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method not allowed. Use POST.' });
  }

  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);
  if (!rateLimit.allowed) {
    return sendJson(res, 429, { error: 'Too many requests. Please wait a minute before retrying.' });
  }

  const body = await parseJsonBody(req);
  const question = typeof body.question === 'string' ? body.question.trim() : '';
  const answer = typeof body.answer === 'string' ? body.answer.trim() : '';

  if (!question || !answer) {
    return sendJson(res, 400, { error: 'Missing required fields: question, answer' });
  }

  const temperature = typeof body.temperature === 'number' ? Math.max(0, Math.min(1, body.temperature)) : 0.2;

  try {
    const ai = getGeminiClient();
    const model = getModelName();

    const promptText = `Question: ${question}\n\nProposed Answer to Verify:\n${answer}`;

    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents: promptText,
        config: {
          systemInstruction: VERIFY_CLAIMS_SYSTEM_PROMPT,
          temperature,
          responseMimeType: 'application/json',
        },
      });
    });

    let rawText = (response.text || '').trim();
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(rawText);
    return sendJson(res, 200, {
      claims: Array.isArray(parsed.claims) ? parsed.claims : [],
      hedged_answer: parsed.hedged_answer || answer,
    });
  } catch (err) {
    console.error('Verify check-claims error:', err);
    return sendJson(res, 500, {
      error: 'Failed to verify claims.',
      details: err.message,
    });
  }
}

