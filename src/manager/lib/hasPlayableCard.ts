import { isCardPlayable } from "./isCardPlayable.js";
import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function hasPlayableCard(player: Player, game: Game) {
  const otherPlayer = game.players.find((p) => p !== player)!;
  const targetPile1 = player.centerPile;
  const targetPile2 = otherPlayer.centerPile;
  for (const card of player.hand) {
    if (
      isCardPlayable(card, targetPile1) ||
      isCardPlayable(card, targetPile2)
    ) {
      return true;
    }
  }
  return false;
}
