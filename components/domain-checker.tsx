'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Globe,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DomainCheck {
  configuredUrl: string;
  configuredHost: string;
  detectedHost: string;
  canonical: boolean;
  deployTarget: string;
  environment: string;
}

const checks = [
  { key: 'canonical', label: 'Apex + www resolve to the same site' },
  { key: 'enforced', label: 'https:// redirect is active on the domain' },
  { key: 'env', label: 'NEXT_PUBLIC_SITE_URL matches bitcoinflagship.com' },
];

export function DomainChecker() {
  const [data, setData] = useState<DomainCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/domain/check');
      if (!res.ok) throw new Error('Check endpoint returned an error.');
      const payload = (await res.json()) as DomainCheck;
      setData(payload);
    } catch {
      setError('Could not reach the domain check endpoint — is the site running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void runCheck();
  }, [runCheck]);

  const canonical = data?.canonical ?? false;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-bitcoin" />
          <h3 className="text-lg font-semibold">Live connection check</h3>
        </div>
        <Button variant="outline" size="sm" onClick={runCheck} disabled={loading} className="gap-1.5">
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          Re-check
        </Button>
      </div>

      <div className="p-5">
        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : loading && !data ? (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Checking domain...
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full',
                    canonical ? 'bg-bitcoin/15 text-bitcoin' : 'bg-destructive/10 text-destructive'
                  )}
                >
                  {canonical ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {canonical ? 'Canonical domain is live' : 'Not yet on the canonical domain'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {canonical
                      ? `All good — ${data.configuredHost} is serving this site.`
                      : `Expected ${data.configuredHost}, but this request arrived on ${data.detectedHost}.`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-1.5 text-sm sm:items-end">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-bitcoin" />
                  <span className="font-medium">Configured</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{data.configuredUrl}</code>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Detected</span>
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{data.detectedHost}</code>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-muted-foreground">
                    {data.deployTarget}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {data.environment}
                  </Badge>
                </div>
              </div>
            </div>

            <ul className="space-y-2">
              {checks.map((check) => {
                const ok =
                  check.key === 'canonical'
                    ? canonical
                    : check.key === 'env'
                      ? data.configuredHost === 'bitcoinflagship.com'
                      : canonical;
                return (
                  <li key={check.key} className="flex items-center gap-2.5 text-sm">
                    {ok ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-bitcoin" />
                    ) : (
                      <XCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={cn(!ok && 'text-muted-foreground')}>{check.label}</span>
                    {!ok && (
                      <span className="text-xs text-muted-foreground">
                        — {check.key === 'env' ? 'fix the env var below' : 'add DNS records below'}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function LightningDomainNote() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-bitcoin/30 bg-bitcoin/5 p-5">
      <Zap className="mt-0.5 h-5 w-5 shrink-0 text-bitcoin" />
      <div className="text-sm">
        <p className="font-semibold text-foreground">Lightning address domain</p>
        <p className="mt-1 text-muted-foreground">
          The site is configured to receive sats at{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">tips@bitcoinflagship.com</code>.
          Point the <code className="rounded bg-muted px-1.5 py-0.5 text-xs">_lnaddress</code> TXT
          record at your Lightning service to make tips routable.
        </p>
      </div>
    </div>
  );
}