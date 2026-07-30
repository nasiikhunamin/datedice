"use client"

import { useGameStore } from "@/lib/store"

export default function Sidebar() {
  const players = useGameStore((s) => s.players)
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex)
  const phase = useGameStore((s) => s.phase)

  const currentPlayer = players[currentPlayerIndex]
  const nextPlayerIndex = (currentPlayerIndex + 1) % players.length
  const nextPlayer = players[nextPlayerIndex]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-56 bg-black/35 backdrop-blur-md border-r border-white/10 p-4 gap-4 h-full text-stone-100 shadow-[4px_0_24px_rgba(0,0,0,0.35)] relative z-20">
        <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400/80 font-mono">
          Pemain
        </h2>

        {currentPlayer && (
          <div className="bg-purple-600/20 border border-purple-500/25 rounded-2xl p-3.5 shadow-md">
            <p className="text-[10px] uppercase font-bold tracking-widest text-purple-400 font-mono">Giliran saat ini</p>
            <div className="flex items-center gap-2.5 mt-1.5">
              <span
                className="flex items-center justify-center w-6 h-6 rounded-full shadow-md border border-white/20 shrink-0"
                style={{ backgroundColor: currentPlayer.color }}
              />
              <span className="font-bold text-sm text-stone-100 truncate">{currentPlayer.name}</span>
            </div>
          </div>
        )}

        <ul className="space-y-2 flex-1 overflow-y-auto">
          {players.map((p, i) => (
            <li
              key={p.id}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-sm transition-all ${
                i === currentPlayerIndex
                  ? "bg-purple-600/90 text-white font-semibold shadow-md shadow-purple-950/20 border border-purple-500"
                  : "bg-black/15 border border-white/5 text-stone-300 hover:bg-black/25"
              }`}
            >
              <span
                className="w-4 h-4 rounded-full shadow-sm shrink-0 border border-white/10"
                style={{ backgroundColor: p.color }}
              />
              <span className="flex-1 truncate font-medium">{p.name}</span>
              <span className="text-xs text-amber-400 font-bold font-mono">#{p.position}</span>
            </li>
          ))}
        </ul>

        {nextPlayer && phase === "playing" && (
          <p className="text-[10px] text-stone-400 text-center border-t border-white/10 pt-3.5 font-mono uppercase tracking-wider font-bold">
            Selanjutnya: <span className="text-stone-200">{nextPlayer.name}</span>
          </p>
        )}
      </aside>

      {/* Mobile bottom bar */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-stone-900/80 backdrop-blur-md border-t border-white/10 px-4 py-3.5 z-40 shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto max-w-[65%]">
            {players.map((p, i) => (
              <span
                key={p.id}
                className={`w-6 h-6 rounded-full shrink-0 transition-all border border-white/10 ${
                  i === currentPlayerIndex
                    ? "ring-2 ring-purple-500 scale-110 shadow-lg shadow-purple-500/25"
                    : "opacity-45"
                }`}
                style={{ backgroundColor: p.color }}
                title={`${p.name} (#${p.position})`}
              />
            ))}
          </div>
          <div className="text-right text-xs">
            {currentPlayer && (
              <p className="font-bold text-stone-100 truncate max-w-[125px] tracking-wide">
                Giliran {currentPlayer.name}
              </p>
            )}
            {nextPlayer && phase === "playing" && (
              <p className="text-[#a89276] text-[10px] uppercase font-bold tracking-widest font-mono mt-0.5">
                Selanjutnya: {nextPlayer.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
