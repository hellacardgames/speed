import {
  addItemToCollection,
  emitEvent,
  requirePlayer,
  takeLastItemFromCollection,
  updatePlayer,
} from "@hellacardgames/lib";
import type { StartedGame } from "../types/Game.js";

export function drawCardFromSidePileToCenterPile(
  game: StartedGame,
  playerId: string,
): StartedGame {
  const { player } = requirePlayer(game, playerId);

  const { collection: newSidePile, item: card } = takeLastItemFromCollection(
    player.sidePile,
  );

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    sidePile: newSidePile,
    centerPile: addItemToCollection(p.centerPile, card),
  }));

  game = emitEvent(game, {
    type: "cardDrawnFromSidePileToCenterPile",
    username: player.username,
    card,
  });

  return game;
}
