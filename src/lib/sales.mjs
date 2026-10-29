// Pure logic for the private sales dashboard (/ops/sales/). No DOM, no network.
// The browser page and the tests both import this. Risk flags are practical
// screening aids for a coaching business, not legal KYC/AML compliance.

export function parseCsv(text) {
  const s = String(text ?? '').replace(/^﻿/, '');
  const rows = [];
  let row = [], cur = '', q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') { if (s[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(cur); cur = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else cur += c;
  }
  row.push(cur);
  if (row.some((x) => x !== '')) rows.push(row);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])));
}

export const OUT = (stage) => /^excluded|^hold/i.test(stage);
const CLOSED = (stage) => /^closed/i.test(stage);

export function metrics(rows, today, cashReceived = 0, target = 25806) {
  const byStage = {};
  for (const r of rows) byStage[r.stage || 'unknown'] = (byStage[r.stage || 'unknown'] || 0) + 1;
  const n = (re) => rows.filter((r) => re.test(r.stage || '')).length;
  const funnel = [
    ['Researched', n(/^researched/i)],
    ['Packet / drafted', n(/^(drafted|packet)/i)],
    ['Contacted', n(/^contacted/i)],
    ['Closed', n(/^closed/i)],
  ];
  const due = rows
    .filter((r) => r.next_action_date && r.next_action_date <= today && !OUT(r.stage) && !CLOSED(r.stage) && !/^none$/i.test(r.next_action))
    .sort((a, b) => a.next_action_date.localeCompare(b.next_action_date) || Number(b.score || 0) - Number(a.score || 0));
  const cash = Math.max(0, Number(cashReceived) || 0);
  return { total: rows.length, byStage, funnel, due, cash, target, pct: target > 0 ? Math.min(100, Math.round((cash / target) * 100)) : 0, gap: Math.max(0, target - cash) };
}

// Screening rules. Each returns a flag object or null. "review" means a human looks; nothing is blocked.
const SANCTIONED = /\b(cuba|iran|north korea|dprk|syria|crimea|donetsk|luhansk)\b/i;
const SANCTIONED_TLD = /\.(ir|kp|sy|cu)(\/|$|:)/i;
const RISKY_PAY = /\b(cash|crypto|bitcoin|btc|usdt|gift ?card|money order|wire from|third[- ]party|western union|zelle from)\b/i;

export function amountsIn(text) {
  const out = [];
  for (const m of String(text).matchAll(/\$\s?(\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{2})?\s?(k)?/gi)) {
    let v = Number(m[1].replace(/,/g, ''));
    if (m[2]) v *= 1000;
    out.push(v);
  }
  return out;
}

