import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Server-side client authenticated with the service-role key: bypasses RLS,
// must never be sent to a browser/frontend.
export function createSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SECRET_KEY must be set"
    );
  }

  return createClient<Database>(url, secretKey, {
    auth: { persistSession: false },
  });
}
