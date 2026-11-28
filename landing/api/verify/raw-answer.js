import { getGeminiClient, getModelName, callWithRetry } from '../_lib/gemini.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { getClientIp, parseJsonBody, sendJson } from '../_lib/handlerUtils.js';

const VERIFY_RAW_SYSTEM_PROMPT = `You are a helpful and knowledgeable assistant. Answer the user question directly and concisely.`;

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

  if (!question) {
    return sendJson(res, 400, { error: 'Missing required field: question' });
  }

  if (question.length > 1000) {
    return sendJson(res, 400, { error: 'Input exceeds maximum allowed length of 1,000 characters.' });
  }

  const temperature = typeof body.temperature === 'number' ? Math.max(0, Math.min(1, body.temperature)) : 0.7;

  try {
    const ai = getGeminiClient();
    const model = getModelName();

    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents: question,
        config: {
          systemInstruction: VERIFY_RAW_SYSTEM_PROMPT,
          temperature,
        },
      });
    });

    const output = (response.text || '').trim();
    return sendJson(res, 200, { output });
  } catch (err) {
    console.error('Verify raw-answer error:', err);
    return sendJson(res, 500, {
      error: 'Failed to generate initial answer.',
      details: err.message,
    });
  }
}

