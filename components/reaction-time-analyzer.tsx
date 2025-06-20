"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

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

export function ReactionTimeAnalyzer({ className }: ReactionTimeAnalyzerProps) {
  // lights array: [yellow1, yellow2, yellow3, green/red, preStage, stage]
  const [lights, setLights] = useState<LightState[]>(["off", "off", "off", "off", "off", "off"])
  const [isStarted, setIsStarted] = useState(false)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [log, setLog] = useState<ReactionLogEntry[]>([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const greenLightTimeRef = useRef<number | null>(null)

  const startSequence = useCallback(() => {
    // Clear any existing timers
    if (timerRef.current) clearTimeout(timerRef.current)

    // Reset states
    setLights(["off", "off", "off", "off", "off", "off"]) // All off
    setIsStarted(true)
    setIsMeasuring(false)
    setReactionTime(null)
    setFeedback(null)
    greenLightTimeRef.current = null

    // Sequence of lights (Full Tree / Sportsman Tree Timing)
    // Total sequence duration: 0.5s (pre-stage) + 1.0s (stage) + 0.5s (Y1) + 0.5s (Y2) + 0.5s (Y3) + 0.5s (Green) = 3.5s

    // 0.5s: Pre-stage on (lights[4])
    timerRef.current = setTimeout(() => {
      setLights((prev) => {
        const newLights = [...prev]
        newLights[4] = "yellow"
        return newLights
      })
    }, 500)

    // 1.5s: Stage on (lights[5])
    timerRef.current = setTimeout(() => {
      setLights((prev) => {
        const newLights = [...prev]
        newLights[5] = "yellow"
        return newLights
      })
    }, 1500)

    // 2.0s: Yellow 1 on (lights[0])
    timerRef.current = setTimeout(() => {
      setLights((prev) => {
        const newLights = [...prev]
        newLights[0] = "yellow"
        return newLights
      })
    }, 2000)

    // 2.5s: Yellow 2 on (lights[1])
    timerRef.current = setTimeout(() => {
      setLights((prev) => {
        const newLights = [...prev]
        newLights[1] = "yellow"
        return newLights
      })
    }, 2500)

    // 3.0s: Yellow 3 on (lights[2])
    timerRef.current = setTimeout(() => {
      setLights((prev) => {
        const newLights = [...prev]
        newLights[2] = "yellow"
        return newLights
      })
    }, 3000)

    // 3.5s: All yellows off, Green on (lights[3])
    timerRef.current = setTimeout(() => {
      setLights((prev) => {
        const newLights = [...prev]
        newLights[0] = "off" // Turn off all yellows
        newLights[1] = "off"
        newLights[2] = "off"
        newLights[3] = "green" // Green light
        return newLights
      })
      greenLightTimeRef.current = performance.now() // Mark green light time
      setIsMeasuring(true) // Now we are measuring
      console.log("Green light on at:", greenLightTimeRef.current) // Debugging log
    }, 3500)
  }, [])

  const handleReaction = useCallback(() => {
    if (!isStarted) return // Do nothing if sequence hasn't started

    // Clear any pending green light timer if a reaction occurs
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null // Ensure it's nullified
    }

    if (greenLightTimeRef.current === null) {
      // User reacted before green light (red light)
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
      if (!isMeasuring) return // Prevent multiple reactions after green

      const reaction = performance.now() - greenLightTimeRef.current
      setReactionTime(reaction)
      setIsMeasuring(false) // Stop measuring after first valid reaction
      setIsStarted(false) // Sequence ends

      let result: "perfect" | "early" | "late" = "late"
      if (reaction >= 0 && reaction <= 50) {
        // 0.000 to 0.050 seconds (50ms) is considered a perfect reaction
        setFeedback(`PERFECT! (+${reaction.toFixed(3)}s)`)
        result = "perfect"
      } else {
        setFeedback(`TOO LATE! (+${reaction.toFixed(3)}s)`)
        result = "late"
      }

      setLog((prev) => [
        { id: prev.length + 1, date: new Date().toLocaleTimeString(), time: reaction, result },
        ...prev,
      ])
    }
  }, [isStarted, isMeasuring])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        handleReaction()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null // Ensure it's nullified on cleanup
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
        <CardTitle>Christmas Tree Simulator</CardTitle>
        <CardDescription className="text-gray-400">
          Click "Start" and hit any key or click the screen when the green light comes on.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Pre-Stage and Stage Lights (smaller) */}
          <div className="flex flex-col items-center space-y-1">
            <motion.div
              className={cn(
                "w-4 h-4 rounded-full border-2 border-zinc-700",
                lights[4] === "yellow" && "bg-yellow-500 shadow-md shadow-yellow-500/50",
              )}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: lights[4] === "yellow" ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className={cn(
                "w-4 h-4 rounded-full border-2 border-zinc-700",
                lights[5] === "yellow" && "bg-yellow-500 shadow-md shadow-yellow-500/50",
              )}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: lights[5] === "yellow" ? 1 : 0.5 }}
              transition={{ duration: 0.2 }}
            />
          </div>

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
              setLights(["off", "off", "off", "off", "off", "off"])
              setReactionTime(null)
              setFeedback(null)
              if (timerRef.current) clearTimeout(timerRef.current)
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
      </CardContent>
    </Card>
  )
}
