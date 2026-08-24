import type { ClientState } from "../types/ClientState.js";
import type { Game } from "../types/Game.js";

export function getClientStateAndClearEvents(game: Game, playerId: string) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player) {
    return { success: false, error: "playerNotFound" } as const;
  }
  const state: ClientState = {
    status: game.status,
    gameId: game.id,
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
  return { success: true, state, game } as const;
}
