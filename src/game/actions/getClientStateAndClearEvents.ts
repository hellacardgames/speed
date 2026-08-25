import { getClientStateAndClearEventsFactory } from "@hellacardgames/lib";
import type { ClientState } from "../types/ClientState.js";
import type { Game } from "../types/Game.js";

export const getClientStateAndClearEvents = getClientStateAndClearEventsFactory<
  Game,
  ClientState
>((game, player) => ({
  status: game.status,
  gameId: game.id,
  playerId: player.id,
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
}));
