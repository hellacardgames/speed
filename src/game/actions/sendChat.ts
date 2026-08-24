import { addItemToCollection, emitEvent } from "@hellacardgames/lib";
import type { ChatMessage } from "../types/ChatMessage.js";
import type { Game } from "../types/Game.js";

export function sendChat(game: Game, playerId: string, text: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
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

  return { success: true, game } as const;
}
