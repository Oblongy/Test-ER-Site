"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Button3DProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  color?: "red" | "blue" | "green" | "purple"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
}

export function Button3D({
  children,
  className,
  onClick,
  color = "red",
  size = "md",
  disabled = false,
}: Button3DProps) {
  const colorClasses = {
    red: "bg-red-600 hover:bg-red-700 shadow-red-700/30",
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-700/30",
    green: "bg-green-600 hover:bg-green-700 shadow-green-700/30",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-700/30",
  }

  const sizeClasses = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative rounded-md font-medium text-white transition-all",
        "transform-gpu translate-y-0 active:translate-y-1",
        "shadow-[0_6px_0] active:shadow-[0_2px_0]",
        "active:after:opacity-0",
        colorClasses[color],
        sizeClasses[size],
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span className="absolute -inset-[100%] animate-[spin_4s_linear_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </span>
    </motion.button>
  )
}
