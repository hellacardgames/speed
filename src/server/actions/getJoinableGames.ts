import { getJoinableGames as doGetJoinableGames } from "../../manager/index.js";

export type GetJoinableGamesResult = {
  readonly games: readonly {
    readonly id: string;
    readonly numPlayers: number;
  }[];
};

export function getJoinableGames(): GetJoinableGamesResult {
  return doGetJoinableGames();
}
