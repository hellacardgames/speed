import { games } from "../games.js";
import type { ClientState } from "../types/ClientState.js";

type GetClientStateAndClearEventsResult =
  | {
      readonly success: true;
      readonly state: ClientState;
    }
  | {
      readonly success: false;
      readonly error: "gameNotFound" | "playerNotFound";
    };

export function getClientStateAndClearEvents(
  gameId: string,
  playerId: string,
): GetClientStateAndClearEventsResult {
  const game = games.get(gameId);
  if (!game) {
    return { success: false, error: "gameNotFound" };
  }
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" };
  }
  const state: ClientState = {
    status: game.status,
    gameId,
    playerId,
    username: player.username,
    players: game.players.map((p) => ({
      username: p.username,
      handSize: p.hand.length,
      drawPileSize: p.drawPile.length,
      sidePileSize: p.sidePile.length,
      centerPileTopCard: p.centerPile.length
        ? p.centerPile[p.centerPile.length - 1]!
        : null,
    })),
    expiresAt: game.expiresAt,
    chatMessages: game.chatMessages,
    hand: player.hand,
    canPlayAt: game.status === "started" ? game.canPlayAt : null,
  };
  player.events.length = 0;
  return { success: true, state };
}
