import { NextRequest, NextResponse } from 'next/server';
import { supabase as supabaseBrowser, isSupabaseConfigured, supabaseUrl } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { providerName } from '@/lib/lightning/provider';
import { siteConfig } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type CheckState = 'ok' | 'unconfigured' | 'paused' | 'error';

interface Check {
  state: CheckState;
  latencyMs?: number;
  detail?: string;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return 'invalid-url';
  }
}

/** Supabase paused projects answer with a 5xx and a message about being paused or restarting. */
function classify(error: { message?: string; code?: string } | null): CheckState {
  if (!error) return 'ok';
  const message = `${error.message ?? ''} ${error.code ?? ''}`.toLowerCase();
  if (message.includes('paused') || message.includes('suspend') || message.includes('restart')) return 'paused';
  if (
    message.includes('fetch failed') ||
    message.includes('econnrefused') ||
    message.includes('enotfound') ||
    message.includes('failed to fetch')
  ) {
    return 'error';
  }
  return 'error';
}

async function checkSupabase(): Promise<Check> {
  if (!isSupabaseConfigured()) {
    return { state: 'unconfigured', detail: 'wall is running on sample content' };
  }

  const db = supabaseAdmin() ?? supabaseBrowser();
  if (!db) return { state: 'unconfigured' };

  const startedAt = Date.now();
  const { error } = await db.from('post_comments').select('id').limit(1);
  const latencyMs = Date.now() - startedAt;
  const state = classify(error);

  if (state !== 'ok') {
    return { state, latencyMs, detail: state === 'paused' ? 'project is paused, unpause it in the dashboard' : error?.message };
  }

  return { state: 'ok', latencyMs, detail: hostOf(supabaseUrl()) };
}

async function checkLightning(): Promise<Check & { provider: string }> {
  const provider = providerName();

  if (provider === 'mock') {
    return { state: 'unconfigured', provider, detail: 'mock provider: no real invoices, ledger resets on restart' };
  }

  if (provider === 'lnd') {
    if (!siteConfig.lnd.host || !siteConfig.lnd.macaroon) {
      return { state: 'unconfigured', provider, detail: 'LND_HOST or LND_MACAROON missing' };
    }

    const startedAt = Date.now();
    try {
      const res = await fetch(`${siteConfig.lnd.host.replace(/\/+$/, '')}/v1/getinfo`, {
        headers: { 'Grpc-Metadata-macaroon': siteConfig.lnd.macaroon },
        cache: 'no-store',
      });
      const latencyMs = Date.now() - startedAt;
      if (!res.ok) {
        return { state: res.status >= 500 ? 'error' : 'unconfigured', provider, latencyMs, detail: `getinfo returned ${res.status}` };
      }
      const info = (await res.json()) as { version?: string; identity_pubkey?: string };
      return { state: 'ok', provider, latencyMs, detail: `node ${info.version ?? 'unknown'}, pubkey ${(info.identity_pubkey ?? '').slice(0, 12)}…` };
    } catch (err) {
      return { state: 'error', provider, detail: err instanceof Error ? err.message : 'unreachable' };
    }
  }

  if (!siteConfig.btcpayserver.url) {
    return { state: 'unconfigured', provider, detail: 'BTCPAY_URL missing' };
  }

  const startedAt = Date.now();
  try {
    const res = await fetch(`${siteConfig.btcpayserver.url.replace(/\/+$/, '')}/api/v1/health`, {
      headers: { Authorization: `Basic ${Buffer.from(`${siteConfig.btcpayserver.apiKey}:`).toString('base64')}` },
      cache: 'no-store',
    });
    const latencyMs = Date.now() - startedAt;
    return {
      state: res.ok ? 'ok' : 'error',
      provider,
      latencyMs,
      detail: res.ok ? hostOf(siteConfig.btcpayserver.url) : `health returned ${res.status}`,
    };
  } catch (err) {
    return { state: 'error', provider, detail: err instanceof Error ? err.message : 'unreachable' };
  }
}

export async function GET(request: NextRequest) {
  const token = process.env.HEALTH_CHECK_TOKEN;
  const provided = request.headers.get('x-health-token');
  const verbose = Boolean(token) && provided === token;

  const [supabase, lightning] = await Promise.all([checkSupabase(), checkLightning()]);

  const checks: Record<string, Check & { provider?: string }> = { supabase, lightning };
  const degraded = Object.values(checks).some((check) => check.state === 'paused' || check.state === 'error');

  const body = {
    status: degraded ? 'degraded' : 'ok',
    checkedAt: new Date().toISOString(),
    checks: verbose
      ? checks
      : {
          supabase: { state: supabase.state },
          lightning: { state: lightning.state, provider: lightning.provider },
        },
  };

  return NextResponse.json(body, {
    status: degraded ? 503 : 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}
