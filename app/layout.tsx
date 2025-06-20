import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { PageTransition } from "@/components/ui/page-transition"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Envious Racing - Professional Racing Tools",
  description:
    "Precision tools for serious racers. Calculate, tune, and compete with our professional-grade racing utilities.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth opacity-50 opacity-45 opacity-40 opacity-35 opacity-30 opacity-100">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
          <PageTransition mode="fade">{children}</PageTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}
