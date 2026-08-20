import { z } from "zod";
import { playCard as doPlayCard } from "../../manager/index.js";

export type PlayCardResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error:
        | "invalidInput"
        | "gameNotFound"
        | "playerNotFound"
        | "invalidStatus"
        | "canPlayAtNotReached"
        | "cardNotFound"
        | "cardNotPlayable";
    };

const inputSchema = z
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

export function playCard(input: unknown): PlayCardResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doPlayCard(...parseResult.data);
}
