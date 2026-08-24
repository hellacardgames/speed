import { emitEvent } from "../lib/emitEvent.js";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { hasPlayableCard } from "../lib/hasPlayableCard.js";
import { isCardPlayable } from "../lib/isCardPlayable.js";
import type { CompletedGame, StartedGame } from "../types/Game.js";

export function playCard(
  game: StartedGame,
  playerId: string,
  cardId: string,
  isForOtherPlayerPile: boolean,
) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (Date.now() < game.canPlayAt) {
    return { success: false, error: "canPlayAtNotReached" } as const;
  }
  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return { success: false, error: "cardNotFound" } as const;
  }
  const otherPlayer = game.players.find((p) => p !== player)!;
  const targetPile = isForOtherPlayerPile
    ? otherPlayer.centerPile
    : player.centerPile;
  const card = player.hand[cardIndex]!;
  if (!isCardPlayable(card, targetPile)) {
    return { success: false, error: "cardNotPlayable" } as const;
  }

  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });

  player.hand.splice(cardIndex, 1);
  targetPile.push(card);
  emitEvent(game, {
    type: "cardPlayed",
    username: player.username,
    card,
    isForOtherPlayerPile,
  });

  if (otherPlayer.hasNoPlayableCards && hasPlayableCard(otherPlayer, game)) {
    otherPlayer.hasNoPlayableCards = false;
  }

  if (player.hand.length === 0 && player.drawPile.length === 0) {
    emitEvent(game, { type: "gameCompleted" });
    const completedGame: CompletedGame = {
      ...game,
      status: "completed",
    };
    return { success: true, game: completedGame } as const;
  }

  return { success: true, game } as const;
}
