"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HelpCircle, Heart, Swords, Trophy, Shuffle } from "lucide-react"
import type { Card } from "@/types"
import { useFocusTrap } from "@/hooks/useFocusTrap"

interface CardModalProps {
  card: Card | null
  onComplete: () => void
  onSkip: () => void
  onReroll: () => void
  open: boolean
}

const TYPE_META = {
  truth: { icon: Heart, label: "Kebenaran", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  dare: { icon: Swords, label: "Tantangan", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  question: { icon: HelpCircle, label: "Pertanyaan", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  challenge: { icon: Trophy, label: "Tantangan", color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" },
}

export default function CardModal({ card, onComplete, onSkip, onReroll, open }: CardModalProps) {
  const focusRef = useFocusTrap(open && !!card)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      e.preventDefault()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open])

  const handleSkip = useCallback(() => {
    onSkip()
  }, [onSkip])

  const handleComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  if (!card) return null

  const meta = TYPE_META[card.type] || TYPE_META.question
  const Icon = meta.icon

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-0 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={focusRef}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 shadow-xl overflow-hidden rounded-none md:rounded-2xl max-h-full flex flex-col"
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 250, damping: 22 }}
          >
            <div className={`flex items-center gap-3 px-6 pt-6 pb-4 ${meta.color}`}>
              <Icon className="w-8 h-8" />
              <h2 className="text-xl font-bold">{meta.label}</h2>
            </div>

            <div className="px-6 pb-6 space-y-4 flex-1 flex flex-col justify-center">
              <p className="text-lg leading-relaxed">{card.text}</p>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleComplete}
                  className="flex-1 rounded-xl bg-green-600 py-3 text-xs md:text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  Selesai
                </button>
                <button
                  onClick={onReroll}
                  className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 py-3 text-xs md:text-sm font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5" /> Acak
                </button>
                <button
                  onClick={handleSkip}
                  className="flex-1 rounded-xl bg-gray-200 dark:bg-gray-700 py-3 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Lewati
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
