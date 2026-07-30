"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { useGameStore } from "@/lib/store"

export default function WinnerScreen() {
  const players = useGameStore((s) => s.players)
  const winnerId = useGameStore((s) => s.winnerId)
  const playerStats = useGameStore((s) => s.playerStats)
  const resetGame = useGameStore((s) => s.resetGame)
  const firedRef = useRef(false)

  const winner = players.find((p) => p.id === winnerId)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#a855f7", "#ec4899", "#f97316", "#3b82f6"],
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#a855f7", "#ec4899", "#f97316", "#3b82f6"],
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    frame()
  }, [])

  if (!winner) return null

  function getStatTotal(playerId: string, stat: "challenges" | "truths" | "dares"): number {
    return playerStats[playerId]?.[stat] ?? 0
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-purple-900/90 to-indigo-900/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.2 }}
      >
        <div className="text-center px-6 pt-8 pb-4">
          <motion.p
            className="text-5xl mb-2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            🎉
          </motion.p>
          <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white">
            Pemenang!
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full shadow-md border-2 border-white"
              style={{ backgroundColor: winner.color }}
            />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              {winner.name}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-center">
            Statistik
          </h3>

          <div className="space-y-3">
            {players.map((p) => {
              const totalChallenges = getStatTotal(p.id, "challenges")
              const totalTruths = getStatTotal(p.id, "truths")
              const totalDares = getStatTotal(p.id, "dares")
              const isWinner = p.id === winnerId

              return (
                <div
                  key={p.id}
                  className={`rounded-xl border p-3 ${
                    isWinner
                      ? "border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-flex items-center justify-center w-5 h-5 rounded-full shadow-sm"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">
                      {p.name}
                      {isWinner && (
                        <span className="ml-1 text-yellow-500">👑</span>
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-white">
                        {totalChallenges}
                      </p>
                      <p className="text-gray-500">Tantangan</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-white">
                        {totalTruths}
                      </p>
                      <p className="text-gray-500">Kebenaran</p>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800 dark:text-white">
                        {totalDares}
                      </p>
                      <p className="text-gray-500">Tantangan</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => {
                resetGame()
                window.location.href = "/setup"
              }}
              className="w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white hover:bg-purple-700 transition-colors"
            >
              Main Lagi
            </button>
            <button
              onClick={() => {
                resetGame()
                window.location.href = "/"
              }}
              className="w-full rounded-xl bg-gray-200 dark:bg-gray-700 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
