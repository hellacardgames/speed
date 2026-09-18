import {
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { INITIAL_DRAW_PILE_SIZE } from "../constants.js";
import type { Card } from "../types/Card.js";
import type { StartedGame } from "../types/Game.js";

type InitializeDrawPileResult = {
  readonly game: StartedGame;
  readonly cards: readonly Card[];
};

export function initializeDrawPile(
  game: StartedGame,
  playerId: string,
  cards: readonly Card[],
): InitializeDrawPileResult {
  if (cards.length < INITIAL_DRAW_PILE_SIZE) {
    throw new Error("Not enough cards.");
  }

  const { player } = getPlayer(game, playerId);

  const drawPile = cards.slice(0, INITIAL_DRAW_PILE_SIZE);
  cards = cards.slice(INITIAL_DRAW_PILE_SIZE);

  game = updatePlayer(game, player.id, (p) => ({ ...p, drawPile }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerDrawPileInitialized",
    numCards: drawPile.length,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerDrawPileInitialized",
    numCards: drawPile.length,
  });

  return { game, cards };
}
