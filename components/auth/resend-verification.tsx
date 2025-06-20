"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Send, CheckCircle } from "lucide-react"
import { Button3D } from "@/components/ui/button-3d"
import { FloatingInput } from "@/components/ui/floating-input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AnimatedText } from "@/components/ui/animated-text"
import { Spotlight } from "@/components/ui/spotlight"
import { cn } from "@/lib/utils"

interface ResendVerificationProps {
  onEmailSent?: (email: string) => void
  className?: string
}

export function ResendVerification({ onEmailSent, className }: ResendVerificationProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState("")

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsSent(true)
      onEmailSent?.(email)
    } catch (err) {
      setError("Failed to send verification email. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <Spotlight className={cn("w-full max-w-md", className)}>
        <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 shadow-2xl">
          <CardContent className="text-center py-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mb-6"
            >
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            <AnimatedText
              text="Email Sent!"
              className="text-2xl font-bold text-white mb-4"
              highlightWords={["Sent!"]}
              highlightColor="text-green-500"
            />

            <motion.p
              className="text-gray-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              We've sent a new verification email to <span className="text-red-600 font-medium">{email}</span>
            </motion.p>

            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Please check your inbox and follow the instructions to verify your account.
            </motion.p>
          </CardContent>
        </Card>
      </Spotlight>
    )
  }

  return (
    <Spotlight className={cn("w-full max-w-md", className)}>
      <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <motion.div
            className="flex justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <AnimatedText
            text="Resend Verification"
            className="text-2xl font-bold text-white"
            highlightWords={["Verification"]}
          />

          <motion.p
            className="text-gray-400 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Enter your email address to receive a new verification link
          </motion.p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <FloatingInput
                id="resend-email"
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button3D type="submit" color="red" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="h-4 w-4" />
                    <span>Send Verification Email</span>
                  </div>
                )}
              </Button3D>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </Spotlight>
  )
}
