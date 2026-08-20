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

export type { CreateGameResult } from "./actions/createGame.js";
export type { DrawCardResult } from "./actions/drawCard.js";
export type { GetClientStateAndClearEventsResult } from "./actions/getClientStateAndClearEvents.js";
export type { GetEventsAndClearAcknowledgedResult } from "./actions/getEventsAndClearAcknowledged.js";
export type { GetJoinableGamesResult } from "./actions/getJoinableGames.js";
export type { JoinGameResult } from "./actions/joinGame.js";
export type { LeaveGameResult } from "./actions/leaveGame.js";
export type { PlayCardResult } from "./actions/playCard.js";
export type { ReportNoPlayableCardsResult } from "./actions/reportNoPlayableCards.js";
export type { SendChatResult } from "./actions/sendChat.js";
export type { StartGameResult } from "./actions/startGame.js";

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../manager/index.js";

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
