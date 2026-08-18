import { emitEvent } from "../../lib/emitEvent.js";
import { MAX_PLAYERS } from "../constants.js";
import { games } from "../games.js";
import type { Player } from "../types/Player.js";

type JoinGameResult =
  | {
      readonly success: true;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error:
        | "gameNotFound"
        | "invalidStatus"
        | "maxPlayersReached"
        | "alreadyInGame";
    };

export function joinGame(
  gameId: string,
  userId: string,
  username: string,
): JoinGameResult {
  const game = games.get(gameId);
  if (!game) {
    return { success: false, error: "gameNotFound" };
  }
  if (game.status !== "open") {
    return { success: false, error: "invalidStatus" };
  }
  if (game.players.length === MAX_PLAYERS) {
    return { success: false, error: "maxPlayersReached" };
  }
  if (game.players.find((p) => p.userId === userId)) {
    return { success: false, error: "alreadyInGame" };
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
  return { success: true, playerId: player.id };
}
