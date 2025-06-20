"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, CheckCircle } from "lucide-react"

type TestStatus = "idle" | "preparing" | "measuring" | "result"

export function ReactionTimeAnalyzer() {
  const [status, setStatus] = useState<TestStatus>("idle")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [foulAmount, setFoulAmount] = useState<number | null>(null) // New state for foul amount
  const [lightSequence, setLightSequence] = useState<("off" | "yellow" | "green" | "red")[]>(["off", "off", "off"])

  const greenLightTimeRef = useRef<number | null>(null)
  const timeoutRefs = useRef<NodeJS.Timeout[]>([])

  const clearTimers = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []
  }, [])

  const startTest = useCallback(() => {
    clearTimers()
    setStatus("preparing")
    setReactionTime(null)
    setFoulAmount(null)
    setLightSequence(["off", "off", "off"])
    greenLightTimeRef.current = null

    const yellowLightDelay = 500 // ms between yellow lights
    const minGreenDelay = 1000 // min ms after last yellow for green
    const maxGreenDelay = 3000 // max ms after last yellow for green

    // Yellow 1
    timeoutRefs.current.push(
      setTimeout(() => {
        setLightSequence(["yellow", "off", "off"])
      }, yellowLightDelay),
    )

    // Yellow 2
    timeoutRefs.current.push(
      setTimeout(() => {
        setLightSequence(["yellow", "yellow", "off"])
      }, yellowLightDelay * 2),
    )

    // Yellow 3
    timeoutRefs.current.push(
      setTimeout(() => {
        setLightSequence(["yellow", "yellow", "yellow"])
      }, yellowLightDelay * 3),
    )

    // Green Light (random delay after last yellow)
    const randomGreenDelay = Math.random() * (maxGreenDelay - minGreenDelay) + minGreenDelay
    timeoutRefs.current.push(
      setTimeout(
        () => {
          setLightSequence(["off", "off", "green"])
          greenLightTimeRef.current = performance.now() // Record the exact time green light appears
          setStatus("measuring")
        },
        yellowLightDelay * 3 + randomGreenDelay,
      ),
    )
  }, [clearTimers])

  const handleReaction = useCallback(() => {
    if (status === "measuring") {
      const reactionEndTime = performance.now()
      if (greenLightTimeRef.current !== null) {
        const rt = reactionEndTime - greenLightTimeRef.current
        setReactionTime(rt)
        setStatus("result")
        clearTimers() // Clear any pending green light timers
      }
    } else if (status === "preparing") {
      // Red light scenario: reacted before green light
      clearTimers() // Clear all pending timers
      setLightSequence(["off", "off", "red"]) // Show red light
      const foulTime = greenLightTimeRef.current ? performance.now() - greenLightTimeRef.current : -0.001 // Estimate foul if greenLightTimeRef wasn't set yet
      setFoulAmount(Math.abs(foulTime)) // Store the absolute foul amount
      setReactionTime(foulTime) // Store the negative RT
      setStatus("result")
    }
  }, [status, clearTimers])

  useEffect(() => {
    // Clean up timers on component unmount
    return () => clearTimers()
  }, [clearTimers])

  const getLightColor = (index: number) => {
    const light = lightSequence[index]
    if (light === "yellow") return "bg-yellow-400"
    if (light === "green") return "bg-green-500"
    if (light === "red") return "bg-red-600"
    return "bg-zinc-700" // Off state
  }

  return (
    <Card className="bg-zinc-900 text-white">
      <CardHeader>
        <CardTitle>Reaction Time Analyzer</CardTitle>
        <CardDescription className="text-gray-400">Test and improve your reaction time for the lights.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center items-center space-x-4">
          {lightSequence.map((_, index) => (
            <motion.div
              key={index}
              className={`w-16 h-16 rounded-full ${getLightColor(index)}`}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>

        <div className="text-center">
          {status === "idle" && <p className="text-lg text-gray-300">Click "Start Test" to begin.</p>}
          {status === "preparing" && <p className="text-lg text-yellow-400">Get ready...</p>}
          {status === "measuring" && <p className="text-lg text-green-500">GO! Click as fast as you can!</p>}
          {status === "result" && reactionTime !== null && (
            <div className="space-y-2">
              {reactionTime < 0 ? (
                <>
                  <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                  <p className="text-3xl font-bold text-red-600">RED LIGHT!</p>
                  <p className="text-xl text-red-500">Fouled by: {foulAmount?.toFixed(3)}s</p>
                </>
              ) : (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-3xl font-bold text-green-500">Reaction Time:</p>
                  <p className="text-4xl font-extrabold text-white">{reactionTime.toFixed(3)}s</p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={status === "measuring" || status === "preparing" ? handleReaction : startTest}
            disabled={status === "measuring" && greenLightTimeRef.current === null} // Disable if measuring but green light not yet on
          >
            {status === "idle" || status === "result" ? "Start Test" : "Click to React"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
