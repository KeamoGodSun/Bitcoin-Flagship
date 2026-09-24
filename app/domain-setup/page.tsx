import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, ArrowLeft, CloudLightning, BadgeCheck } from 'lucide-react';
import { DomainChecker, LightningDomainNote } from '@/components/domain-checker';

export const metadata: Metadata = {
  title: 'Domain Setup — ₿itcoin Flagship',
  description:
    'Connect and verify the bitcoinflagship.com domain for the Bitcoin Flagship site — DNS records, redirects, and environment configuration.',
};

const vercelRecords = [
  {
    type: 'A',
    name: '@ (root)',
    value: '76.76.21.21',
    note: 'Apex record — Vercel. Propagates the domain at the root.',
  },
  {
    type: 'AAAA',
    name: '@ (root)',
    value: '2606:4700::6810:84e5',
    note: 'IPv6 for the apex record (optional but recommended).',
  },
  {
    type: 'CNAME',
    name: 'www',
    value: 'cname.vercel-dns.com',
    note: 'Serves www and enables automatic HTTPS certs.',
  },
  {
    type: '_lnaddress',
    name: 'TXT',
    value: 'depends on your Lightning provider',
    note: 'Makes tips@bitcoinflagship.com routable over Lightning.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Point the DNS records',
    description:
      'In your DNS provider (Namecheap, Cloudflare, GoDaddy, etc.), add the records for bitcoinflagship.com using the table below. Apex and www must both resolve.',
  },
  {
    step: '02',
    title: 'Add the domain in Vercel',
    description:
      'In the Vercel project → Settings → Domains, add bitcoinflagship.com and www.bitcoinflagship.com, then set a redirect (e.g. www → apex) so one canonical URL is served.',
  },
  {
    step: '03',
    title: 'Verify with the live check',
    description:
      'Wait a few minutes for DNS propagation, then re-run the Live connection check on this page from https://bitcoinflagship.com. All checks should light up green.',
  },
];

export default function DomainSetupPage() {
  return (
    <div>
      <section className="border-b border-border/60 bg-card/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-bitcoin"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Connect <span className="text-gradient-bitcoin">bitcoinflagship.com</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            This site runs on Vercel. To serve it from your own domain, point the DNS records below at
            Vercel, add the domain in the dashboard, and confirm every check on this page turns green.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
        <DomainChecker />

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border/60 p-5">
            <Globe className="h-5 w-5 text-bitcoin" />
            <h3 className="text-lg font-semibold">DNS records to add</h3>
          </div>
          <div className="p-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Type</th>
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Value</th>
                    <th className="pb-3 font-medium">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {vercelRecords.map((record) => (
                    <tr key={record.type + record.name}>
                      <td className="py-3 pr-4 font-mono text-xs text-bitcoin">{record.type}</td>
                      <td className="py-3 pr-4 font-mono text-xs">{record.name}</td>
                      <td className="py-3 pr-4 break-all font-mono text-xs">{record.value}</td>
                      <td className="py-3 text-xs text-muted-foreground">{record.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Not on Vercel? The Netlify build reads the same env vars — swap the CNAME value for your
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.netlify.app</code> project URL,
              and add your domain under Netlify → Domain management.
            </p>
          </div>
        </div>

        <LightningDomainNote />

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border/60 p-5">
            <BadgeCheck className="h-5 w-5 text-bitcoin" />
            <h3 className="text-lg font-semibold">Three steps to go live</h3>
          </div>
          <div className="grid gap-6 p-5 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step}>
                <div className="text-2xl font-bold text-bitcoin/40">{s.step}</div>
                <h4 className="mt-2 text-sm font-semibold">{s.title}</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-bitcoin/20 bg-bitcoin/5 p-5 text-sm">
          <p className="flex items-center gap-2 font-semibold">
            <CloudLightning className="h-4 w-4 text-bitcoin" /> Environment variables
          </p>
          <p className="mt-2 text-muted-foreground">
            Set these in Vercel project settings (or a <code className="rounded bg-muted px-1.5 py-0.5 text-xs">.env.local</code>{' '}
            for local dev) and redeploy after changing them:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed">
{`NEXT_PUBLIC_SITE_URL=https://bitcoinflagship.com
NEXT_PUBLIC_LIGHTNING_ADDRESS=tips@bitcoinflagship.com
LIGHTNING_PROVIDER=mock   # or: lnd / btcpayserver`}
          </pre>
        </div>
      </main>
    </div>
  );
}