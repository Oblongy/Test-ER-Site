import { createClient } from "@supabase/supabase-js"

// Note: These environment variables are automatically available in your Vercel deployment.
// For local development, ensure they are set in your .env.local file.
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Server-side client for authenticated actions (e.g., inserting data)
export const createServerClient = () =>
  createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
    },
  })

// Client-side client for public actions (e.g., fetching public data)
export const createBrowserClient = () => createClient(supabaseUrl, supabaseAnonKey)
