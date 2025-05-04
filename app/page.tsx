"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Settings, Calculator, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/nav-bar"

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

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <NavBar />

      {/* Hero Section */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black via-black to-red-950/30 animate-gradient-shift"></div>
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.1),transparent_70%)] animate-pulse-subtle"></div>

        <div className="z-10 flex flex-col items-center space-y-6">
          <div className="mb-4 flex items-center justify-center animate-float">
            <div className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl">
              <span className="text-white">E</span>
              <span className="text-red-600">R</span>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-slide-up">
            <span className="text-white">ENVIOUS</span>
            <span className="text-red-600"> RACING</span>
          </h1>

          <p className="max-w-[600px] text-lg text-gray-400 sm:text-xl animate-slide-up stagger-1">
            Precision tools for serious racers. Calculate, tune, and compete with our professional-grade racing
            utilities.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 animate-slide-up stagger-2">
            <Button
              asChild
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700 transition-transform duration-300 hover:scale-105"
            >
              <Link href="/ratio-maker">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
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
      </section>

      {/* Features Section */}
      <section id="features" className="py-20" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <h2
            className={`mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl ${isVisible.features ? "animate-slide-up" : "opacity-0"}`}
          >
            <span className="text-red-600">Premium</span> Features
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Ratio Maker */}
            <div
              className={`group relative overflow-hidden rounded-lg bg-zinc-900 p-6 transition-all duration-500 hover:bg-zinc-800 hover:shadow-lg hover:shadow-red-900/20 ${isVisible.features ? "animate-slide-up stagger-1" : "opacity-0"}`}
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-600/10 transition-transform duration-500 group-hover:scale-[2]"></div>
              <Calculator className="mb-4 h-10 w-10 text-red-600 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold">Ratio Maker</h3>
              <p className="mb-6 text-gray-400">
                Precision gear ratio calculator with visual output. Save and export your configurations for track day.
              </p>
              <Button
                asChild
                variant="ghost"
                className="text-red-600 hover:bg-red-950/20 hover:text-red-500 transition-all duration-300 group-hover:translate-x-1"
              >
                <Link href="/ratio-maker">
                  Try It Now{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Tuning Hub */}
            <div
              className={`group relative overflow-hidden rounded-lg bg-zinc-900 p-6 transition-all duration-500 hover:bg-zinc-800 hover:shadow-lg hover:shadow-red-900/20 ${isVisible.features ? "animate-slide-up stagger-2" : "opacity-0"}`}
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-600/10 transition-transform duration-500 group-hover:scale-[2]"></div>
              <Settings className="mb-4 h-10 w-10 text-red-600 transition-transform duration-300 group-hover:rotate-45" />
              <h3 className="mb-3 text-xl font-bold">Tuning Hub</h3>
              <p className="mb-6 text-gray-400">
                Adjust car settings and share tunes with the community. Find the perfect setup for any track.
              </p>
              <Button
                asChild
                variant="ghost"
                className="text-red-600 hover:bg-red-950/20 hover:text-red-500 transition-all duration-300 group-hover:translate-x-1"
              >
                <Link href="/tuning-hub">
                  Try It Now{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>

            {/* Bracket Maker */}
            <div
              className={`group relative overflow-hidden rounded-lg bg-zinc-900 p-6 transition-all duration-500 hover:bg-zinc-800 hover:shadow-lg hover:shadow-red-900/20 ${isVisible.features ? "animate-slide-up stagger-3" : "opacity-0"}`}
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-red-600/10 transition-transform duration-500 group-hover:scale-[2]"></div>
              <Trophy className="mb-4 h-10 w-10 text-red-600 transition-transform duration-300 group-hover:scale-110" />
              <h3 className="mb-3 text-xl font-bold">Bracket Maker</h3>
              <p className="mb-6 text-gray-400">
                Create and share professional racing tournament brackets. Manage your events like a pro.
              </p>
              <Button
                asChild
                variant="ghost"
                className="text-red-600 hover:bg-red-950/20 hover:text-red-500 transition-all duration-300 group-hover:translate-x-1"
              >
                <Link href="/bracket-maker">
                  Try It Now{" "}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20" ref={ctaRef}>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-red-950/30 to-black animate-gradient-shift"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2
            className={`mb-6 text-3xl font-bold tracking-tight sm:text-4xl ${isVisible.cta ? "animate-slide-up" : "opacity-0"}`}
          >
            Ready to <span className="text-red-600">Dominate</span> the Track?
          </h2>
          <p
            className={`mx-auto mb-8 max-w-2xl text-gray-400 ${isVisible.cta ? "animate-slide-up stagger-1" : "opacity-0"}`}
          >
            Join thousands of racers who trust Envious Racing tools for their competitive edge.
          </p>
          <Button
            asChild
            size="lg"
            className={`bg-red-600 text-white hover:bg-red-700 transition-transform duration-300 hover:scale-105 ${isVisible.cta ? "animate-slide-up stagger-2" : "opacity-0"}`}
          >
            <Link href="/ratio-maker">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
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
