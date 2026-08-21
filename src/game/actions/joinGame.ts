import { emitEvent } from "../lib/emitEvent.js";
import { MAX_PLAYERS } from "../constants.js";
import type { CreatedGame } from "../types/Game.js";
import type { Player } from "../types/Player.js";

type JoinGameResult =
  | {
      readonly success: true;
      readonly game: CreatedGame;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error: "maxPlayersReached" | "alreadyInGame";
    };

export function joinGame(
  game: CreatedGame,
  userId: string,
  username: string,
): JoinGameResult {
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
  return { success: true, game, playerId: player.id };
}
