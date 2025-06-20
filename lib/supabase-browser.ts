import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase.types"

export function createBrowserClient() {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
}
