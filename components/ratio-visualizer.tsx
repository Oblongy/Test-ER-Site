// ... (imports)

export function RatioVisualizer({ gears, primaryGear, finalDrive, rpm, tireSize }: RatioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ... (existing canvas setup)

    // Update font to use a web-safe fallback or a CSS variable if defined
    ctx.font = "12px sans-serif" // Or use a CSS variable like `var(--font-inter)` if you set it up
    // ...
  }, [gears, primaryGear, finalDrive, rpm, tireSize])

  // ...
}
