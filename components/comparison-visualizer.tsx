"use client"

import { useEffect, useRef } from "react"

interface GearConfig {
  id: string
  name: string
  car: string
  finalDrive: number
  gears: number[]
  rpm: number
  tireSize: number
  spreadFactor: number
  gearCount: 5 | 6
  firstGear: number
  color: string
  weight?: number
  power?: number
  torque?: number
  quarterMileTime?: number
  halfMileTime?: number
}

interface ComparisonVisualizerProps {
  configs: GearConfig[]
}

export function ComparisonVisualizer({ configs }: ComparisonVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || configs.length === 0) return

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

    // Calculate speeds for each gear in each config
    const allSpeeds: number[] = []
    const allRpms: number[] = []

    configs.forEach((config) => {
      config.gears.forEach((gear) => {
        const combinedRatio = gear * config.finalDrive
        const speed = (config.rpm * config.tireSize * Math.PI) / (combinedRatio * 336)
        allSpeeds.push(speed)
      })
      allRpms.push(config.rpm)
    })

    // Find max speed and rpm for scaling
    const maxSpeed = Math.max(...allSpeeds) * 1.1
    const maxRpm = Math.max(...allRpms)

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

    // Draw gear curves for each config
    configs.forEach((config, configIndex) => {
      // Use the config's color
      const color = config.color

      // Draw each gear curve
      config.gears.forEach((gear, gearIndex) => {
        // Calculate combined ratio
        const combinedRatio = gear * config.finalDrive

        // Draw gear curve
        ctx.strokeStyle = color
        ctx.lineWidth = 2.5
        ctx.beginPath()

        for (let speed = 0; speed <= maxSpeed; speed += maxSpeed / 200) {
          // Calculate RPM for this speed
          // RPM = (speed × gear ratio × final drive × 336) ÷ (tire diameter × π)
          const calculatedRPM = (speed * combinedRatio * 336) / (config.tireSize * Math.PI)

          if (calculatedRPM <= config.rpm) {
            const x = padding.left + (speed / maxSpeed) * chartWidth
            const y = padding.top + (config.rpm - calculatedRPM) * (chartHeight / config.rpm)

            if (speed === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          }
        }

        // Add glow effect
        ctx.shadowColor = color
        ctx.shadowBlur = 5
        ctx.stroke()
        ctx.shadowBlur = 0
      })
    })
  }, [configs])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
