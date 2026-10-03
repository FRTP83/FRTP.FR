import { createClient } from "@supabase/supabase-js";

// A local preview never creates a client connected to the production database.
export const isLocalPreview = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_FRTP_LOCAL_PREVIEW === "true";
const supabaseUrl = isLocalPreview ? "http://localhost:3000/api/local-db" : process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = isLocalPreview ? "local-preview" : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export function getSupabaseAdmin() {
  const serviceRoleKey = isLocalPreview ? "local-preview" : process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
