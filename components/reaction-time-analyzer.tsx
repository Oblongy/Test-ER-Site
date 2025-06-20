"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, RefreshCw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { submitReactionTime, getTopReactionTimes } from "@/actions/reaction-times"

interface ReactionTimeAnalyzerProps {
  className?: string
}

type LightState = "off" | "yellow" | "green" | "red"

interface ReactionLogEntry {
  id: number
  date: string
  time: number
  result: "perfect" | "early" | "late"
}

interface LeaderboardEntry {
  id: string
  username: string
  reaction_time: number
  result: string
  created_at: string
}

export function ReactionTimeAnalyzer({ className }: ReactionTimeAnalyzerProps) {
  const [lights, setLights] = useState<LightState[]>(["off", "off", "off", "off"]) // Y1, Y2, Y3, Go/Red
  const [isStarted, setIsStarted] = useState(false)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [log, setLog] = useState<ReactionLogEntry[]>([])
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [username, setUsername] = useState("")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true)

  const greenLightTimerRef = useRef<NodeJS.Timeout | null>(null) // Specific ref for the green light timer
  const greenLightTimeRef = useRef<number | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    setIsLoadingLeaderboard(true)
    const { data, success } = await getTopReactionTimes(10)
    if (success) {
      setLeaderboard(data as LeaderboardEntry[])
    }
    setIsLoadingLeaderboard(false)
  }, [])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const startSequence = useCallback(() => {
    console.log("--- Starting new sequence ---")
    // Clear any existing green light timer
    if (greenLightTimerRef.current) {
      clearTimeout(greenLightTimerRef.current)
      greenLightTimerRef.current = null
      console.log("Cleared previous green light timer.")
    }

    // Reset states
    setLights(["off", "off", "off", "off"]) // All off
    setIsStarted(true)
    setIsMeasuring(false)
    setReactionTime(null)
    setFeedback(null)
    greenLightTimeRef.current = null
    setShowSubmitDialog(false) // Close dialog if open

    // Sportsman Tree Timing: Yellows sequentially, then green after 0.5s from last yellow
    let currentDelay = 0
    const lightInterval = 500 // 0.5 seconds between lights

    // Yellow 1
    setTimeout(
      () => {
        setLights((prev) => {
          const newLights = [...prev]
          newLights[0] = "yellow"
          return newLights
        })
        console.log("Yellow 1 on at", currentDelay + lightInterval, "ms")
      },
      (currentDelay += lightInterval),
    )

    // Yellow 2
    setTimeout(
      () => {
        setLights((prev) => {
          const newLights = [...prev]
          newLights[1] = "yellow"
          return newLights
        })
        console.log("Yellow 2 on at", currentDelay + lightInterval, "ms")
      },
      (currentDelay += lightInterval),
    )

    // Yellow 3
    setTimeout(
      () => {
        setLights((prev) => {
          const newLights = [...prev]
          newLights[2] = "yellow"
          return newLights
        })
        console.log("Yellow 3 on at", currentDelay + lightInterval, "ms")
      },
      (currentDelay += lightInterval),
    )

    // Green Light
    const greenLightDelay = currentDelay + lightInterval
    console.log("Setting green light timer for", greenLightDelay, "ms")
    greenLightTimerRef.current = setTimeout(() => {
      console.log("Green light setTimeout callback fired!")
      setLights((prev) => {
        const newLights = [...prev]
        newLights[0] = "off" // Turn off all yellows
        newLights[1] = "off"
        newLights[2] = "off"
        newLights[3] = "green" // Green light
        console.log("Lights state after green:", newLights)
        return newLights
      })
      greenLightTimeRef.current = performance.now() // Mark green light time
      setIsMeasuring(true) // Now we are measuring
      console.log("Green light time set:", greenLightTimeRef.current)
    }, greenLightDelay)
  }, [])

  const handleReaction = useCallback(() => {
    console.log(
      "handleReaction called. isStarted:",
      isStarted,
      "isMeasuring:",
      isMeasuring,
      "greenLightTimeRef.current:",
      greenLightTimeRef.current,
    )
    if (!isStarted) return // Do nothing if sequence hasn't started

    if (greenLightTimeRef.current === null) {
      // User reacted before green light (red light)
      console.log("RED LIGHT path taken.")
      // Clear the pending green light timer if it exists
      if (greenLightTimerRef.current) {
        clearTimeout(greenLightTimerRef.current)
        greenLightTimerRef.current = null
        console.log("Cleared pending green light timer due to red light.")
      }

      setLights((prev) => {
        const newLights = [...prev]
        newLights[0] = "off" // Turn off yellows
        newLights[1] = "off"
        newLights[2] = "off"
        newLights[3] = "red" // Turn on red light
        return newLights
      })
      setFeedback("RED LIGHT! (-0.000)")
      setReactionTime(0) // Reaction time for red light is typically 0.000 or negative
      setIsStarted(false) // Sequence ends
      setIsMeasuring(false) // Stop measuring
      setLog((prev) => [
        { id: prev.length + 1, date: new Date().toLocaleTimeString(), time: 0, result: "early" },
        ...prev,
      ])
    } else {
      // User reacted after green light (or exactly on it)
      console.log("GREEN LIGHT path taken.")
      if (!isMeasuring) {
        console.log("Not measuring, returning to prevent multiple reactions.")
        return // Prevent multiple reactions after green
      }

      const reaction = performance.now() - greenLightTimeRef.current
      setReactionTime(reaction)
      setIsMeasuring(false) // Stop measuring after first valid reaction
      setIsStarted(false) // Sequence ends

      let result: "perfect" | "early" | "late" = "late"
      if (reaction >= 0 && reaction <= 50) {
        // 0.000 to 0.050 seconds (50ms) is considered a perfect reaction
        setFeedback(`PERFECT! (+${reaction.toFixed(3)}s)`)
        result = "perfect"
        setShowSubmitDialog(true) // Show dialog for perfect reaction
      } else {
        setFeedback(`TOO LATE! (+${reaction.toFixed(3)}s)`)
        result = "late"
      }

      setLog((prev) => [
        { id: prev.length + 1, date: new Date().toLocaleTimeString(), time: reaction, result },
        ...prev,
      ])
    }
  }, [isStarted, isMeasuring, log, setShowSubmitDialog])

  const handleSubmitScore = async () => {
    if (!username.trim() || reactionTime === null) return

    const latestLogEntry = log[0] // Get the most recent entry
    if (!latestLogEntry) return

    const { success, message } = await submitReactionTime({
      username: username.trim(),
      reaction_time: Number.parseFloat(latestLogEntry.time.toFixed(3)),
      result: latestLogEntry.result,
    })

    if (success) {
      console.log(message)
      setShowSubmitDialog(false)
      setUsername("")
      fetchLeaderboard() // Refresh leaderboard after submission
    } else {
      console.error(message)
      // Optionally show an error toast
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        handleReaction()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      // Clear the green light timer if the component unmounts or dependencies change
      if (greenLightTimerRef.current) {
        clearTimeout(greenLightTimerRef.current)
        greenLightTimerRef.current = null
        console.log("Cleanup: Cleared green light timer.")
      }
    }
  }, [handleReaction])

  const getFeedbackColor = (result: "perfect" | "early" | "late") => {
    if (result === "perfect") return "text-green-500"
    if (result === "early") return "text-red-500"
    return "text-yellow-500"
  }

  return (
    <Card className={cn("bg-zinc-900 text-white", className)}>
      <CardHeader>
        <CardTitle>Sportsman Tree Simulator</CardTitle>
        <CardDescription className="text-gray-400">
          Click "Start" and hit any key or click the screen when the green light comes on.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Main Yellow Lights (larger) */}
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              className={cn(
                "w-12 h-12 rounded-full border-4 border-zinc-700",
                lights[0] === "yellow" && "bg-yellow-500 shadow-lg shadow-yellow-500/50",
              )}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: lights[0] === "yellow" ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className={cn(
                "w-12 h-12 rounded-full border-4 border-zinc-700",
                lights[1] === "yellow" && "bg-yellow-500 shadow-lg shadow-yellow-500/50",
              )}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: lights[1] === "yellow" ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className={cn(
                "w-12 h-12 rounded-full border-4 border-zinc-700",
                lights[2] === "yellow" && "bg-yellow-500 shadow-lg shadow-yellow-500/50",
              )}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: lights[2] === "yellow" ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          {/* Go/Red Light (largest) */}
          <motion.div
            className={cn(
              "w-20 h-20 rounded-full border-4 border-zinc-700",
              lights[3] === "green" && "bg-green-500 shadow-xl shadow-green-500/50",
              lights[3] === "red" && "bg-red-600 shadow-xl shadow-red-600/50",
            )}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: lights[3] !== "off" ? 1 : 0.8,
              opacity: lights[3] !== "off" ? 1 : 0.5,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={handleReaction}
          />
        </div>

        <div className="text-center space-y-2">
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.p
                key="feedback"
                className={cn("text-xl font-bold", getFeedbackColor(log[0]?.result || "late"))}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {feedback}
              </motion.p>
            )}
            {reactionTime !== null && (
              <motion.p
                key="reactionTime"
                className="text-4xl font-extrabold text-white tabular-nums"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {reactionTime.toFixed(3)}s
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={startSequence}
            disabled={isStarted || isMeasuring}
          >
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
          <Button
            variant="outline"
            className="bg-black text-red-600 hover:bg-red-950/20"
            onClick={() => {
              setIsStarted(false)
              setIsMeasuring(false)
              setLights(["off", "off", "off", "off"]) // Reset all 4 lights
              setReactionTime(null)
              setFeedback(null)
              if (greenLightTimerRef.current) {
                clearTimeout(greenLightTimerRef.current)
                greenLightTimerRef.current = null
                console.log("Reset button: Cleared green light timer.")
              }
              setShowSubmitDialog(false) // Close dialog on reset
            }}
            disabled={!isStarted && !isMeasuring && reactionTime === null}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Reaction Log</h3>
          {log.length === 0 ? (
            <p className="text-center text-gray-500">No runs logged yet.</p>
          ) : (
            <div className="max-h-[200px] overflow-y-auto pr-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-gray-400">
                    <th className="py-2 text-left">Time</th>
                    <th className="py-2 text-left">Reaction (s)</th>
                    <th className="py-2 text-left">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((entry) => (
                    <tr key={entry.id} className="border-b border-zinc-800">
                      <td className="py-2">{entry.date}</td>
                      <td className="py-2 tabular-nums">{entry.time.toFixed(3)}</td>
                      <td className={cn("py-2 font-medium", getFeedbackColor(entry.result))}>
                        {entry.result.toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" /> Global Leaderboard
          </h3>
          {isLoadingLeaderboard ? (
            <p className="text-center text-gray-500">Loading leaderboard...</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-center text-gray-500">No scores on the leaderboard yet. Be the first!</p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto pr-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 text-gray-400">
                    <th className="py-2 text-left">Rank</th>
                    <th className="py-2 text-left">Username</th>
                    <th className="py-2 text-left">Reaction (s)</th>
                    <th className="py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr key={entry.id} className="border-b border-zinc-800">
                      <td className="py-2">{index + 1}</td>
                      <td className="py-2 font-medium">{entry.username}</td>
                      <td className="py-2 tabular-nums">{entry.reaction_time.toFixed(3)}</td>
                      <td className="py-2 text-gray-500">{new Date(entry.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
            <DialogHeader>
              <DialogTitle>Submit Your Score!</DialogTitle>
              <DialogDescription className="text-gray-400">
                You got a perfect reaction time! Enter your username to add your score to the global leaderboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                  placeholder="Your racing name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Reaction Time</Label>
                <Input
                  value={reactionTime !== null ? reactionTime.toFixed(3) : ""}
                  readOnly
                  className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleSubmitScore}
                disabled={!username.trim() || reactionTime === null}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Submit Score
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
