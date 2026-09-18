import {
  emitEvent,
  getOtherPlayer,
  shuffle,
  tryGetPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import {
  CAN_PLAY_AT_DELAY_MS,
  EXPIRY_EXTENSION_MS,
  MAX_HAND_SIZE,
} from "../constants.js";
import { moveCardFromSidePileToCenterPile } from "../lib/moveCardFromSidePileToCenterPile.js";
import { hasPlayableCard } from "../lib/hasPlayableCard.js";
import { initializeCenterPile } from "../lib/initializeCenterPile.js";
import { initializeSidePile } from "../lib/initializeSidePile.js";
import type { Game } from "../types/Game.js";

export function reportNoPlayableCards(game: Game, playerId: string) {
  const { player } = tryGetPlayer(game, playerId);
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
  if (hasPlayableCard(game, player.id)) {
    return { success: false, error: "hasPlayableCard" } as const;
  }
  if (player.drawPile.length > 0 && player.hand.length < MAX_HAND_SIZE) {
    return { success: false, error: "canDraw" } as const;
  }

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    hasNoPlayableCards: true,
  }));

  const { otherPlayer } = getOtherPlayer(game, player.id);

  if (otherPlayer.hasNoPlayableCards) {
    if (player.sidePile.length === 0 && otherPlayer.sidePile.length === 0) {
      let cards = [...player.centerPile, ...otherPlayer.centerPile] as const;
      cards = shuffle(cards);

      ({ game, cards } = initializeSidePile(game, player.id, cards));
      ({ game, cards } = initializeCenterPile(game, player.id, cards));
      ({ game, cards } = initializeCenterPile(game, otherPlayer.id, cards));
      ({ game, cards } = initializeSidePile(game, otherPlayer.id, cards));

      // Stash the remaining cards.
      game = updatePlayer(game, player.id, (p) => ({
        ...p,
        centerPile: [...cards, ...p.centerPile],
      }));
    } else {
      game = moveCardFromSidePileToCenterPile(game, player.id);
      game = moveCardFromSidePileToCenterPile(game, otherPlayer.id);
    }

    game = updatePlayer(game, player.id, (p) => ({
      ...p,
      hasNoPlayableCards: false,
    }));
    game = updatePlayer(game, otherPlayer.id, (p) => ({
      ...p,
      hasNoPlayableCards: false,
    }));

    game = { ...game, canPlayAt: Date.now() + CAN_PLAY_AT_DELAY_MS };
    game = emitEvent(game, {
      type: "canPlayAtUpdated",
      canPlayAt: game.canPlayAt,
    });
  }

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}
