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
  sendChat,
  startGame,
} from "../game/index.js";

export type Manager = ReturnType<typeof createManager>;

export const createManager = createManagerFactory({
  maxPlayers: MAX_PLAYERS,
  createGame,
  getClientStateAndClearEvents,
  getEventsAndClearAcknowledged,
  joinGame,
  leaveGame,
  sendChat,
  startGame,
  gameplayActions: {
    drawCard,
    playCard,
    reportNoPlayableCards,
  },
});
