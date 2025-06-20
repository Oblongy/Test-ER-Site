"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, CheckCircle, RefreshCw, ArrowLeft, Clock } from "lucide-react"
import { Button3D } from "@/components/ui/button-3d"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AnimatedText } from "@/components/ui/animated-text"
import { Spotlight } from "@/components/ui/spotlight"
import { cn } from "@/lib/utils"

interface EmailVerificationProps {
  email: string
  onVerified?: () => void
  onResendEmail?: () => void
  onBackToSignup?: () => void
  className?: string
}

export function EmailVerification({
  email,
  onVerified,
  onResendEmail,
  onBackToSignup,
  className,
}: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      setCanResend(true)
    }
  }, [timeLeft, isVerified])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newCode = [...verificationCode]
    newCode[index] = value

    setVerificationCode(newCode)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-verify when all fields are filled
    if (newCode.every((digit) => digit !== "") && newCode.join("").length === 6) {
      handleVerify(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerify = async (code?: string) => {
    const codeToVerify = code || verificationCode.join("")

    if (codeToVerify.length !== 6) {
      setError("Please enter the complete 6-digit code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success for demo (in real app, this would be an API call)
          if (codeToVerify === "123456") {
            resolve(true)
          } else {
            reject(new Error("Invalid verification code"))
          }
        }, 2000)
      })

      setIsVerified(true)
      setTimeout(() => {
        onVerified?.()
      }, 2000)
    } catch (err) {
      setError("Invalid verification code. Please try again.")
      setVerificationCode(["", "", "", "", "", ""])
      // Focus first input
      document.getElementById("code-0")?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onResendEmail?.()
      setTimeLeft(300) // Reset timer
      setCanResend(false)
      setVerificationCode(["", "", "", "", "", ""])
    } catch (err) {
      setError("Failed to resend email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
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
              text="Email Verified!"
              className="text-2xl font-bold text-white mb-4"
              highlightWords={["Verified!"]}
              highlightColor="text-green-500"
            />

            <motion.p
              className="text-gray-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Your email has been successfully verified. You can now access all features.
            </motion.p>

            <motion.div
              className="flex items-center justify-center space-x-2 text-green-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Redirecting to dashboard...</span>
            </motion.div>
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

          <AnimatedText text="Check Your Email" className="text-2xl font-bold text-white" highlightWords={["Email"]} />

          <motion.p
            className="text-gray-400 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            We've sent a 6-digit verification code to
          </motion.p>

          <motion.p
            className="text-red-600 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {email}
          </motion.p>
        </CardHeader>

        <CardContent className="space-y-6">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-center space-x-2">
              {verificationCode.map((digit, index) => (
                <motion.input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={cn(
                    "w-12 h-12 text-center text-xl font-bold bg-zinc-800 border-2 rounded-lg focus:outline-none transition-all",
                    error
                      ? "border-red-600 focus:border-red-500"
                      : "border-zinc-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/20",
                    digit && "border-red-600 bg-red-950/20",
                  )}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                />
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  className="text-red-600 text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mb-4">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>

              <Button3D
                color="red"
                className="w-full mb-4"
                onClick={() => handleVerify()}
                disabled={isLoading || verificationCode.some((digit) => !digit)}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button3D>

              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || isResending}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    canResend && !isResending ? "text-red-600 hover:text-red-500" : "text-gray-500 cursor-not-allowed",
                  )}
                >
                  {isResending ? (
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Resending...</span>
                    </div>
                  ) : canResend ? (
                    "Resend Code"
                  ) : (
                    `Resend available in ${formatTime(timeLeft)}`
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="text-center border-t border-zinc-800 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <button
              type="button"
              onClick={onBackToSignup}
              className="text-gray-400 hover:text-white text-sm transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign Up</span>
            </button>
          </motion.div>
        </CardContent>
      </Card>
    </Spotlight>
  )
}
