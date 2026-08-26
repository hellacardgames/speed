import { z } from "zod";
import { createServerFactory } from "@hellacardgames/lib";
import { createManager } from "../manager/index.js";

export const createServer = createServerFactory(createManager, {
  drawCard: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),

  playCard: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
      cardId: z.string(),
      isForOtherPlayerPile: z.boolean(),
    })
    .transform(
      ({ gameId, playerId, cardId, isForOtherPlayerPile }) =>
        [gameId, playerId, cardId, isForOtherPlayerPile] as const,
    ),

  reportNoPlayableCards: z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const),
});
