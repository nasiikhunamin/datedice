"use client"

import { motion, LayoutGroup } from "framer-motion"
import boardConfig from "@/data/board.json"
import { useGameStore } from "@/lib/store"
import type { BoardConfig, Tile, TileType, Player } from "@/types"
import { HelpCircle, Heart, Trophy, Sparkles, Skull, Star, Play } from "lucide-react"

const tiles = (boardConfig as BoardConfig).tiles

const tileStyles: Record<TileType, { bg: string; border: string; iconColor: string }> = {
  normal: {
    bg: "bg-stone-50 dark:bg-stone-900",
    border: "border-stone-200/50 dark:border-zinc-800/40",
    iconColor: ""
  },
  truthOrDare: {
    bg: "bg-pink-500/5 dark:bg-pink-500/10",
    border: "border-pink-300/80 dark:border-pink-700/60 shadow-[inset_0_0_12px_rgba(236,72,153,0.1)]",
    iconColor: "text-pink-500/80 dark:text-pink-400/80"
  },
  question: {
    bg: "bg-blue-500/5 dark:bg-blue-500/10",
    border: "border-blue-300/80 dark:border-blue-700/60 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]",
    iconColor: "text-blue-500/80 dark:text-blue-400/80"
  },
  challenge: {
    bg: "bg-orange-500/5 dark:bg-orange-500/10",
    border: "border-orange-300/80 dark:border-orange-700/60 shadow-[inset_0_0_12px_rgba(249,115,22,0.1)]",
    iconColor: "text-orange-500/80 dark:text-orange-400/80"
  },
  lucky: {
    bg: "bg-emerald-500/5 dark:bg-emerald-500/10",
    border: "border-emerald-300/80 dark:border-emerald-700/60 shadow-[inset_0_0_12px_rgba(16,185,129,0.1)]",
    iconColor: "text-emerald-500/80 dark:text-emerald-400/80"
  },
  trap: {
    bg: "bg-stone-500/5 dark:bg-stone-500/10",
    border: "border-stone-400/80 dark:border-stone-600/60 shadow-[inset_0_0_12px_rgba(120,113,108,0.1)]",
    iconColor: "text-stone-500/80 dark:text-stone-400/80"
  },
  special: {
    bg: "bg-amber-500/5 dark:bg-amber-500/10",
    border: "border-amber-300/80 dark:border-amber-700/60 shadow-[inset_0_0_12px_rgba(245,158,11,0.1)]",
    iconColor: "text-amber-500/80 dark:text-amber-400/80"
  }
}

function getTileStyle(type: TileType, number: number): { bgClass: string; borderClass: string } {
  if (number === 1) {
    return {
      bgClass: "bg-emerald-500/10 dark:bg-emerald-500/15",
      borderClass: "border-emerald-400 dark:border-emerald-600 shadow-[inset_0_0_15px_rgba(16,185,129,0.15)]"
    }
  }
  if (number === 100) {
    return {
      bgClass: "bg-gradient-to-br from-amber-400/15 to-yellow-500/10 dark:from-amber-600/20 dark:to-yellow-700/15",
      borderClass: "border-amber-400 dark:border-amber-600 shadow-[inset_0_0_18px_rgba(245,158,11,0.2)]"
    }
  }
  const base = tileStyles[type] || tileStyles.normal
  if (type === "normal") {
    // Alternate checkered colors
    const isEven = number % 2 === 0
    const bg = isEven
      ? "bg-[#faf8f5] dark:bg-zinc-800/65"
      : "bg-[#f2efe9] dark:bg-zinc-900/65"
    return { bgClass: bg, borderClass: base.border }
  }
  return { bgClass: base.bg, borderClass: base.border }
}

function getGridPosition(tileNumber: number) {
  const rowFromBottom = Math.floor((tileNumber - 1) / 10)
  const colInRow = (tileNumber - 1) % 10
  const displayRow = 9 - rowFromBottom
  const displayCol = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow
  return { row: displayRow, col: displayCol }
}

function getTileCoords(tileNumber: number) {
  const { row, col } = getGridPosition(tileNumber)
  return {
    x: col * 100 + 50,
    y: row * 100 + 50,
  }
}

