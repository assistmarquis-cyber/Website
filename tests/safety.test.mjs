import test from 'node:test';
import assert from 'node:assert/strict';
import { scrub, isCrisis } from '../src/lib/safety.mjs';
import { originOk, sign } from '../netlify/functions/alan.mjs';
import handler from '../netlify/functions/alan.mjs';

test('scrub removes identifying formats', () => {
  const r = scrub('Email me at jo.doe@gmail.com or call (215) 555-0134. SSN 123-45-6789, DOB 4/12/1988, lives at 120 Market Street, MRN: 889122. See https://x.com/a');
  assert.equal(r.removed >= 6, true);
  for (const bad of ['jo.doe', '555-0134', '123-45', '1988', 'Market Street', '889122', 'https://']) assert.equal(r.text.includes(bad), false, bad);
});
test('scrub leaves ordinary words alone', () => {
  const t = 'I keep saying yes to every call and it is wearing me down.';
  assert.deepEqual(scrub(t), { text: t, removed: 0 });
});
test('crisis language is caught, everyday stress is not', () => {
  for (const t of ['I want to die', 'thinking about suicide', "I'm going to hurt myself", 'I am not safe at home']) assert.equal(isCrisis(t), true, t);
  for (const t of ['I am dying to ship this', 'this deadline will kill me', 'work is hard']) assert.equal(isCrisis(t), false, t);
});
test('origin allowlist', () => {
  assert.equal(originOk('https://bigpicturearchitect.com'), true);
  assert.equal(originOk('https://deploy-preview-19--lovely-tarsier-9fa751.netlify.app'), true);
  assert.equal(originOk('https://evil.example'), false);
  assert.equal(originOk(null), false);
});
const call = (body, origin = 'https://bigpicturearchitect.com', method = 'POST') => handler(new Request('https://x/.netlify/functions/alan', { method, headers: { origin, 'content-type': 'application/json' }, body: method === 'POST' ? JSON.stringify(body) : undefined }));
test('handler rejects bad origin, bad method, oversized and empty bodies', async () => {
  assert.equal((await call({ answer: 'hi' }, 'https://evil.example')).status, 403);
  assert.equal((await call(null, undefined, 'GET')).status, 405);
  assert.equal((await call({ answer: 'x'.repeat(20000) })).status, 413);
  assert.equal((await call({ answer: '  ' })).status, 400);
});
test('crisis answers return help without needing the model or a key', async () => {
  delete process.env.ANTHROPIC_API_KEY;
  const r = await call({ answer: 'I want to die', stop: 'x', question: 'q' });
  const j = await r.json();
  assert.equal(r.status, 200); assert.equal(j.crisis, true); assert.match(j.reply, /988/);
});
test('without a key an ordinary answer gets a quiet 503', async () => {
  delete process.env.ANTHROPIC_API_KEY;
  assert.equal((await call({ answer: 'work is hard', stop: 's', question: 'q' })).status, 503);
});
test('the model is sent scrubbed text and the logs carry no answer text', async () => {
  process.env.ANTHROPIC_API_KEY = 'test';
  const logs = []; const origLog = console.log; console.log = (x) => logs.push(String(x));
  let sent;
  const origFetch = globalThis.fetch;
  globalThis.fetch = async (_u, o) => { sent = o.body; return new Response(JSON.stringify({ content: [{ text: '{"reply":"Sounds heavy. Write me at a@b.com — ok."}' }] }), { status: 200 }); };
  const r = await call({ answer: 'My email is secret.person@mail.com and work is heavy', stop: 'Window', question: 'What would you notice?' });
  console.log = origLog; globalThis.fetch = origFetch;
  const j = await r.json();
  assert.equal(sent.includes('secret.person'), false);
  assert.equal(j.reply.includes('a@b.com'), false);
  assert.equal(j.reply.includes('—'), false);
  assert.equal(logs.some((l) => l.includes('secret.person') || l.includes('heavy')), false);
  assert.equal(logs.length >= 1 && JSON.parse(logs[0]).app === 'alan', true);
});
test('seven mode keeps only options that are exactly seven words, and attaches provenance', async () => {
  process.env.ANTHROPIC_API_KEY = 'test'; process.env.AUDIT_HMAC_KEY = 'k';
  const logs = []; const origLog = console.log; console.log = (x) => logs.push(String(x));
  const origFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ content: [{ text: '{"options":["I say yes before I even think.","Eight words are not allowed in this list.","Too short","Calls eat my mornings and my energy."]}' }] }), { status: 200 });
  const r = await call({ mode: 'seven', kind: 'friction', sid: 'a1b2c3d4e5f60718', trail: [{ stop: 'Window', a: 'I say yes to everything' }] });
  console.log = origLog; globalThis.fetch = origFetch;
  const j = await r.json();
  assert.equal(r.status, 200);
  for (const o of j.options) assert.equal(o.split(/\s+/).length, 7, o);
  assert.equal(j.options.length, 2);
  assert.equal(j.prov.model.length > 0 && /^[a-f0-9]{8}$/.test(j.prov.promptV), true);
  const line = JSON.parse(logs.find((l) => l.includes('"audit":1')));
  assert.equal(line.event, 'seven'); assert.equal(line.sid.length, 16);
  const { sig, ...rest } = line;
  assert.equal(sig, sign(rest, 'k'));
  assert.equal(JSON.stringify(line).includes('say yes'), false);
});
