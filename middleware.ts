import { NextResponse, type NextRequest } from 'next/server';

/**
 * Access control for the draft review routes under /learn/preview.
 *
 * Those routes are statically generated, so the unpublished lesson text is
 * baked into HTML files at build time. Marking them noindex only asks crawlers
 * to stay away; it is not a lock. Without this gate anyone who guesses the URL
 * reads half-written course material, which is the one thing the course copy
 * promises never happens.
 *
 * Behaviour:
 *   - credentials set          -> HTTP basic auth, browser prompts
 *   - production, no creds     -> 404. Fails closed rather than serving drafts
 *                                 because a missing env var must never silently
 *                                 publish unpublished content.
 *   - development, no creds    -> open, so local review needs no setup
 */

const PREFIX = '/learn/preview';
const REALM = 'Bitcoin Flagship draft review';

function deny(status: 401 | 404): NextResponse {
  return new NextResponse(status === 404 ? 'Not found' : 'Unauthorized', {
    status,
    headers:
      status === 401
        ? { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` }
        : { 'Cache-Control': 'no-store' },
  });
}

function unauthorized(request: NextRequest): boolean {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Basic ')) return false;

  const user = process.env.PREVIEW_BASIC_AUTH_USER ?? '';
  const pass = process.env.PREVIEW_BASIC_AUTH_PASSWORD ?? '';
  if (!user || !pass) return false;

  const decoded = atob(header.slice('Basic '.length));
  const separator = decoded.indexOf(':');
  if (separator === -1) return false;

  return decoded.slice(0, separator) === user && decoded.slice(separator + 1) === pass;
}

export function middleware(request: NextRequest) {
  const user = process.env.PREVIEW_BASIC_AUTH_USER ?? '';
  const pass = process.env.PREVIEW_BASIC_AUTH_PASSWORD ?? '';

  if (!user || !pass) {
    return process.env.NODE_ENV === 'production' ? deny(404) : NextResponse.next();
  }

  return unauthorized(request) ? NextResponse.next() : deny(401);
}

export const config = {
  matcher: ['/learn/preview', '/learn/preview/:path*'],
};