import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null | undefined;

/**
 * Server-only client for writes the browser must not perform (recording tips).
 * Uses the service role key, so it must never be imported from a client component.
 */
export function supabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    client = null;
    return client;
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export async function recordPendingTip(tip: {
  paymentHash: string;
  invoiceId: string;
  postId?: string | null;
  amountSats: number;
  memo: string;
}): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;

  const { error } = await db.from('tips').insert({
    payment_hash: tip.paymentHash,
    invoice_id: tip.invoiceId,
    post_id: tip.postId ?? null,
    amount_sats: tip.amountSats,
    memo: tip.memo,
    status: 'pending',
  });
  if (error) throw error;
}

export async function markTipPaid(paymentHash: string): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;

  const { error } = await db.from('tips').update({ status: 'paid' }).eq('payment_hash', paymentHash);
  if (error) throw error;
}
