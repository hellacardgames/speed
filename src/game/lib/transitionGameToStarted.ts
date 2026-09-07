import type { CreatedGame, StartedGame } from "../types/Game.js";

export function transitionGameToStarted(game: CreatedGame): StartedGame {
  return { ...game, status: "started" };
}
