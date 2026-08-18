import { createGame } from "./actions/createGame.js";
import { drawCard } from "./actions/drawCard.js";
import { getClientStateAndClearEvents } from "./actions/getClientStateAndClearEvents.js";
import { getEventsAndClearAcknowledged } from "./actions/getEventsAndClearAcknowledged.js";
import { getJoinableGames } from "./actions/getJoinableGames.js";
import { joinGame } from "./actions/joinGame.js";
import { leaveGame } from "./actions/leaveGame.js";
import { playCard } from "./actions/playCard.js";
import { reportNoPlayableCards } from "./actions/reportNoPlayableCards.js";
import { sendChat } from "./actions/sendChat.js";
import { startGame } from "./actions/startGame.js";

export const actions = [
  { path: "/createGame", action: createGame },
  { path: "/drawCard", action: drawCard },
  {
    path: "/getClientStateAndClearEvents",
    action: getClientStateAndClearEvents,
  },
  {
    path: "/getEventsAndClearAcknowledged",
    action: getEventsAndClearAcknowledged,
  },
  { path: "/getJoinableGames", action: getJoinableGames },
  { path: "/joinGame", action: joinGame },
  { path: "/leaveGame", action: leaveGame },
  { path: "/playCard", action: playCard },
  { path: "/reportNoPlayableCards", action: reportNoPlayableCards },
  { path: "/sendChat", action: sendChat },
  { path: "/startGame", action: startGame },
] as const;
