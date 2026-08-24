import { EXPIRY_EXTENSION_MS } from "../constants.js";
import type { CreatedGame } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function createGame(userId: string, username: string) {
  const player: Player = {
    id: crypto.randomUUID(),
    userId,
    username,
    events: [],
    hand: [],
    drawPile: [],
    sidePile: [],
    centerPile: [],
    hasNoPlayableCards: false,
  };

  const createdAt = Date.now();

  const game: CreatedGame = {
    status: "created",
    id: crypto.randomUUID(),
    createdAt,
    expiresAt: createdAt + EXPIRY_EXTENSION_MS,
    chatMessages: [],
    players: [player],
  };

  return { game, playerId: player.id } as const;
}
