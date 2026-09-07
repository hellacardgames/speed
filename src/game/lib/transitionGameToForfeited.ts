import type { ForfeitedGame, StartedGame } from "../types/Game.js";

export function transitionGameToForfeited(game: StartedGame): ForfeitedGame {
  return { ...game, status: "forfeited" };
}
