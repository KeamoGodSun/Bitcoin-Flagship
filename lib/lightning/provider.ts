import crypto from 'node:crypto';
import { siteConfig } from '@/lib/config';

export interface Invoice {
  id: string;
  paymentHash: string;
  paymentRequest: string;
  amountSats: number;
  memo: string;
  status: 'pending' | 'paid' | 'expired' | 'not_found';
  createdAt: string;
  expiresAt: string;
}

export interface PaymentStatus {
  invoiceId: string;
  paid: boolean;
  amountSats: number;
  settledAt: string | null;
  status: Invoice['status'];
}

interface CreateInvoiceOptions {
  amountSats: number;
  memo?: string;
}

interface MockInvoice extends Invoice {
  paidAt?: string;
}

const mockStore = new Map<string, MockInvoice>();

function createMockInvoice({ amountSats, memo }: CreateInvoiceOptions): Invoice {
  const now = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const paymentHash = crypto
    .createHash('sha256')
    .update(`${amountSats}:${memo}:${nonce}`)
    .digest('hex');
  const expiresAt = new Date(now + 60 * 60 * 1000);

  const invoice: MockInvoice = {
    id: `mock_${nonce.slice(0, 8)}`,
    paymentHash,
    paymentRequest: `lnbc${amountSats}0n1pmockyp${nonce.slice(0, 20)}`,
    amountSats,
    memo: memo || 'Tip',
    status: 'pending',
    createdAt: new Date(now).toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
  mockStore.set(paymentHash, invoice);
  return invoice;
}

function mockLookup(paymentHash: string): PaymentStatus {
  const invoice = mockStore.get(paymentHash);
  if (!invoice) {
    return {
      invoiceId: paymentHash,
      paid: false,
      amountSats: 0,
      settledAt: null,
      status: 'not_found',
    };
  }
  return {
    invoiceId: invoice.id,
    paid: invoice.status === 'paid',
    amountSats: invoice.amountSats,
    settledAt: invoice.paidAt || null,
    status: invoice.status,
  };
}

function mockSimulate(paymentHash: string): PaymentStatus {
  const invoice = mockStore.get(paymentHash);
  if (!invoice) return mockLookup(paymentHash);
  invoice.status = 'paid';
  invoice.paidAt = new Date().toISOString();
  return mockLookup(paymentHash);
}

function makeLndAgent() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const https = require('node:https') as typeof import('node:https');
  if (siteConfig.lnd.tlsCertBase64) {
    const cert = Buffer.from(siteConfig.lnd.tlsCertBase64, 'base64').toString('utf8');
    return new https.Agent({ ca: cert, rejectUnauthorized: true });
  }
  // Local dev fallback — LND ships a self-signed cert
  return new https.Agent({ rejectUnauthorized: false });
}

async function createLndInvoice({ amountSats, memo }: CreateInvoiceOptions): Promise<Invoice> {
  const { host, macaroon } = siteConfig.lnd;
  if (!host || !macaroon) {
    throw new Error('LND provider not configured — set LND_HOST and LND_MACAROON');
  }
  const res = await fetch(`${host.replace(/\/+$/, '')}/v1/invoices`, {
    method: 'POST',
    headers: {
      'Grpc-Metadata-macaroon': macaroon,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: amountSats, memo: memo || 'Tip', expiry: 3600 }),
    agent: makeLndAgent(),
  } as RequestInit & { agent: unknown });
  if (!res.ok) {
    throw new Error(`LND create invoice failed: ${res.status} ${await res.text()}`);
  }
  const result = await res.json();
  const paymentHash = Array.isArray(result.r_hash)
    ? Buffer.from(result.r_hash).toString('hex')
    : result.r_hash || result.payment_hash;

  return {
    id: String(result.add_index || paymentHash),
    paymentHash,
    paymentRequest: result.payment_request,
    amountSats,
    memo: memo || 'Tip',
    status: 'pending',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (Number(result.expiry) || 3600) * 1000).toISOString(),
  };
}

