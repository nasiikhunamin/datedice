import type { Card } from "@/types"

function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array]
  let s = seed | 0
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) | 0
    const j = Math.abs(s) % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export class CardPool {
  private allByCategory: Map<string, Card[]>

  constructor(allCards: Card[], seed: number) {
    this.allByCategory = new Map()
    const groups: Record<string, Card[]> = {}

    for (const card of allCards) {
      ;(groups[card.type] ??= []).push(card)
    }

    for (const [type, cards] of Object.entries(groups)) {
      this.allByCategory.set(type, seededShuffle(cards, seed))
    }

    if (groups["truth"] || groups["dare"]) {
      const truthOrDare = [...(groups["truth"] || []), ...(groups["dare"] || [])]
      this.allByCategory.set("truthOrDare", seededShuffle(truthOrDare, seed))
    }
  }

  draw(category: string, usedCardIds: string[]): Card | null {
    const all = this.allByCategory.get(category)
    if (!all || all.length === 0) return null

    const usedSet = new Set(usedCardIds)
    const available = all.filter((c) => !usedSet.has(c.id))

    if (available.length === 0) {
      const reshuffled = seededShuffle(all, Date.now())
      this.allByCategory.set(category, reshuffled)
      return reshuffled[0]
    }

    return available[Math.floor(Math.random() * available.length)]
  }

  getAvailableCount(category: string, usedCardIds: string[]): number {
    const all = this.allByCategory.get(category)
    if (!all) return 0
    const usedSet = new Set(usedCardIds)
    return all.filter((c) => !usedSet.has(c.id)).length
  }
}
