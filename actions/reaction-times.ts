"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface ReactionTimeEntry {
  username: string
  reaction_time: number
  result: string
}

export async function submitReactionTime(entry: ReactionTimeEntry) {
  const supabase = createServerClient()
  const { data, error } = await supabase.from("reaction_times").insert([entry]).select()

  if (error) {
    console.error("Error submitting reaction time:", error)
    return { success: false, message: error.message }
  }

  revalidatePath("/tuning-hub") // Revalidate the page to show updated leaderboard
  return { success: true, message: "Reaction time submitted!", data }
}

export async function getTopReactionTimes(limit = 10) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("reaction_times")
    .select("id, username, reaction_time, result, created_at")
    .order("reaction_time", { ascending: true }) // Lower reaction time is better
    .limit(limit)

  if (error) {
    console.error("Error fetching top reaction times:", error)
    return { success: false, message: error.message, data: [] }
  }

  return { success: true, data }
}
