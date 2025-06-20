import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic" // ensure fresh data on every load

export default async function ChatPage() {
  const supabase = createServerClient(cookies)
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    redirect("/login")
  }

  // Placeholder until we wire up real-time chat.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">Welcome to the chat room, {data.user.email}!</h1>
      <p className="text-neutral-600">Real-time messages and file sharing coming next 🚀</p>
    </main>
  )
}
