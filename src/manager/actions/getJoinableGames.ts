import { MAX_PLAYERS } from "../constants.js";
import { games } from "../games.js";

type GetJoinableGamesResult = {
  readonly games: readonly {
    readonly id: string;
    readonly numPlayers: number;
  }[];
};

export function getJoinableGames(): GetJoinableGamesResult {
  return {
    games: Array.from(games.values())
      .filter((g) => g.status === "open" && g.players.length < MAX_PLAYERS)
      .map((g) => ({
        id: g.id,
        numPlayers: g.players.length,
      })),
  };
}
