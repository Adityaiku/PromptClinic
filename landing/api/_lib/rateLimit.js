const ipHits = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 30; // Max 30 requests per minute per IP

export function checkRateLimit(ip = '127.0.0.1') {
  const now = Date.now();
  const hits = ipHits.get(ip) || [];
  const validHits = hits.filter((t) => now - t < WINDOW_MS);
  if (validHits.length >= MAX_REQUESTS) {
    return false;
  }
  validHits.push(now);
  ipHits.set(ip, validHits);
  return true;
}
