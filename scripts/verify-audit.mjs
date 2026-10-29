// Checks signed Alan audit lines. Usage:
//   AUDIT_HMAC_KEY=... node scripts/verify-audit.mjs export.log
// Reads a log export (one JSON object per line, other lines ignored) and reports lines whose
// signature does not match, lines that are unsigned, and any text-like fields that should never appear.
import fs from 'node:fs';
import crypto from 'node:crypto';

const file = process.argv[2];
const key = process.env.AUDIT_HMAC_KEY;
if (!file || !key) { console.error('Usage: AUDIT_HMAC_KEY=... node scripts/verify-audit.mjs <log-file>'); process.exit(2); }

const canonical = (o) => JSON.stringify(Object.keys(o).sort().reduce((a, k) => { a[k] = o[k]; return a; }, {}));
const ALLOWED = new Set(['app', 'audit', 'ts', 'build', 'promptV', 'policyV', 'rid', 'sid', 'event', 'status', 'ms', 'redacted', 'model', 'crisis', 'kind', 'n', 'upstream', 'sig']);
let ok = 0, bad = 0, unsigned = 0, extra = 0, total = 0;
const seen = new Set();
for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
  const i = line.indexOf('{"app":"alan"');
  if (i < 0) continue;
  let e; try { e = JSON.parse(line.slice(i)); } catch { continue; }
  if (!e.audit) continue;
  total++;
  const { sig, ...rest } = e;
  if (seen.has(e.rid) && e.rid) console.log('duplicate request id', e.rid);
  seen.add(e.rid);
  if (Object.keys(e).some((k) => !ALLOWED.has(k))) { extra++; console.log('unexpected field(s) on', e.rid, Object.keys(e).filter((k) => !ALLOWED.has(k))); }
  if (sig === 'unsigned') { unsigned++; continue; }
  const want = crypto.createHmac('sha256', key).update(canonical(rest)).digest('hex');
  if (sig && sig.length === want.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want))) ok++; else { bad++; console.log('BAD SIGNATURE', e.rid, e.ts); }
}
console.log(JSON.stringify({ total, valid: ok, badSignature: bad, unsigned, unexpectedFields: extra }));
process.exit(bad || extra ? 1 : 0);
