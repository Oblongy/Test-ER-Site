"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Flag, Clock, Gauge } from "lucide-react"

interface RunLogEntry {
  id: number
  date: string
  dialIn: string
  et: string
  mph: string
  rt: string
}

interface BracketSimulatorProps {
  run: RunLogEntry | null // The run to simulate
  dialIn: string // The target dial-in for comparison
}

export function BracketSimulator({ run, dialIn }: BracketSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentET, setCurrentET] = useState(0)
  const [currentMPH, setCurrentMPH] = useState(0)
  const [result, setResult] = useState<string | null>(null)

  const actualET = run ? Number.parseFloat(run.et) : 0
  const actualMPH = run ? Number.parseFloat(run.mph) : 0
  const actualRT = run ? Number.parseFloat(run.rt) : 0
  const targetDialIn = Number.parseFloat(dialIn)

  // Draw the simulation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with proper scaling for high DPI displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    // Set display size (css pixels)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Set up dimensions
    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 30, bottom: 40, left: 60 }
    const trackWidth = width - padding.left - padding.right
    const trackHeight = 80
    const quarterMileDistance = 1320 // feet (for reference, not directly used in linear animation)

    // Draw background - dark gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
    bgGradient.addColorStop(0, "#111111")
    bgGradient.addColorStop(1, "#1a1a1a")
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // Draw track
    const trackY = height / 2 - trackHeight / 2
    ctx.fillStyle = "#222222"
    ctx.fillRect(padding.left, trackY, trackWidth, trackHeight)

    // Draw track markings
    ctx.strokeStyle = "#ffffff"
    ctx.setLineDash([5, 10])
    ctx.beginPath()
    ctx.moveTo(padding.left, trackY + trackHeight / 2)
    ctx.lineTo(padding.left + trackWidth, trackY + trackHeight / 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw start line
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding.left, trackY - 10)
    ctx.lineTo(padding.left, trackY + trackHeight + 10)
    ctx.stroke()
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Start", padding.left, trackY - 15)

    // Draw finish line (quarter mile)
    const finishLineX = padding.left + trackWidth
    ctx.strokeStyle = "#ff4444"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(finishLineX, trackY - 10)
    ctx.lineTo(finishLineX, trackY + trackHeight + 10)
    ctx.stroke()
    ctx.fillStyle = "#ff4444"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Finish (1/4 Mile)", finishLineX, trackY - 15)

    // Draw car position based on animation progress
    if (isAnimating && run) {
      // Calculate car position based on elapsed time
      const totalSimTime = actualET + actualRT // Total time from start light to finish line
      const currentSimTime = animationProgress * totalSimTime

      let carX = padding.left
      let timeInMotion = 0 // Declare timeInMotion variable
      if (currentSimTime > actualRT) {
        // Car starts moving after RT
        timeInMotion = currentSimTime - actualRT
        // Simple linear progression for now
        carX = padding.left + (timeInMotion / actualET) * trackWidth
      }

      // Draw car
      ctx.fillStyle = "#ff0000"
      ctx.beginPath()
      ctx.roundRect(carX - 15, trackY + trackHeight / 2 - 10, 30, 20, 5)
      ctx.fill()

      // Add glow effect
      ctx.shadowColor = "#ff0000"
      ctx.shadowBlur = 10
      ctx.fillStyle = "#ff6600"
      ctx.beginPath()
      ctx.roundRect(carX - 20, trackY + trackHeight / 2 - 5, 5, 10, 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Draw current speed and time
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Inter, sans-serif"
      ctx.textAlign = "center"
      setCurrentET(currentSimTime)
      setCurrentMPH(currentSimTime > actualRT ? (timeInMotion / actualET) * actualMPH : 0) // Speed only increases when moving

      ctx.fillText(`${currentSimTime.toFixed(2)}s`, carX, trackY + trackHeight + 30)
      ctx.fillText(`${Math.round(currentMPH)} mph`, carX, trackY + trackHeight + 50)
    } else if (run && !isAnimating && animationProgress === 1) {
      // Display final results after animation
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Inter, sans-serif"
      ctx.textAlign = "center"
      const finalCarX = padding.left + trackWidth // Car is at finish line
      ctx.fillText(`${actualET.toFixed(2)}s`, finalCarX, trackY + trackHeight + 30)
      ctx.fillText(`${Math.round(actualMPH)} mph`, finalCarX, trackY + trackHeight + 50)

      // Display result
      ctx.font = "bold 20px Inter, sans-serif"
      if (actualET < targetDialIn) {
        ctx.fillStyle = "#ef4444" // Red for breakout
        ctx.fillText("BROKE OUT!", width / 2, height - 10)
      } else if (actualET > targetDialIn + 0.05) {
        // Small tolerance for "too slow"
        ctx.fillStyle = "#f97316" // Orange for too slow
        ctx.fillText("TOO SLOW!", width / 2, height - 10)
      } else {
        ctx.fillStyle = "#22c55e" // Green for on dial
        ctx.fillText("ON DIAL!", width / 2, height - 10)
      }
    }

    // Draw car model name
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(run ? `Simulating: ${run.dialIn}s Dial-in` : "Select a Run to Simulate", width / 2, padding.top / 2)
  }, [animationProgress, isAnimating, run, actualET, actualMPH, actualRT, targetDialIn])

  // Animation effect
  useEffect(() => {
    if (isAnimating && run) {
      let start: number | null = null
      const totalDuration = (actualET + actualRT) * 1000 // Convert to milliseconds

      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const elapsed = timestamp - start
        const progress = Math.min(elapsed / totalDuration, 1)

        setAnimationProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
          // Set final values
          setCurrentET(actualET)
          setCurrentMPH(actualMPH)
          // Determine and set result
          if (actualET < targetDialIn) {
            setResult("BROKE OUT!")
          } else if (actualET > targetDialIn + 0.05) {
            setResult("TOO SLOW!")
          } else {
            setResult("ON DIAL!")
          }
        }
      }

      const animationId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationId)
    } else if (!isAnimating && animationProgress === 0) {
      setResult(null) // Reset result when not animating and at start
    }
  }, [isAnimating, run, actualET, actualRT, actualMPH, targetDialIn, animationProgress])

  const startAnimation = () => {
    if (!run) {
      alert("Please select a run from the log to simulate.")
      return
    }
    setAnimationProgress(0)
    setCurrentET(0)
    setCurrentMPH(0)
    setResult(null)
    setIsAnimating(true)
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="aspect-video w-full overflow-hidden rounded-lg bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <canvas ref={canvasRef} className="h-full w-full" />
      </motion.div>

      <div className="flex justify-center">
        <motion.button
          className="rounded-md bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
          onClick={startAnimation}
          disabled={isAnimating || !run}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? "Simulating..." : "Run Simulation"}
        </motion.button>
      </div>

      {run && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 text-center">
          <div className="rounded-lg bg-zinc-800 p-4">
            <Clock className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Actual ET</p>
            <p className="text-2xl font-bold">{run.et}s</p>
          </div>
          <div className="rounded-lg bg-zinc-800 p-4">
            <Gauge className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Actual MPH</p>
            <p className="text-2xl font-bold">{run.mph} mph</p>
          </div>
          <div className="rounded-lg bg-zinc-800 p-4">
            <Flag className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Dial-in</p>
            <p className="text-2xl font-bold">{dialIn}s</p>
          </div>
          {result && (
            <motion.div
              className="md:col-span-3 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ backgroundColor: result === "ON DIAL!" ? "#22c55e" : "#ef4444" }}
            >
              <p className="text-xl font-bold text-white">{result}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}
