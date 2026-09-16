import { getRankValue } from "@hellacardgames/lib";
import type { Card } from "../types/Card.js";

export function isCardPlayable(card: Card, targetPile: readonly Card[]) {
  const targetCard = targetPile[targetPile.length - 1]!;
  const rankValue = getRankValue(card.rank);
  const targetRankValue = getRankValue(targetCard.rank);
  const diff = Math.abs(rankValue - targetRankValue) % 11;
  return diff === 1;
}
