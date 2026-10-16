// Password-protects everything under /portal/ for clients.
// Set PORTAL_PASSWORD in the Netlify UI (Environment variables). Any username works.
import type { Config, Context } from '@netlify/edge-functions';

export default async (request: Request, context: Context) => {
  const password = Netlify.env.get('PORTAL_PASSWORD');
  const auth = request.headers.get('authorization') || '';
  const [scheme, encoded] = auth.split(' ');
  if (password && scheme === 'Basic' && encoded) {
    const decoded = atob(encoded);
    if (decoded.slice(decoded.indexOf(':') + 1) === password) {
      const res = await context.next();
      res.headers.set('Cache-Control', 'private, no-store');
      res.headers.set('X-Robots-Tag', 'noindex');
      return res;
    }
  }
  return new Response('Client portal: please sign in with the password Marquis gave you.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Client portal", charset="UTF-8"' },
  });
};

export const config: Config = { path: ['/portal', '/portal/*'] };
