import type { Card } from "../types/Card.js";

export function isCardPlayable(card: Card, targetPile: Card[]) {
  const targetCard = targetPile[targetPile.length - 1]!;
  const diff = Math.abs(card.rank - targetCard.rank) % 11;
  return diff === 1;
}
