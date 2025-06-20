"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResendVerification } from "@/components/auth/resend-verification"
import { GradientBackground } from "@/components/ui/gradient-background"
import { NavBar } from "@/components/nav-bar"

export default function ResendVerificationPage() {
  const router = useRouter()

  const handleEmailSent = (email: string) => {
    // Redirect to verification page after a delay
    setTimeout(() => {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    }, 3000)
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
              <Link href="/auth">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign In
              </Link>
            </Button>
          </div>

          <ResendVerification onEmailSent={handleEmailSent} />
        </div>
      </GradientBackground>
    </div>
  )
}
