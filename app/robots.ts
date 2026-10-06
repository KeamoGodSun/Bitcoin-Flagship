import type { MetadataRoute } from 'next';

/**
 * The preview routes are password gated in middleware, so they are already
 * unreachable without the shared secret. Disallowing them here as well means a
 * crawler that never authenticates still never receives a link to them.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/learn/preview', '/api/'],
    },
  };
}