import { emitEvent } from "../lib/emitEvent.js";
import { shuffleCards } from "../lib/shuffleCards.js";
import {
  CAN_PLAY_AT_DELAY_MS,
  EXPIRY_EXTENSION_MS,
  MAX_HAND_SIZE,
} from "../constants.js";
import { hasPlayableCard } from "../lib/hasPlayableCard.js";
import type { Game } from "../types/Game.js";

export function reportNoPlayableCards(game: Game, playerId: string) {
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
  if (player.hasNoPlayableCards) {
    return { success: false, error: "alreadyReported" } as const;
  }
  if (hasPlayableCard(player, game)) {
    return { success: false, error: "hasPlayableCard" } as const;
  }
  if (player.drawPile.length > 0 && player.hand.length < MAX_HAND_SIZE) {
    return { success: false, error: "canDraw" } as const;
  }

  game.expiresAt = Date.now() + EXPIRY_EXTENSION_MS;
  emitEvent(game, { type: "expirationUpdated", expiresAt: game.expiresAt });

  player.hasNoPlayableCards = true;

  const otherPlayer = game.players.find((p) => p !== player)!;
  if (otherPlayer.hasNoPlayableCards) {
    if (player.sidePile.length === 0 && otherPlayer.sidePile.length === 0) {
      const cards = [...player.centerPile, ...otherPlayer.centerPile];
      shuffleCards(cards);
      player.sidePile.push(...cards.splice(0, 5));
      emitEvent(game, {
        type: "playerSidePileInitialized",
        username: player.username,
        numCards: player.sidePile.length,
      });
      player.centerPile.push(...cards.splice(0, 1));
      emitEvent(game, {
        type: "playerCenterPileInitialized",
        username: player.username,
        card: player.centerPile[player.centerPile.length - 1]!,
      });
      otherPlayer.centerPile.push(...cards.splice(0, 1));
      emitEvent(game, {
        type: "playerCenterPileInitialized",
        username: otherPlayer.username,
        card: otherPlayer.centerPile[otherPlayer.centerPile.length - 1]!,
      });
      otherPlayer.sidePile.push(...cards.splice(0, 5));
      emitEvent(game, {
        type: "playerSidePileInitialized",
        username: otherPlayer.username,
        numCards: otherPlayer.sidePile.length,
      });
    } else {
      const playerSidePileCard = player.sidePile.pop()!;
      player.centerPile.push(playerSidePileCard);
      emitEvent(game, {
        type: "cardDrawnFromSidePileToCenterPile",
        username: player.username,
        card: playerSidePileCard,
      });
      const otherPlayerSidePileCard = otherPlayer.sidePile.pop()!;
      otherPlayer.centerPile.push(otherPlayerSidePileCard);
      emitEvent(game, {
        type: "cardDrawnFromSidePileToCenterPile",
        username: otherPlayer.username,
        card: otherPlayerSidePileCard,
      });
    }
    player.hasNoPlayableCards = false;
    otherPlayer.hasNoPlayableCards = false;
    game.canPlayAt = Date.now() + CAN_PLAY_AT_DELAY_MS;
    emitEvent(game, {
      type: "canPlayAtUpdated",
      canPlayAt: game.canPlayAt,
    });
  }

  return { success: true, game } as const;
}
