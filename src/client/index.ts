export { Client } from "./Client.js";

export type {
  CreateGameResult,
  DrawCardResult,
  GetClientStateAndClearEventsResult,
  GetEventsAndClearAcknowledgedResult,
  GetJoinableGamesResult,
  JoinGameResult,
  LeaveGameResult,
  PlayCardResult,
  ReportNoPlayableCardsResult,
  SendChatResult,
  StartGameResult,
} from "../server/index.js";

export type {
  Card,
  ChatMessage,
  ClientState,
  GameEvent,
} from "../server/index.js";
