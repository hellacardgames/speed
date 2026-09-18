import {
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import { INITIAL_SIDE_PILE_SIZE } from "../constants.js";
import type { Card } from "../types/Card.js";
import type { StartedGame } from "../types/Game.js";

type InitializeSidePileResult = {
  readonly game: StartedGame;
  readonly cards: readonly Card[];
};

export function initializeSidePile(
  game: StartedGame,
  playerId: string,
  cards: readonly Card[],
): InitializeSidePileResult {
  if (cards.length < INITIAL_SIDE_PILE_SIZE) {
    throw new Error("Not enough cards.");
  }

  const { player } = getPlayer(game, playerId);

  const sidePile = cards.slice(0, INITIAL_SIDE_PILE_SIZE);
  cards = cards.slice(INITIAL_SIDE_PILE_SIZE);

  game = updatePlayer(game, player.id, (p) => ({ ...p, sidePile }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerSidePileInitialized",
    numCards: sidePile.length,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerSidePileInitialized",
    numCards: sidePile.length,
  });

  return { game, cards };
}
