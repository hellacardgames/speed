import { removeItemFromCollection, requirePlayer } from "@hellacardgames/lib";

type Game = {
  readonly players: readonly {
    readonly id: string;
  }[];
};

export function removePlayerFromGame<TGame extends Game>(
  game: TGame,
  playerId: string,
): TGame {
  const { player } = requirePlayer(game, playerId);
  game = { ...game, players: removeItemFromCollection(game.players, player) };
  return game;
}
