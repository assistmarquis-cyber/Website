import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = (p) => JSON.parse(fs.readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const fw = read('brain/frameworks.json'), loops = read('brain/feed/loops.json'), lib = read('brain/feed/library.json');

test('every want has a seven-word line of exactly seven words', () => {
  for (const w of fw.wants) assert.equal(w.seven.trim().split(/\s+/).length, 7, w.seven);
});
test('every research loop maps to a mindset part, an offer, and verified evidence', () => {
  const parts = new Set(loops.mindsetArchitecture.map((p) => p.id)), ids = new Set(lib.entries.map((e) => e.id)), offers = new Set(fw.offers.map((o) => o.id));
  for (const l of loops.loops) {
    assert.ok(parts.has(fw.loopPart[l.id]), `${l.id} needs a loopPart`);
    assert.ok(offers.has(fw.offerByTool[l.strategy.tool]), `${l.id} tool ${l.strategy.tool} needs an offer`);
    assert.ok(l.evidence.length && l.evidence.every((id) => ids.has(id)), `${l.id} evidence`);
  }
});
test('every library entry has a verified link, a finding and an honest caveat', () => {
  for (const e of lib.entries) for (const k of ['verifiedUrl', 'verifiedOn', 'finding', 'caveat']) assert.ok(e[k], `${e.id} missing ${k}`);
});
test('copy has no em-dashes', () => {
  assert.equal(/—/.test(JSON.stringify(fw)), false);
});
test('every loop has a content hook with a bracketed story slot, and every offer states first win and effort', () => {
  for (const l of loops.loops) { const h = fw.hooks[l.id]; assert.ok(h && h.hook && /^\[/.test(h.story), `${l.id} hook`); }
  for (const o of fw.offers) assert.ok(o.firstWin && o.effort, `${o.id} firstWin/effort`);
});
test('the daily content pack builds for any date and carries the draft warning', async () => {
  const { pack } = await import('../scripts/content-pack.mjs');
  for (const d of ['2026-10-29', '2026-10-30', '2027-01-01']) { const t = pack(d); assert.match(t, /needs Marquis's OK/); assert.equal(/—/.test(t), false); }
});
