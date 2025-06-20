import { createClient } from "@supabase/supabase-js"
import type { Database } from "./supabase.types"
import type { cookies as Cookies } from "next/headers"

export function createServerClient(cookies: ReturnType<typeof Cookies>) {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      cookieOptions: {
        name: "sb",
        sameSite: "lax",
      },
    },
    global: { headers: { Cookie: cookies().toString() } },
  })
}
