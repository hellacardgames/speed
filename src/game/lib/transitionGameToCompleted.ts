import type { CompletedGame, StartedGame } from "../types/Game.js";

export function transitionGameToCompleted(game: StartedGame): CompletedGame {
  return { ...game, status: "completed" };
}
