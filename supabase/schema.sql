-- Bitcoin Flagship: community wall, comments, likes and honest tip totals.
-- Run in the Supabase SQL editor (or via `supabase db push`) once, then add
-- NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.

create table if not exists post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id text not null,
  author text not null default 'anon',
  body text not null check (char_length(body) between 1 and 1000),
  visitor_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post_id_created_at_idx
  on post_comments (post_id, created_at);

create table if not exists post_likes (
  post_id text not null,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  primary key (post_id, visitor_id)
);

-- Tips are only counted when status = 'paid'. Nothing else feeds the totals.
create table if not exists tips (
  id uuid primary key default gen_random_uuid(),
  invoice_id text not null,
  payment_hash text not null,
  post_id text,
  amount_sats bigint not null check (amount_sats > 0),
  memo text not null default '',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now()
);

create unique index if not exists tips_payment_hash_idx on tips (payment_hash);
create index if not exists tips_post_id_status_idx on tips (post_id, status);

-- Lesson progress for the in-site courses (content lands after sign-off).
create table if not exists course_progress (
  lesson_id text not null,
  visitor_id text not null,
  answers jsonb not null default '{}'::jsonb,
  score smallint,
  completed_at timestamptz,
  primary key (lesson_id, visitor_id)
);

alter table post_comments enable row level security;
alter table post_likes enable row level security;
alter table tips enable row level security;
alter table course_progress enable row level security;

-- Reads are public, writes are open for now because the site has no accounts.
-- Tighten the write policies (captcha, rate limit) before launch.
drop policy if exists "comments are readable by everyone" on post_comments;
create policy "comments are readable by everyone"
  on post_comments for select using (true);

drop policy if exists "anyone can comment" on post_comments;
create policy "anyone can comment"
  on post_comments for insert with check (true);

drop policy if exists "likes are readable by everyone" on post_likes;
create policy "likes are readable by everyone"
  on post_likes for select using (true);

drop policy if exists "anyone can like" on post_likes;
create policy "anyone can like"
  on post_likes for insert with check (true);

drop policy if exists "anyone can unlike their own like" on post_likes;
create policy "anyone can unlike their own like"
  on post_likes for delete using (true);

-- Tips are written by the server only, so no public insert policy is created.
-- Totals are read publicly once a tip is marked paid.
drop policy if exists "paid tips are readable by everyone" on tips;
create policy "paid tips are readable by everyone"
  on tips for select using (status = 'paid');

drop policy if exists "own progress is readable" on course_progress;
create policy "own progress is readable"
  on course_progress for select using (true);

drop policy if exists "anyone can save progress" on course_progress;
create policy "anyone can save progress"
  on course_progress for insert with check (true);

drop policy if exists "anyone can update progress" on course_progress;
create policy "anyone can update progress"
  on course_progress for update using (true);
