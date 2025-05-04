"use client"

import { useEffect, useRef } from "react"

interface BracketDisplayProps {
  participants: string[]
  bracketType: string
}

export function BracketDisplay({ participants, bracketType }: BracketDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth * window.devicePixelRatio
    canvas.height = canvas.clientHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate number of rounds
    const rounds = Math.ceil(Math.log2(participants.length))

    // Set up dimensions
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    // Draw background
    ctx.fillStyle = "#18181b" // zinc-900
    ctx.fillRect(0, 0, width, height)

    // Calculate bracket layout
    const matchHeight = 60
    const matchWidth = 200
    const matchSpacing = 20
    const roundSpacing = 100

    // Draw rounds
    let remainingParticipants = [...participants]

    for (let round = 0; round < rounds; round++) {
      const matchCount = Math.pow(2, rounds - round - 1)
      const roundWidth = matchWidth
      const roundHeight = matchCount * matchHeight + (matchCount - 1) * matchSpacing
      const roundX = 50 + round * (matchWidth + roundSpacing)
      const roundY = (height - roundHeight) / 2

      // Draw round title
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Round ${round + 1}`, roundX + matchWidth / 2, roundY - 20)

      // Draw matches
      for (let match = 0; match < matchCount; match++) {
        const matchY = roundY + match * (matchHeight + matchSpacing)

        // Draw match box
        ctx.fillStyle = "#27272a" // zinc-800
        ctx.fillRect(roundX, matchY, matchWidth, matchHeight)

        // Draw match border
        ctx.strokeStyle = "#ef4444" // red-500
        ctx.lineWidth = 2
        ctx.strokeRect(roundX, matchY, matchWidth, matchHeight)

        // Draw participant names
        ctx.fillStyle = "#ffffff"
        ctx.font = "14px Inter, sans-serif"
        ctx.textAlign = "left"

        if (round === 0) {
          // First round - use actual participants
          const participant1 = participants[match * 2] || "BYE"
          const participant2 = participants[match * 2 + 1] || "BYE"

          ctx.fillText(participant1, roundX + 10, matchY + 25)
          ctx.fillText(participant2, roundX + 10, matchY + 55)

          // Draw separator
          ctx.strokeStyle = "#3f3f46" // zinc-700
          ctx.beginPath()
          ctx.moveTo(roundX, matchY + matchHeight / 2)
          ctx.lineTo(roundX + matchWidth, matchY + matchHeight / 2)
          ctx.stroke()
        } else {
          // Later rounds - use TBD
          ctx.fillText("TBD", roundX + 10, matchY + 25)
          ctx.fillText("TBD", roundX + 10, matchY + 55)

          // Draw separator
          ctx.strokeStyle = "#3f3f46" // zinc-700
          ctx.beginPath()
          ctx.moveTo(roundX, matchY + matchHeight / 2)
          ctx.lineTo(roundX + matchWidth, matchY + matchHeight / 2)
          ctx.stroke()
        }

        // Draw connector lines to next round (if not final round)
        if (round < rounds - 1) {
          ctx.strokeStyle = "#3f3f46" // zinc-700
          ctx.lineWidth = 2

          // Calculate positions
          const nextRoundX = roundX + matchWidth + roundSpacing
          const nextMatchY = roundY + Math.floor(match / 2) * (matchHeight + matchSpacing) + matchHeight / 2

          // Draw horizontal line
          ctx.beginPath()
          ctx.moveTo(roundX + matchWidth, matchY + matchHeight / 2)
          ctx.lineTo(roundX + matchWidth + roundSpacing / 2, matchY + matchHeight / 2)
          ctx.stroke()

          // Draw vertical line to next match
          if (match % 2 === 0) {
            // Top match
            ctx.beginPath()
            ctx.moveTo(roundX + matchWidth + roundSpacing / 2, matchY + matchHeight / 2)
            ctx.lineTo(roundX + matchWidth + roundSpacing / 2, nextMatchY)
            ctx.stroke()
          } else {
            // Bottom match
            ctx.beginPath()
            ctx.moveTo(roundX + matchWidth + roundSpacing / 2, matchY + matchHeight / 2)
            ctx.lineTo(roundX + matchWidth + roundSpacing / 2, nextMatchY)
            ctx.stroke()
          }

          // Draw horizontal line to next match
          if (match % 2 === 1) {
            ctx.beginPath()
            ctx.moveTo(roundX + matchWidth + roundSpacing / 2, nextMatchY)
            ctx.lineTo(nextRoundX, nextMatchY)
            ctx.stroke()
          }
        }
      }

      // For the next round, we'll have one winner from each match
      remainingParticipants = Array(matchCount).fill("TBD")
    }

    // Draw champion box for the final winner
    const finalRoundX = 50 + rounds * (matchWidth + roundSpacing)
    const finalRoundY = height / 2 - matchHeight / 2

    ctx.fillStyle = "#27272a" // zinc-800
    ctx.fillRect(finalRoundX, finalRoundY, matchWidth, matchHeight)

    ctx.strokeStyle = "#ef4444" // red-500
    ctx.lineWidth = 3
    ctx.strokeRect(finalRoundX, finalRoundY, matchWidth, matchHeight)

    // Draw champion text
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 16px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("CHAMPION", finalRoundX + matchWidth / 2, finalRoundY + 35)
    ctx.font = "14px Inter, sans-serif"
    ctx.fillText("TBD", finalRoundX + matchWidth / 2, finalRoundY + 55)
  }, [participants, bracketType])

  return (
    <div className="h-[600px] w-full overflow-auto">
      <div className="min-w-[1200px]">
        <canvas ref={canvasRef} className="h-[600px] w-full" style={{ width: "100%", height: "600px" }} />
      </div>
    </div>
  )
}
