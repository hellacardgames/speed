import type { Game } from "../types/Game.js";
import type { Player } from "../types/Player.js";

export function requireOtherPlayer(game: Game, playerId: string): Player {
  const otherPlayer = game.players.find((p) => p.id !== playerId);
  if (!otherPlayer) {
    throw new Error("Other player not found.");
  }

  return otherPlayer;
}
