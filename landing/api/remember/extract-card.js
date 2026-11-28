import { getGeminiClient, getModelName, callWithRetry } from '../_lib/gemini.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { getClientIp, parseJsonBody, sendJson } from '../_lib/handlerUtils.js';

const REMEMBER_CARD_SYSTEM_PROMPT = `You are a Context Summarization Engine.
Analyze a multi-turn chat transcript and extract a structured 'Context Card' capturing critical decisions, explicit constraints, preferences, goals, and open questions.

You MUST respond strictly with valid, parseable JSON conforming to this schema:
{
  "context_card": {
    "goal": "Core objective established in conversation",
    "decisions_made": [
      "Explicit technical, architectural, or design choices confirmed by the user"
    ],
    "constraints": [
      "Hard boundaries (budget, performance limits, deadlines, technical restrictions)"
    ],
    "preferences": [
      "Stylistic, aesthetic, or format preferences"
    ],
    "open_questions": [
      "Unresolved items or next steps mentioned in chat"
    ]
  }
}

Rules:
1. Extract concise, actionable bullet points.
2. Return pure JSON without markdown backticks or commentary outside the JSON object.`;

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
  const transcript = typeof body.transcript === 'string' ? body.transcript.trim() : '';

  if (!transcript) {
    return sendJson(res, 400, { error: 'Missing required field: transcript' });
  }

  const temperature = typeof body.temperature === 'number' ? Math.max(0, Math.min(1, body.temperature)) : 0.3;

  try {
    const ai = getGeminiClient();
    const model = getModelName();

    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents: transcript,
        config: {
          systemInstruction: REMEMBER_CARD_SYSTEM_PROMPT,
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
      context_card: parsed.context_card || parsed,
    });
  } catch (err) {
    console.error('Remember extract-card error:', err);
    return sendJson(res, 500, {
      error: 'Failed to extract context card.',
      details: err.message,
    });
  }
}

