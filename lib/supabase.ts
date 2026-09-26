import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface WallComment {
  id: string;
  postId: string;
  author: string;
  body: string;
  createdAt: string;
}

let client: SupabaseClient | null | undefined;

export function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Returns null when the project is not configured, so callers can fall back to sample data. */
export function supabase(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = supabaseUrl();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    client = null;
    return client;
  }

  client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

const VISITOR_KEY = 'bf_visitor_id';

/** Anonymous per-browser id. Lets us count one like per visitor without accounts. */
export function visitorId(): string {
  if (typeof window === 'undefined') return 'server';

  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  window.localStorage.setItem(VISITOR_KEY, id);
  return id;
}

export function storedDisplayName(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem('bf_display_name') ?? '';
}

export function rememberDisplayName(name: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('bf_display_name', name);
}

function mapComment(row: Record<string, unknown>): WallComment {
  return {
    id: String(row.id),
    postId: String(row.post_id),
    author: String(row.author ?? 'anon'),
    body: String(row.body ?? ''),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function fetchComments(postId: string): Promise<WallComment[]> {
  const db = supabase();
  if (!db) return [];

  const { data, error } = await db
    .from('post_comments')
    .select('id, post_id, author, body, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
    .limit(200);

  if (error) throw error;
  return (data ?? []).map((row) => mapComment(row as Record<string, unknown>));
}

export async function addComment(
  postId: string,
  author: string,
  body: string
): Promise<WallComment> {
  const db = supabase();
  if (!db) throw new Error('Supabase is not configured');

  const { data, error } = await db
    .from('post_comments')
    .insert({ post_id: postId, author, body, visitor_id: visitorId() })
    .select('id, post_id, author, body, created_at')
    .single();

  if (error) throw error;
  return mapComment(data as Record<string, unknown>);
}

export async function fetchLikedPostIds(): Promise<string[]> {
  const db = supabase();
  if (!db) return [];

  const { data, error } = await db.from('post_likes').select('post_id').eq('visitor_id', visitorId());
  if (error) throw error;
  return (data ?? []).map((row) => String((row as { post_id: string }).post_id));
}

export async function toggleLike(postId: string, liked: boolean): Promise<void> {
  const db = supabase();
  if (!db) throw new Error('Supabase is not configured');

  if (liked) {
    const { error } = await db.from('post_likes').insert({ post_id: postId, visitor_id: visitorId() });
    if (error) throw error;
    return;
  }

  const { error } = await db
    .from('post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('visitor_id', visitorId());
  if (error) throw error;
}

export async function fetchLikeCount(postId: string): Promise<number> {
  const db = supabase();
  if (!db) return 0;

  const { count, error } = await db
    .from('post_likes')
    .select('post_id', { count: 'exact', head: true })
    .eq('post_id', postId);
  if (error) throw error;
  return count ?? 0;
}

export async function fetchTipTotal(postId: string): Promise<number> {
  const db = supabase();
  if (!db) return 0;

  const { data, error } = await db
    .from('tips')
    .select('amount_sats')
    .eq('post_id', postId)
    .eq('status', 'paid');
  if (error) throw error;

  return (data ?? []).reduce((total, row) => total + Number(row.amount_sats), 0);
}
