"use client"

import type React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardHoverEffectProps {
  items: {
    title: string
    description: string
    icon?: React.ReactNode
    link?: string
  }[]
  className?: string
  cardClassName?: string
}

export function CardHoverEffect({ items, className, cardClassName }: CardHoverEffectProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className={cn(
            "relative group overflow-hidden rounded-lg p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors",
            cardClassName,
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {item.icon && <div className="text-red-600 mb-3 group-hover:scale-110 transition-transform">{item.icon}</div>}

          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-red-500 transition-colors">{item.title}</h3>

          <p className="text-gray-400 group-hover:text-gray-300 transition-colors">{item.description}</p>

          {item.link && (
            <div className="mt-4">
              <a
                href={item.link}
                className="text-red-600 hover:text-red-500 text-sm font-medium inline-flex items-center"
              >
                Learn more
                <svg
                  className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
