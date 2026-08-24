import { getEventsAndClearAcknowledged as doGetEventsAndClearAcknowledged } from "@hellacardgames/lib";
import type { Game } from "../types/Game.js";

export function getEventsAndClearAcknowledged(
  game: Game,
  playerId: string,
  lastReadId: string | null,
) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }

  const result = doGetEventsAndClearAcknowledged(game, player.id, lastReadId);

  return {
    success: true,
    events: result.events,
    game: result.game,
  } as const;
}
