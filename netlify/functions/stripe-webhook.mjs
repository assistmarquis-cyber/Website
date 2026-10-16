// Stripe calls this after a successful checkout. For a G.O.D. Coach purchase it
// emails the buyer their prompt link and sends Marquis a sale notice, from
// book@bigpicturearchitect.com through Hostinger's mail server.
//
// Webhook URL to add in Stripe (event: checkout.session.completed):
//   https://bigpicturearchitect.com/.netlify/functions/stripe-webhook
//
// Needs these Netlify environment variables, set in the Netlify UI (never in code,
// because this repository is public):
//   STRIPE_WEBHOOK_SECRET  the signing secret Stripe shows for this webhook (whsec_...)
//   GOD_COACH_URL          link to the G.O.D. Coach (the Momentum Coach artifact, shared as "anyone with the link")
//   SMTP_PASSWORD          the password for book@bigpicturearchitect.com (already set)
//   MAILING_ADDRESS        the postal address shown in the email footer (already set)
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const FROM = process.env.SMTP_USER || 'book@bigpicturearchitect.com';
const ADDRESS = process.env.MAILING_ADDRESS || '';
// Only $88 checkouts get the G.O.D. Coach email. Change this if the price changes.
const PRICE_CENTS = 8800;
const TOLERANCE_SECONDS = 300;

// Checks the Stripe-Signature header the same way Stripe's own library does.
export const verify = (raw, header = '', secret = '', now = Date.now() / 1000) => {
  const parts = {};
  const v1 = [];
  for (const kv of header.split(',')) {
    const [k, v] = kv.split('=');
    if (k === 't') parts.t = v;
    if (k === 'v1') v1.push(v);
  }
  if (!parts.t || !v1.length || !secret) return false;
  if (Math.abs(now - Number(parts.t)) > TOLERANCE_SECONDS) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${raw}`).digest('hex');
  return v1.some((sig) => sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)));
};

const firstName = (name = '') => name.trim().split(/\s+/)[0] || 'there';

const buyerEmail = (name, url) => `Hi ${firstName(name)}, thank you for getting the G.O.D. Coach.

Open your coach here:
${url}

To start:
1. Open the link while signed in to Claude (claude.ai). A free account works to get started.
2. When it asks, allow it to chat using your Claude account.
3. Tell it what you're working on right now. It checks in with you, names your mode, and scores your momentum.

It works in three modes from the G.O.D. Framework: the Generator creates, the Operator executes, and the Destroyer cuts what's in the way. Your check-in log stays in your browser.

Your $88 setup also includes my help getting it running. Reply to this email with what you want the coach to help you with, and I'll follow up within 24 to 48 hours.

Marquis

The G.O.D. Coach is a thinking tool, not therapy, medical, legal or financial advice. Any Claude plan is billed by Anthropic separately.
Marquis Alan Experience LLC${ADDRESS ? `, ${ADDRESS}` : ''}. You received this because you purchased the G.O.D. Coach at bigpicturearchitect.com.`;

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
  const sigHeader = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  if (!verify(raw, sigHeader, process.env.STRIPE_WEBHOOK_SECRET)) {
    console.error('Stripe webhook: bad or missing signature');
    return { statusCode: 400, body: 'Invalid signature' };
  }

  const evt = JSON.parse(raw);
  if (evt.type !== 'checkout.session.completed') return { statusCode: 200, body: 'ignored' };
  const s = evt.data?.object || {};
  if (s.payment_status !== 'paid') return { statusCode: 200, body: 'not paid' };
  if (s.amount_total !== PRICE_CENTS) return { statusCode: 200, body: 'other product' };

  const email = s.customer_details?.email;
  const name = s.customer_details?.name || '';
  const url = process.env.GOD_COACH_URL;
  if (!email || !url || !process.env.SMTP_PASSWORD) {
    console.error('G.O.D. Coach email skipped:', !email ? 'no buyer email' : !url ? 'GOD_COACH_URL not set' : 'SMTP_PASSWORD not set');
    // 500 makes Stripe retry for up to three days, giving time to fix the setting.
    return { statusCode: 500, body: 'Not configured' };
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: { user: FROM, pass: process.env.SMTP_PASSWORD },
  });

  try {
    await transport.sendMail({ from: `Marquis Harmon <${FROM}>`, to: email, replyTo: FROM, subject: 'Your G.O.D. Coach is ready', text: buyerEmail(name, url) });
  } catch (err) {
    console.error('G.O.D. Coach email failed:', err.message);
    return { statusCode: 500, body: 'Email failed' }; // Stripe retries
  }
  try {
    await transport.sendMail({ from: `G.O.D. Coach sales <${FROM}>`, to: FROM, subject: `New G.O.D. Coach sale: ${name || email}`, text: `${name || 'A buyer'} (${email}) paid $${(s.amount_total / 100).toFixed(2)} for the G.O.D. Coach. Their prompt email has been sent.\n\nStripe checkout session: ${s.id}` });
  } catch (err) {
    console.error('Sale notice failed:', err.message);
  }
  return { statusCode: 200, body: 'sent' };
};
