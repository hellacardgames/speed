import { emitEvent } from "../lib/emitEvent.js";
import { MAX_PLAYERS } from "../constants.js";
import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function joinGame(game: Game, userId: string, username: string) {
  if (game.status !== "created") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (game.players.length === MAX_PLAYERS) {
    return { success: false, error: "maxPlayersReached" } as const;
  }
  if (game.players.find((p) => p.userId === userId)) {
    return { success: false, error: "alreadyInGame" } as const;
  }
  const player: Player = {
    id: crypto.randomUUID(),
    userId,
    username,
    events: [],
    hand: [],
    drawPile: [],
    sidePile: [],
    centerPile: [],
    hasNoPlayableCards: false,
  };
  game.players.push(player);
  emitEvent(game, { type: "playerJoined", username });
  return { success: true, game, playerId: player.id } as const;
}
