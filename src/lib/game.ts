import type { Player, BoardConfig, TileType } from "@/types"
import boardData from "@/data/board.json"

const board = boardData as BoardConfig

export interface ProcessMoveResult {
  moved: boolean
  newPosition?: number
  triggeredSnake?: { from: number; to: number }
  triggeredLadder?: { from: number; to: number }
  pendingEventTile?: TileType
  isWin?: boolean
}

export function processMove(player: Player, roll: number): ProcessMoveResult {
  const newPos = player.position + roll

  if (newPos > 100) {
    return { moved: false }
  }

  let finalPos = newPos
  let triggeredSnake: ProcessMoveResult["triggeredSnake"]
  let triggeredLadder: ProcessMoveResult["triggeredLadder"]

  const tile = board.tiles.find((t) => t.number === newPos)

  if (tile?.snakeTo !== undefined) {
    finalPos = tile.snakeTo
    triggeredSnake = { from: newPos, to: tile.snakeTo }
  } else if (tile?.ladderTo !== undefined) {
    finalPos = tile.ladderTo
    triggeredLadder = { from: newPos, to: tile.ladderTo }
  }

  const destTile = board.tiles.find((t) => t.number === finalPos)

  const isSnakeOrLadderLanding = !!(triggeredSnake || triggeredLadder)
  const pendingEventTile =
    !isSnakeOrLadderLanding && destTile && destTile.type !== "normal"
      ? destTile.type
      : undefined

  const isWin = finalPos === 100

  return {
    moved: true,
    newPosition: finalPos,
    triggeredSnake,
    triggeredLadder,
    pendingEventTile,
    isWin,
  }
}

export function getTile(tileNumber: number) {
  return board.tiles.find((t) => t.number === tileNumber)
}

export const TIMEOUT_PENALTY_TILES = 2

export type LuckyEffect = "rollAgain" | "moveForward3"
export type TrapEffect = "moveBack5" | "skipTurn"

export function getLuckyEffect(tileNumber: number): LuckyEffect {
  return tileNumber % 2 === 0 ? "rollAgain" : "moveForward3"
}

export function getTrapEffect(tileNumber: number): TrapEffect {
  return tileNumber % 2 === 0 ? "moveBack5" : "skipTurn"
}
