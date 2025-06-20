"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Flag, Clock, Gauge } from "lucide-react"

interface PerformanceSimulatorProps {
  gears: number[]
  finalDrive: number
  rpm: number
  tireSize: number
  car: string
}

export function PerformanceSimulator({ gears, finalDrive, rpm, tireSize, car }: PerformanceSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [quarterMileTime, setQuarterMileTime] = useState(0)
  const [quarterMileSpeed, setQuarterMileSpeed] = useState(0)
  const [halfMileTime, setHalfMileTime] = useState(0)
  const [halfMileSpeed, setHalfMileSpeed] = useState(0)

  // Calculate performance metrics
  useEffect(() => {
    // Simplified performance calculation based on gearing
    const quarterTime = 13.5 - (1 / finalDrive) * 2
    const quarterSpeed = 100 + (1 / finalDrive) * 50

    // Half mile calculation
    const halfTime = quarterTime * 1.6
    const halfSpeed = quarterSpeed * 1.3

    setQuarterMileTime(Math.max(9, Math.min(16, quarterTime)))
    setQuarterMileSpeed(Math.max(80, Math.min(160, quarterSpeed)))
    setHalfMileTime(Math.max(14, Math.min(25, halfTime)))
    setHalfMileSpeed(Math.max(100, Math.min(200, halfSpeed)))
  }, [gears, finalDrive, rpm, tireSize])

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

    // Draw quarter mile marker
    const quarterMileX = padding.left + trackWidth * 0.5
    ctx.strokeStyle = "#ff4444"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(quarterMileX, trackY - 10)
    ctx.lineTo(quarterMileX, trackY + trackHeight + 10)
    ctx.stroke()
    ctx.fillStyle = "#ff4444"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("1/4 Mile", quarterMileX, trackY - 15)

    // Draw half mile marker
    const halfMileX = padding.left + trackWidth * 0.9
    ctx.strokeStyle = "#ff8844"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(halfMileX, trackY - 10)
    ctx.lineTo(halfMileX, trackY + trackHeight + 10)
    ctx.stroke()
    ctx.fillStyle = "#ff8844"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("1/2 Mile", halfMileX, trackY - 15)

    // Draw car position based on animation progress
    if (animationProgress > 0) {
      // Calculate car position
      let carX = padding.left
      if (animationProgress <= 0.5) {
        // First half of animation is quarter mile
        const quarterProgress = animationProgress * 2 // Scale to 0-1 for quarter mile
        carX = padding.left + quarterProgress * (quarterMileX - padding.left)
      } else {
        // Second half is half mile
        const halfProgress = (animationProgress - 0.5) * 2 // Scale to 0-1 for half mile
        carX = quarterMileX + halfProgress * (halfMileX - quarterMileX)
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

      // Draw speed and time
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Inter, sans-serif"
      ctx.textAlign = "center"

      let currentTime, currentSpeed
      if (animationProgress <= 0.5) {
        // Quarter mile
        const quarterProgress = animationProgress * 2
        currentTime = quarterMileTime * quarterProgress
        currentSpeed = quarterMileSpeed * (0.5 + quarterProgress * 0.5) // Speed increases non-linearly
      } else {
        // Half mile
        const halfProgress = (animationProgress - 0.5) * 2
        currentTime = quarterMileTime + (halfMileTime - quarterMileTime) * halfProgress
        currentSpeed = quarterMileSpeed + (halfMileSpeed - quarterMileSpeed) * halfProgress
      }

      ctx.fillText(`${currentTime.toFixed(2)}s`, carX, trackY + trackHeight + 30)
      ctx.fillText(`${Math.round(currentSpeed)} mph`, carX, trackY + trackHeight + 50)
    }

    // Draw car model name
    ctx.fillStyle = "#ffffff"
    ctx.font = "16px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(car, width / 2, padding.top / 2)
  }, [
    animationProgress,
    gears,
    finalDrive,
    rpm,
    tireSize,
    car,
    quarterMileTime,
    quarterMileSpeed,
    halfMileTime,
    halfMileSpeed,
  ])

  // Animation effect
  useEffect(() => {
    if (isAnimating) {
      let start: number | null = null
      const totalDuration = 3000 // 3 seconds for full animation

      const animate = (timestamp: number) => {
        if (!start) start = timestamp
        const elapsed = timestamp - start
        const progress = Math.min(elapsed / totalDuration, 1)

        setAnimationProgress(progress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      const animationId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationId)
    }
  }, [isAnimating])

  const startAnimation = () => {
    setAnimationProgress(0)
    setIsAnimating(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-zinc-800 p-4">
          <div className="flex items-center space-x-2 text-red-500">
            <Flag className="h-5 w-5" />
            <h3 className="font-semibold">Quarter Mile</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-md bg-zinc-900 p-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <p className="mt-1 text-xs text-gray-400">Time</p>
              <p className="text-2xl font-bold">{quarterMileTime.toFixed(2)}s</p>
            </div>
            <div className="flex flex-col items-center rounded-md bg-zinc-900 p-3">
              <Gauge className="h-5 w-5 text-gray-400" />
              <p className="mt-1 text-xs text-gray-400">Speed</p>
              <p className="text-2xl font-bold">{Math.round(quarterMileSpeed)} mph</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-zinc-800 p-4">
          <div className="flex items-center space-x-2 text-red-500">
            <Flag className="h-5 w-5" />
            <h3 className="font-semibold">Half Mile</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center rounded-md bg-zinc-900 p-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <p className="mt-1 text-xs text-gray-400">Time</p>
              <p className="text-2xl font-bold">{halfMileTime.toFixed(2)}s</p>
            </div>
            <div className="flex flex-col items-center rounded-md bg-zinc-900 p-3">
              <Gauge className="h-5 w-5 text-gray-400" />
              <p className="mt-1 text-xs text-gray-400">Speed</p>
              <p className="text-2xl font-bold">{Math.round(halfMileSpeed)} mph</p>
            </div>
          </div>
        </div>
      </div>

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
          disabled={isAnimating}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAnimating ? "Simulating..." : "Run Simulation"}
        </motion.button>
      </div>
    </div>
  )
}
