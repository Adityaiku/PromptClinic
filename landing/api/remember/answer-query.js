import { getGeminiClient, getModelName, callWithRetry } from '../_lib/gemini.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { getClientIp, parseJsonBody, sendJson } from '../_lib/handlerUtils.js';

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
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  const contextCard = body.contextCard;

  if (!query) {
    return sendJson(res, 400, { error: 'Missing required field: query' });
  }

  const temperature = typeof body.temperature === 'number' ? Math.max(0, Math.min(1, body.temperature)) : 0.7;

  try {
    const ai = getGeminiClient();
    const model = getModelName();

    let systemInstruction = 'You are a helpful assistant. Answer the user question based on general knowledge.';
    let contents = query;

    if (contextCard) {
      systemInstruction = `You are a project assistant strictly grounded in the following structured Context Card:
${JSON.stringify(contextCard, null, 2)}

Answer the user question accurately referencing only the choices, boundaries, and decisions in the Context Card.`;
    }

    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });
    });

    const output = (response.text || '').trim();
    return sendJson(res, 200, { output });
  } catch (err) {
    console.error('Remember answer query error:', err);
    return sendJson(res, 500, {
      error: 'Failed to generate query answer.',
      details: err.message,
    });
  }
}
