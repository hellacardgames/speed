import {
  addItem,
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getPlayer,
  takeLastItem,
  updatePlayer,
} from "@hellacardgames/lib";
import type { StartedGame } from "../types/Game.js";

export function moveCardFromSidePileToCenterPile(
  game: StartedGame,
  playerId: string,
): StartedGame {
  const { player } = getPlayer(game, playerId);

  const { collection: newSidePile, item: card } = takeLastItem(player.sidePile);

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    sidePile: newSidePile,
    centerPile: addItem(p.centerPile, card),
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerMovedCardFromSidePileToCenterPile",
    card,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerMovedCardFromSidePileToCenterPile",
    card,
  });

  return game;
}
