import { getOtherPlayer, getPlayer } from "@hellacardgames/lib";
import { isCardPlayable } from "./isCardPlayable.js";
import type { Game } from "../types/Game.js";

export function hasPlayableCard(game: Game, playerId: string) {
  const { player } = getPlayer(game, playerId);
  const { otherPlayer } = getOtherPlayer(game, player.id);
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
