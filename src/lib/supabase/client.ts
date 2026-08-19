import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient<Database> | null = null;

// Lazily created so importing this module never throws when env vars are
// missing (e.g. during local setup before .env.local is filled in).
export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseConfigured) {
    throw new Error(
      "Supabase no está configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local"
    );
  }
  if (!client) {
    client = createClient<Database>(url!, anonKey!, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return client;
}
