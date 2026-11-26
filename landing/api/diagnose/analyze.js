import { getGeminiClient, getModelName, callWithRetry } from '../_lib/gemini.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { getClientIp, parseJsonBody, sendJson } from '../_lib/handlerUtils.js';
import { DIAGNOSE_SYSTEM_PROMPT, DIAGNOSE_USER_PROMPT_TEMPLATE } from '../../src/data/prompts.js';

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
    const userPrompt = DIAGNOSE_USER_PROMPT_TEMPLATE.replace('{prompt}', prompt);

    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction: DIAGNOSE_SYSTEM_PROMPT,
          temperature,
          responseMimeType: 'application/json',
        },
      })
    );

    let rawText = response.text || '{}';
    rawText = rawText.trim();
    if (rawText.startsWith('```json')) rawText = rawText.slice(7);
    else if (rawText.startsWith('```')) rawText = rawText.slice(3);
    if (rawText.endsWith('```')) rawText = rawText.slice(0, -3);

    const parsed = JSON.parse(rawText.trim());
    return sendJson(res, 200, {
      issues: parsed.issues || [],
      prompt_strength: parsed.prompt_strength || { before: 3, after: 9 },
      rewritten_prompt: parsed.rewritten_prompt || prompt,
    });
  } catch (err) {
    console.error('API Error /diagnose/analyze:', err.message);
    const isApiKeyError = err.message?.includes('GEMINI_API_KEY') || err.message?.includes('API key');
    return sendJson(res, 500, {
      error: isApiKeyError
        ? 'Gemini API Key is not set on the server. Toggle Offline Demo Mode to test with bundled data.'
        : 'Diagnosis failed. Please try again or switch on Offline Demo Mode.',
    });
  }
}
