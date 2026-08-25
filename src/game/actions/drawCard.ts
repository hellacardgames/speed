import { emitEvent } from "../lib/emitEvent.js";
import { emitEventToPlayer } from "../lib/emitEventToPlayer.js";
import { EXPIRY_EXTENSION_MS, MAX_HAND_SIZE } from "../constants.js";
import type { Game } from "../types/Game.js";

export function drawCard(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (Date.now() < game.canPlayAt) {
    return { success: false, error: "canPlayAtNotReached" } as const;
  }
  if (player.hand.length >= MAX_HAND_SIZE) {
    return { success: false, error: "handFull" } as const;
  }
  if (player.drawPile.length === 0) {
    return { success: false, error: "drawPileEmpty" } as const;
  }
  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
  const card = player.drawPile.pop()!;
  player.hand.push(card);
  emitEventToPlayer(player, { type: "drewCard", card });
  emitEvent(game, { type: "playerDrewCard", username: player.username });
  return { success: true, game } as const;
}
