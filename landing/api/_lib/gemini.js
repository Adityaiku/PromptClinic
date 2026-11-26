import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

// Automatically load .env from landing or project root
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export function getGeminiClient() {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server. Please add it to your environment variables or toggle Offline Demo Mode.');
  }
  return new GoogleGenAI({ apiKey });
}

export function getModelName() {
  return (process.env.GEMINI_MODEL || 'gemini-2.5-flash').trim();
}

export async function callWithRetry(fn, maxRetries = 2) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = err.status || err.statusCode;
      const msg = err.message || '';
      if ((status === 429 || status === 503 || msg.includes('429') || msg.includes('503') || msg.includes('RESOURCE_EXHAUSTED')) && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
