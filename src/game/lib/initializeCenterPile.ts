import {
  emitEventToOtherPlayer,
  emitEventToPlayer,
  getPlayer,
  updatePlayer,
} from "@hellacardgames/lib";
import type { Card } from "../types/Card.js";
import type { StartedGame } from "../types/Game.js";

type InitializeCenterPileResult = {
  readonly game: StartedGame;
  readonly cards: readonly Card[];
};

export function initializeCenterPile(
  game: StartedGame,
  playerId: string,
  cards: readonly Card[],
): InitializeCenterPileResult {
  const { player } = getPlayer(game, playerId);

  const card = cards[0];
  if (!card) {
    throw new Error("Not enough cards.");
  }

  cards = cards.slice(1);

  game = updatePlayer(game, player.id, (p) => ({ ...p, centerPile: [card] }));

  game = emitEventToPlayer(game, player.id, {
    type: "playerCenterPileInitialized",
    card,
  });
  game = emitEventToOtherPlayer(game, player.id, {
    type: "otherPlayerCenterPileInitialized",
    card,
  });

  return { game, cards };
}
