import { createGame as doCreateGame } from "../../manager/index.js";

export type CreateGameResult =
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
  return doCreateGame(userId, username);
}
