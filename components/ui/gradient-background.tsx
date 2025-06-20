"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface GradientBackgroundProps {
  children: React.ReactNode
  className?: string
  colors?: string[]
  speed?: number
  blur?: number
}

export function GradientBackground({
  children,
  className,
  colors = ["#ef4444", "#991b1b", "#450a0a"],
  speed = 10,
  blur = 100,
}: GradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: {
      x: number
      y: number
      size: number
      color: string
      vx: number
      vy: number
    }[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const particleCount = 10

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 200 + 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * speed * 0.1,
          vy: (Math.random() - 0.5) * speed * 0.1,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.beginPath()
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size)
        gradient.addColorStop(0, `${particle.color}40`)
        gradient.addColorStop(1, `${particle.color}00`)
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < -particle.size) particle.x = canvas.width + particle.size
        if (particle.x > canvas.width + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = canvas.height + particle.size
        if (particle.y > canvas.height + particle.size) particle.y = -particle.size
      })

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colors, speed])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ filter: `blur(${blur}px)` }} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
