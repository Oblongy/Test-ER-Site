"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Sparkles, Trophy, ArrowRight } from "lucide-react"
import { Button3D } from "@/components/ui/button-3d"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedText } from "@/components/ui/animated-text"
import { Spotlight } from "@/components/ui/spotlight"
import { cn } from "@/lib/utils"

interface VerificationSuccessProps {
  userName: string
  onContinue?: () => void
  className?: string
}

export function VerificationSuccess({ userName, onContinue, className }: VerificationSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const confettiParticles = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-red-600 rounded-full"
      initial={{
        x: 0,
        y: 0,
        scale: 0,
        rotate: 0,
      }}
      animate={
        showConfetti
          ? {
              x: (Math.random() - 0.5) * 400,
              y: Math.random() * 300 + 100,
              scale: [0, 1, 0],
              rotate: Math.random() * 360,
            }
          : {}
      }
      transition={{
        duration: 2,
        delay: Math.random() * 0.5,
        ease: "easeOut",
      }}
    />
  ))

  return (
    <Spotlight className={cn("w-full max-w-md", className)}>
      <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 shadow-2xl relative overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {confettiParticles}
          </div>
        </div>

        <CardContent className="text-center py-12 relative z-10">
          {/* Success Icon with Animation */}
          <motion.div
            className="relative mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto relative">
              <CheckCircle className="h-12 w-12 text-white" />

              {/* Pulsing Ring */}
              <motion.div
                className="absolute inset-0 border-4 border-green-400 rounded-full"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
              />

              {/* Sparkles */}
              <motion.div
                className="absolute -top-2 -right-2"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 180 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <AnimatedText
              text={`Welcome to the Race, ${userName}!`}
              className="text-2xl font-bold text-white mb-4"
              highlightWords={["Welcome", userName + "!"]}
              highlightColor="text-green-500"
            />
          </motion.div>

          <motion.p
            className="text-gray-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Your email has been verified successfully. You now have full access to all premium racing tools.
          </motion.p>

          {/* Features List */}
          <motion.div
            className="space-y-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            {["Gear Ratio Calculator", "Performance Simulator", "Tuning Hub Access", "Tournament Brackets"].map(
              (feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center justify-center space-x-2 text-sm text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>{feature}</span>
                </motion.div>
              ),
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <Button3D color="red" className="w-full" onClick={onContinue}>
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Start Racing</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Button3D>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <p className="text-xs text-gray-500">🏁 Ready to dominate the track? Let's go!</p>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </Spotlight>
  )
}
