export interface Player {
  id: string
  name: string
  color: string
  icon: string
  position: number
  skipTurn: boolean
}

export interface Card {
  id: string
  type: "truth" | "dare" | "question" | "challenge"
  text: string
}

export interface Tile {
  number: number
  type: TileType
  snakeTo?: number
  ladderTo?: number
}

export interface BoardConfig {
  boardId: string
  tiles: Tile[]
}

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  phase: GamePhase
  winnerId: string | null
  usedCardIds: Record<string, string[]>
  playerStats: Record<string, PlayerStats>
  sessionSeed: number
}

export type GamePhase = "setup" | "playing" | "challenge" | "handoff" | "finished"

export type Theme = "romance"

export type TileType =
  | "normal"
  | "truthOrDare"
  | "question"
  | "challenge"
  | "lucky"
  | "trap"
  | "special"

export interface PlayerStats {
  challenges: number
  truths: number
  dares: number
}
