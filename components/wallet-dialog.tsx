'use client';

import { useCallback, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Check,
  Copy,
  Loader2,
  Zap,
  PartyPopper,
  ArrowDownToLine,
  History,
  Wallet as WalletIcon,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  walletGroups,
  walletAddress,
  getWalletGroup,
  type WalletGroupId,
} from '@/lib/wallets';
import { cn } from '@/lib/utils';

interface Invoice {
  id: string;
  paymentHash: string;
  paymentRequest: string;
  amountSats: number;
  memo: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

interface LedgerEntry {
  id: string;
  paymentHash: string;
  walletId: string;
  programId: string | null;
  programName: string | null;
  amountSats: number;
  memo: string;
  status: string;
  createdAt: string;
  paidAt: string | null;
}

interface WalletPayload {
  wallet: { id: string; name: string; address: string; memo: string };
  summary: { receivedSats: number; pendingSats: number; settledCount: number; pendingCount: number };
  entries: LedgerEntry[];
}

interface WalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWalletId?: WalletGroupId;
  initialProgramId?: string;
}

const PRESETS = [1000, 5000, 21000, 100000];

export function WalletDialog({ open, onOpenChange, initialWalletId, initialProgramId }: WalletDialogProps) {
  const [activeGroupId, setActiveGroupId] = useState<WalletGroupId>(initialWalletId || 'flagship');
  const [activeProgramId, setActiveProgramId] = useState<string | undefined>(initialProgramId);
  const [amount, setAmount] = useState(5000);
  const [data, setData] = useState<WalletPayload | null>(null);
  const [loading, setLoading] = useState(false);

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [provider, setProvider] = useState<string>('mock');
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  const activeGroup = getWalletGroup(activeGroupId);
  const activeProgram = activeGroup.programs.find((p) => p.id === activeProgramId) ?? null;

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lightning/wallet?walletId=${activeGroupId}`);
      if (!res.ok) throw new Error('Failed to load wallet');
      const payload = (await res.json()) as WalletPayload;
      setData(payload);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [activeGroupId]);

  useEffect(() => {
    if (open) {
      const nextGroup = initialWalletId || 'flagship';
      setActiveGroupId(nextGroup);
      setActiveProgramId(initialProgramId);
      setAmount(getWalletGroup(nextGroup).defaultAmount);
      setInvoice(null);
      setPaid(false);
      setError(null);
      setCopied(false);
      void fetchWallet();
    }
  }, [open, initialWalletId, initialProgramId, fetchWallet]);

  useEffect(() => {
    if (open) void fetchWallet();
  }, [activeGroupId, open, fetchWallet]);

  useEffect(() => {
    if (open) setAmount(activeProgram?.defaultAmount ?? activeGroup.defaultAmount);
  }, [activeProgramId, activeGroupId, open, activeProgram, activeGroup]);

  const selectGroup = (id: WalletGroupId) => {
    setActiveGroupId(id);
    setActiveProgramId(undefined);
    setInvoice(null);
    setPaid(false);
    setError(null);
  };

  const selectProgram = (id: string) => {
    setActiveProgramId(id);
    setInvoice(null);
    setPaid(false);
    setError(null);
  };

  const generateInvoice = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/lightning/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountSats: amount,
          walletId: activeGroupId,
          programId: activeProgramId,
        }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to generate invoice');
      setInvoice(resData.invoice);
      setProvider(resData.provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invoice');
    } finally {
      setGenerating(false);
    }
  };

  const verifyPayment = async () => {
    if (!invoice) return;
    setChecking(true);
    try {
      const res = await fetch('/api/lightning/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentHash: invoice.paymentHash }),
      });
      const resData = await res.json();
      if (resData.payment?.paid) {
        setPaid(true);
        void fetchWallet();
      } else {
        setError('Payment not detected yet — scan and pay the invoice, then check again.');
      }
    } catch {
      setError('Failed to check payment status.');
    } finally {
      setChecking(false);
    }
  };

  const simulatePayment = async () => {
    if (!invoice) return;
    setChecking(true);
    try {
      const res = await fetch('/api/lightning/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentHash: invoice.paymentHash }),
      });
      const resData = await res.json();
      if (resData.payment?.paid) {
        setPaid(true);
        void fetchWallet();
      }
    } catch {
      setError('Simulation failed.');
    } finally {
      setChecking(false);
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyAddress = () => copyText(walletAddress(activeGroupId));
  const copyInvoice = () => invoice && copyText(invoice.paymentRequest);

  const summary = data?.summary;
  const entries = data?.entries ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-bitcoin" /> ₿itcoin Wallet
          </DialogTitle>
          <DialogDescription>
            Receive sats over Lightning. Pick a wallet, set your amount, and support the mission.
          </DialogDescription>
        </DialogHeader>

        {/* Wallet group picker */}
        <div className="flex flex-wrap gap-2">
          {walletGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => selectGroup(group.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                activeGroupId === group.id
                  ? 'border-bitcoin bg-bitcoin/15 text-bitcoin'
                  : 'border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground'
              )}
            >
              <group.icon className="h-3.5 w-3.5" />
              {group.shortName}
            </button>
          ))}
        </div>

        {/* Program picker */}
        {activeGroup.programs.length > 0 && (
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">
              Donating to a specific program?
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => selectProgram('')}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  !activeProgram
                    ? 'border-bitcoin bg-bitcoin/10 text-bitcoin'
                    : 'border-border text-muted-foreground hover:border-bitcoin/40'
                )}
              >
                {activeGroup.name}
              </button>
              {activeGroup.programs.map((program) => (
                <button
                  key={program.id}
                  onClick={() => selectProgram(program.id)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                    activeProgramId === program.id
                      ? 'border-bitcoin bg-bitcoin/10 text-bitcoin'
                      : 'border-border text-muted-foreground hover:border-bitcoin/40'
                  )}
                >
                  {program.name}
                </button>
              ))}
            </div>
            {activeProgram && (
              <p className="mt-1.5 text-xs text-bitcoin">{activeProgram.description}</p>
            )}
          </div>
        )}

        {/* Balance row */}
        <div className="grid grid-cols-3 gap-2 rounded-xl border border-border bg-card p-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Received</p>
            <p className="mt-0.5 text-sm font-bold text-bitcoin">
              {summary ? summary.receivedSats.toLocaleString() : '—'} <span className="text-[11px] font-medium">sats</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Pending</p>
            <p className="mt-0.5 text-sm font-bold">
              {summary ? summary.pendingSats.toLocaleString() : '—'} <span className="text-[11px] font-medium">sats</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Payouts</p>
            <p className="mt-0.5 text-sm font-bold">
              {summary ? summary.settledCount.toLocaleString() : '—'}
            </p>
          </div>
        </div>

        {paid ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/15">
              <PartyPopper className="h-8 w-8 text-bitcoin" />
            </div>
            <div>
              <p className="text-lg font-bold">Payment received!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {invoice?.amountSats.toLocaleString()} sats → {activeProgram ? activeProgram.name : activeGroup.name}
              </p>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="receive">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receive" className="gap-1.5">
                <ArrowDownToLine className="h-3.5 w-3.5" /> Receive
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-1.5">
                <History className="h-3.5 w-3.5" /> Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="receive" className="mt-4 space-y-4">
              {/* Lightning address */}
              <div className="flex items-center gap-2 rounded-lg border border-bitcoin/30 bg-bitcoin/5 px-3 py-2">
                <Zap className="h-4 w-4 shrink-0 text-bitcoin" />
                <button
                  onClick={copyAddress}
                  className="truncate font-mono text-xs font-medium text-foreground transition-colors hover:text-bitcoin"
                  title="Copy Lightning address"
                >
                  {walletAddress(activeGroupId)}
                </button>
                <button
                  onClick={copyAddress}
                  aria-label="Copy Lightning address"
                  className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:text-bitcoin"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-bitcoin" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
                <a
                  href={`lightning:${walletAddress(activeGroupId)}`}
                  aria-label="Open in Lightning wallet"
                  className="rounded p-1 text-muted-foreground transition-colors hover:text-bitcoin"
                >
                  <Zap className="h-3.5 w-3.5" />
                </a>
              </div>

              {!invoice ? (
                <>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAmount(preset)}
                        className={cn(
                          'rounded-lg border px-2 py-2.5 text-sm font-semibold transition-colors',
                          amount === preset
                            ? 'border-bitcoin bg-bitcoin/10 text-bitcoin'
                            : 'border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground'
                        )}
                      >
                        {preset.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                      Set your own price (sats)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      value={amount}
                      onChange={(e) => setAmount(Math.max(1, Math.floor(Number(e.target.value) || 0)))}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your gift goes to <span className="font-semibold text-bitcoin">{activeProgram ? activeProgram.name : activeGroup.name}</span>
                    {activeProgram ? ` · ${activeGroup.name}` : ''}.
                  </p>
                  <Button onClick={generateInvoice} disabled={generating || amount < 1} className="w-full">
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating invoice...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" /> Create Lightning Invoice
                      </>
                    )}
                  </Button>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-xl border border-border bg-white p-3">
                      <QRCodeSVG value={invoice.paymentRequest} size={200} />
                    </div>
                    <p className="text-2xl font-bold">
                      {invoice.amountSats.toLocaleString()} <span className="text-base text-bitcoin">sats</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {invoice.memo} · Expires {new Date(invoice.expiresAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate rounded-md border border-border bg-muted px-3 py-2 text-xs font-mono">
                      {invoice.paymentRequest}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyInvoice} aria-label="Copy invoice">
                      {copied ? <Check className="h-4 w-4 text-bitcoin" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setInvoice(null)}>
                      Back
                    </Button>
                    <Button onClick={verifyPayment} disabled={checking}>
                      {checking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                      I&apos;ve Paid
                    </Button>
                  </div>

                  {provider === 'mock' && (
                    <button
                      onClick={simulatePayment}
                      disabled={checking}
                      className="block w-full text-center text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      Simulate payment (mock mode)
                    </button>
                  )}

                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="mt-4">
              {provider === 'mock' ? (
                <p className="mb-3 rounded-lg border border-dashed border-border bg-card/40 p-3 text-xs text-muted-foreground">
                  Demo mode. These entries come from test invoices held in server memory — they are not real payments
                  and they clear whenever the server restarts.
                </p>
              ) : null}
              {loading && entries.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Loading activity...</p>
              ) : entries.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No payments yet for this wallet. Create an invoice in the Receive tab.
                </p>
              ) : (
                <ScrollArea className="h-64">
                  <div className="space-y-2 pr-3">
                    {entries.map((entry) => (
                      <div
                        key={entry.paymentHash}
                        className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {entry.programName ?? entry.memo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-bitcoin">
                          +{entry.amountSats.toLocaleString()} <span className="text-[11px] font-medium">sats</span>
                        </p>
                        <Badge
                          variant={entry.status === 'paid' ? 'default' : 'outline'}
                          className={cn(
                            entry.status === 'paid' && 'border-bitcoin bg-bitcoin/15 text-bitcoin'
                          )}
                        >
                          {entry.status === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}