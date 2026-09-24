import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const configuredUrl = siteConfig.url.replace(/\/+$/, '');
  let configuredHost: string;
  try {
    configuredHost = new URL(configuredUrl).host;
  } catch {
    configuredHost = configuredUrl;
  }

  const detectedHost =
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    'unknown';

  const deployTarget = process.env.VERCEL_ENV || process.env.NETLIFY || 'local';

  return NextResponse.json({
    configuredUrl,
    configuredHost,
    detectedHost,
    canonical: detectedHost === configuredHost,
    deployTarget,
    environment: process.env.NODE_ENV || 'development',
    revalidateHint:
      'Run again from https://' +
      configuredHost +
      '/api/domain/check after DNS + redirects are live to confirm a green check.',
  });
}