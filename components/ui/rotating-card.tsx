"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface RotatingCardProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}

export function RotatingCard({ front, back, className }: RotatingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  function handleFlip() {
    if (!isAnimating) {
      setIsAnimating(true)
      setIsFlipped(!isFlipped)
    }
  }

  return (
    <div className={cn("w-full h-80 cursor-pointer perspective-1000", className)} onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <div className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
          {front}
        </div>
        <div
          className="absolute w-full h-full backface-hidden rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 rotate-y-180"
          style={{ transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}
