import { requirePlayer } from "@hellacardgames/lib";
import type { StartedGame } from "../types/Game.js";

export function isOutOfCards(game: StartedGame, playerId: string): boolean {
  const { player } = requirePlayer(game, playerId);
  return player.hand.length === 0 && player.drawPile.length === 0;
}
