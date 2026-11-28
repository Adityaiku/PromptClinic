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
  const draft = typeof body.draft === 'string' ? body.draft.trim() : '';
  const styleGuide = body.styleGuide;

  if (!draft) {
    return sendJson(res, 400, { error: 'Missing required field: draft' });
  }

  const temperature = typeof body.temperature === 'number' ? Math.max(0, Math.min(1, body.temperature)) : 0.7;

  try {
    const ai = getGeminiClient();
    const model = getModelName();

    let systemInstruction = 'You are a general writing assistant. Rewrite the following draft text.';
    if (styleGuide) {
      systemInstruction = `You are a stylistic editor. Rewrite the draft text so it strictly embodies this authorial style signature:
Tone: ${styleGuide.tone || 'Direct'}
Sentence Length: ${styleGuide.sentence_length || 'Brisk'}
Vocabulary: ${styleGuide.vocabulary || 'Concrete, no jargon'}
Rules to follow:
${(styleGuide.do_list || []).map(r => `- ${r}`).join('\n')}
Rules to avoid:
${(styleGuide.dont_list || []).map(r => `- ${r}`).join('\n')}

Output ONLY the rewritten text without commentary.`;
    }

    const response = await callWithRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents: draft,
        config: {
          systemInstruction,
          temperature,
        },
      });
    });

    const output = (response.text || '').trim();
    return sendJson(res, 200, { output });
  } catch (err) {
    console.error('Voice rewrite-draft error:', err);
    return sendJson(res, 500, {
      error: 'Failed to rewrite draft.',
      details: err.message,
    });
  }
}

