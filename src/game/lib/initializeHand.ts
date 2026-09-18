import {
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { INITIAL_HAND_SIZE } from "../constants.js";
import type { Card } from "../types/Card.js";
import type { StartedGame } from "../types/Game.js";

type InitializeHandResult = {
  readonly game: StartedGame;
  readonly cards: readonly Card[];
};

export function initializeHand(
  game: StartedGame,
  playerId: string,
  cards: readonly Card[],
): InitializeHandResult {
  if (cards.length < INITIAL_HAND_SIZE) {
    throw new Error("Not enough cards.");
  }

  const { player } = getPlayer(game, playerId);

  const hand = cards.slice(0, INITIAL_HAND_SIZE);
  cards = cards.slice(INITIAL_HAND_SIZE);

  game = updatePlayer(game, player.id, (p) => ({ ...p, hand }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerHandInitialized",
    cards: hand,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerHandInitialized",
    numCards: hand.length,
  });

  return { game, cards };
}
