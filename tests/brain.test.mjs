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
