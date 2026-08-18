import { z } from "zod";
import { reportNoPlayableCards as doReportNoPlayableCards } from "../../manager/actions/reportNoPlayableCards.js";

export type ReportNoPlayableCardsResult =
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
        | "alreadyReported"
        | "hasPlayableCard"
        | "canDraw";
    };

const inputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

export function reportNoPlayableCards(
  input: unknown,
): ReportNoPlayableCardsResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doReportNoPlayableCards(...parseResult.data);
}
