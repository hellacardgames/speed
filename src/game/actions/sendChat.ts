import { addItemToCollection, emitEvent } from "@hellacardgames/lib";
import type { ChatMessage } from "../types/ChatMessage.js";
import type { Game } from "../types/Game.js";

type SendChatResult =
  | {
      readonly success: true;
      readonly game: Game;
    }
  | {
      readonly success: false;
      readonly error: "playerNotFound";
    };

export function sendChat(
  game: Game,
  playerId: string,
  text: string,
): SendChatResult {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }

  const message: ChatMessage = {
    id: crypto.randomUUID(),
    username: player.username,
    text,
  };

  game = {
    ...game,
    chatMessages: addItemToCollection(game.chatMessages, message),
  };

  game = emitEvent(game, { type: "chat", message });

  return { success: true, game };
}
