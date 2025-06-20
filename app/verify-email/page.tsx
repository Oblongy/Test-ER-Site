"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmailVerification } from "@/components/auth/email-verification"
import { VerificationSuccess } from "@/components/auth/verification-success"
import { GradientBackground } from "@/components/ui/gradient-background"
import { NavBar } from "@/components/nav-bar"

export default function VerifyEmailPage() {
  const [step, setStep] = useState<"verify" | "success">("verify")
  const [userEmail, setUserEmail] = useState("")
  const [userName, setUserName] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Get email and name from URL params (in real app, this would be more secure)
    const email = searchParams.get("email") || "user@example.com"
    const name = searchParams.get("name") || "Racer"

    setUserEmail(email)
    setUserName(name)
  }, [searchParams])

  const handleVerified = () => {
    setStep("success")
  }

  const handleResendEmail = () => {
    // In a real app, this would trigger an API call to resend the verification email
    console.log("Resending verification email to:", userEmail)
    // Show toast notification or some feedback
  }

  const handleBackToSignup = () => {
    router.push("/auth")
  }

  const handleContinue = () => {
    // Redirect to dashboard or main app
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar />

      <GradientBackground
        colors={["#ef4444", "#991b1b", "#450a0a"]}
        speed={3}
        blur={120}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center">
            <Button asChild variant="ghost" className="mr-4 text-gray-400 hover:text-white">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Link>
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {step === "verify" ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <EmailVerification
                  email={userEmail}
                  onVerified={handleVerified}
                  onResendEmail={handleResendEmail}
                  onBackToSignup={handleBackToSignup}
                />
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <VerificationSuccess userName={userName} onContinue={handleContinue} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GradientBackground>
    </div>
  )
}
