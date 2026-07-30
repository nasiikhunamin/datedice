"use client"

import { useGameStore } from "@/lib/store"

export default function GameStatus() {
  const players = useGameStore((s) => s.players)
  const phase = useGameStore((s) => s.phase)

  if (phase !== "playing") return null

  const totalMoves = players.reduce((sum, p) => sum + p.position, 0)
  const round = Math.floor(totalMoves / (players.length || 1)) + 1

  return (
    <div className="text-xs text-gray-400 text-center">
      Putaran {round} &middot; {players.length} pemain
    </div>
  )
}
