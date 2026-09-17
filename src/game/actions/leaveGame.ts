import { emitEvent, removePlayer, requirePlayerOne } from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS, MIN_PLAYERS } from "../constants.js";
import { transitionGameToForfeited } from "../lib/transitionGameToForfeited.js";
import type { Game } from "../types/Game.js";

export function leaveGame(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }

  game = removePlayer(game, player.id);
  game = emitEvent(game, {
    type: "otherPlayerLeft",
  });

  if (game.players.length > 0 && player.id === game.adminId) {
    const newAdmin = requirePlayerOne(game);
    game = { ...game, adminId: newAdmin.id };
    game = emitEvent(game, {
      type: "adminChanged",
      username: newAdmin.username,
    });
  }

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
