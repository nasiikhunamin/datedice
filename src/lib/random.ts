export function createRng(seed: number): () => number {
  let s = seed | 0
  return () => {
    s = (s * 1664525 + 1013904223) | 0
    return (s >>> 0) / 4294967296
  }
}

export function rollDice(rng: () => number): number {
  return Math.floor(rng() * 6) + 1
}
