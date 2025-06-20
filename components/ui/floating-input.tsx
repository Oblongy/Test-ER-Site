"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FloatingInputProps {
  id: string
  label: string
  type?: string
  required?: boolean
  className?: string
  error?: string
}

export function FloatingInput({ id, label, type = "text", required = false, className, error }: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState("")

  const handleFocus = () => setFocused(true)
  const handleBlur = () => setFocused(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)

  const isActive = focused || value.length > 0

  return (
    <div className={cn("relative", className)}>
      <motion.label
        htmlFor={id}
        className="absolute left-3 text-gray-400 pointer-events-none"
        initial={{ y: 0, scale: 1 }}
        animate={{
          y: isActive ? -24 : 0,
          scale: isActive ? 0.8 : 1,
          color: isActive ? "rgb(239, 68, 68)" : "rgb(156, 163, 175)",
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </motion.label>

      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          "w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all",
          error ? "border-red-600" : "border-zinc-700",
        )}
        required={required}
      />

      {error && (
        <motion.p
          className="text-red-600 text-sm mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
