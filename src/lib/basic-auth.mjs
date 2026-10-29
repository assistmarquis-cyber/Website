// Shared HTTP Basic check for the private areas (/portal, /ops). Any username works.
// Compares SHA-256 digests byte by byte without early exit, so timing does not leak
// how much of a guess was right, and a malformed header never throws.
const enc = new TextEncoder();

async function digest(s) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(String(s))));
}

export function parseBasic(header) {
  const m = /^Basic\s+([A-Za-z0-9+/=_-]{1,2048})$/i.exec(String(header || '').trim());
  if (!m) return null;
  try {
    const bin = atob(m[1].replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    const i = decoded.indexOf(':');
    return i < 0 ? null : { user: decoded.slice(0, i), password: decoded.slice(i + 1) };
  } catch {
    return null;
  }
}

export async function checkBasic(header, expected) {
  if (!expected || String(expected).length < 12) return false; // refuse weak or missing secrets
  const got = parseBasic(header);
  if (!got) return false;
  const [a, b] = await Promise.all([digest(got.password), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
