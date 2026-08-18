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
  { path: "/createGame", func: createGame },
  { path: "/drawCard", func: drawCard },
  { path: "/getClientStateAndClearEvents", func: getClientStateAndClearEvents },
  {
    path: "/getEventsAndClearAcknowledged",
    func: getEventsAndClearAcknowledged,
  },
  { path: "/getJoinableGames", func: getJoinableGames },
  { path: "/joinGame", func: joinGame },
  { path: "/leaveGame", func: leaveGame },
  { path: "/playCard", func: playCard },
  { path: "/reportNoPlayableCards", func: reportNoPlayableCards },
  { path: "/sendChat", func: sendChat },
  { path: "/startGame", func: startGame },
] as const;
