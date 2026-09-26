'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, Loader2, Zap, PartyPopper } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memo?: string;
  defaultAmount?: number;
  /** Links the payment to a community post so the sats total stays attributable. */
  postId?: string;
  onPaid?: () => void;
}

const PRESETS = [500, 2100, 5000, 21000];

export function TipDialog({
  open,
  onOpenChange,
  memo = 'Bitcoin Flagship tip',
  defaultAmount = 2100,
  postId,
  onPaid,
}: TipDialogProps) {
  const [amount, setAmount] = useState(defaultAmount);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [provider, setProvider] = useState<string>('mock');
  const [generating, setGenerating] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (open) {
      setInvoice(null);
      setError(null);
      setPaid(false);
      setCopied(false);
    }
  }, [open]);

  const generateInvoice = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/lightning/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountSats: amount, memo, postId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate invoice');
      setInvoice(data.invoice);
      setProvider(data.provider);
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
      const data = await res.json();
      if (data.payment?.paid) {
        setPaid(true);
        onPaid?.();
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
      const data = await res.json();
      if (data.payment?.paid) {
        setPaid(true);
        onPaid?.();
      }
    } catch {
      setError('Simulation failed.');
    } finally {
      setChecking(false);
    }
  };

  const copyInvoice = async () => {
    if (!invoice) return;
    await navigator.clipboard.writeText(invoice.paymentRequest);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-bitcoin" /> Send a Tip
          </DialogTitle>
          <DialogDescription>
            Support the community with a Lightning payment. No middleman needed.
          </DialogDescription>
        </DialogHeader>

        {paid ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bitcoin/15">
              <PartyPopper className="h-8 w-8 text-bitcoin" />
            </div>
            <div>
              <p className="text-lg font-bold">Payment received!</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {invoice?.amountSats.toLocaleString()} sats → ₿itcoin Flagship
              </p>
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : !invoice ? (
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setAmount(p)}
                  className={cn(
                    'rounded-lg border px-2 py-2.5 text-sm font-semibold transition-colors',
                    amount === p
                      ? 'border-bitcoin bg-bitcoin/10 text-bitcoin'
                      : 'border-border text-muted-foreground hover:border-bitcoin/40 hover:text-foreground'
                  )}
                >
                  {p.toLocaleString()}
                </button>
              ))}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                Custom amount (sats)
              </label>
              <Input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Math.floor(Number(e.target.value) || 0)))}
              />
            </div>
            <Button onClick={generateInvoice} disabled={generating || amount < 1} className="w-full">
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating invoice...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" /> Generate Lightning Invoice
                </>
              )}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-xl border border-border bg-white p-3">
                <QRCodeSVG value={invoice.paymentRequest} size={210} />
              </div>
              <p className="text-2xl font-bold">
                {invoice.amountSats.toLocaleString()} <span className="text-base text-bitcoin">sats</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Expires {new Date(invoice.expiresAt).toLocaleTimeString()} · Scan with any Lightning wallet
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
      </DialogContent>
    </Dialog>
  );
}