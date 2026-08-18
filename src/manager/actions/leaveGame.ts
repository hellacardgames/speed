import { emitEvent } from "../../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS, MIN_PLAYERS } from "../constants.js";
import { games } from "../games.js";
import type { Game } from "../types/Game.js";

type LeaveGameResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export function leaveGame(gameId: string, playerId: string): LeaveGameResult {
  const game = games.get(gameId);
  if (!game) {
    return { success: false, error: "gameNotFound" };
  }
  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) {
    return { success: false, error: "playerNotFound" };
  }

  const player = game.players[playerIndex]!;
  emitEvent(game, { type: "playerLeft", username: player.username });

  game.players.splice(playerIndex, 1);

  if (game.status === "started" && game.players.length < MIN_PLAYERS) {
    const forfeitedGame: Game = {
      ...game,
      status: "forfeited",
      expiresAt: Date.now() + EXPIRY_EXTENSION_MS,
    };
    games.set(game.id, forfeitedGame);
    emitEvent(forfeitedGame, { type: "gameForfeited" });
    emitEvent(forfeitedGame, {
      type: "expirationUpdated",
      expiresAt: forfeitedGame.expiresAt,
    });
  }
  if (game.players.length === 0) {
    games.delete(game.id);
  }
  return { success: true };
}
