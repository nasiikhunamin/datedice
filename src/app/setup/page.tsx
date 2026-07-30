"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Trash2, UserPlus } from "lucide-react"
import { useGameStore } from "@/lib/store"

const COLORS = [
  { color: "#ef4444", name: "red", icon: "star" },
  { color: "#3b82f6", name: "blue", icon: "circle" },
  { color: "#22c55e", name: "green", icon: "triangle" },
  { color: "#f97316", name: "orange", icon: "square" },
  { color: "#a855f7", name: "purple", icon: "diamond" },
  { color: "#ec4899", name: "pink", icon: "cross" },
  { color: "#14b8a6", name: "teal", icon: "heart" },
  { color: "#84cc16", name: "lime", icon: "moon" },
]

const ICON_MAP: Record<string, string> = {
  star: "\u2B50",
  circle: "\u25CF",
  triangle: "\u25B2",
  square: "\u25A0",
  diamond: "\u25C6",
  cross: "\u2716",
  heart: "\u2764",
  moon: "\u263D",
}

interface PlayerForm {
  name: string
  colorIndex: number | null
}

export default function SetupPage() {
  const router = useRouter()
  const { addPlayer, setPhase, setSessionSeed, resetGame } = useGameStore()
  const [players, setPlayers] = useState<PlayerForm[]>([])
  const hasReset = useRef(false)

  useEffect(() => {
    if (!hasReset.current) {
      resetGame()
      setPlayers([
        { name: "Pemain 1", colorIndex: 0 },
        { name: "Pemain 2", colorIndex: 1 },
      ])
      hasReset.current = true
    }
  }, [resetGame])

  function addPlayerRow() {
    if (players.length >= 8) return
    const usedColors = players.map((p) => p.colorIndex)
    const firstFree = COLORS.findIndex((_, i) => !usedColors.includes(i))
    setPlayers([...players, { name: `Pemain ${players.length + 1}`, colorIndex: firstFree !== -1 ? firstFree : null }])
  }

  function removePlayerRow(index: number) {
    setPlayers(players.filter((_, i) => i !== index))
  }

  function updateName(index: number, name: string) {
    const updated = [...players]
    updated[index] = { ...updated[index], name: name.slice(0, 20) }
    setPlayers(updated)
  }

  function selectColor(index: number, colorIndex: number) {
    const used = players.map((p) => p.colorIndex)
    if (used.includes(colorIndex)) return
    const updated = [...players]
    updated[index] = { ...updated[index], colorIndex }
    setPlayers(updated)
  }

  function canStart(): boolean {
    if (players.length < 2) return false
    return players.every((p) => p.name.trim().length > 0 && p.colorIndex !== null)
  }

  function startGame() {
    if (!canStart()) return
    players.forEach((p) => {
      const c = COLORS[p.colorIndex!]
      addPlayer(p.name.trim(), c.color, c.icon)
    })
    setSessionSeed(Math.floor(Math.random() * 2147483647))
    setPhase("playing")
    router.push("/game")
  }

  const usedColorIndexes = players.map((p) => p.colorIndex)

  return (
    <div className="relative flex-1 flex flex-col items-center justify-start p-4 py-8 bg-[radial-gradient(circle_at_center,_#1c3829_0%,_#0e1c15_70%,_#070d0a_100%)] text-stone-100 min-h-screen overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      <div className="w-full max-w-md space-y-6 z-10">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow">
            Pengaturan Game
          </h1>
          <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-mono">Atur Pemain</p>
        </div>

        {/* Players List */}
        <div className="space-y-4">
          {players.map((player, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/10 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.25)] transition-all hover:border-white/20"
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Nama Pemain ${i + 1}`}
                  maxLength={20}
                  value={player.name}
                  onChange={(e) => updateName(i, e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-stone-200 placeholder-stone-500 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
                    aria-label={`Nama Pemain ${i + 1}`}
                />
                {players.length > 2 && (
                  <button
                    onClick={() => removePlayerRow(i)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-950/20 hover:bg-red-900/30 border border-red-900/30 text-red-400 hover:text-red-300 transition-colors"
                    aria-label={`Hapus pemain ${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Color & Icon Picker */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COLORS.map((c, ci) => {
                  const isUsed = usedColorIndexes.includes(ci) && player.colorIndex !== ci
                  const isSelected = player.colorIndex === ci
                  return (
                    <button
                      key={ci}
                      onClick={() => selectColor(i, ci)}
                      disabled={isUsed}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs transition-all relative ${
                        isSelected
                          ? "ring-2 ring-offset-2 ring-offset-[#0e1c15] ring-white scale-110 shadow-lg"
                          : ""
                      } ${isUsed ? "opacity-25 cursor-not-allowed" : "cursor-pointer hover:scale-110"}`}
                      style={{ backgroundColor: c.color }}
                      aria-label={`${c.name} color${isUsed ? " (used)" : ""}`}
                      title={`${c.name}${isUsed ? " (taken)" : ""}`}
                    >
                      {isSelected && (
                        <span className="text-white text-[10px] font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {ICON_MAP[c.icon]}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Player button */}
        {players.length < 8 && (
          <button
            onClick={addPlayerRow}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-400/60 bg-white/5 hover:bg-white/10 py-3 text-sm font-semibold text-stone-300 hover:text-amber-300 transition-all cursor-pointer shadow-md"
          >
            <UserPlus className="w-4 h-4" /> Tambah Pemain
          </button>
        )}

        {players.length > 0 && players.length < 2 && (
          <p className="text-center text-sm text-amber-500 font-medium">
            Minimal 2 pemain untuk memulai
          </p>
        )}

        {players.length === 8 && (
          <p className="text-center text-xs text-stone-500 font-mono">Maksimal 8 pemain tercapai</p>
        )}

        {/* Start Game Action */}
        <button
          onClick={startGame}
          disabled={!canStart()}
          className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 py-4 text-lg font-bold text-white shadow-[0_4px_24px_rgba(245,158,11,0.3)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer mt-2"
        >
          Mulai Game
        </button>
      </div>
    </div>
  )
}
