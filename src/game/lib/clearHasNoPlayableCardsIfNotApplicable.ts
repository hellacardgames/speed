import { requirePlayer, updatePlayer } from "@hellacardgames/lib";
import { hasPlayableCard } from "./hasPlayableCard.js";
import type { StartedGame } from "../types/Game.js";

export function clearHasNoPlayableCardsIfNotApplicable(
  game: StartedGame,
  playerId: string,
): StartedGame {
  const { player } = requirePlayer(game, playerId);

  if (player.hasNoPlayableCards && hasPlayableCard(game, player.id)) {
    game = updatePlayer(game, player.id, (p) => ({
      ...p,
      hasNoPlayableCards: false,
    }));
  }

  return game;
}
