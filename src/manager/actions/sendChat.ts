import { emitEvent } from "../../lib/emitEvent.js";
import { games } from "../games.js";
import type { ChatMessage } from "../types/ChatMessage.js";

type SendChatResult =
  | {
      readonly success: true;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export function sendChat(
  gameId: string,
  playerId: string,
  text: string,
): SendChatResult {
  const game = games.get(gameId);
  if (!game) {
    return { success: false, error: "gameNotFound" };
  }
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  const message: ChatMessage = {
    id: crypto.randomUUID(),
    username: player.username,
    text,
  };
  game.chatMessages.push(message);
  emitEvent(game, { type: "chat", message });
  return { success: true };
}
