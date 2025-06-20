"use client"

import { useEffect } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  once?: boolean
  highlightColor?: string
  highlightWords?: string[]
}

export function AnimatedText({
  text,
  className,
  once = true,
  highlightColor = "text-red-600",
  highlightWords = [],
}: AnimatedTextProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  const words = text.split(" ")

  const renderWord = (word: string, index: number) => {
    const isHighlighted = highlightWords.includes(word)

    return (
      <motion.span
        key={index}
        className={cn("inline-block", isHighlighted ? highlightColor : "")}
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.5,
              delay: index * 0.1,
            },
          },
        }}
      >
        {word}{" "}
      </motion.span>
    )
  }

  return (
    <motion.div ref={ref} className={cn("", className)}>
      {words.map(renderWord)}
    </motion.div>
  )
}
