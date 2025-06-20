"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Settings, Calculator, Trophy, Gauge, Zap } from "lucide-react" // Removed Clock icon
import { Button } from "@/components/ui/button"
import { Button3D } from "@/components/ui/button-3d"
import { NavBar } from "@/components/nav-bar"
import { AnimatedText } from "@/components/ui/animated-text"
import { CardHoverEffect } from "@/components/ui/card-hover-effect"
import { GradientBackground } from "@/components/ui/gradient-background"
import { Spotlight } from "@/components/ui/spotlight"

export default function Home() {
  const [isVisible, setIsVisible] = useState({
    features: false,
    cta: false,
  })

  const featuresRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === featuresRef.current) {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, features: true }))
            }
          } else if (entry.target === ctaRef.current) {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, cta: true }))
            }
          }
        })
      },
      { threshold: 0.1 },
    )

    if (featuresRef.current) {
      observer.observe(featuresRef.current)
    }

    if (ctaRef.current) {
      observer.observe(ctaRef.current)
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current)
      }
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current)
      }
    }
  }, [])

  const featureItems = [
    {
      title: "Ratio Maker",
      description:
        "Precision gear ratio calculator with visual output. Save and export your configurations for track day.",
      icon: <Calculator className="h-10 w-10" />,
      link: "/ratio-maker",
    },
    {
      title: "Tuning Hub",
      description: "Adjust car settings and share tunes with the community. Find the perfect setup for any track.",
      icon: <Settings className="h-10 w-10" />,
      link: "/tuning-hub",
    },
    {
      title: "Bracket Maker",
      description: "Create and share professional racing tournament brackets. Manage your events like a pro.",
      icon: <Trophy className="h-10 w-10" />,
      link: "/bracket-maker",
    },
    {
      title: "Gear Analyzer",
      description: "Visualize and analyze your transmission's gear ratios with interactive gauges and simulations.",
      icon: <Gauge className="h-10 w-10" />,
      link: "/gear-analyzer",
    },
    {
      title: "Performance Simulator",
      description: "Simulate quarter mile and half mile performance with your current gear ratios and vehicle specs.",
      icon: <Zap className="h-10 w-10" />,
      link: "/ratio-maker?tab=performance",
    },
    // Removed the "Lap Timer" item
    // {
    //   title: "Lap Timer",
    //   description: "Track and analyze your lap times with precision. Compare sessions and monitor your progress.",
    //   icon: <Clock className="h-10 w-10" />,
    //   link: "#",
    // },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <NavBar />

      {/* Hero Section */}
      <GradientBackground
        colors={["#ef4444", "#991b1b", "#450a0a"]}
        speed={5}
        blur={150}
        className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-4 text-center"
      >
        <div className="z-10 flex flex-col items-center space-y-6">
          <div className="mb-4 flex items-center justify-center animate-float">
            <div className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl">
              <span className="text-white">E</span>
              <span className="text-red-600">R</span>
            </div>
          </div>

          <AnimatedText
            text="ENVIOUS RACING"
            className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
            highlightWords={["RACING"]}
          />

          <p className="max-w-[600px] text-lg text-gray-400 sm:text-xl animate-slide-up stagger-1">
            Precision tools for serious racers. Calculate, tune, and compete with our professional-grade racing
            utilities.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-slide-up stagger-2">
            <Button3D
              color="red"
              size="lg"
              className="transition-transform duration-300 hover:scale-105"
              onClick={() => (window.location.href = "/ratio-maker")}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button3D>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-red-600 text-red-600 hover:bg-red-950/20 transition-transform duration-300 hover:scale-105"
            >
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center animate-slide-up stagger-3">
          <Link
            href="#features"
            className="flex animate-bounce flex-col items-center text-sm text-gray-400 transition-colors hover:text-red-600"
          >
            <span>Scroll Down</span>
            <ArrowRight className="mt-1 h-4 w-4 rotate-90" />
          </Link>
        </div>
      </GradientBackground>

      {/* Features Section */}
      <section id="features" className="py-20" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <AnimatedText
            text="Premium Features"
            className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            highlightWords={["Premium"]}
          />

          <Spotlight>
            <CardHoverEffect items={featureItems} />
          </Spotlight>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20" ref={ctaRef}>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-red-950/30 to-black animate-gradient-shift"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <AnimatedText
            text="Ready to Dominate the Track?"
            className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
            highlightWords={["Dominate"]}
          />

          <p
            className={`mx-auto mb-8 max-w-2xl text-gray-400 ${isVisible.cta ? "animate-slide-up stagger-1" : "opacity-0"}`}
          >
            Join hundreds of racers who trust Envious Racing tools for their competitive edge.
          </p>

          <Button3D
            color="red"
            size="lg"
            className={`transition-transform duration-300 hover:scale-105 ${isVisible.cta ? "animate-slide-up stagger-2" : "opacity-0"}`}
            onClick={() => (window.location.href = "/ratio-maker")}
          >
            Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button3D>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center">
              <div className="text-2xl font-black tracking-tighter">
                <span className="text-white">E</span>
                <span className="text-red-600">R</span>
              </div>
              <span className="ml-2 text-lg font-bold">
                <span className="text-white">ENVIOUS</span>
                <span className="text-red-600"> RACING</span>
              </span>
            </div>

            <div className="flex gap-8">
              <Link
                href="/ratio-maker"
                className="text-gray-400 transition-colors hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full"
              >
                Ratio Maker
              </Link>
              <Link
                href="/tuning-hub"
                className="text-gray-400 transition-colors hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full"
              >
                Tuning Hub
              </Link>
              <Link
                href="/bracket-maker"
                className="text-gray-400 transition-colors hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full"
              >
                Bracket Maker
              </Link>
            </div>

            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Envious Racing. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