function TileIcon({ type, number }: { type: TileType; number: number }) {
  if (number === 1) return <Play className="w-5 h-5 opacity-70 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
  if (number === 100) return <Trophy className="w-6 h-6 text-amber-500 drop-shadow animate-pulse" />
  
  const iconClass = "w-5 h-5 opacity-25 dark:opacity-35 shrink-0"

  switch (type) {
    case "truthOrDare": return <Heart className={`${iconClass} text-pink-500 dark:text-pink-400`} />
    case "question": return <HelpCircle className={`${iconClass} text-blue-600 dark:text-blue-400`} />
    case "challenge": return <Trophy className={`${iconClass} text-orange-600 dark:text-orange-400`} />
    case "lucky": return <Sparkles className={`${iconClass} text-emerald-600 dark:text-emerald-400`} />
    case "trap": return <Skull className={`${iconClass} text-stone-600 dark:text-stone-400`} />
    case "special": return <Star className={`${iconClass} text-amber-500 dark:text-amber-400`} />
    default: return null
  }
}

function PawnToken({ player, index, total }: { player: Player; index: number; total: number }) {
  let offsetStyle = {}
  if (total > 1) {
    const angle = (index * (2 * Math.PI)) / total
    const radius = 12
    const tx = Math.cos(angle) * radius
    const ty = Math.sin(angle) * radius
    offsetStyle = {
      transform: `translate(${tx}px, ${ty}px)`,
    }
  }

  return (
    <motion.div
      layoutId={player.id}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
      transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
      style={offsetStyle}
    >
      <motion.span
        className="flex items-center justify-center w-5 h-5 md:w-7 md:h-7 rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.3)] border-2 border-white dark:border-gray-800 shrink-0 pointer-events-auto"
        style={{ backgroundColor: player.color }}
        whileHover={{ scale: 1.25, zIndex: 30 }}
        title={player.name}
      />
    </motion.div>
  )
}

