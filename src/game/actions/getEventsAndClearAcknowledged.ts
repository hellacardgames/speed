import { getEventsAndClearAcknowledged as doGetEventsAndClearAcknowledged } from "@hellacardgames/lib";
import type { Game } from "../types/Game.js";
import type { GameEvent } from "../types/GameEvent.js";

type GetEventsAndClearAcknowledgedResult =
  | {
      readonly success: true;
      readonly events: readonly GameEvent[];
      readonly game: Game;
    }
  | {
      readonly success: false;
      readonly error: "playerNotFound";
    };

export function getEventsAndClearAcknowledged(
  game: Game,
  playerId: string,
  lastReadId: string | null,
): GetEventsAndClearAcknowledgedResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }

  const result = doGetEventsAndClearAcknowledged(game, player.id, lastReadId);

  return {
    success: true,
    events: result.events,
    game: result.game,
  };
}
