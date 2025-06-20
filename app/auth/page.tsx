"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { GradientBackground } from "@/components/ui/gradient-background"
import { NavBar } from "@/components/nav-bar"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const handleLogin = (email: string, password: string) => {
    console.log("Login:", { email, password })
    // Handle login logic here
    alert(`Welcome back! Logged in with ${email}`)
  }

  const handleSignup = (name: string, email: string, password: string) => {
    console.log("Signup:", { name, email, password })
    // Handle signup logic here
    alert(`Welcome ${name}! Account created with ${email}`)
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
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm onSubmit={handleLogin} onSwitchToSignup={() => setIsLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignupForm onSubmit={handleSignup} onSwitchToLogin={() => setIsLogin(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GradientBackground>
    </div>
  )
}
