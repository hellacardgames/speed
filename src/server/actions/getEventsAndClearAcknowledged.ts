import { z } from "zod";
import { getEventsAndClearAcknowledged as doGetEventsAndClearAcknowledged } from "../../manager/actions/getEventsAndClearAcknowledged.js";
import type { GameEvent } from "../../manager/types/GameEvent.js";

export type GetEventsAndClearAcknowledgedResult =
  | {
      readonly success: true;
      readonly events: readonly GameEvent[];
    }
  | {
      readonly success: false;
      readonly error: "invalidInput" | "gameNotFound" | "playerNotFound";
    };

const inputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
    lastReadId: z.string().nullable(),
  })
  .transform(
    ({ gameId, playerId, lastReadId }) =>
      [gameId, playerId, lastReadId] as const,
  );

export function getEventsAndClearAcknowledged(
  input: unknown,
): GetEventsAndClearAcknowledgedResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doGetEventsAndClearAcknowledged(...parseResult.data);
}