function TileCell({ tile, players }: { tile: Tile; players: Player[] }) {
  const { row, col } = getGridPosition(tile.number)
  const isSnakeHead = tile.snakeTo !== undefined
  const isLadderBottom = tile.ladderTo !== undefined
  const occupants = players.filter((p) => p.position === tile.number)

  const labelParts = [`Tile ${tile.number}`]
  if (tile.type !== "normal") labelParts.push(tile.type)
  if (isSnakeHead) labelParts.push(`snake to ${tile.snakeTo}`)
  if (isLadderBottom) labelParts.push(`ladder to ${tile.ladderTo}`)
  if (occupants.length > 0) {
    labelParts.push(`occupied by ${occupants.map((p) => p.name).join(", ")}`)
  }

  const { bgClass, borderClass } = getTileStyle(tile.type, tile.number)

  return (
    <motion.div
      className={`relative flex flex-col items-center justify-between aspect-square min-w-0 p-1 border font-medium select-none overflow-hidden ${bgClass} ${borderClass}`}
      style={{
        gridRow: row + 1,
        gridColumn: col + 1,
      }}
      whileHover={{ scale: 1.03, zIndex: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      role="gridcell"
      aria-label={labelParts.join(", ")}
    >
      {/* Tile Numbering (clean, positioned top-left or top-right) */}
      <span className="self-start text-[clamp(0.55rem,1.8vw,0.8rem)] text-stone-500 dark:text-zinc-400 font-bold font-mono">
        {tile.number}
      </span>

      {/* Decorative center icon for special types */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <TileIcon type={tile.type} number={tile.number} />
      </div>

      {/* Start/Finish labels */}
      {tile.number === 1 && (
        <span className="text-[7px] md:text-[9px] uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 mt-auto z-10">
          Mulai
        </span>
      )}
      {tile.number === 100 && (
        <span className="text-[7px] md:text-[9px] uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400 mt-auto z-10">
          Selesai
        </span>
      )}

      {/* Players */}
      {occupants.map((p, idx) => (
        <PawnToken key={p.id} player={p} index={idx} total={occupants.length} />
      ))}
    </motion.div>
  )
}

function Snake({ from, to }: { from: number; to: number }) {
  const start = getTileCoords(from) // Head
  const end = getTileCoords(to) // Tail
  
  const dx = end.x - start.x
  const dy = end.y - start.y
  const len = Math.sqrt(dx * dx + dy * dy)
  
  // Perpendicular normal vector
  const nx = -dy / len
  const ny = dx / len
  
  // Make a wavy curve using cubic Bezier points
  const waveAmp = Math.min(75, len * 0.25)
  const cp1x = start.x + dx * 0.33 + nx * waveAmp
  const cp1y = start.y + dy * 0.33 + ny * waveAmp
  
  const cp2x = start.x + dx * 0.67 - nx * waveAmp
  const cp2y = start.y + dy * 0.67 - ny * waveAmp
  
  const pathData = `M ${start.x} ${start.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${end.x} ${end.y}`
  
  // Direction tangent vector at the head for tongue orientation
  const tx = cp1x - start.x
  const ty = cp1y - start.y
  const tlen = Math.sqrt(tx * tx + ty * ty)
  const ux = tx / (tlen || 1)
  const uy = ty / (tlen || 1)
  
  const headRadius = 14
  const tongueStart = { x: start.x - ux * headRadius, y: start.y - uy * headRadius }
  const tongueEnd1 = { x: tongueStart.x - ux * 12 + uy * 5, y: tongueStart.y - uy * 12 - ux * 5 }
  const tongueEnd2 = { x: tongueStart.x - ux * 12 - uy * 5, y: tongueStart.y - uy * 12 + ux * 5 }
  
  return (
    <g>
      {/* Red Tongue */}
      <path
        d={`M ${tongueStart.x} ${tongueStart.y} L ${tongueStart.x - ux * 8} ${tongueStart.y - uy * 8} M ${tongueStart.x - ux * 8} ${tongueStart.y - uy * 8} L ${tongueEnd1.x} ${tongueEnd1.y} M ${tongueStart.x - ux * 8} ${tongueStart.y - uy * 8} L ${tongueEnd2.x} ${tongueEnd2.y}`}
        stroke="#ef4444"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Snake Body Shadows */}
      <path
        d={pathData}
        stroke="rgba(0, 0, 0, 0.22)"
        strokeWidth="24"
        strokeLinecap="round"
        fill="none"
        filter="url(#shadow-filter)"
      />
      
      {/* Snake Body Outer */}
      <path
        d={pathData}
        stroke="url(#snake-body-gradient)"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Snake Body Inner Scales */}
      <path
        d={pathData}
        stroke="url(#snake-scales-gradient)"
        strokeWidth="8"
        strokeDasharray="5 7"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Snake Head */}
      <circle
        cx={start.x}
        cy={start.y}
        r={headRadius}
        fill="url(#snake-head-gradient)"
        filter="url(#shadow-filter)"
      />
      
      {/* Snake Eyes */}
      <circle
        cx={start.x - ux * 5 - uy * 4.5}
        cy={start.y - uy * 5 + ux * 4.5}
        r="2"
        fill="#ffffff"
      />
      <circle
        cx={start.x - ux * 6 - uy * 4.5}
        cy={start.y - uy * 6 + ux * 4.5}
        r="0.8"
        fill="#000000"
      />
      
      <circle
        cx={start.x - ux * 5 + uy * 4.5}
        cy={start.y - uy * 5 - ux * 4.5}
        r="2"
        fill="#ffffff"
      />
      <circle
        cx={start.x - ux * 6 + uy * 4.5}
        cy={start.y - uy * 6 - ux * 4.5}
        r="0.8"
        fill="#000000"
      />
    </g>
  )
}

