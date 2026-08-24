import { emitEvent } from "../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS, MIN_PLAYERS } from "../constants.js";
import type { Game } from "../types/Game.js";

export function leaveGame(game: Game, playerId: string) {
  const playerIndex = game.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) {
    return { success: false, error: "playerNotFound" } as const;
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
    // this.games.set(game.id, forfeitedGame);
    emitEvent(forfeitedGame, { type: "gameForfeited" });
    emitEvent(forfeitedGame, {
      type: "expirationUpdated",
      expiresAt: forfeitedGame.expiresAt,
    });
  }
  return { success: true, game } as const;
}
