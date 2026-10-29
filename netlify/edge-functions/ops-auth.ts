// Password-protects the private sales tools under /ops/. Separate secret from the client portal.
// Set SALES_PASSWORD in the Netlify UI (Environment variables), 12+ characters. Any username works.
// Fails closed: with no (or a weak) password set, nobody gets in.
import type { Config, Context } from '@netlify/edge-functions';
import { checkBasic } from '../../src/lib/basic-auth.mjs';

export default async (request: Request, context: Context) => {
  if (await checkBasic(request.headers.get('authorization'), Netlify.env.get('SALES_PASSWORD'))) {
    const res = await context.next();
    res.headers.set('Cache-Control', 'private, no-store');
    res.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return res;
  }
  return new Response('Private. Sign in with the sales password.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Sales", charset="UTF-8"', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' },
  });
};

export const config: Config = { path: ['/ops', '/ops/*'], rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ['ip', 'domain'] } };
