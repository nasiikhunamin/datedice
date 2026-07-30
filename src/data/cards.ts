import truthData from "./truth.json"
import dareData from "./dare.json"
import questionData from "./question.json"
import challengeData from "./challenge.json"
import type { Card } from "@/types"

export const allCards: Card[] = [
  ...(truthData as Card[]),
  ...(dareData as Card[]),
  ...(questionData as Card[]),
  ...(challengeData as Card[]),
]
