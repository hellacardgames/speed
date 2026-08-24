import { z } from "zod";
import { createServerFactory } from "@hellacardgames/lib";
import { createManager } from "../manager/index.js";

export const createServer = createServerFactory(createManager, (manager) => {
  const drawCardInputSchema = z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const);

  function drawCard(input: unknown) {
    const parseResult = drawCardInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" } as const;
    }
    return manager.drawCard(...parseResult.data);
  }

  const playCardInputSchema = z
    .object({
      gameId: z.string(),
      playerId: z.string(),
      cardId: z.string(),
      isForOtherPlayerPile: z.boolean(),
    })
    .transform(
      ({ gameId, playerId, cardId, isForOtherPlayerPile }) =>
        [gameId, playerId, cardId, isForOtherPlayerPile] as const,
    );

  function playCard(input: unknown) {
    const parseResult = playCardInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" } as const;
    }
    return manager.playCard(...parseResult.data);
  }

  const reportNoPlayableCardsInputSchema = z
    .object({
      gameId: z.string(),
      playerId: z.string(),
    })
    .transform(({ gameId, playerId }) => [gameId, playerId] as const);

  function reportNoPlayableCards(input: unknown) {
    const parseResult = reportNoPlayableCardsInputSchema.safeParse(input);
    if (!parseResult.success) {
      return { success: false, error: "invalidInput" } as const;
    }
    return manager.reportNoPlayableCards(...parseResult.data);
  }

  return [
    { path: "/drawCard", action: drawCard },
    { path: "/playCard", action: playCard },
    { path: "/reportNoPlayableCards", action: reportNoPlayableCards },
  ];
});
