import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { GamePhase, Player, PlayerStats } from "@/types"

interface GameStore {
  players: Player[]
  currentPlayerIndex: number
  phase: GamePhase
  winnerId: string | null
  playerUsedCards: Record<string, string[]>
  playerStats: Record<string, PlayerStats>
  sessionSeed: number
  finishOrder: string[]

  addPlayer: (name: string, color: string, icon: string) => void
  removePlayer: (id: string) => void
  setPhase: (phase: GamePhase) => void
  nextTurn: () => void
  movePlayer: (playerId: string, tiles: number) => void
  markCardUsed: (playerId: string, cardId: string) => void
  resetGame: () => void
  incrementPlayerStat: (playerId: string, stat: keyof PlayerStats) => void
  setSessionSeed: (seed: number) => void
  setPlayerSkipTurn: (playerId: string, skip: boolean) => void
  setWinnerId: (id: string | null) => void
  setFinishOrder: (ids: string[]) => void
}

const initialState = {
  players: [] as Player[],
  currentPlayerIndex: 0,
  phase: "setup" as GamePhase,
  winnerId: null as string | null,
  playerUsedCards: {} as Record<string, string[]>,
  playerStats: {} as Record<string, PlayerStats>,
  sessionSeed: 0,
  finishOrder: [] as string[],
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addPlayer: (name, color, icon) =>
        set((state) => ({
          players: [
            ...state.players,
            {
              id: crypto.randomUUID(),
              name,
              color,
              icon,
              position: 0,
              skipTurn: false,
            },
          ],
        })),

      removePlayer: (id) =>
        set((state) => ({
          players: state.players.filter((p) => p.id !== id),
        })),

      setPhase: (phase) => set({ phase }),

      nextTurn: () => {
        const { players, currentPlayerIndex, phase, finishOrder } = get()
        if (phase === "finished") return
        if (players.length === 0) return

        if (finishOrder.length > 0) {
          if (finishOrder.length === players.length) {
            set({ phase: "finished", winnerId: finishOrder[0] })
            return
          }
          const nextIdx = (currentPlayerIndex + 1) % players.length
          if (finishOrder.includes(players[nextIdx].id)) {
            set({ phase: "finished", winnerId: finishOrder[0] })
            return
          }
        }

        let nextIndex = (currentPlayerIndex + 1) % players.length

        if (players[nextIndex].skipTurn) {
          const updatedPlayers = players.map((p) =>
            p.id === players[nextIndex].id ? { ...p, skipTurn: false } : p
          )
          nextIndex = (nextIndex + 1) % players.length
          set({ currentPlayerIndex: nextIndex, players: updatedPlayers })
          return
        }

        set({ currentPlayerIndex: nextIndex })
      },

      movePlayer: (playerId, tiles) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId
              ? { ...p, position: Math.max(0, p.position + tiles) }
              : p
          ),
        })),

      markCardUsed: (playerId, cardId) =>
        set((state) => {
          const current = state.playerUsedCards[playerId] || []
          return {
            playerUsedCards: {
              ...state.playerUsedCards,
              [playerId]: [...current, cardId],
            },
          }
        }),

      resetGame: () =>
        set({ ...initialState }),

      incrementPlayerStat: (playerId, stat) =>
        set((state) => {
          const current = state.playerStats[playerId] || {
            challenges: 0,
            truths: 0,
            dares: 0,
          }
          return {
            playerStats: {
              ...state.playerStats,
              [playerId]: { ...current, [stat]: current[stat] + 1 },
            },
          }
        }),

      setSessionSeed: (seed) => set({ sessionSeed: seed }),

      setPlayerSkipTurn: (playerId, skip) =>
        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? { ...p, skipTurn: skip } : p
          ),
        })),

      setWinnerId: (id) => set({ winnerId: id }),

      setFinishOrder: (ids) => set({ finishOrder: ids }),
    }),
    {
      name: "snake-challenge-game",
      partialize: (state) => ({
        players: state.players,
        currentPlayerIndex: state.currentPlayerIndex,
        phase: state.phase,
        winnerId: state.winnerId,
        playerUsedCards: state.playerUsedCards,
        playerStats: state.playerStats,
        sessionSeed: state.sessionSeed,
        finishOrder: state.finishOrder,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log("[game-store] rehydrated from localStorage", state.phase)
        }
      },
    }
  )
)
