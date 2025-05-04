"use client"

import { type ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [displayChildren, setDisplayChildren] = useState(children)
  const [transitionStage, setTransitionStage] = useState("page-transition-enter")

  useEffect(() => {
    setTransitionStage("page-transition-enter-active")

    const timer = setTimeout(() => {
      setTransitionStage("page-transition-exit")
      setDisplayChildren(children)

      const exitTimer = setTimeout(() => {
        setTransitionStage("page-transition-exit-active")
      }, 10)

      return () => clearTimeout(exitTimer)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname, children])

  return <div className={transitionStage}>{displayChildren}</div>
}
