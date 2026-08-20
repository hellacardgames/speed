import { z } from "zod";
import { getClientStateAndClearEvents as doGetClientStateAndClearEvents } from "../../manager/index.js";
import type { ClientState } from "../../manager/index.js";

export type GetClientStateAndClearEventsResult =
  | {
      readonly success: true;
      readonly state: ClientState;
    }
  | {
      readonly success: false;
      readonly error: "invalidInput" | "gameNotFound" | "playerNotFound";
    };

const inputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
  })
  .transform(({ gameId, playerId }) => [gameId, playerId] as const);

export function getClientStateAndClearEvents(
  input: unknown,
): GetClientStateAndClearEventsResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doGetClientStateAndClearEvents(...parseResult.data);
}