export function riskFlags(rows) {
  const flags = [];
  const add = (r, code, level, why) => flags.push({ id: r.id, name: r.org_or_name, stage: r.stage, code, level, why });
  const seen = new Map();
  for (const r of rows) {
    const blob = [r.org_or_name, r.url, r.contact_route, r.notes].join(' ');
    if (SANCTIONED.test(blob) || SANCTIONED_TLD.test(r.url || '')) add(r, 'sanctions-screen', 'high', 'Mentions a comprehensively sanctioned place. Check the OFAC search before any payment or contract.');
    if (RISKY_PAY.test(r.notes || '')) add(r, 'payment-method', 'medium', 'Notes mention cash, crypto, gift cards, wires or a third-party payer. Take card or ACH through Stripe only.');
    const big = amountsIn(r.notes || '').filter((v) => v >= 10000);
    if (big.length) add(r, 'large-amount', 'medium', `Notes mention $${Math.max(...big).toLocaleString('en-US')}. Confirm the payer and source, and keep the invoice.`);
    if ((CLOSED(r.stage) || /^contacted/i.test(r.stage)) && !r.contact_route && !r.url) add(r, 'identity-gap', 'medium', 'Active or closed with no contact route or URL. Record who you are dealing with (KYC-lite).');
    if (CLOSED(r.stage) && !/contract|invoice|stripe|paid|agreement/i.test(r.notes || '')) add(r, 'closed-no-record', 'low', 'Closed with no invoice, contract or payment note. Add the record for your books.');
    const key = (r.org_or_name || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (key) { if (seen.has(key)) add(r, 'duplicate', 'low', `Same name as row ${seen.get(key)}.`); else seen.set(key, r.id); }
    for (const [k, v] of Object.entries(r)) {
      if (/^[=+\-@\t\r]/.test(v) && !/^-?\d[\d.,]*$/.test(v) && !/^\+?[\d\s().-]{7,}$/.test(v)) { add(r, 'formula-cell', 'high', `Column ${k} starts with a spreadsheet formula character. Neutralized on export.`); break; }
    }
  }
  const rank = { high: 0, medium: 1, low: 2 };
  return flags.sort((a, b) => rank[a.level] - rank[b.level]);
}

// Prevent spreadsheet formula injection when exporting.
export function csvCell(v) {
  let s = String(v ?? '');
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
export function flagsCsv(flags) {
  const head = ['id', 'name', 'stage', 'level', 'code', 'why'];
  return [head.join(','), ...flags.map((f) => head.map((h) => csvCell(f[h])).join(','))].join('\n');
}

// ---- Payments ledger (Stripe Dashboard export, or any CSV with a date, amount and description) ----
const pick = (r, ...names) => { for (const n of names) if (r[n] !== undefined && r[n] !== '') return r[n]; return ''; };
const money = (v) => { const n = Number(String(v).replace(/[$,\s]/g, '')); return Number.isFinite(n) ? n : 0; };

export function offerOf(text) {
  const t = String(text).toLowerCase();
  if (/pattern[_ ]?audit/.test(t)) return 'Pattern Audit';
  if (/g\.?o\.?d\.? ?coach|god[_ ]coach/.test(t)) return 'G.O.D. Coach';
  if (/sprint/.test(t)) return 'Mindset Sprint';
  if (/workshop/.test(t)) return 'Workshops';
  if (/keynote|speak/.test(t)) return 'Keynotes';
  if (/alan/.test(t)) return 'Alan';
  return 'Unlabeled';
}

export function parseLedger(rows) {
  return rows.map((r) => {
    const status = pick(r, 'status').toLowerCase();
    const gross = money(pick(r, 'amount', 'amount captured', 'gross'));
    const refunded = money(pick(r, 'amount refunded', 'refunded'));
    const text = [pick(r, 'description', 'product', 'item'), pick(r, 'client_reference_id', 'client reference id'), pick(r, 'metadata')].join(' ');
    return {
      date: pick(r, 'created date (utc)', 'created (utc)', 'date', 'created').slice(0, 10),
      status, gross, refunded, net: Math.max(0, gross - refunded),
      offer: offerOf(text), who: pick(r, 'customer email', 'email', 'customer name', 'customer'), text: text.trim(),
      counted: /^(paid|succeeded|complete|completed)$/.test(status),
    };
  }).filter((p) => p.gross > 0 || p.counted);
}

export function salesSummary(pays, today) {
  const paid = pays.filter((p) => p.counted);
  const month = today.slice(0, 7);
  const sum = (a) => a.reduce((s, p) => s + p.net, 0);
  const byOffer = {};
  for (const p of paid) { const o = (byOffer[p.offer] ||= { offer: p.offer, count: 0, net: 0 }); o.count++; o.net += p.net; }
  const byMonth = {};
  for (const p of paid) { const k = p.date.slice(0, 7) || 'unknown'; byMonth[k] = (byMonth[k] || 0) + p.net; }
  return {
    count: paid.length, total: sum(paid), monthToDate: sum(paid.filter((p) => p.date.startsWith(month))),
    refunded: paid.reduce((s, p) => s + p.refunded, 0),
    offers: Object.values(byOffer).sort((a, b) => b.net - a.net),
    months: Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b)),
    notCounted: pays.length - paid.length,
    recent: [...paid].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10),
    flags: pays.flatMap((p) => [
      ...(p.counted && p.net >= 10000 ? [{ code: 'large-payment', level: 'medium', why: `$${p.net.toLocaleString('en-US')} on ${p.date}. Confirm the payer and keep the invoice.` }] : []),
      ...(/dispute|chargeback|lost/.test(p.status) ? [{ code: 'dispute', level: 'high', why: `Payment on ${p.date} is ${p.status}. Respond in Stripe before the deadline.` }] : []),
    ]),
  };
}

// Pipeline by offer from leads.csv: counts only, since leads carry no confirmed price.
export function pipelineByOffer(rows) {
  const out = {};
  for (const r of rows) {
    if (OUT(r.stage)) continue;
    const k = r.type || 'other';
    const o = (out[k] ||= { type: k, active: 0, closed: 0 });
    CLOSED(r.stage) ? o.closed++ : o.active++;
  }
  return Object.values(out).sort((a, b) => b.active - a.active);
}
