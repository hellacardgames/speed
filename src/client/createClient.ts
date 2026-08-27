import { createClientFactory } from "@hellacardgames/lib";
import type { createManager } from "../manager/createManager.js";
import type { createServer } from "../server/createServer.js";

export const createClient = createClientFactory<
  ReturnType<typeof createServer>,
  ReturnType<typeof createManager>
>({
  drawCard: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
  playCard: (
    gameId: string,
    playerId: string,
    cardId: string,
    isForOtherPlayerPile: boolean,
  ) => ({
    gameId,
    playerId,
    cardId,
    isForOtherPlayerPile,
  }),
  reportNoPlayableCards: (gameId: string, playerId: string) => ({
    gameId,
    playerId,
  }),
});
