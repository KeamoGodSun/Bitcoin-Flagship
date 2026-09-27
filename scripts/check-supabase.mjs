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

const supabaseVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

// .env.local is the default, but real environment variables win, so a one-off
// run against the local Docker stack does not mean editing the file that holds
// the production keys.
const env = {
  ...readEnv(envFile),
  ...Object.fromEntries(
    Object.entries(process.env).filter(([key, value]) => supabaseVars.includes(key) && value)
  ),
};

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
  console.log('Then apply the migrations in supabase/migrations (supabase db push), and re-run:');
  console.log('npm run check:supabase');
  process.exit(1);
}

const db = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Hoisted so the cleanup block can reach it. Row level security blocks anon
// deletes on several of these tables, so cleanup has to run as the service role.
const admin = serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : null;

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

// The wall-post path is the only one with restrictive row level security, so it
// gets its own coverage. The insert must succeed, and the row must stay
// invisible to the public until a moderator approves it. Widening the select
// policy to make the insert readable would pass the first check and leak
// unmoderated content, so both halves are asserted here.
const { error: submitError } = await db.from('wall_posts').insert({
  author: 'self-test',
  handle: '',
  content: 'self-test post awaiting moderation',
  tags: ['selftest'],
  visitor_id: visitorA,
});

report(!submitError, 'anon key can submit a wall post', submitError?.message ?? '');

const { data: leaked, error: leakError } = await db
  .from('wall_posts')
  .select('id')
  .eq('visitor_id', visitorA)
  .limit(1);

report(
  !leakError && (leaked ?? []).length === 0,
  'a pending post stays invisible to the public',
  leakError?.message ?? `anon could read ${(leaked ?? []).length} pending row(s)`,
);

const { error: selfApproveError } = await db.from('wall_posts').insert({
  author: 'self-test',
  handle: '',
  content: 'self-test trying to approve itself',
  tags: [],
  visitor_id: visitorB,
  status: 'approved',
});

report(
  Boolean(selfApproveError),
  'anon key cannot self-approve a post',
  selfApproveError ? 'blocked as intended' : 'PROBLEM: a visitor approved its own post',
);

const { error: anonWallDelete } = await db.from('wall_posts').delete().eq('visitor_id', visitorA);

report(
  Boolean(anonWallDelete),
  'anon key cannot delete a wall post',
  anonWallDelete ? 'blocked as intended' : 'PROBLEM: anon delete was allowed',
);

if (admin) {
  const { data: adminPending, error: adminPendingError } = await admin
    .from('wall_posts')
    .select('id, status')
    .eq('visitor_id', visitorA)
    .limit(1);

  report(
    !adminPendingError && adminPending?.[0]?.status === 'pending',
    'service role sees the submitted post as pending',
    adminPendingError?.message ?? `status was ${adminPending?.[0]?.status}`,
  );

  const { data: approvedRows, error: approveError } = await admin
    .from('wall_posts')
    .update({ status: 'approved' })
    .eq('visitor_id', visitorA)
    .select('id');

  report(!approveError && approvedRows?.length === 1, 'service role can approve the post', approveError?.message ?? '');

  const { data: nowVisible, error: nowVisibleError } = await db
    .from('wall_posts')
    .select('id, content')
    .eq('visitor_id', visitorA)
    .limit(1);

  report(
    !nowVisibleError && nowVisible?.[0]?.content === 'self-test post awaiting moderation',
    'an approved post becomes publicly readable',
    nowVisibleError?.message ?? `anon saw ${(nowVisible ?? []).length} row(s)`,
  );
}

const { error: anonTipError } = await db.from('tips').insert({
  invoice_id: `selftest-${stamp}`,
  payment_hash: `selftest-${stamp}`,
  post_id: postId,
  amount_sats: 1,
  memo: 'self-test',
});

report(Boolean(anonTipError), 'anon key is blocked from writing tips', anonTipError ? 'blocked as intended' : 'PROBLEM: tip insert was allowed');

if (admin) {
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

// post_comments and wall_posts have no anon delete policy, so this has to run as
// the service role. Cleaning up with the anon key failed silently and leaked a
// row on every run while still reporting that cleanup had been done.
await db.from('post_likes').delete().eq('post_id', postId);

if (admin) {
  // Exact ids only. A LIKE on visitor_id would also match real visitors.
  const selfTestVisitors = [visitorA, visitorB];
  const results = await Promise.all([
    admin.from('post_comments').delete().eq('post_id', postId),
    admin.from('tips').delete().eq('post_id', postId),
    admin.from('wall_posts').delete().in('visitor_id', selfTestVisitors),
  ]);
  const problems = results.map((r) => r.error?.message).filter(Boolean);
  report(problems.length === 0, 'self-test rows removed', problems.join('; '));
} else {
  report(false, 'self-test rows removed', 'SUPABASE_SERVICE_ROLE_KEY is not set, so rows cannot be cleaned up');
}

console.log('');
if (failures > 0) {
  console.log(`${failures} check(s) failed. If reads or writes fail, apply the migrations in supabase/migrations.`);
  process.exit(1);
}
console.log('All checks passed. Restart the dev server so the site picks up the env.');
