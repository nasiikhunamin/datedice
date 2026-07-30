import board from "../src/data/board.json"
import type { Tile } from "../src/types"

const tiles = board.tiles as Tile[]

const errors: string[] = []

if (tiles.length !== 100) {
  errors.push(`Expected 100 tiles, got ${tiles.length}`)
}

const numbers = new Set<number>()
const snakeHeads = new Set<number>()
const ladderBottoms = new Set<number>()

for (const tile of tiles) {
  if (tile.number < 1 || tile.number > 100) {
    errors.push(`Tile number ${tile.number} out of range 1-100`)
  }
  if (numbers.has(tile.number)) {
    errors.push(`Duplicate tile number ${tile.number}`)
  }
  numbers.add(tile.number)

  if (tile.snakeTo !== undefined) {
    snakeHeads.add(tile.number)
    if (tile.ladderTo !== undefined) {
      errors.push(`Tile ${tile.number} is both snake head and ladder bottom`)
    }
    if (tile.snakeTo >= tile.number) {
      errors.push(`Snake at ${tile.number}: head must be > tail (${tile.snakeTo})`)
    }
    if (tile.snakeTo < 1 || tile.snakeTo > 100) {
      errors.push(`Snake at ${tile.number}: tail ${tile.snakeTo} out of range`)
    }
  }

  if (tile.ladderTo !== undefined) {
    ladderBottoms.add(tile.number)
    if (tile.ladderTo <= tile.number) {
      errors.push(`Ladder at ${tile.number}: bottom must be < top (${tile.ladderTo})`)
    }
    if (tile.ladderTo < 1 || tile.ladderTo > 100) {
      errors.push(`Ladder at ${tile.number}: top ${tile.ladderTo} out of range`)
    }
  }
}

const overlaps = new Set(
  [...snakeHeads].filter((n) => ladderBottoms.has(n))
)
if (overlaps.size > 0) {
  errors.push(`Overlapping snake/ladder positions: ${[...overlaps].join(", ")}`)
}

const typeCounts: Record<string, number> = {}
for (const tile of tiles) {
  typeCounts[tile.type] = (typeCounts[tile.type] || 0) + 1
}

console.log("Tile type distribution:", typeCounts)
console.log(`Snake heads: ${snakeHeads.size} at positions ${[...snakeHeads].sort((a,b) => a-b).join(", ")}`)
console.log(`Ladder bottoms: ${ladderBottoms.size} at positions ${[...ladderBottoms].sort((a,b) => a-b).join(", ")}`)

if (errors.length > 0) {
  console.error("\nValidation ERRORS:")
  errors.forEach((e) => console.error(`  ✗ ${e}`))
  process.exit(1)
} else {
  console.log("\n✓ Board validation passed")
}
