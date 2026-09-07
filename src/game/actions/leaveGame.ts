import { emitEvent } from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS, MIN_PLAYERS } from "../constants.js";
import { removePlayerFromGame } from "../lib/removePlayerFromGame.js";
import { transitionGameToForfeited } from "../lib/transitionGameToForfeited.js";
import type { Game } from "../types/Game.js";

export function leaveGame(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }

  game = emitEvent(game, { type: "playerLeft", username: player.username });
  game = removePlayerFromGame(game, player.id);

  if (game.status === "started" && game.players.length < MIN_PLAYERS) {
    game = transitionGameToForfeited(game);
    game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
    game = emitEvent(game, { type: "gameForfeited" });
    game = emitEvent(game, {
      type: "expirationUpdated",
      expiresAt: game.expiresAt,
    });
  }

  return { success: true, game } as const;
}
