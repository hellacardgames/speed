import { z } from "zod";
import { sendChat as doSendChat } from "../../manager/index.js";

export type SendChatResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: "invalidInput" | "gameNotFound" | "playerNotFound";
    };

const inputSchema = z
  .object({
    gameId: z.string(),
    playerId: z.string(),
    text: z.string(),
  })
  .transform(({ gameId, playerId, text }) => [gameId, playerId, text] as const);

export function sendChat(input: unknown): SendChatResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doSendChat(...parseResult.data);
}
