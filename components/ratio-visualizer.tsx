"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface RatioVisualizerProps {
  gears: number[]
  primaryGear: number
  finalDrive: number
  rpm: number
  tireSize: number
}

export function RatioVisualizer({ gears, primaryGear, finalDrive, rpm, tireSize }: RatioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Calculate speeds for each gear
    const speeds = gears.map((gear) => {
      const combinedRatio = gear * finalDrive * primaryGear
      return (rpm * tireSize * Math.PI) / (combinedRatio * 336)
    })

    // Find max speed for scaling
    const maxSpeed = Math.max(...speeds) * 1.1

    // Set up dimensions
    const width = rect.width
    const height = rect.height
    const padding = { top: 40, right: 30, bottom: 60, left: 60 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Draw background - dark gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
    bgGradient.addColorStop(0, "#111111")
    bgGradient.addColorStop(1, "#1a1a1a")
    ctx.fillStyle = bgGradient
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 0.5

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (chartWidth * i) / 10
      ctx.beginPath()
      ctx.moveTo(x, padding.top)
      ctx.lineTo(x, height - padding.bottom)
      ctx.stroke()
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight * i) / 5
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()
    }

    // Draw axes labels
    ctx.fillStyle = "#ffffff"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"

    // X-axis (Speed)
    for (let i = 0; i <= 10; i++) {
      const x = padding.left + (chartWidth * i) / 10
      const speedValue = Math.round((maxSpeed * i) / 10)
      ctx.fillText(`${speedValue}`, x, height - padding.bottom + 20)
    }
    ctx.fillText("MPH", width / 2, height - 15)

    // Y-axis (RPM)
    ctx.textAlign = "right"
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight * i) / 5
      const rpmValue = Math.round(rpm - (rpm * i) / 5)
      ctx.fillText(rpmValue.toLocaleString(), padding.left - 10, y + 4)
    }

    // Draw redline
    ctx.strokeStyle = "#ff0000"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(width - padding.right, padding.top)
    ctx.stroke()

    // Draw gear curves
    const colors = [
      "#ffcc00", // yellow/gold
      "#ffaa00", // orange
      "#ff8800", // darker orange
      "#ff6600", // even darker orange
      "#ff4400", // reddish orange
      "#ff2200", // almost red
    ]

    // Draw gear curves with animation delay
    gears.forEach((gear, index) => {
      const color = colors[index % colors.length]

      // Calculate combined ratio
      const combinedRatio = gear * finalDrive * primaryGear

      // Draw gear curve
      ctx.strokeStyle = color
      ctx.lineWidth = 3
      ctx.beginPath()

      const points = []
      for (let speed = 0; speed <= maxSpeed; speed += maxSpeed / 200) {
        // Calculate RPM for this speed
        // RPM = (speed × gear ratio × final drive × 336) ÷ (tire diameter × π)
        const calculatedRPM = (speed * combinedRatio * 336) / (tireSize * Math.PI)

        if (calculatedRPM <= rpm) {
          const x = padding.left + (speed / maxSpeed) * chartWidth
          const y = padding.top + (rpm - calculatedRPM) * (chartHeight / rpm)
          points.push({ x, y })

          if (speed === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
      }

      // Add glow effect
      ctx.shadowColor = color
      ctx.shadowBlur = 10
      ctx.stroke()
      ctx.shadowBlur = 0

      // Draw shift points
      if (index < gears.length - 1) {
        const nextGear = gears[index + 1]
        const speedAtMaxRPM = (rpm * tireSize * Math.PI) / (combinedRatio * 336)
        const nextGearRPM = (speedAtMaxRPM * nextGear * finalDrive * primaryGear * 336) / (tireSize * Math.PI)

        const x = padding.left + (speedAtMaxRPM / maxSpeed) * chartWidth
        const y = padding.top + (rpm - nextGearRPM) * (chartHeight / rpm)

        // Draw shift point
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw shift line
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, y)
        ctx.stroke()
        ctx.setLineDash([])
      }
    })

    // Add gear labels
    gears.forEach((gear, index) => {
      const color = colors[index % colors.length]
      const combinedRatio = gear * finalDrive * primaryGear
      const speedAtMaxRPM = (rpm * tireSize * Math.PI) / (combinedRatio * 336)

      if (speedAtMaxRPM <= maxSpeed) {
        const x = padding.left + (speedAtMaxRPM / maxSpeed) * chartWidth
        const y = padding.top - 15

        // Draw gear number
        ctx.fillStyle = color
        ctx.font = "bold 14px Inter, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`${index + 1}`, x, y)
      }
    })
  }, [gears, primaryGear, finalDrive, rpm, tireSize])

  return (
    <motion.div
      className="aspect-video w-full overflow-hidden rounded-lg bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </motion.div>
  )
}
