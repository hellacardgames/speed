import {
  getClientStateAndClearEventsFactory,
  getOtherPlayer,
  requirePlayer,
} from "@hellacardgames/lib";
import type { ClientState } from "../types/ClientState.js";
import type { Game } from "../types/Game.js";

export const getClientStateAndClearEvents = getClientStateAndClearEventsFactory<
  Game,
  ClientState
>((game, player) => {
  const otherPlayer = getOtherPlayer(game, player.id);

  return {
    status: game.status,
    gameId: game.id,
    playerId: player.id,
    player: {
      username: player.username,
      hand: player.hand,
      drawPileSize: player.drawPile.length,
      sidePileSize: player.sidePile.length,
      centerPileTopCard:
        player.centerPile[player.centerPile.length - 1] ?? null,
    },
    otherPlayer: otherPlayer
      ? {
          username: otherPlayer.username,
          handSize: otherPlayer.hand.length,
          drawPileSize: otherPlayer.drawPile.length,
          sidePileSize: otherPlayer.sidePile.length,
          centerPileTopCard:
            otherPlayer.centerPile[otherPlayer.centerPile.length - 1] ?? null,
        }
      : null,
    adminUsername: requirePlayer(game, game.adminId).player.username,
    expiresAt: game.expiresAt,
    chatMessages: game.chatMessages,
    hand: player.hand,
    canPlayAt: game.status === "started" ? game.canPlayAt : null,
  };
});
