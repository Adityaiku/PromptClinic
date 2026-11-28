import { getGeminiClient, getModelName, callWithRetry } from '../_lib/gemini.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { getClientIp, parseJsonBody, sendJson } from '../_lib/handlerUtils.js';

const VOICE_EXTRACT_SYSTEM_PROMPT = `You are a Linguistic Stylist.
Analyze the provided writing samples and extract an actionable style guide detailing:
- sentence length (e.g. brisk, complex, mixed)
- tone (e.g. candid, formal, humorous, direct)
- vocabulary habits
- 3 explicit 'do' rules
- 3 explicit 'don't' rules

You MUST respond strictly with valid, parseable JSON conforming to this schema:
{
  "style_guide": {
    "sentence_length": "Brisk (8-15 words average)",
    "tone": "Direct, pragmatic, candid",
    "vocabulary": "Concrete verbs, zero corporate jargon",
    "do_list": ["Rule 1", "Rule 2", "Rule 3"],
    "dont_list": ["Rule 1", "Rule 2", "Rule 3"]
  }
}

Return pure JSON without markdown backticks or commentary outside the JSON object.`;

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
  const samples = typeof body.samples === 'string' ? body.samples.trim() : '';

  if (!samples) {
    return sendJson(res, 400, { error: 'Missing required field: samples' });
  }

  const temperature = typeof body.temperature === 'number' ? Math.max(0, Math.min(1, body.temperature)) : 0.3;

  try {
    const ai = getGeminiClient();
    const model = getModelName();

    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents: `Analyze these writing samples:\n\n${samples}`,
        config: {
          systemInstruction: VOICE_EXTRACT_SYSTEM_PROMPT,
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
      style_guide: parsed.style_guide || parsed,
    });
  } catch (err) {
    console.error('Voice extract-style error:', err);
    return sendJson(res, 500, {
      error: 'Failed to extract style guide.',
      details: err.message,
    });
  }
}

