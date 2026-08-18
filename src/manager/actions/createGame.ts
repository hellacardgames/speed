import { EXPIRY_EXTENSION_MS, MAX_GAMES } from "../constants.js";
import { games } from "../games.js";
import type { Player } from "../types/Player.js";
import type { Game } from "../types/Game.js";

type CreateGameResult =
  | {
      readonly success: true;
      readonly gameId: string;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error: "maxGamesReached";
    };

export function createGame(userId: string, username: string): CreateGameResult {
  if (games.size === MAX_GAMES) {
    return { success: false, error: "maxGamesReached" };
  }
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
  const game: Game = {
    status: "open",
    id: crypto.randomUUID(),
    createdAt,
    expiresAt: createdAt + EXPIRY_EXTENSION_MS,
    chatMessages: [],
    players: [player],
  };
  games.set(game.id, game);
  return { success: true, gameId: game.id, playerId: player.id };
}
