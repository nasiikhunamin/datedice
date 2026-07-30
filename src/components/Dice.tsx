"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface DiceProps {
  onRoll: (result: number) => void
  disabled: boolean
}

const FACE_PIPS = [
  [4],
  [0, 8],
  [0, 4, 8],
  [0, 2, 6, 8],
  [0, 2, 4, 6, 8],
  [0, 2, 3, 5, 6, 8],
]

const FACE_ROTATIONS = [
  { x: 0, y: 0 },
  { x: 0, y: 180 },
  { x: 0, y: -90 },
  { x: 0, y: 90 },
  { x: -90, y: 0 },
  { x: 90, y: 0 },
]

export default function Dice({ onRoll, disabled }: DiceProps) {
  const [rolling, setRolling] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleRollClick = useCallback(() => {
    if (disabled || rolling) return

    setRolling(true)
    const result = Math.floor(Math.random() * 6) + 1

    const baseRot = FACE_ROTATIONS[result - 1]

    const extraSpinsX = (4 + Math.floor(Math.random() * 3)) * 360
    const extraSpinsY = (4 + Math.floor(Math.random() * 3)) * 360

    setRotation({
      x: baseRot.x + extraSpinsX,
      y: baseRot.y + extraSpinsY,
    })

    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return
      setRolling(false)
      onRoll(result)
    }, 1250)
  }, [disabled, rolling, onRoll])

  return (
    <div className="flex flex-col items-center gap-4 my-2 select-none">
      <div
        className="w-24 h-24 flex items-center justify-center"
        style={{ perspective: "400px" }}
      >
        <motion.div
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
          }}
          transition={{
            duration: 1.2,
            ease: [0.25, 1, 0.5, 1],
          }}
          className="relative w-16 h-16 pointer-events-auto"
          style={{ transformStyle: "preserve-3d" }}
          onClick={handleRollClick}
        >
          {[0, 1, 2, 3, 4, 5].map((faceIndex) => {
            const isRedPip = faceIndex === 0 || faceIndex === 3
            const targetPips = FACE_PIPS[faceIndex]

            let faceTransform = ""
            switch (faceIndex) {
              case 0: faceTransform = "rotateY(0deg) translateZ(32px)"; break
              case 1: faceTransform = "rotateY(180deg) translateZ(32px)"; break
              case 2: faceTransform = "rotateY(90deg) translateZ(32px)"; break
              case 3: faceTransform = "rotateY(-90deg) translateZ(32px)"; break
              case 4: faceTransform = "rotateX(90deg) translateZ(32px)"; break
              case 5: faceTransform = "rotateX(-90deg) translateZ(32px)"; break
            }

            return (
              <div
                key={faceIndex}
                className="absolute inset-0 bg-stone-50 dark:bg-zinc-800 border-2 border-stone-300 dark:border-zinc-700 rounded-xl shadow-[inset_0_4px_6px_rgba(255,255,255,1),_inset_0_-4px_6px_rgba(0,0,0,0.1),_0_4px_10px_rgba(0,0,0,0.2)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),_inset_0_-4px_6px_rgba(0,0,0,0.4),_0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center"
                style={{
                  transform: faceTransform,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2 justify-items-center items-center">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cellIndex) => {
                    const hasPip = targetPips.includes(cellIndex)
                    if (!hasPip) return <div key={cellIndex} className="w-2.5 h-2.5" />

                    const isOne = faceIndex === 0
                    const pipSize = isOne ? "w-4.5 h-4.5" : "w-2.5 h-2.5"
                    const pipBg = isRedPip
                      ? "bg-red-600 dark:bg-red-500 shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]"
                      : "bg-stone-800 dark:bg-stone-200 shadow-[inset_0_1px_1px_rgba(0,0,0,0.4)]"

                    return (
                      <div
                        key={cellIndex}
                        className={`${pipSize} ${pipBg} rounded-full`}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      <button
        onClick={handleRollClick}
        disabled={disabled || rolling}
        className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_6px_rgba(0,0,0,0.1)] active:scale-95 ${
          disabled || rolling
            ? "bg-stone-200 dark:bg-zinc-800 text-stone-400 dark:text-zinc-600 cursor-not-allowed border-none"
            : "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer hover:shadow-lg"
        }`}
      >
        {rolling ? "Melempar..." : "Lempar Dadu"}
      </button>
    </div>
  )
}
