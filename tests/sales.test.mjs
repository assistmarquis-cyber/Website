import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseCsv, metrics, riskFlags, csvCell, flagsCsv, amountsIn } from '../src/lib/sales.mjs';
import { parseBasic, checkBasic } from '../src/lib/basic-auth.mjs';

const rows = parseCsv(readFileSync(new URL('./fixtures/leads-synthetic.csv', import.meta.url), 'utf8'));
const codes = (id) => riskFlags(rows).filter((f) => f.id === id).map((f) => f.code);

test('parser handles quotes, commas, CRLF and BOM', () => {
  const r = parseCsv('﻿a,b\r\n1,"x, ""y"""\r\n');
  assert.deepEqual(r, [{ a: '1', b: 'x, "y"' }]);
  assert.equal(rows.length, 6);
  assert.equal(rows[0].notes, 'Asked about pricing, said "maybe"');
  assert.deepEqual(parseCsv(''), []);
});

test('metrics: funnel, due follow-ups and cash vs target', () => {
  const m = metrics(rows, '2026-10-29', 5000, 10000);
  assert.equal(m.total, 6);
  assert.equal(m.pct, 50);
  assert.equal(m.gap, 5000);
  assert.deepEqual(m.due.map((r) => r.id), ['1', '3']); // future date, closed, and held rows excluded
  assert.equal(m.funnel.find((f) => f[0] === 'Closed')[1], 2);
  assert.equal(metrics(rows, '2026-10-29', -50, 0).pct, 0);
});

test('AML-lite: large amounts, risky payment methods, sanctions, duplicates', () => {
  assert.ok(codes('2').includes('large-amount'));
  assert.ok(codes('2').includes('payment-method'));
  assert.ok(codes('4').includes('sanctions-screen'));
  assert.ok(codes('5').includes('payment-method'));
  assert.ok(codes('5').includes('duplicate'));
  assert.deepEqual(amountsIn('got $12,000 and $5k and $300.50'), [12000, 5000, 300]);
});

test('KYC-lite: closed or active with no identity or record', () => {
  assert.ok(codes('2').includes('identity-gap'));
  assert.ok(!codes('6').includes('identity-gap'));
  assert.ok(!codes('6').includes('closed-no-record'));
});

test('clean row raises nothing; high flags sort first', () => {
  assert.deepEqual(codes('1'), []);
  assert.equal(riskFlags(rows)[0].level, 'high');
});

test('formula injection is flagged and neutralized on export', () => {
  assert.ok(codes('3').includes('formula-cell'));
  for (const v of ['=1+1', '+cmd', '-cmd', '@SUM(A1)', '\tx']) assert.ok(csvCell(v).replace(/^"/, '').startsWith("'"), v);
  assert.equal(csvCell('plain'), 'plain');
  assert.equal(csvCell('a,"b"'), '"a,""b"""');
  const out = flagsCsv(riskFlags(rows));
  for (const line of out.split('\n').slice(1)) assert.ok(!/^[=+\-@]/.test(line.split(',')[1] || ''));
});

const hdr = (user, pw) => 'Basic ' + Buffer.from(`${user}:${pw}`).toString('base64');
const PW = 'correct horse battery';

test('basic auth: accepts right password, any username, colons in password', async () => {
  assert.equal(await checkBasic(hdr('anything', PW), PW), true);
  assert.equal(await checkBasic(hdr('', PW), PW), true);
  assert.equal(await checkBasic(hdr('u', 'pa:ss word long'), 'pa:ss word long'), true);
});

test('basic auth: rejects wrong, empty, malformed, oversize and unset', async () => {
  for (const h of [hdr('u', 'wrong password!!'), hdr('u', ''), 'Basic', 'Basic !!!!', 'Bearer abc', '', null, undefined, 'Basic ' + 'A'.repeat(5000), 'Basic ' + Buffer.from('nocolon').toString('base64'), 'Basic /w==']) {
    assert.equal(await checkBasic(h, PW), false, String(h).slice(0, 20));
  }
  assert.equal(await checkBasic(hdr('u', ''), ''), false);
  assert.equal(await checkBasic(hdr('u', 'short'), 'short'), false); // weak secret refused
  assert.equal(await checkBasic(hdr('u', PW), undefined), false);
  assert.equal(parseBasic('Basic /w=='), null); // invalid utf-8 must not throw
});