async function lndLookup(paymentHash: string): Promise<PaymentStatus> {
  const { host, macaroon } = siteConfig.lnd;
  try {
    const res = await fetch(`${host.replace(/\/+$/, '')}/v1/invoice/${paymentHash}`, {
      headers: { 'Grpc-Metadata-macaroon': macaroon },
      agent: makeLndAgent(),
    } as RequestInit & { agent: unknown });
    if (!res.ok) {
      return { invoiceId: paymentHash, paid: false, amountSats: 0, settledAt: null, status: 'not_found' };
    }
    const result = await res.json();
    const settled = result.state === 'SETTLED';
    return {
      invoiceId: paymentHash,
      paid: settled,
      amountSats: Number(result.value || 0),
      settledAt: settled ? new Date((result.settle_date || Date.now()) * 1000).toISOString() : null,
      status: settled ? 'paid' : 'pending',
    };
  } catch {
    return { invoiceId: paymentHash, paid: false, amountSats: 0, settledAt: null, status: 'pending' };
  }
}

async function createBTCPayInvoice({ amountSats, memo }: CreateInvoiceOptions): Promise<Invoice> {
  const { url, apiKey, storeId } = siteConfig.btcpayserver;
  if (!url || !apiKey) {
    throw new Error('BTCPay provider not configured — set BTCPAY_URL, BTCPAY_API_KEY, BTCPAY_STORE_ID');
  }
  const res = await fetch(`${url.replace(/\/+$/, '')}/api/v1/stores/${storeId}/invoices`, {
    method: 'POST',
    headers: {
      Authorization: `token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountSats / 100_000_000,
      currency: 'BTC',
      metadata: { memo: memo || 'Tip' },
      checkout: { lightningMemo: memo || 'Bitcoin Flagship tip' },
    }),
  });
  if (!res.ok) {
    throw new Error(`BTCPay create invoice failed: ${res.status} ${await res.text()}`);
  }
  const result = await res.json();
  return {
    id: result.id,
    paymentHash: result.id,
    paymentRequest: result.checkout?.BNB || result.lightningAddress || result.id,
    amountSats,
    memo: memo || 'Tip',
    status: 'pending',
    createdAt: result.createdTime
      ? new Date(result.createdTime * 1000).toISOString()
      : new Date().toISOString(),
    expiresAt: result.expirationTime
      ? new Date(result.expirationTime * 1000).toISOString()
      : new Date(Date.now() + 3600 * 1000).toISOString(),
  };
}

async function btcpayLookup(paymentHash: string): Promise<PaymentStatus> {
  const { url, apiKey, storeId } = siteConfig.btcpayserver;
  try {
    const res = await fetch(
      `${url.replace(/\/+$/, '')}/api/v1/stores/${storeId}/invoices/${paymentHash}`,
      { headers: { Authorization: `token ${apiKey}` } }
    );
    if (!res.ok) {
      return { invoiceId: paymentHash, paid: false, amountSats: 0, settledAt: null, status: 'not_found' };
    }
    const result = await res.json();
    const status = String(result.status || '');
    const paid = status === 'Settled' || status === 'Complete' || status === 'Processing';
    return {
      invoiceId: paymentHash,
      paid,
      amountSats: Math.round(Number(result.amount || result.invoiceAmount || 0) * 100_000_000),
      settledAt: paid ? new Date().toISOString() : null,
      status: paid ? 'paid' : 'pending',
    };
  } catch {
    return { invoiceId: paymentHash, paid: false, amountSats: 0, settledAt: null, status: 'pending' };
  }
}

export async function createInvoice(opts: CreateInvoiceOptions): Promise<Invoice> {
  switch (siteConfig.lightningProvider) {
    case 'lnd':
      return createLndInvoice(opts);
    case 'btcpayserver':
      return createBTCPayInvoice(opts);
    case 'mock':
    default:
      return createMockInvoice(opts);
  }
}

export async function lookupInvoice(paymentHash: string): Promise<PaymentStatus> {
  switch (siteConfig.lightningProvider) {
    case 'lnd':
      return lndLookup(paymentHash);
    case 'btcpayserver':
      return btcpayLookup(paymentHash);
    case 'mock':
    default:
      return mockLookup(paymentHash);
  }
}

export function simulateInvoice(paymentHash: string): PaymentStatus {
  if (siteConfig.lightningProvider !== 'mock') {
    throw new Error('Simulation is only available in mock mode');
  }
  return mockSimulate(paymentHash);
}

export function providerName(): string {
  return siteConfig.lightningProvider;
}