import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const root = process.cwd();
const envFile = join(root, '.env.local');

function readEnv(file) {
  const values = {};
  let raw;
  try {
    raw = readFileSync(file, 'utf8');
  } catch {
    return values;
  }

  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    values[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
  return values;
}

const env = readEnv(envFile);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

let failures = 0;

function report(ok, label, detail = '') {
  if (!ok) failures += 1;
  const mark = ok ? 'PASS' : 'FAIL';
  console.log(`${mark}  ${label}${detail ? ` - ${detail}` : ''}`);
}

if (!url || !anonKey) {
  console.log('Supabase is not configured yet.');
  console.log('');
  console.log('Add these to .env.local (Dashboard -> Project Settings -> API Keys):');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon or publishable key>');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=<service role key>');
  console.log('');
  console.log('Then run supabase/schema.sql in the SQL editor, and re-run: npm run check:supabase');
  process.exit(1);
}

const db = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const stamp = Date.now();
const postId = `selftest-${stamp}`;
const visitorA = `visitor-a-${stamp}`;
const visitorB = `visitor-b-${stamp}`;

const { data: readable, error: readError } = await db.from('post_comments').select('id').limit(1);
report(!readError, 'anon key can read post_comments', readError?.message ?? '');

const { data: inserted, error: insertError } = await db
  .from('post_comments')
  .insert({ post_id: postId, author: 'self-test', body: 'verifying the wall end to end', visitor_id: visitorA })
  .select('id, post_id, author, body')
  .single();

report(!insertError && Boolean(inserted?.id), 'anon key can insert a comment', insertError?.message ?? '');

const { data: fetched, error: fetchError } = await db
  .from('post_comments')
  .select('id, body')
  .eq('post_id', postId)
  .single();

report(!fetchError && fetched?.body === 'verifying the wall end to end', 'comment reads back unchanged', fetchError?.message ?? '');

const { error: likeA } = await db.from('post_likes').insert({ post_id: postId, visitor_id: visitorA });
const { error: likeB } = await db.from('post_likes').insert({ post_id: postId, visitor_id: visitorB });
report(!likeA && !likeB, 'two different visitors can like the same post', likeA?.message ?? likeB?.message ?? '');

const { count, error: countError } = await db
  .from('post_likes')
  .select('post_id', { count: 'exact', head: true })
  .eq('post_id', postId);

report(!countError && count === 2, 'like count is 2', countError?.message ?? `got ${count}`);

const { error: unlikeError } = await db
  .from('post_likes')
  .delete()
  .eq('post_id', postId)
  .eq('visitor_id', visitorB);

report(!unlikeError, 'a visitor can unlike their own like', unlikeError?.message ?? '');

const { error: anonTipError } = await db.from('tips').insert({
  invoice_id: `selftest-${stamp}`,
  payment_hash: `selftest-${stamp}`,
  post_id: postId,
  amount_sats: 1,
  memo: 'self-test',
});

report(Boolean(anonTipError), 'anon key is blocked from writing tips', anonTipError ? 'blocked as intended' : 'PROBLEM: tip insert was allowed');

if (serviceKey) {
  const admin = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: tipError } = await admin.from('tips').insert({
    invoice_id: `selftest-${stamp}`,
    payment_hash: `selftest-${stamp}`,
    post_id: postId,
    amount_sats: 2100,
    memo: 'self-test tip',
    status: 'pending',
  });
  report(!tipError, 'service role can write a tip', tipError?.message ?? '');

  const { data: marked, error: markError } = await admin
    .from('tips')
    .update({ status: 'paid' })
    .eq('payment_hash', `selftest-${stamp}`)
    .select('amount_sats, status');
  report(!markError && marked?.[0]?.status === 'paid', 'tip can be marked paid', markError?.message ?? '');

  const { data: paidTotal, error: totalError } = await admin
    .from('tips')
    .select('amount_sats')
    .eq('post_id', postId)
    .eq('status', 'paid');

  const total = (paidTotal ?? []).reduce((sum, row) => sum + Number(row.amount_sats), 0);
  report(!totalError && total === 2100, 'paid tip total reads 2100', totalError?.message ?? `got ${total}`);
} else {
  console.log('SKIP  service role checks (SUPABASE_SERVICE_ROLE_KEY not set)');
}

await db.from('post_likes').delete().eq('post_id', postId);
await db.from('post_comments').delete().eq('post_id', postId);
if (serviceKey) {
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  await admin.from('tips').delete().eq('post_id', postId);
}
console.log('Cleanup done: self-test rows removed.');

console.log('');
if (failures > 0) {
  console.log(`${failures} check(s) failed. If reads or writes fail, run supabase/schema.sql in the SQL editor.`);
  process.exit(1);
}
console.log('All checks passed. Restart the dev server so the site picks up the env.');
