import {
  addItem,
  emitEvent,
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getOtherPlayer,
  getPlayer,
  removeItem,
  tryGetPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { EXPIRY_EXTENSION_MS } from "../constants.js";
import { clearHasNoPlayableCardsIfNotApplicable } from "../lib/clearHasNoPlayableCardsIfNotApplicable.js";
import { isCardPlayable } from "../lib/isCardPlayable.js";
import { transitionGameToCompleted } from "../lib/transitionGameToCompleted.js";
import type { Game } from "../types/Game.js";

export function playCard(
  game: Game,
  playerId: string,
  cardId: string,
  isForOtherPlayerPile: boolean,
) {
  let { player } = tryGetPlayer(game, playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  if (game.status !== "started") {
    return { success: false, error: "invalidStatus" } as const;
  }
  if (Date.now() < game.canPlayAt) {
    return { success: false, error: "canPlayAtNotReached" } as const;
  }
  const card = player.hand.find((c) => c.id === cardId);
  if (!card) {
    return { success: false, error: "cardNotFound" } as const;
  }
  const { otherPlayer } = getOtherPlayer(game, player.id);
  const targetPlayer = isForOtherPlayerPile ? otherPlayer : player;
  if (!isCardPlayable(card, targetPlayer.centerPile)) {
    return { success: false, error: "cardNotPlayable" } as const;
  }

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    hand: removeItem(p.hand, card),
  }));

  game = updatePlayer(game, targetPlayer.id, (p) => ({
    ...p,
    centerPile: addItem(p.centerPile, card),
  }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerPlayedCard",
    card,
    isForOtherPlayerPile,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerPlayedCard",
    card,
    isForOtherPlayerPile,
  });

  game = clearHasNoPlayableCardsIfNotApplicable(game, otherPlayer.id);

  ({ player } = getPlayer(game, player.id));

  if (player.hand.length === 0 && player.drawPile.length === 0) {
    game = transitionGameToCompleted(game);
    game = emitEvent(game, { type: "gameCompleted" });
  }

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  return { success: true, game } as const;
}
