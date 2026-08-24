import { createManagerFactory } from "@hellacardgames/lib";
import {
  createGame,
  drawCard,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  MAX_PLAYERS,
  playCard,
  reportNoPlayableCards,
  startGame,
} from "../game/index.js";

export const createManager = createManagerFactory({
  maxPlayers: MAX_PLAYERS,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  startGame,
  createCustomActions: (games) => ({
    drawCard: (gameId: string, playerId: string) => {
      const game = games.get(gameId);
      if (!game) {
        return { success: false, error: "gameNotFound" } as const;
      }
      if (game.status !== "started") {
        return { success: false, error: "invalidStatus" } as const;
      }
      const result = drawCard(game, playerId);
      if (!result.success) {
        return { success: false, error: result.error } as const;
      }
      games.set(gameId, result.game);
      return { success: true } as const;
    },
    playCard: (
      gameId: string,
      playerId: string,
      cardId: string,
      isForOtherPlayerPile: boolean,
    ) => {
      const game = games.get(gameId);
      if (!game) {
        return { success: false, error: "gameNotFound" } as const;
      }
      if (game.status !== "started") {
        return { success: false, error: "invalidStatus" } as const;
      }
      const result = playCard(game, playerId, cardId, isForOtherPlayerPile);
      if (!result.success) {
        return { success: false, error: result.error } as const;
      }
      games.set(gameId, result.game);
      return { success: true } as const;
    },
    reportNoPlayableCards: (gameId: string, playerId: string) => {
      const game = games.get(gameId);
      if (!game) {
        return { success: false, error: "gameNotFound" } as const;
      }
      if (game.status !== "started") {
        return { success: false, error: "invalidStatus" } as const;
      }
      const result = reportNoPlayableCards(game, playerId);
      if (!result.success) {
        return { success: false, error: result.error } as const;
      }
      games.set(gameId, result.game);
      return { success: true } as const;
    },
  }),
});
