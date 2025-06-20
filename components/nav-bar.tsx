"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-zinc-800 backdrop-blur-sm transition-all duration-300 ${
        scrolled ? "bg-black/90 py-2 shadow-lg shadow-black/50" : "bg-black/50 py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link href="/" className="flex items-center group">
          <div className="text-2xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-110">
            <span className="text-white">E</span>
            <span className="text-red-600">R</span>
          </div>
          <span className="ml-2 text-lg font-bold">
            <span className="text-white">ENVIOUS</span>
            <span className="text-red-600 transition-colors duration-300 group-hover:text-white"> RACING</span>
          </span>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link
            href="/ratio-maker"
            className="text-sm font-medium text-gray-200 transition-all duration-300 hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full"
          >
            Ratio Maker
          </Link>
          <Link
            href="/tuning-hub"
            className="text-sm font-medium text-gray-200 transition-all duration-300 hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full"
          >
            Tuning Hub
          </Link>
          <Link
            href="/bracket-maker"
            className="text-sm font-medium text-gray-200 transition-all duration-300 hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full"
          >
            Bracket Maker
          </Link>
          <Link
            href="/auth"
            className="text-sm font-medium text-gray-200 transition-all duration-300 hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all hover:after:w-full"
          >
            Sign In
          </Link>
          <Button className="bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105">
            Sign Up
          </Button>
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="border-zinc-800 bg-black text-white">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center group" onClick={() => setIsOpen(false)}>
                <div className="text-2xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-110">
                  <span className="text-white">E</span>
                  <span className="text-red-600">R</span>
                </div>
                <span className="ml-2 text-lg font-bold">
                  <span className="text-white">ENVIOUS</span>
                  <span className="text-red-600 transition-colors duration-300 group-hover:text-white"> RACING</span>
                </span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-6 w-6" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>

            <nav className="mt-8 flex flex-col space-y-6">
              <Link
                href="/ratio-maker"
                className="text-lg font-medium text-gray-200 transition-all duration-300 hover:text-red-600 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                Ratio Maker
              </Link>
              <Link
                href="/tuning-hub"
                className="text-lg font-medium text-gray-200 transition-all duration-300 hover:text-red-600 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                Tuning Hub
              </Link>
              <Link
                href="/bracket-maker"
                className="text-lg font-medium text-gray-200 transition-all duration-300 hover:text-red-600 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                Bracket Maker
              </Link>
              <Link
                href="/auth"
                className="text-lg font-medium text-gray-200 transition-all duration-300 hover:text-red-600 hover:translate-x-2"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Button className="mt-4 w-full bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105">
                Sign Up
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
