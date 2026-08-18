import { z } from "zod";
import { joinGame as doJoinGame } from "../../manager/actions/joinGame.js";

export type JoinGameResult =
  | {
      readonly success: true;
      readonly playerId: string;
    }
  | {
      readonly success: false;
      readonly error:
        | "invalidInput"
        | "gameNotFound"
        | "invalidStatus"
        | "maxPlayersReached"
        | "alreadyInGame";
    };

const inputSchema = z
  .object({
    gameId: z.string(),
  })
  .transform(({ gameId }) => [gameId] as const);

export function joinGame(
  input: unknown,
  userId: string,
  username: string,
): JoinGameResult {
  const parseResult = inputSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: "invalidInput" };
  }
  return doJoinGame(...parseResult.data, userId, username);
}
