import { emitEvent } from "../lib/emitEvent.js";
import { emitEventToPlayer } from "../lib/emitEventToPlayer.js";
import { EXPIRY_EXTENSION_MS, MAX_HAND_SIZE } from "../constants.js";
import type { StartedGame } from "../types/Game.js";

type DrawCardResult =
  | {
      readonly success: true;
      readonly game: StartedGame;
    }
  | {
      readonly success: false;
      readonly error:
        "playerNotFound" | "canPlayAtNotReached" | "handFull" | "drawPileEmpty";
    };

export function drawCard(game: StartedGame, playerId: string): DrawCardResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  if (Date.now() < game.canPlayAt) {
    return { success: false, error: "canPlayAtNotReached" };
  }
  if (player.hand.length >= MAX_HAND_SIZE) {
    return { success: false, error: "handFull" };
  }
  if (player.drawPile.length === 0) {
    return { success: false, error: "drawPileEmpty" };
  }
  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });
  const card = player.drawPile.pop()!;
  player.hand.push(card);
  emitEventToPlayer(player, { type: "drewCard", card });
  emitEvent(game, { type: "playerDrewCard", username: player.username });
  return { success: true, game };
}
