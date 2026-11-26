import { getGeminiClient, getModelName, callWithRetry } from '../_lib/gemini.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { getClientIp, parseJsonBody, sendJson } from '../_lib/handlerUtils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: 'Method Not Allowed. Use POST.' });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return sendJson(res, 429, { error: 'Rate limit exceeded. Please wait a minute before retrying.' });
  }

  const body = await parseJsonBody(req);
  const prompt = (body.prompt || '').trim();
  const temperature = typeof body.temperature === 'number' ? body.temperature : 0.7;

  if (!prompt) {
    return sendJson(res, 400, { error: 'Prompt is required.' });
  }

  if (prompt.length > 1000) {
    return sendJson(res, 400, { error: 'Prompt exceeds maximum length of 1,000 characters.' });
  }

  try {
    const ai = getGeminiClient();
    const model = getModelName();

    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: 'You are a helpful assistant.',
          temperature,
        },
      })
    );

    return sendJson(res, 200, {
      output: response.text || '',
    });
  } catch (err) {
    console.error('API Error /diagnose/run-original:', err.message);
    return sendJson(res, 500, {
      error: 'Failed to generate output for original prompt. Switch on Offline Demo Mode to test.',
    });
  }
}
