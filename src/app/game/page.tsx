"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"

import Board from "@/components/Board"
import Dice from "@/components/Dice"
import Sidebar from "@/components/Sidebar"
import GameStatus from "@/components/GameStatus"
import CardModal from "@/components/CardModal"
import WinnerScreen from "@/components/WinnerScreen"
import { useGameStore } from "@/lib/store"
import { processMove } from "@/lib/game"
import { CardPool } from "@/lib/cardPool"
import { allCards } from "@/data/cards"
import type { Card } from "@/types"

const EVENT_CARD_MAP: Record<string, string> = {
  lucky: "challenge",
  trap: "truthOrDare",
}

export default function GamePage() {
  const {
    players,
    currentPlayerIndex,
    phase,
    movePlayer,
    setPhase,
    nextTurn,
    winnerId,
    setPlayerSkipTurn,
    markCardUsed,
    playerUsedCards,
    finishOrder,
    setFinishOrder,
    sessionSeed,
  } = useGameStore()

  const [notification, setNotification] = useState<string | null>(null)
  const [showDice, setShowDice] = useState(true)
  const [pendingCard, setPendingCard] = useState<Card | null>(null)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)

  const cardPoolRef = useRef<CardPool | null>(null)
  const notifTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const endTurnTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const currentPlayer = players[currentPlayerIndex]

  const getPool = useCallback(() => {
    if (!cardPoolRef.current) {
      cardPoolRef.current = new CardPool(allCards, sessionSeed || Date.now())
    }
    return cardPoolRef.current
  }, [sessionSeed])

  function showNotification(msg: string) {
    if (notifTimeoutRef.current) clearTimeout(notifTimeoutRef.current)
    setNotification(msg)
  }

  function clearNotification() {
    setNotification(null)
  }

  useEffect(() => {
    if (phase !== "playing") return
    const player = players[currentPlayerIndex]
    if (!player || !player.skipTurn) return

    const delayTimer = setTimeout(() => {
      showNotification(`${player.name} melewati giliran ini!`)
    }, 0)

    const timer = setTimeout(() => {
      clearNotification()
      nextTurn()
    }, 1500)

    return () => {
      clearTimeout(delayTimer)
      clearTimeout(timer)
    }
  }, [currentPlayerIndex, phase, players, nextTurn])

  const endTurn = useCallback((delay: number) => {
    if (endTurnTimeoutRef.current) clearTimeout(endTurnTimeoutRef.current)
    endTurnTimeoutRef.current = setTimeout(() => {
      clearNotification()
      setShowDice(true)
      nextTurn()
    }, delay)
  }, [nextTurn])

  function handleCardComplete() {
    setPendingCard(null)
    setCurrentCategory(null)
    setPhase("playing")
    setShowDice(true)
    nextTurn()
  }

  function handleCardSkip() {
    setPendingCard(null)
    setCurrentCategory(null)
    setPhase("playing")
    setShowDice(true)
    nextTurn()
  }

  const handleCardReroll = useCallback(() => {
    if (!pendingCard || !currentCategory || !currentPlayer) return

    const newCard = getPool().draw(currentCategory, playerUsedCards[currentPlayer.id] || [])
    if (!newCard) {
      showNotification(`Tidak ada kartu lain tersedia!`)
      return
    }

    markCardUsed(currentPlayer.id, newCard.id)
    setPendingCard(newCard)
    showNotification("Kartu diacak!")
  }, [pendingCard, currentCategory, currentPlayer, getPool, playerUsedCards, markCardUsed])

  const handleRoll = useCallback(
    (roll: number) => {
      if (!currentPlayer) return

      // Hide dice tray during movement
      setShowDice(false)

      const result = processMove(currentPlayer, roll)

      if (!result.moved) {
        showNotification("Terlalu jauh! Harus mendarat tepat di 100.")
        endTurn(1500)
        return
      }

      const targetPos = currentPlayer.position + roll

      // Move the player token tile-by-tile with enough time for spring animation
      let step = 0
      const stepInterval = setInterval(() => {
        step++
        movePlayer(currentPlayer.id, 1)

        if (step >= roll) {
          clearInterval(stepInterval)

          // Pause briefly on the landing tile before resolving snake/ladder
          setTimeout(() => {
            if (result.triggeredSnake) {
              showNotification(
                `Turuni ular ${result.triggeredSnake.from} → ${result.triggeredSnake.to}!`
              )
              movePlayer(currentPlayer.id, result.triggeredSnake.to - targetPos)
            } else if (result.triggeredLadder) {
              showNotification(
                `Naiki tangga ${result.triggeredLadder.from} → ${result.triggeredLadder.to}!`
              )
              movePlayer(currentPlayer.id, result.triggeredLadder.to - targetPos)
            }

            const hasSnakeOrLadder = result.triggeredSnake || result.triggeredLadder

            // Wait for snake/ladder spring animation to finish
            setTimeout(() => {
              if (result.isWin) {
                const newFinishOrder = [...finishOrder, currentPlayer.id]
                setFinishOrder(newFinishOrder)
                setPlayerSkipTurn(currentPlayer.id, true)
                showNotification(`${currentPlayer.name} menang!`)
                setTimeout(() => {
                  clearNotification()
                  endTurn(800)
                }, 300)
                return
              }

              if (result.pendingEventTile) {
                const tileType = result.pendingEventTile
                const cardType = EVENT_CARD_MAP[tileType] || tileType
                const card = getPool().draw(cardType, playerUsedCards[currentPlayer.id] || [])
                if (!card) {
                  showNotification(`Tidak ada kartu tersedia!`)
                  endTurn(1500)
                  return
                }
                markCardUsed(currentPlayer.id, card.id)
                setPendingCard(card)
                setCurrentCategory(cardType)
                setPhase("challenge")
              } else {
                endTurn(hasSnakeOrLadder ? 800 : 400)
              }
            }, hasSnakeOrLadder ? 800 : 0)

          }, 400)
        }
      }, 350)
    },
    [currentPlayer, movePlayer, setPhase, setPlayerSkipTurn, markCardUsed, playerUsedCards, endTurn, getPool, finishOrder, setFinishOrder, setCurrentCategory]
  )

  return (
    <div className="flex h-screen overflow-hidden bg-stone-900 text-stone-100">
      <Sidebar />

      <main className="flex-1 flex flex-col items-center overflow-y-auto p-4 pb-24 md:pb-6 gap-3 bg-[radial-gradient(circle_at_center,_#1c3829_0%,_#0f1f16_65%,_#060c09_100%)] relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

        <div className="flex flex-col items-center gap-1 z-10 w-full">
          <GameStatus />

          {currentPlayer && (
            <div className="mt-1 bg-black/45 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-center gap-2">
                <span
                  className="w-3 h-3 rounded-full ring-2 ring-white/10 shrink-0"
                  style={{ backgroundColor: currentPlayer.color }}
                />
                <p className="text-sm font-semibold tracking-wide text-white">
                  Giliran {currentPlayer.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full z-10">
          <Board />
        </div>

        {showDice && phase === "playing" && (
          <div className="mt-2 bg-[#1b1511] border-4 border-[#524434] dark:border-[#3d3226] rounded-3xl p-4 shadow-[inset_0_8px_16px_rgba(0,0,0,0.65),_0_12px_24px_rgba(0,0,0,0.4)] flex flex-col items-center gap-1.5 border-double z-10 min-w-[170px] max-w-[200px]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#a89276]/80 font-mono">
              Baki Dadu
            </span>
            <Dice onRoll={handleRoll} disabled={false} />
          </div>
        )}

        <AnimatePresence>
          {notification && (
            <motion.div
              key={notification}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-stone-900/90 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-stone-800 text-sm font-medium z-50 whitespace-nowrap"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        <CardModal
          card={pendingCard}
          open={phase === "challenge"}
          onComplete={handleCardComplete}
          onSkip={handleCardSkip}
          onReroll={handleCardReroll}
        />

      </main>

      {phase === "finished" && winnerId && (
        <WinnerScreen />
      )}
    </div>
  )
}