function Ladder({ from, to }: { from: number; to: number }) {
  const start = getTileCoords(from)
  const end = getTileCoords(to)
  
  const dx = end.x - start.x
  const dy = end.y - start.y
  const len = Math.sqrt(dx * dx + dy * dy)
  
  // Perpendicular normal vector
  const nx = -dy / len
  const ny = dx / len
  
  const w = 15 // Half ladder width
  
  // Left Rail
  const rx1_start = start.x - nx * w
  const ry1_start = start.y - ny * w
  const rx1_end = end.x - nx * w
  const ry1_end = end.y - ny * w
  
  // Right Rail
  const rx2_start = start.x + nx * w
  const ry2_start = start.y + ny * w
  const rx2_end = end.x + nx * w
  const ry2_end = end.y + ny * w
  
  // Calculate Rungs
  const rungSpacing = 35
  const numRungs = Math.max(3, Math.floor(len / rungSpacing))
  const rungs = []
  for (let i = 1; i < numRungs; i++) {
    const t = i / numRungs
    const px = start.x + dx * t
    const py = start.y + dy * t
    
    rungs.push({
      x1: px - nx * w,
      y1: py - ny * w,
      x2: px + nx * w,
      y2: py + ny * w,
    })
  }
  
  return (
    <g>
      {/* Shadows for rails and rungs */}
      <g opacity="0.3" filter="url(#shadow-filter)">
        <line x1={rx1_start + 3} y1={ry1_start + 5} x2={rx1_end + 3} y2={ry1_end + 5} stroke="#000000" strokeWidth="6" strokeLinecap="round" />
        <line x1={rx2_start + 3} y1={ry2_start + 5} x2={rx2_end + 3} y2={ry2_end + 5} stroke="#000000" strokeWidth="6" strokeLinecap="round" />
        {rungs.map((r, i) => (
          <line key={i} x1={r.x1 + 3} y1={r.y1 + 5} x2={r.x2 + 3} y2={r.y2 + 5} stroke="#000000" strokeWidth="4.5" strokeLinecap="round" />
        ))}
      </g>
      
      {/* Main Rails */}
      <line
        x1={rx1_start}
        y1={ry1_start}
        x2={rx1_end}
        y2={ry1_end}
        stroke="url(#ladder-rail-gradient)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <line
        x1={rx2_start}
        y1={ry2_start}
        x2={rx2_end}
        y2={ry2_end}
        stroke="url(#ladder-rail-gradient)"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      
      {/* Rungs */}
      {rungs.map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="url(#ladder-rung-gradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}
    </g>
  )
}

export default function Board() {
  const players = useGameStore((s) => s.players)

  const snakes = tiles
    .filter((t) => t.snakeTo !== undefined)
    .map((t) => ({ from: t.number, to: t.snakeTo! }))

  const ladders = tiles
    .filter((t) => t.ladderTo !== undefined)
    .map((t) => ({ from: t.number, to: t.ladderTo! }))

  return (
    <div className="w-full max-w-[620px] mx-auto p-3.5 bg-gradient-to-b from-[#dfd7c2] to-[#cfc4ac] dark:from-[#2e2a24] dark:to-[#221f1a] rounded-3xl shadow-[0_12px_28px_rgba(0,0,0,0.35),_0_2px_4px_rgba(0,0,0,0.1),_inset_0_2px_1px_rgba(255,255,255,0.15)] border-4 border-[#8e7e60] dark:border-[#524939] relative select-none" role="grid" aria-label="Game board">
      <LayoutGroup>
        <div className="relative grid grid-cols-10 gap-0 rounded-xl overflow-hidden border-2 border-[#a8987a]/60 dark:border-[#3d362a]/60 shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
          
          {/* Tiles layout */}
          {tiles.map((tile) => (
            <TileCell key={tile.number} tile={tile} players={players} />
          ))}

          {/* SVG Overlay for Snakes and Ladders */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-multiply dark:mix-blend-normal" viewBox="0 0 1000 1000">
            <defs>
              {/* Drop Shadow filter */}
              <filter id="shadow-filter" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="5" stdDeviation="5" floodOpacity="0.45" />
              </filter>
              
              {/* Snake gradients */}
              <linearGradient id="snake-body-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" /> {/* Emerald */}
                <stop offset="35%" stopColor="#10b981" />
                <stop offset="70%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </linearGradient>
              
              <linearGradient id="snake-scales-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="50%" stopColor="#059669" />
                <stop offset="100%" stopColor="#022c22" />
              </linearGradient>
              
              <radialGradient id="snake-head-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="60%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>
              
              {/* Ladder gradients */}
              <linearGradient id="ladder-rail-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d97706" /> {/* Amber-600 */}
                <stop offset="40%" stopColor="#b45309" /> {/* Amber-700 */}
                <stop offset="100%" stopColor="#78350f" /> {/* Amber-900 */}
              </linearGradient>
              
              <linearGradient id="ladder-rung-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" /> {/* Amber-500 */}
                <stop offset="50%" stopColor="#d97706" /> {/* Amber-600 */}
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            
            {/* Draw all Ladders first */}
            {ladders.map((l, idx) => (
              <Ladder key={`ladder-${idx}`} from={l.from} to={l.to} />
            ))}
            
            {/* Draw all Snakes second so they sit on top */}
            {snakes.map((s, idx) => (
              <Snake key={`snake-${idx}`} from={s.from} to={s.to} />
            ))}
          </svg>
        </div>
      </LayoutGroup>
    </div>
  )
}
