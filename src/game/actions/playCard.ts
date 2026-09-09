import {
  addItemToCollection,
  emitEvent,
  removeItemFromCollection,
  requireOtherPlayer,
  requirePlayer,
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
  let player = game.players.find((p) => p.id === playerId);
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
  const { otherPlayer } = requireOtherPlayer(game, player.id);
  const targetPlayer = isForOtherPlayerPile ? otherPlayer : player;
  if (!isCardPlayable(card, targetPlayer.centerPile)) {
    return { success: false, error: "cardNotPlayable" } as const;
  }

  game = { ...game, expiresAt: Date.now() + EXPIRY_EXTENSION_MS };
  game = emitEvent(game, {
    type: "expirationUpdated",
    expiresAt: game.expiresAt,
  });

  game = updatePlayer(game, player.id, (p) => ({
    ...p,
    hand: removeItemFromCollection(p.hand, card),
  }));

  game = updatePlayer(game, targetPlayer.id, (p) => ({
    ...p,
    centerPile: addItemToCollection(p.centerPile, card),
  }));

  game = emitEvent(game, {
    type: "cardPlayed",
    username: player.username,
    card,
    isForOtherPlayerPile,
  });

  game = clearHasNoPlayableCardsIfNotApplicable(game, otherPlayer.id);

  ({ player } = requirePlayer(game, player.id));

  if (player.hand.length === 0 && player.drawPile.length === 0) {
    game = transitionGameToCompleted(game);
    game = emitEvent(game, { type: "gameCompleted" });
  }

  return { success: true, game } as const;
}
