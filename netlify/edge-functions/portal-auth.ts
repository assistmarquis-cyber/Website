// Password-protects everything under /portal/ for clients.
// Set PORTAL_PASSWORD in the Netlify UI (Environment variables), 12+ characters. Any username works.
import type { Config, Context } from '@netlify/edge-functions';
import { checkBasic } from '../../src/lib/basic-auth.mjs';

export default async (request: Request, context: Context) => {
  if (await checkBasic(request.headers.get('authorization'), Netlify.env.get('PORTAL_PASSWORD'))) {
    const res = await context.next();
    res.headers.set('Cache-Control', 'private, no-store');
    res.headers.set('X-Robots-Tag', 'noindex');
    return res;
  }
  return new Response('Client portal: please sign in with the password Marquis gave you.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Client portal", charset="UTF-8"', 'Cache-Control': 'no-store' },
  });
};

export const config: Config = { path: ['/portal', '/portal/*'], rateLimit: { windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
